import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAddress } from '../../database/entities/bulk-email/email-address.entity';
import { EmailAddressGroup } from '../../database/entities/bulk-email/email-group.entity';
import { EmailAddressGroupsController } from './email-address-groups.controller';
import { EmailAddressGroupsService } from './email-address-groups.service';
import { EmailAddressProcessor } from './processors/email-address.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailAddressGroup, EmailAddress], 'bulk_email'),
    BullModule.registerQueue({
      name: 'INSERT_EMAILS',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
      },
    }),
    BullBoardModule.forFeature({
      name: 'INSERT_EMAILS',
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [EmailAddressGroupsController],
  providers: [EmailAddressGroupsService, EmailAddressProcessor],
})
export class EmailAddressGroupsModule {}
