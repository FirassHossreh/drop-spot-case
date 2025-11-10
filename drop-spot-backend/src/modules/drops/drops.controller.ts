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
import { DropsService } from '../drops/drops.service';
import { CreateDropDto } from '../drops/dto/create-drop.dto';
import { UpdateDropDto } from '../drops/dto/update-drop.dto';
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
  create(@Body() body: CreateDropDto) {
    return this.dropsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateDropDto) {
    return this.dropsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.dropsService.remove(id);
  }
}
