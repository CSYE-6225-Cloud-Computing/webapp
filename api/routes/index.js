import usersRouter from "./users-router.js";


export default (app) => {
    app.use('/',usersRouter);
}