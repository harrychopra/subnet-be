import dotenv from 'dotenv';
import { Pool } from 'pg';

process.env.NODE_ENV ||= 'development';
const envPath = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envPath });

if (!process.env.PGDATABASE) {
  throw new Error(`DB env vars missing`);
}

export default new Pool();
