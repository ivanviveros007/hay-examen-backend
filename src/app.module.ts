import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamenesModule } from './examenes/examenes.module';
import { ExamenEntity } from './examenes/examen.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        entities: [ExamenEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ExamenesModule,
  ],
})
export class AppModule {}
