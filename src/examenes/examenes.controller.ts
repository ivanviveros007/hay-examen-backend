import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExamenesService } from './examenes.service';
import { CreateExamenDto } from './dto/create-examen.dto';

@Controller('examenes')
export class ExamenesController {
  constructor(private readonly examenesService: ExamenesService) {}

  @Get('materias')
  getMaterias() {
    return this.examenesService.getMaterias();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExamenDto: CreateExamenDto) {
    return this.examenesService.createExamen(createExamenDto);
  }

  @Get()
  async findAll() {
    return this.examenesService.getExamenes();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.examenesService.deleteExamen(+id);
  }
}
