import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('examenes')
export class ExamenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  materiaId: number;

  @Column()
  materiaNombre: string;

  @Column()
  fecha: string;

  @Column({ nullable: true })
  calendarEventId: string;

  @CreateDateColumn()
  createdAt: Date;
}
