import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drop } from './drop.entity';
import { DropsService } from './drops.service';
import { DropsController } from './drops.controller';
import { AuthModule } from '../auth/auth.module';
import { DropsUserController } from './drops-user.controller';
import { Waitlist } from '../waitlist/waitlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Drop, Waitlist]), AuthModule],
  providers: [DropsService],
  controllers: [DropsController, DropsUserController],
  exports: [DropsService],
})
export class DropsModule {}
