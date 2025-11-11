import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../auth/user.entity';
import { Drop } from '../drops/drop.entity';

@Entity()
export class Waitlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Drop, { eager: true })
  drop: Drop;

  @Column({ default: false })
  claimed: boolean;

  @Column({ nullable: true })
  claimCode: string;

  @Column({ type: 'int', default: 0 })
  priorityScore: number;
}
