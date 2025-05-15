import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unsubscribe } from '../../database/entities/bulk-email/unsubscribe.entity';
import { UnsubscribesController } from './unsubscribes.controller';
import { UnsubscribesService } from './unsubscribes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Unsubscribe], 'bulk_email')],
  controllers: [UnsubscribesController],
  providers: [UnsubscribesService],
})
export class UnsubscribesModule {}
