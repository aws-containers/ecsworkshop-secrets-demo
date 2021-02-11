import { Router } from 'express';
import pool from '../dbconfig/dbconnector';

const migrateRouter = Router();

migrateRouter.get('/', async (req, res) => {
  try {
    const client = await pool.connect();

    const create = `
        CREATE TABLE todos
        (
            id integer NOT NULL,
            title text  NOT NULL,
            description text NOT NULL,
            "isFinished" boolean NOT NULL,
            CONSTRAINT todos_pkey PRIMARY KEY (id)
        )
        `
      const insert = `
        INSERT INTO todos VALUES
        (
            1,'Do something','Do Something good',true

        )
    `
    const { resultCreate } = await client.query(create);
    const { resultInsert } = await client.query(insert);

    const result = `${resultCreate} + ${resultInsert}`

    client.release();

    res.send(result);
  } catch (error) {
    res.status(400).send(`${error} in migrate`);
  }
});

export default migrateRouter;

