import joi from 'joi';
import * as dotenv from 'dotenv';
dotenv.config();

import { Config } from '../../models/config';
import { database } from './database.config';
import { server } from './server.config';

const envSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .allow('development', 'production', 'test')
      .required(),
    npm_package_version: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config: Config = {
  env: envVars.NODE_ENV,
  isDevelopment: envVars.NODE_ENV === 'development',
  packageVersion: envVars.npm_package_version,
  database,
  server,
};
