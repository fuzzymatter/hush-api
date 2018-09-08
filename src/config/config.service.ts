import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    console.log(config); // tslint:disable-line
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      TYPEORM_CONNECTION: Joi.string().default('postgres'),
      TYPEORM_HOST: Joi.string().default('localhosty'),
      TYPEORM_USERNAME: Joi.string().default('postgres'),
      TYPEORM_PASSWORD: Joi.string().default('postgres'),
      TYPEORM_DATABASE: Joi.string().default('hush'),
      TYPEORM_PORT: Joi.number().default(5432),
      TYPEORM_SYNCHRONIZE: Joi.boolean().default(true),
      TYPEORM_LOGGING: Joi.boolean().default(true),
      TYPEORM_ENTITIES: Joi.string().default(
        'entity/.*js,modules/**/entity/.*js',
      ),
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
