import * as dotenv from 'dotenv';
import * as dotenvParseVariables from 'dotenv-parse-variables';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsIn,
  IsArray,
  IsEnum,
} from 'class-validator';
import { transformAndValidateSync } from 'class-transformer-validator';

export enum TypeOrmConnection {
  Postgres = 'postgres',
}

export class EnvConfig {
  @IsString()
  SENDGRID_API_KEY: string;

  @IsEnum(TypeOrmConnection)
  TYPEORM_CONNECTION: TypeOrmConnection;

  @IsString()
  TYPEORM_HOST: string;

  @IsString()
  TYPEORM_USERNAME: string;

  @IsString()
  TYPEORM_PASSWORD: string;

  @IsString()
  TYPEORM_DATABASE: string;

  @IsInt()
  TYPEORM_PORT: number;

  @IsBoolean()
  TYPEORM_SYNCHRONIZE: boolean = true;

  @IsBoolean()
  TYPEORM_LOGGING: boolean = true;

  @IsArray()
  TYPEORM_ENTITIES: [string];

  @IsString()
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: string = 'development';

  @IsInt()
  PORT: number = 3000;
}

@Injectable()
export class ConfigService {
  readonly env: EnvConfig;

  constructor(filePath: string) {
    let env = dotenv.parse(fs.readFileSync(filePath));
    env = dotenvParseVariables(env);

    this.env = this.validateInput(env);
  }

  private validateInput(env: object): EnvConfig {
    const envConfig = transformAndValidateSync(EnvConfig, env, {
      validator: { whitelist: true },
    });

    return envConfig;
  }
}
