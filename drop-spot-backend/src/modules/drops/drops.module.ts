import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drop } from './drop.entity';
import { DropsService } from './drops.service';
import { DropsController } from './drops.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Drop]), AuthModule],
  providers: [DropsService],
  controllers: [DropsController],
  exports: [DropsService],
})
export class DropsModule {}
