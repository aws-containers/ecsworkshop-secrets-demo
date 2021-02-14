const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const port = 4000;

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_NAME,
    password: process.env.POSTGRES_PASS,
    port: process.env.POSTGRES_PORT,
})

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(cors())

//Routers
app.get('/', (request, response) => {
    response.json({ info: 'running' })
})

app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM public.todos");
        res.status(200).json(allTodos.rows)
    } catch (error) {
        console.log(error.meessage)
    }
});

app.post("/todos", async (req, res) => {
    console.log(req);
    try {
        const { description } = req.body;
        //console.log(req.body);
        const newTodo = await pool.query("INSERT INTO public.todos (description) VALUES($1) RETURNING * ", [description]);
        res.status(200).json(newTodo.rows[0]);
    } catch (error) {
        console.log(error.meessage)
    }
});

app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM public.todos WHERE todo_id = $1", [id])
        res.status(200).json(todo.rows[0])

    } catch (error) {
        console.log(error.message)

    }
});

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE public.todos SET description = $1 WHERE todo_id = $2", [description, id])
        res.status(200).json("Todo updated.")

    } catch (error) {
        console.log(error.message)
    }
});

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM public.todos WHERE todo_id = $1", [id])
        res.status(200).json("Todo deleted.")

    } catch (error) {
        console.log(error.message)
    }
});

app.get('/migrate', async (req, res) => {
    try {
        const create = `
          DROP TABLE todos;
          CREATE TABLE todos
          (
              id integer NOT NULL,
              title text  NOT NULL,
              description text NOT NULL,
              "isFinished" boolean NOT NULL,
              CONSTRAINT todos_pkey PRIMARY KEY (id)
          );
          INSERT INTO todos VALUES
          (
              1,'Do something','Do Something good',true
  
          );
        `
        const resultCreate = await pool.query(create);

        res.status(200).send(resultCreate);
    } catch (error) {
        res.status(400).send(`${error} in migrate`);
    }
});


//Start Server
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})