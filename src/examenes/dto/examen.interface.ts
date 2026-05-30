export interface Materia {
  id: number;
  nombre: string;
}

export interface Examen {
  id: number;
  materiaId: number;
  materiaNombre: string;
  fecha: string;        // YYYY-MM-DD
  createdAt: string;    // ISO timestamp
  calendarEventId?: string;
}
