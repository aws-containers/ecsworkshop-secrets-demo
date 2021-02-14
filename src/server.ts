import express, { Application } from 'express';
import bodyParser from 'body-parser';

import pool from './dbconnector';

class Server {
    private app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.dbConnect();
        this.routerConfig();

    }

    private config() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
    }


    private dbConnect() {
        pool.connect(function (err, client, done) {
            if (err) throw new Error(err);
            //console.log('Connected');
            console.log(`CONNECTION STRING IS postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASS}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_NAME}`);
        });
    }

    private routerConfig() {
        this.app.post("/todos", async (req, res) => {
            try {
                const { description } = req.body;
                console.log(req.body);
                const newTodo = await pool.query("INSERT INTO public.todos (description) VALUES($1) RETURNING * ", [description]);
                res.json(newTodo.rows[0]);

            } catch (error) {
                console.log(error.meessage)
            }
        });

        this.app.get("/todos", async (req, res) => {
            try {
                const allTodos = await pool.query("SELECT * FROM public.todos");
                console.log("here");
                res.json(allTodos.rows);

            } catch (error) {
                console.log(error.meessage)
            }
        });

        this.app.get("/todos/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const todo = await pool.query("SELECT * FROM public.todos WHERE todo_id = $1", [id])
                res.json(todo.rows[0])

            } catch (error) {
                console.log(error.message)

            }
        });

        this.app.put("/todos/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const { description } = req.body;
                const updateTodo = await pool.query("UPDATE public.todos SET description = $1 WHERE todo_id = $2", [description, id])
                res.json("Todo updated.")

            } catch (error) {
                console.log(error.message)
            }
        });

        this.app.delete("/todos/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const deleteTodo = await pool.query("DELETE FROM public.todos WHERE todo_id = $1", [id])
                res.json("Todo deleted.")

            } catch (error) {
                console.log(error.message)
            }
        });

        this.app.get('/migrate', async (req, res) => {
            try {

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
                const { resultCreate } = await pool.query(create);
                const { resultInsert } = await pool.query(insert);

                const result = `${resultCreate} + ${resultInsert}`



                res.send(result);
            } catch (error) {
                res.status(400).send(`${error} in migrate`);
            }
        });
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }

}

export default Server

