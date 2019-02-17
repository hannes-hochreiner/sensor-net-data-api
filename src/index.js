import { default as express } from 'express';
import { Pool } from 'pg';

const app = express();
const port = 8000;
const pool = Pool();

app.use(express.json());
app.get('/sensor', async (req, res, next) => {
  try {
    let query_result = await pool.query('SELECT * FROM sensor');
    res.send({ status: "ok", result: query_result.rows});
    // await pool.end();
  } catch (e) {
    res.send({ status: "error"});
    next(e);
  } 
});
app.get('/equipment', async (req, res, next) => {
  try {
    let query_result = await pool.query('SELECT * FROM equipment');
    res.send({ status: "ok", result: query_result.rows});
    // await pool.end();
  } catch (e) {
    res.send({ status: "error"});
    next(e);
  } 
});
app.get('/parameter_type', async (req, res, next) => {
  try {
    let query_result = await pool.query('SELECT * FROM parameter_type');
    res.send({ status: "ok", result: query_result.rows});
    // await pool.end();
  } catch (e) {
    res.send({ status: "error"});
    next(e);
  } 
});
app.get('/parameter', async (req, res, next) => {
  try {
    let query_result = await pool.query('SELECT * FROM parameter p left join measurement m on m._id = p._measurement_id where m.ts >= $1 and m.ts < $2', [req.query.ts_start, req.query.ts_end]);
    res.send({ status: "ok", result: query_result.rows});
    // await pool.end();
  } catch (e) {
    res.send({ status: "error"});
    next(e);
  } 
});

app.listen(port, () => console.log(`sensor-net-data-api listening on port ${port}!`));
