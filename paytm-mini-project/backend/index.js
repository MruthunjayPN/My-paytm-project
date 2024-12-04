import express from 'express';
import cors from 'cors';
import mainRouter from './routes/index.js';

const app = express();

app.use(cors()); //middleware -> coz frontend and backend run in different routes
app.use(express.json());  //body parser

app.use('/api/v1', mainRouter);
app.listen(3000);