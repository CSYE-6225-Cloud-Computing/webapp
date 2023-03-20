const bcrypt = require('bcrypt')
const moment = require('moment')
const logger = require('../../logger')

const db = require('../models')
const sequelize  = require('../models/index')

const User = db.users

// A dummy check method
const check = async (req,res) =>  {

    logger.info("hitting status check");

    sequelize.sequelize.authenticate()
    .then(() => {
        res.send('Connection established successfully.');
    })
}

// add method to create a new user
const add = async (req, res) => {

    logger.info("POST: hitting create a user");

    // check if request body exists
    if(Object.keys(req.body).length === 0){

        logger.error("POST: Failed due to bad request body: wrong number of arguments passed");

        return res.status(400).send('Bad request')
    }

    // check if request body has all the necessary information
    if(!req.body.first_name || !req.body.last_name || !req.body.username || !req.body.password ){

        logger.error("POST: Failed due to bad request body: Fields mismatch");

        return res.status(400).send('Bad request')
    }

    var date = moment().tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss.sss')

    // retrieves attribute values from request body
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var username = req.body.username
    var password = req.body.password
    var created_date = date

    // standard email regex
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var userExists = await User.findOne({where: { username: username }})

    // hash the user password with a salt value of 10
    var hash = await bcrypt.hash(password, 11)

    // check if username is valid
    if(userExists == null && username.match(re)){

        // structuring JSON object with Info
        let newUser = {
            first_name: first_name,
            last_name: last_name,
            username: username,
            password: hash,
            account_created: created_date,
            account_updated: created_date
        }

        await User.create(newUser)

        // retrieving back the created user to send it back in response
        let response = await User.findOne({where: { username: username },
            attributes: { exclude: [ 'password']}})

        logger.info(`user ${username} created with id ${response.id}`);

        return res.status(201).send(response)
    }

    logger.error(`User with username: ${username} already exists`);

    return res.status(400).send('Bad request')
}

// method to be executed on GET method call
const retrieve = async (req, res) => {

    // check if Auth Block exists in the request
    if(isNaN(req.params.id)){
        return res.status(400).json('Bad request');
    }

    logger.info(`GET:retrieving a user with id: ${req.params.id}`);

    if(!req.get('Authorization')){

        logger.error(`GET:Credentials not provided to authenticate`);

        return res.status(401).send('Unauthorized')
    }

    // decoding the Auth Block
    const authenticated = await authenticate(req, res)

    if(authenticated == true){

        // retrieve user data based on parameter id
        let user = await User.findOne({where: { id: req.params.id },
            attributes: { exclude: [ 'password']}})

        if(user != null){

            logger.info(`GET: Success`);

            return res.status(200).send(user)
        }
    }

}

// Update method to be called on PUT method call
const update = async (req, res) => {

    if(isNaN(req.params.id)){

        logger.error("PUT: ID in Endpoint URL is NaN");

        return res.status(400).json('Bad request');
    }

    logger.info(`PUT: updating the user with ID: ${req.param.id}`);

    if(!req.get('Authorization')){

        logger.error("PUT: Credentials not provided to authenticate");

        return res.status(401).send('Unauthorized')
    }

    //should not allow user to update username, account created/updated
    if(!req.body.username && !req.body.account_created && !req.body.account_updated && Object.keys(req.body).length === 3)
    {
        //decode auth
        const authenticated = await authenticate(req,res)

        if(authenticated == true){

            if(!req.body.first_name || !req.body.last_name || !req.body.password){

                logger.error("PUT: Missing necessary parameters required to update");

                return res.status(400).send("Bad Request")
            }

            var password = req.body.password

            // hashing the password using salt
            const hash = await bcrypt.hash(password, 10)

            var date = moment().tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss.sss')
            // update user
            const user = await User.update({first_name: req.body.first_name, last_name: req.body.last_name, password: hash, account_updated: date}, {where: { id: req.params.id }})

            if(user == 1){

                logger.info(`PUT: Updated user with ID: ${req.param.id}`);

                return res.status(204).send(user)
            }

            logger.error("PUT: DB Update Failed");

            return res.status(400).send('Bad request')
        }
    }else{

        logger.error(`PUT: Trying to update failed due to bad request`);

        return res.status(400).send('Bad request')
    }
}

// function to authenticate a user
async function authenticate (req, res) {

    // decrypt auth
    var basicAuth = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':')

    logger.info(`checking authentication for user ${basicAuth[0]}`);

    // find the user by id
    let userByID = await User.findOne({where: { id: req.params.id }})

    let user = await User.findOne({where: { username: basicAuth[0] }})

    if(user && userByID){
        // check the auth
        const authenticated = await bcrypt.compare(basicAuth[1], user.password)

        if(authenticated && basicAuth[0] == userByID.username) {

            logger.info(`user ${basicAuth[0]} is authenticated`)

            return true
        }
        if(authenticated && basicAuth[0] != userByID.username){

            logger.error(`user ${basicAuth[0]} is forbidden to perform this action`)
            
            return res.status(403).send('Forbidden')
        }
    }
    
    logger.error(`user ${basicAuth[0]} is not authorized`)

    return res.status(401).send('Unauthorized')
}


module.exports = {
    add,
    retrieve,
    update,
    check
}
