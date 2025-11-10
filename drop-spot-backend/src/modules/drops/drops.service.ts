import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Drop } from './drop.entity';
import { CreateDropDto } from './dto/create-drop.dto';
import { UpdateDropDto } from './dto/update-drop.dto';

@Injectable()
export class DropsService {
  constructor(
    @InjectRepository(Drop) private dropsRepo: Repository<Drop>,
    private dataSource: DataSource,
  ) {}
  async findAll() {
    return await this.dropsRepo.find({
      order: { createdAt: 'DESC' },
    });
  }
  async create(body: CreateDropDto) {
    const drop = this.dropsRepo.create({
      ...body,
      startAt: new Date(body.startAt),
      endAt: body.endAt ? new Date(body.endAt) : undefined, // <- undefined kullan
      //   remaining: dto.totalQuantity,
    });
    const saved = await this.dropsRepo.save(drop);
    return saved;
  }

  async update(id: string, body: UpdateDropDto) {
    const exist = await this.dropsRepo.findOne({ where: { id } });
    if (!exist) throw new NotFoundException('Drop not found.');

    Object.assign(exist, body);
    return this.dropsRepo.save(exist);
  }

  async remove(id: string) {
    const exist = await this.dropsRepo.findOne({ where: { id } });
    if (!exist) throw new NotFoundException('Drop not found.');
    // soft delete
    return this.dropsRepo.remove(exist);
  }

  //   // transactional örnek: bir drop oluştururken başka tablolar da güncellenecekse:
  //   async createWithTransaction(dto: CreateDropDto) {
  //     const queryRunner = this.dataSource.createQueryRunner();
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();
  //     try {
  //       const drop = queryRunner.manager.create(Drop, {
  //         ...dto,
  //         startAt: new Date(dto.startAt),
  //         remaining: dto.totalQuantity,
  //       });
  //       const saved = await queryRunner.manager.save(drop);
  //       // başka insert/update işlemleri...
  //       await queryRunner.commitTransaction();
  //       return saved;
  //     } catch (err) {
  //       await queryRunner.rollbackTransaction();
  //       throw err;
  //     } finally {
  //       await queryRunner.release();
  //     }
  //   }
}
