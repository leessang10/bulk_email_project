import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/services/config.service';

@Module({
  imports: [
    ConfigModule,
    // bulk_email 데이터베이스 연결
    TypeOrmModule.forRootAsync({
      name: 'bulk_email',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = await configService.getDatabaseConfig();
        return config.bulk_email;
      },
      inject: [ConfigService],
    }),
    // tlooto 데이터베이스 연결
    TypeOrmModule.forRootAsync({
      name: 'tlooto',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = await configService.getDatabaseConfig();
        return config.tlooto;
      },
      inject: [ConfigService],
    }),
    // jobs 데이터베이스 연결
    TypeOrmModule.forRootAsync({
      name: 'jobs',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = await configService.getDatabaseConfig();
        return config.jobs;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
