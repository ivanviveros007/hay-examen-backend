import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExamenesService } from './examenes.service';
import { CreateExamenDto } from './dto/create-examen.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';

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

  @Patch(':id/nota')
  async updateNota(@Param('id') id: string, @Body() dto: UpdateNotaDto) {
    return this.examenesService.updateNota(+id, dto.nota);
  }

  @Delete(':id/nota')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNota(@Param('id') id: string) {
    await this.examenesService.deleteNota(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.examenesService.deleteExamen(+id);
  }
}
