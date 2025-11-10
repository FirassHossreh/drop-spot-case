// src/drops/drops.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drop } from './drop.entity';
import { DropsService } from './drops.service';
import { DropsController } from './drops.controller';
import { AuthModule } from '../auth/auth.module'; // AuthModule export'larını kullanmak için import
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Drop]),
    AuthModule, // JwtModule, JwtAuthGuard, RolesGuard burada export edilmiş olmalı
  ],
  providers: [DropsService],
  controllers: [DropsController],
  exports: [DropsService],
})
export class DropsModule {}
