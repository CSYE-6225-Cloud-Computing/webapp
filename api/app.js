import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import model from './models/index.js';

//import mongoose from 'mongoose';
// use postgres tool import here

const app = express();

// mongoose.connect('mongo url here')
// enter postgres connection here

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

routes(app);

export default app;