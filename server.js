import app from './api/app.js';

const port = 9000;

app.listen(port, ()=>{
    console.log(`server running at ${port}.`);
});