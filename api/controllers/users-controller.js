const bcrypt = require('bcrypt')

const db = require('../models')
const sequelize  = require('../models/index')

const User = db.users

// A dummy check method
const check = (req,res) => {
    sequelize.sequelize.authenticate()
    .then(() => {
        res.send('Connection has been established successfully.');
    })
    .catch(err => {
        res.send('Unable to connect to the database:', err);
    })
}

// add method to create a new user
const add = async (req, res) => {

    // check if request body exists
    if(Object.keys(req.body).length === 0){
        return res.status(400).send('Bad request')
    }

    // check if request body has all the necessary information
    if(req.body.first_name == null || req.body.last_name == null || req.body.username == null || req.body.password == null){
        return res.status(400).send('Bad request')
    }

    // retrieves attribute values from request body
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var username = req.body.username
    var password = req.body.password
    var date = new Date()
    var created_date = date.toJSON()

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
            attributes: { exclude: [ 'password', 'createdAt', 'updatedAt' ]}})     
        return res.status(201).send(response)
    }

    return res.status(400).send('Bad request')
}

// method to be executed on GET method call
const retrieve = async (req, res) => {
    // check if Auth Block exists in the request
    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }

    // decoding the Auth Block
    const authenticated = await authenticate(req)

    if(authenticated == true){

        // retrieve user data based on parameter id
        let user = await User.findOne({where: { id: req.params.id },
            attributes: { exclude: [ 'password', 'createdAt', 'updatedAt' ]}})

        if(user != null){
            return res.status(200).send(user)
        }

        
        return res.status(403).send('Forbidden')
    }

    return res.status(403).send('Forbidden')
}

// Update method to be called on PUT method call
const update = async (req, res) => {
    if(!req.body.first_name || !req.body.last_name || !req.body.password){
        return res.status(400).json("Bad Request")
    }
    
    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }
    
    //should not allow user to update username, account created/updated
    if(!req.body.username && !req.body.account_created && !req.body.account_updated)
    {
        //decode auth
        const authenticated = await authenticate(req)

        if(authenticated == true){

            var password = req.body.password

            // hashing the password using salt
            const hash = await bcrypt.hash(password, 10)

            // update user
            const user = await User.update({first_name: req.body.first_name, last_name: req.body.last_name, password: hash, account_updated: new Date().toJSON()}, {where: { id: req.params.id }})
            
            if(user == 1){
                return res.status(204).send(user)
            }
                return res.status(400).send('Bad request')
        }
            return res.status(403).send('Forbidden')
    }
    return res.status(400).send('Bad request')
}

// function decode and check authentication
async function authenticate (req) {

    // decoding the Auth Block
    var basicAuth = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':')

    // retrieve user
    let user = await User.findOne({where: { username: basicAuth[0] }})

    //checking if user exist
    if(user != null && user.id == req.params.id){
        // compare user password with stored hash
        const authenticated = await bcrypt.compare(basicAuth[1], user.password)
        return authenticated
    }
    return false
}


module.exports = {
    add,
    retrieve,
    update,
    check
}