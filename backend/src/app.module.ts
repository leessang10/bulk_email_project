import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
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
      url: 'redis://localhost:6379',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
