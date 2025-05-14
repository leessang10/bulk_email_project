import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AwsParamStoreService } from './services/aws-param-store.service';
import { ConfigService } from './services/config.service';
import { DotEnvService } from './services/dot-env.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [ConfigService, DotEnvService, AwsParamStoreService],
  exports: [ConfigService],
})
export class ConfigModule {}
