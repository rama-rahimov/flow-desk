import { DataSource } from 'typeorm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import dotenv from 'dotenv';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const AppDataSource = new DataSource({
  type: 'postgres',
  // host: process.env.DB_HOST,
  // port: Number(process.env.DB_PORT),
  // username: process.env.DB_USERNAME,
  // password: String(process.env.DB_PASSWORD),
  database: process.env.DB_DATABASE,
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  entities: [join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations/*.{ts,js}')],
});
