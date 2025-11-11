import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { DropsService } from './drops.service';
import { Request } from 'express';
import { User } from '../auth/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('drops')
export class DropsUserController {
  constructor(private readonly dropsService: DropsService) {}

  @Get()
  getActiveDrops(@Req() req: any) {
    const user = req.user as User;

    return this.dropsService.getActiveDrops(user);
  }

  @Post(':id/join')
  joinWaitlist(@Param('id') id: string, @Req() req: any) {
    const user = req.user as User;
    console.log(user);
    return this.dropsService.joinWaitlist(id, user);
  }

  @Post(':id/leave')
  leaveWaitlist(@Param('id') id: string, @Req() req: any) {
    const user = req.user as User;
    return this.dropsService.leaveWaitlist(id, user);
  }

  @Post(':id/claim')
  claimDrop(@Param('id') id: string, @Req() req: any) {
    const user = req.user as User;
    return this.dropsService.claimDrop(id, user);
  }
}
