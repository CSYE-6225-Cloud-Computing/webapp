//import mongoose from 'mongoose';

const Schema = new mongoose({// change mongooselll

    first_name:{
        type: String,
        required: 'First name is required'
    },

    last_name:{
        type: String,
        required: 'last name is required'
    },

    username:{
        type: String,
        required: 'Username is required'
    },

    password:{
        type: String,
        required: 'password is required'
    },

    account_created:{
        type: Date,
        default: Date.now
    },

    account_updated:{
        type: Date,
        default: Date.now
    }

}, {versionKey: false});

const model = mongoose.model(users,Schema);

export default model;