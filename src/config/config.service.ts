import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      SENDGRID_API_KEY: Joi.string().default('sendgrid_api_key'),
      TYPEORM_CONNECTION: Joi.string()
        .only(['postgres'])
        .default('postgres'),
      TYPEORM_HOST: Joi.string().default('localhost'),
      TYPEORM_USERNAME: Joi.string().default('postgres'),
      TYPEORM_PASSWORD: Joi.string().default('postgres'),
      TYPEORM_DATABASE: Joi.string().default('hush'),
      TYPEORM_PORT: Joi.number().default(5432),
      TYPEORM_SYNCHRONIZE: Joi.boolean().default(true),
      TYPEORM_LOGGING: Joi.boolean().default(true),
      TYPEORM_ENTITIES: Joi.string().default('src/**/*.entity{.ts,.js}'),
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test'])
        .default('development'),
      PORT: Joi.number().default(3000),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
