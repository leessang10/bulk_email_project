import {
  GetParameterCommand,
  GetParametersByPathCommand,
  SSMClient,
} from '@aws-sdk/client-ssm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsParamStoreService {
  private client: SSMClient;
  private cache: Map<string, string>;

  constructor() {
    this.client = new SSMClient({ region: 'ap-northeast-2' });
    this.cache = new Map();
  }

  async get<T>(name: string): Promise<T | undefined> {
    if (this.cache.has(name)) {
      return this.cache.get(name) as T;
    }

    try {
      const command = new GetParameterCommand({
        Name: name,
        WithDecryption: true,
      });

      const response = await this.client.send(command);
      const value = response.Parameter?.Value;

      if (value) {
        this.cache.set(name, value);
        return value as T;
      }
      return undefined;
    } catch (error) {
      console.error(`Error fetching parameter ${name}:`, error);
      return undefined;
    }
  }

  async getByPath(path: string): Promise<Record<string, string>> {
    const command = new GetParametersByPathCommand({
      Path: path,
      Recursive: true,
      WithDecryption: true,
    });

    try {
      const response = await this.client.send(command);
      const parameters: Record<string, string> = {};

      response.Parameters?.forEach((param) => {
        if (param.Name && param.Value) {
          const name = param.Name.split('/').pop() || param.Name;
          parameters[name] = param.Value;
          this.cache.set(param.Name, param.Value);
        }
      });

      return parameters;
    } catch (error) {
      console.error(`Error fetching parameters from path ${path}:`, error);
      return {};
    }
  }

  async getOrThrow<T>(name: string): Promise<T> {
    const value = await this.get<T>(name);
    if (value === undefined) {
      throw new Error(
        `Parameter "${name}" is required but not found in AWS Parameter Store.`,
      );
    }
    return value;
  }
}
