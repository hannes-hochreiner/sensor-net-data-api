import { default as express } from 'express';
import { Pool } from 'pg';
import {default as commander} from "commander";

const app = express();
const pool = Pool();

commander.option("-p, --port [n]", "Port at which the server listens. If none is specfied, the server listens at file descriptor 3.")
  .parse(process.argv);

let port = commander.port || { fd: 3 };
let idleCounter = 0;

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

let server = app.listen(port, () => console.log(`sensor-net-data-api listening on port ${port}!`));

setInterval(() => {
  if (idleCounter > 10) {
    console.log("closing sensor-net-data-api");
    server.close();
    process.exit(0);
  }

  idleCounter += 1;
}, 1000);
