import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Config } from './';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Config.DB_HOST ?? 'localhost',
  port: Number(Config.DB_PORT) || 5432,
  username: Config.DB_USERNAME ?? 'root',
  password: Config.DB_PASSWORD ?? 'root',
  database: Config.DB_NAME ?? 'test',
  synchronize: false,
  logging: false,
  entities: ["src/entity/*.ts"],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
