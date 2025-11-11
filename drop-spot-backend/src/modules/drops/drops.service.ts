import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  MoreThan,
} from 'typeorm';
import { Drop } from './drop.entity';
import { CreateDropDto } from './dto/create-drop.dto';
import { UpdateDropDto } from './dto/update-drop.dto';
import { Waitlist } from '../waitlist/waitlist.entity';
import { User } from '../auth/user.entity';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';

@Injectable()
export class DropsService {
  constructor(
    @InjectRepository(Drop) private dropsRepo: Repository<Drop>,
    private dataSource: DataSource,
    @InjectRepository(Waitlist) private waitlistRepo: Repository<Waitlist>,
  ) {}

  //admin

  async findAll() {
    return await this.dropsRepo.find({
      order: { createdAt: 'DESC' },
    });
  }
  async create(body: CreateDropDto) {
    const drop = this.dropsRepo.create({
      ...body,
      startAt: new Date(body.startAt),
      endAt: body.endAt ? new Date(body.endAt) : undefined,
    });
    const saved = await this.dropsRepo.save(drop);
    return saved;
  }

  async update(id: string, body: UpdateDropDto) {
    const exist = await this.dropsRepo.findOne({ where: { id } });
    if (!exist) throw new NotFoundException('Drop not found.');

    Object.assign(exist, body);
    const updated = await this.dropsRepo.save(exist);
    return updated;
  }

  async remove(id: string) {
    const exist = await this.dropsRepo.findOne({ where: { id } });
    if (!exist) throw new NotFoundException('Drop not found.');
    const deleted = await this.dropsRepo.remove(exist);
    return deleted;
  }

  //user
  async getActiveDrops(user: User) {
    const now = new Date();

    const claimedWaitlist = await this.waitlistRepo.find({
      where: { user: { id: user.id }, claimed: true },
      relations: ['drop'],
    });

    const claimedDrops = claimedWaitlist
      .map((w) => w.drop)
      .filter((drop) => drop.endAt > now);

    const currentDrops = await this.dropsRepo.find({
      where: {
        startAt: LessThanOrEqual(now),
        endAt: MoreThan(now),
      },
      order: { startAt: 'ASC' },
    });

    const upcomingDrops = await this.dropsRepo.find({
      where: { startAt: MoreThan(now) },
      order: { startAt: 'ASC' },
    });

    return {
      claimedDrops,
      currentDrops,
      upcomingDrops,
    };
  }

  generateSeed(remoteUrl: string, firstCommitEpoch: string, startTime: string) {
    const raw = `${remoteUrl}|${firstCommitEpoch}|${startTime}`;
    return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 12);
  }

  calculatePriorityScore(
    seed: string,
    signupLatencyMs: number,
    accountAgeDays: number,
    rapidActions: number,
    base = 0,
  ) {
    const A = 7 + (parseInt(seed.slice(0, 2), 16) % 5);
    const B = 13 + (parseInt(seed.slice(2, 4), 16) % 7);
    const C = 3 + (parseInt(seed.slice(4, 6), 16) % 3);
    return (
      base + (signupLatencyMs % A) + (accountAgeDays % B) - (rapidActions % C)
    );
  }

  async joinWaitlist(dropId: string, user: User) {
    return this.dataSource.transaction(async (manager) => {
      const drop = await manager.findOne(Drop, { where: { id: dropId } });
      if (!drop) throw new NotFoundException('Drop not found');

      const exist = await manager.findOne(Waitlist, {
        where: { drop: { id: dropId }, user: { id: user.id } },
      });
      if (exist) throw new BadRequestException('Already joined waitlist');

      const seed = this.generateSeed(
        'https://github.com/FirassHossreh/drop-spot-case.git',
        '1762555579',
        '20251181230',
      );
      const priorityScore = this.calculatePriorityScore(
        seed,
        user.signupLatencyMs || 0,
        user.accountAgeDays || 0,
        user.rapidActions || 0,
      );

      const waitlist = manager.create(Waitlist, { drop, user, priorityScore });
      return await manager.save(waitlist);
    });
  }

  async leaveWaitlist(dropId: string, user: User) {
    const exist = await this.waitlistRepo.findOne({
      where: { drop: { id: dropId }, user: { id: user.id } },
    });
    if (!exist) throw new NotFoundException('Not in waitlist');
    return await this.waitlistRepo.remove(exist);
  }

  async claimDrop(dropId: string, user: User) {
    return this.dataSource.transaction(async (manager) => {
      const drop = await manager.findOne(Drop, { where: { id: dropId } });
      if (!drop) throw new NotFoundException('Drop not found');

      let userEntry = await manager.findOne(Waitlist, {
        where: { drop: { id: dropId }, user: { id: user.id } },
        relations: ['user'],
      });

      const seed = this.generateSeed(
        'https://github.com/FirassHossreh/drop-spot-case.git',
        '1762555579',
        '20251181230',
      );
      const priorityScore = this.calculatePriorityScore(
        seed,
        user.signupLatencyMs || 0,
        user.accountAgeDays || 0,
        user.rapidActions || 0,
      );

      if (!userEntry) {
        userEntry = manager.create(Waitlist, {
          drop,
          user,
          priorityScore: priorityScore,
          claimed: false,
        });
        userEntry = await manager.save(userEntry);
      }

      if (userEntry.claimed) throw new BadRequestException('Already claimed');

      const allWaitlist = await manager.find(Waitlist, {
        where: { drop: { id: dropId } },
        relations: ['user'],
      });
      const sortedWaitlist = allWaitlist.sort(
        (a, b) => b.priorityScore - a.priorityScore,
      );

      const claimedCount = sortedWaitlist.filter((w) => w.claimed).length;
      if (claimedCount >= drop.maxClaims)
        throw new BadRequestException('No more claims available');

      const userPosition = sortedWaitlist.findIndex(
        (w) => w.user.id === user.id,
      );

      if (userPosition < drop.maxClaims) {
        drop.claimedCount = (drop.claimedCount || 0) + 1;
        await manager.save(drop);

        userEntry.claimed = true;
        userEntry.claimCode = this.generateClaimCode();

        return await manager.save(userEntry);
      } else {
        throw new BadRequestException(
          `You are in position ${userPosition + 1}. Only top ${drop.maxClaims} can claim.`,
        );
      }
    });
  }

  private generateClaimCode(): string {
    return `DROP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }
}
