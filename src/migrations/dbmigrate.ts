import pool from '../dbconfig/dbconnector';

const client = pool.connect();

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
const result = client.query(sql);
console.log(result);
  
client.release();



