//import Client from 'pg';

import pg from 'pg';
const Client = pg.Client;

const client = new Client ({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "dvdrental",
})

client.connect((err)=>{
    if(err){
        throw err;
    }

    console.log("connected");
})

client.query(`SELECT * FROM actor`,(err,res)=>{
    if(!err){
        console.log(res.rows);
    }else{
        console.log(err.message);
    }
    client.end;
})

