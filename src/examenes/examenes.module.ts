import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamenesController } from './examenes.controller';
import { ExamenesService } from './examenes.service';
import { ExamenEntity } from './examen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamenEntity])],
  controllers: [ExamenesController],
  providers: [ExamenesService],
})
export class ExamenesModule {}
