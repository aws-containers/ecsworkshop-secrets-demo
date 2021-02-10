import pool from '../dbconfig/dbconnector';
import fs from 'fs';

const client = pool.connect();

const sql = fs.readFileSync('dbinit.sql','utf8');
const result = client.query(sql);
console.log(result);
  
client.release();



