import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DropsService } from './drops.service';
import { CreateDropDto } from './dto/create-drop.dto';
import { UpdateDropDto } from './dto/update-drop.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/drops')
export class DropsController {
  constructor(private dropsService: DropsService) {}

  @Get()
  findAll() {
    return this.dropsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateDropDto) {
    const created = await this.dropsService.create(body);
    console.log(created);
    return {
      success: true,
      message: 'added drops',
      data: created,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateDropDto) {
    const updated = await this.dropsService.update(id, body);
    return {
      success: true,
      message: 'updated drops',
      data: updated,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    const deleted = await this.dropsService.remove(id);
    return {
      success: true,
      message: 'deleted drops',
      data: deleted,
    };
  }
}
