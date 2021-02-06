import { Pool } from 'pg';

export default new Pool ({
    max: 20,
    connectionString: 'postgres://tuszym:password@127.0.0.1:5432/tododb',
    idleTimeoutMillis: 30000
})