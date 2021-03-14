const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 4000;

const creds = JSON.parse(process.env.POSTGRES_DATA);

const Pool = require('pg').Pool;
const pool = new Pool({
    user: creds.username,
    host: creds.host,
    database: creds.dbname,
    password: creds.password,
    port: creds.port,
});

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

const corsOptions = {
    origin: "http://localhost:4000"
};

app.use(cors(corsOptions));

//Routers

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM public.todos");
        res.status(200).json(allTodos.rows);
    } catch (error) {
        console.log(error.meessage);
    }
});

app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO public.todos (description) VALUES($1) RETURNING * ", [description]);
        res.status(200).json(newTodo.rows[0]);
    } catch (error) {
        console.log(error);
    }
});

app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM public.todos WHERE todo_id = $1", [id]);
        res.status(200).json(todo.rows[0]);

    } catch (error) {
        console.log(error.message);

    }
});

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        await pool.query("UPDATE public.todos SET description = $1 WHERE todo_id = $2", [description, id]);
        res.status(200).json("Todo updated.");

    } catch (error) {
        console.log(error);
    }
});

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM public.todos WHERE todo_id = $1", [id]);
        res.status(200).json("Todo deleted.");

    } catch (error) {
        console.log(error);
    }
});

app.get('/migrate', async (req, res) => {
    try {
        const create = `
          DROP TABLE IF EXISTS todos;
          CREATE TABLE todos
          (
              todo_id SERIAL PRIMARY KEY,
              description VARCHAR(255)
          );
          INSERT INTO public.todos (description) VALUES
          (
              'Do something excellent today'
  
          );
        `;
        const resultCreate = await pool.query(create);

        res.status(200).send(resultCreate);
    } catch (error) {
        console.log(error);
    }
});

app.get('/env', (req, res) => {
    let result = process.env;
    res.status(200).json(result);
});

app.get('/creds', (req, res) => {
    res.send(`<ul><li>Host is ${creds.host}</li><li>dbname is ${creds.dbname}</li><li>port is ${creds.port}</li><li>password is ${creds.password}</li><li>user is ${creds.username}</li></ul>`);
});

app.get('/parameter-store-demo', (req, res) => {
    const envParam = process.env.DEMO_PARAMETER;
    if (envParam) {
        res.send(`{ "value" : "${envParam}" }`);
    } else {
        res.send(`{ "value" : "" }`);
    }

});

//Start Server
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});