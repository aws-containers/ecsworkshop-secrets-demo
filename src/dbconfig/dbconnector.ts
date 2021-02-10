import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config()

export default new Pool({
    max: 20,
    connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASS}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_NAME}`,
    idleTimeoutMillis: 30000
})