const bcrypt = require('bcrypt')

const db = require('../models')
const sequelize  = require('../models/index')

const User = db.users

// A dummy check method
const check = async (req,res) =>  {
    sequelize.sequelize.authenticate()
    .then(() => {
        res.send('Connection established successfully.');
    })
}

// add method to create a new user
const add = async (req, res) => {

    // check if request body exists
    if(Object.keys(req.body).length === 0){
        return res.status(400).send('Bad request')
    }

    // check if request body has all the necessary information
    if(!req.body.first_name || !req.body.last_name || !req.body.username || !req.body.password ){
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
            attributes: { exclude: [ 'password']}})
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
    const authenticated = await authenticate(req, res)

    if(authenticated == true){

        // retrieve user data based on parameter id
        let user = await User.findOne({where: { id: req.params.id },
            attributes: { exclude: [ 'password']}})

        if(user != null){
            return res.status(200).send(user)
        }
    }

}

// Update method to be called on PUT method call
const update = async (req, res) => {
    if(!req.body.first_name || !req.body.last_name || !req.body.password){
        return res.status(400).send("Bad Request")
    }

    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }

    //should not allow user to update username, account created/updated
    if(!req.body.username && !req.body.account_created && !req.body.account_updated && Object.keys(req.body).length === 3)
    {
        //decode auth
        const authenticated = await authenticate(req,res)

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
    }else{
        return res.status(400).send('Bad request')
    }
}

// function to authenticate a user
async function authenticate (req, res) {
    // decrypt auth
    var basicAuth = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':')

    // find the user by id
    let userByID = await User.findOne({where: { id: req.params.id }})
    let user = await User.findOne({where: { username: basicAuth[0] }})

    if(user && userByID){
        // check the auth
        const authenticated = await bcrypt.compare(basicAuth[1], user.password)

        if(authenticated && basicAuth[0] == userByID.username) {
            return true
        }
        if(authenticated && basicAuth[0] != userByID.username){
            return res.status(403).send('Forbidden')
        }
    }
    return res.status(401).send('Unauthorized')
}


module.exports = {
    add,
    retrieve,
    update,
    check
}
