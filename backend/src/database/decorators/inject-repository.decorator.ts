import { InjectRepository as TypeOrmInjectRepository } from '@nestjs/typeorm';

export const InjectBulkEmailRepository = (entity: any) =>
  TypeOrmInjectRepository(entity, 'bulk_email');
export const InjectTlootoRepository = (entity: any) =>
  TypeOrmInjectRepository(entity, 'tlooto');
export const InjectJobsRepository = (entity: any) =>
  TypeOrmInjectRepository(entity, 'jobs');
