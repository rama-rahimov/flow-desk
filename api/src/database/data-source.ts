import { DataSource } from "typeorm";
import { typeOrmConfig } from './config.js';
export const AppDataSource = new DataSource(typeOrmConfig as any)