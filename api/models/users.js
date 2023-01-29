import { Sequelize } from "sequelize";

module.exports =(sequelize,DataTypes) =>{
    const product = sequelize.define("user",{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_created: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_updated: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })
    return user
} // const Schema = new mongoose({
//     first_name:{
//         type: String,
//         required: 'First name is required'
//     },

//     last_name:{
//         type: String,
//         required: 'last name is required'
//     },

//     username:{
//         type: String,
//         required: 'Username is required'
//     },

//     password:{
//         type: String,
//         required: 'password is required'
//     },

//     account_created:{
//         type: Date,
//         default: Date.now
//     },

//     account_updated:{
//         type: Date,
//         default: Date.now
//     }

// }, {versionKey: false});

// const model = mongoose.model(users,Schema);

// export default model;