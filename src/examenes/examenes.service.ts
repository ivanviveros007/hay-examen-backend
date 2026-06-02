import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { CreateExamenDto } from './dto/create-examen.dto';
import { ExamenEntity } from './examen.entity';
import { Materia } from './dto/examen.interface';

const MATERIAS: Materia[] = [
  { id: 1,  nombre: 'Prácticas del lenguaje' },
  { id: 2,  nombre: 'Matemáticas' },
  { id: 3,  nombre: 'Ciencias sociales' },
  { id: 4,  nombre: 'Ciencias naturales' },
  { id: 5,  nombre: 'Humanities' },
  { id: 6,  nombre: 'Literature' },
  { id: 7,  nombre: 'Inglés' },
  { id: 8,  nombre: 'Global perspective' },
  { id: 9,  nombre: 'Ciudadanía' },
  { id: 10, nombre: 'Vocabulary-Lab' },
];

const TIMEZONE = 'America/Argentina/Buenos_Aires';

@Injectable()
export class ExamenesService {
  private readonly logger = new Logger(ExamenesService.name);

  constructor(
    @InjectRepository(ExamenEntity)
    private readonly examenRepo: Repository<ExamenEntity>,
    private readonly config: ConfigService,
  ) {}

  getMaterias(): Materia[] {
    return MATERIAS;
  }

  async createExamen(dto: CreateExamenDto): Promise<ExamenEntity> {
    const materia = MATERIAS.find((m) => m.id === dto.materiaId);
    if (!materia) throw new NotFoundException('Materia no encontrada');

    const examen = this.examenRepo.create({
      materiaId: dto.materiaId,
      materiaNombre: materia.nombre,
      fecha: dto.fecha,
    });

    const saved = await this.examenRepo.save(examen);

    try {
      saved.calendarEventId = await this.insertCalendarEvent(saved);
      await this.examenRepo.save(saved);
    } catch (err) {
      this.logger.error('Fallo Google Calendar, guardando examen de todas formas', err);
    }

    return saved;
  }

  async getExamenes(): Promise<ExamenEntity[]> {
    return this.examenRepo.find({ order: { fecha: 'ASC' } });
  }

  async deleteExamen(id: number): Promise<void> {
    const examen = await this.examenRepo.findOneBy({ id });
    if (!examen) throw new NotFoundException('Examen no encontrado');

    if (examen.calendarEventId) {
      try {
        await this.deleteCalendarEvent(examen.calendarEventId);
      } catch (err) {
        this.logger.error('No se pudo eliminar el evento del calendario', err);
      }
    }

    await this.examenRepo.delete(id);
    this.logger.log(`Examen eliminado: ${examen.materiaNombre} el ${examen.fecha}`);
  }

  private async getCalendar() {
    const clientEmail = this.config.get<string>('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const rawKey = this.config.get<string>('GOOGLE_PRIVATE_KEY') ?? '';
    const privateKey = rawKey.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return {
      calendar: google.calendar({ version: 'v3', auth }),
      calendarId: this.config.get<string>('GOOGLE_CALENDAR_ID') ?? 'primary',
    };
  }

  private async deleteCalendarEvent(eventId: string): Promise<void> {
    const { calendar, calendarId } = await this.getCalendar();
    await calendar.events.delete({ calendarId, eventId });
    this.logger.log(`Evento eliminado de Google Calendar (id: ${eventId})`);
  }

  private async insertCalendarEvent(examen: ExamenEntity): Promise<string> {
    const { calendar, calendarId } = await this.getCalendar();

    // Google Calendar requiere end.date = start + 1 día para eventos de día completo (rango exclusivo)
    const endDate = new Date(examen.fecha + 'T00:00:00');
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = endDate.toISOString().split('T')[0];

    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `Examen: ${examen.materiaNombre}`,
        description: `Registrado con la app Hay Examen 📚`,
        start: { date: examen.fecha },
        end:   { date: endDateStr },
        reminders: { useDefault: true },
      },
    });

    this.logger.log(
      `Evento creado en Google Calendar: ${examen.materiaNombre} el ${examen.fecha} (id: ${response.data.id})`,
    );

    return response.data.id ?? '';
  }
}
