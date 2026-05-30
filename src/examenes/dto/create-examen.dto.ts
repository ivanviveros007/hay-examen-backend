import { IsInt, IsString, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamenDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  materiaId: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe tener formato YYYY-MM-DD' })
  fecha: string;
}
