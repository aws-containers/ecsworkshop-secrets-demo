import { Pool } from 'pg';

export default new Pool ({
    max: 20,
    connectionString: 'postgres://postgres:newPassword@postgres:5432/tododb',
    idleTimeoutMillis: 30000
})