import express, { Application } from 'express';
import bodyParser from 'body-parser';
import todosRouter from './routers/TodosRouter';
import migrateRouter from './routers/MigrateRouter';
import pool from './dbconfig/dbconnector';

class Server {
    private app: Application;

    private port = parseInt(process.env.PORT || '4000');

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();
        this.start(this.port)
            .then(port => console.log(`Running on port ${this.port}`))
            .catch(error => {
                console.log(error)
            });

    }

    private config() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
    }


    private dbConnect() {
        pool.connect(function (err, client, done) {
            if (err) throw new Error(err);
            console.log('Connected');
        });
    }

    private routerConfig() {
        this.app.use('/todos', todosRouter);
        this.app.use('/migrate', migrateRouter);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }

}

export default Server;