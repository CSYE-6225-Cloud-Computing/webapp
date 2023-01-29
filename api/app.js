import express from 'express';

// import mongoose from 'mongoose';
// use postgres tool import here

import cors from 'cors';

const app = express();

// mongoose.connect('mongo url here')
// enter postgres connection here

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

export default app;