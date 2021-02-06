import { Router } from 'express';
import pool from '../dbconfig/dbconnector';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const client = await pool.connect();

    const sql = "SELECT id,item FROM public.todos";
    const { rows } = await client.query(sql);
    const todos = rows;
    
    client.release();

    res.send(todos);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
  



