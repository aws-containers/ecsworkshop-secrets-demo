import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config()

export default new Pool ({
    max: 20,
    connectionString: `postgres://postgres:${process.env.SECRET_NAME}@${process.env.DATABASE_ENDPOINT}:5432/tododb`,
    idleTimeoutMillis: 30000
})