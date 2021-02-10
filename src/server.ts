import express, { Application } from 'express';
import bodyParser from 'body-parser';
import todosRouter from './routers/TodosRouter';
import migrateRouter from './routers/MigrateRouter';
import pool from './dbconfig/dbconnector';

class Server {
    private app : Application;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();

    }

    private config() {
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
        //this.debugContainer();
    }


    private dbConnect() {
        console.log(`postgres://postgres:${process.env.SECRET_NAME}@${process.env.DATABASE_ENDPOINT}:5432/tododb`)
        pool.connect(function (err, client, done) {
            if (err) throw new Error(err);
            console.log('Connected');
          }); 
    }

    private routerConfig() {
        this.app.use('/todos', todosRouter);
        this.app.use('/migrate', migrateRouter);
    }

    // private debugContainer() {

    //     this.app.get('/', (req, res) => {
    //         let dbname = process.env.DATABASE_ENDPONT;
    //         let dbsecret = process.env.SECRET_NAME;
    //         res.send(`DBname is ${dbname}<br>DBSecret is ${dbsecret}`);
    //     });
    //}

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }
}

export default Server;