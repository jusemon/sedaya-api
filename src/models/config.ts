export type DatabaseConfig = {
  user: string;
  host: string;
  password: string;
  name: string;
  port: number;
};

export type ServerConfig = {
  port: number;
  origins: ReadonlyArray<string>;
  apiVersion: number;
};

export type Config = {
  env: string;
  isDevelopment: boolean;
  packageVersion: string
  database: DatabaseConfig;
  server: ServerConfig;
};
