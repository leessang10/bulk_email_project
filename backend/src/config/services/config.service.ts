import { Injectable } from '@nestjs/common';
import { AwsParamStoreService } from './aws-param-store.service';
import { DotEnvService } from './dot-env.service';

@Injectable()
export class ConfigService {
  constructor(
    private readonly dotEnvService: DotEnvService,
    private readonly awsParamStore: AwsParamStoreService,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    // AWS Parameter Store에서 먼저 확인
    const awsValue = await this.awsParamStore.get<T>(key);
    if (awsValue !== undefined) {
      return awsValue;
    }

    // 환경 변수에서 확인
    return this.dotEnvService.get<T>(key);
  }

  async getOrThrow<T>(key: string): Promise<T> {
    const value = await this.get<T>(key);
    if (value === undefined) {
      throw new Error(
        `Configuration key "${key}" not found in any configuration source.`,
      );
    }
    return value;
  }

  async getByPath(path: string): Promise<Record<string, string>> {
    return this.awsParamStore.getByPath(path);
  }

  async getDatabaseConfig() {
    const [bulkEmailParams, tlootoParams, jobsParams] = await Promise.all([
      this.getByPath('/bulk-email/database/'),
      this.getByPath('/tlooto/database/'),
      this.getByPath('/jobs/database/'),
    ]);

    return {
      bulk_email: {
        type: 'mysql' as const,
        host: bulkEmailParams.host || (await this.get('BULK_EMAIL_HOST')),
        port: 3306,
        database: bulkEmailParams.database || (await this.get('BULK_EMAIL_DB')),
        username:
          bulkEmailParams.username || (await this.get('BULK_EMAIL_USER')),
        password:
          bulkEmailParams.password || (await this.get('BULK_EMAIL_PASSWORD')),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: process.env.NODE_ENV !== 'production',
      },
      tlooto: {
        type: 'mysql' as const,
        host: tlootoParams.host || (await this.get('TLOOTO_HOST')),
        port: 3306,
        database: tlootoParams.database || (await this.get('TLOOTO_DB')),
        username: tlootoParams.username || (await this.get('TLOOTO_USER')),
        password: tlootoParams.password || (await this.get('TLOOTO_PASSWORD')),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: process.env.NODE_ENV !== 'production',
      },
      jobs: {
        type: 'mysql' as const,
        host: jobsParams.host || (await this.get('JOBS_HOST')),
        port: 3306,
        database: jobsParams.database || (await this.get('JOBS_DB')),
        username: jobsParams.username || (await this.get('JOBS_USER')),
        password: jobsParams.password || (await this.get('JOBS_PASSWORD')),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: process.env.NODE_ENV !== 'production',
      },
    };
  }
}
