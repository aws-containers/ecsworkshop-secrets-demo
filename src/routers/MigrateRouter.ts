import { Router } from 'express';
import pool from '../dbconfig/dbconnector';

const migrateRouter = Router();

migrateRouter.get('/', async (req, res) => {
  try {
    const client = await pool.connect();

    const sql = `
        CREATE TABLE todos
        (
            id integer NOT NULL,
            title text  NOT NULL,
            description text NOT NULL,
            "isFinished" boolean NOT NULL,
            CONSTRAINT todos_pkey PRIMARY KEY (id)
        )
        INSERT INTO todos VALUES
        (
            1,'Do something','Do Something good',true

        )
    `
    const { result } = await client.query(sql);
    const migrate = result;
    
    client.release();

    res.send(migrate);
  } catch (error) {
    res.status(400).send(`${error} in migrate`);
  }
});

export default migrateRouter;

