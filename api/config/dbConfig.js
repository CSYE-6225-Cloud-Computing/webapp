//Standard DB Config file for postgres
console.log();
module.exports = {
    HOST: `${process.env.DB_HOST}`,
    USER: `${process.env.DB_USER}`,
    PASSWORD: `${process.env.DB_PASS}`,
    DB: `${process.env.DB_DATABASE}`,
    dialect: 'postgres',
    omitNull: true,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}