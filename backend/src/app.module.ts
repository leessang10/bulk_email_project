import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { EmailAddressGroupsModule } from './modules/email-address-groups/email-address-groups.module';

@Module({
  imports: [DatabaseModule, ConfigModule, EmailAddressGroupsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
