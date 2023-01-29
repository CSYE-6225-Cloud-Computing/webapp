import Users from './users.js';

import dbConfig from '../config/dbConfig.js';
import {Sequelize, DataTypes} from 'sequelize';

const sequelize = new sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host:dbConfig.HOST,
        dialect: dbConfig.dialect,
        operationAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.acquire.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

sequelize.authenticate()
.then(()=>{
    console.log('connected..')
})
.catch(err=>{
    console.log('Error:'+err);
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./users')(sequelize,DataTypes  )

db.sequelize.sync({force : false})
.them(()=>{
    console.log('resync done..')
})

modules.export = db

export default { Users };