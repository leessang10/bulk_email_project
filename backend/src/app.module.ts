import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import basicAuth from 'express-basic-auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { EmailAddressGroupsModule } from './modules/email-address-groups/email-address-groups.module';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    EmailAddressGroupsModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
        retryStrategy: (times) => (times > 0 ? null : 1000),
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
      middleware: basicAuth({
        challenge: true,
        users: { admin: '123123123' },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
