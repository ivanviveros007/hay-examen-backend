import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateNotaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  nota: string;
}
