const bcrypt = require('bcrypt')

const db = require('../models')
const sequelize  = require('../models/index')

const User = db.users

const Products = db.products

const add = async (req, res) => {

    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }

    // check if request body has all the necessary information
    if(Object.keys(req.body).length != 5 || !req.body.name || !req.body.description || !req.body.sku || !req.body.manufacturer || !req.body.quantity || req.body.quantity < 0){
        return res.status(400).send('Bad request')
    }

    //decode auth
    const authenticated = await authenticate(req,res)
    
    if(!isNaN(authenticated)){

        // structuring JSON object with Info
        let newProduct = {
            name: req.body.name,
            description: req.body.description,
            sku: req.body.sku,
            manufacturer: req.body.manufacturer,
            quantity : req.body.quantity,
            date_added: (new Date()).toJSON(),
            date_last_updated: (new Date()).toJSON(),
            owner_user_id: authenticated
        }

        await Products.create(newProduct)

        // retrieving back the created user to send it back in response
        let response = await Products.findOne({where: { name: req.body.name }})
        return res.status(201).send(response)
    }else{
        return res.status(400).send('Bad request')
    }
    
}

// method to be executed on GET method call
const retrieve = async (req, res) => {
    
    // retrieve product data based on parameter id
    let product = await Products.findOne({where: { id: req.params.id }})

    if(product != null){
        return res.status(200).send(product)
    }else{
        return res.status(400).send("Bad Request")
    }

}

const remove = async (req,res) => {

    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }

    //decode auth
    const authenticated = await authenticate(req,res)

    if(!isNaN(authenticated)){
        
        // retrieve product data based on parameter id
        let product = await Products.findOne({where: { id: req.params.id }})

        if(product != null){

            const product = await Products.destroy({where: { id: req.params.id }})
            return res.status(204).send()

        }else{

            return res.status(400).send("Bad Request")
        }
    }
    
}

// Update method to be called on PUT method call
const update = async (req, res) => {

    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }

    if(!req.body.name || !req.body.description || !req.body.manufacturer || !req.body.sku || !req.body.quantity ){
        return res.status(400).send("Bad Request")
    }

    //should not allow user to update username, account created/updated
    if(Object.keys(req.body).length === 5 && !req.body.id && !req.body.owner_user_id && !req.body.account_created && !req.body.account_updated)
    {
        //decode auth
        const authenticated = await authenticate(req,res)

        if(!isNaN(authenticated)){

            // update product
            const product = await Products.update(
                {
                    name: req.body.name,
                    description: req.body.description,
                    sku: req.body.sku,
                    manufacturer: req.body.manufacturer,
                    quantity : req.body.quantity,
                    date_last_updated : (new Date()).toJSON()
                },
                {where: { id: req.params.id }})

            if(product == 1){
                return res.status(204).send(product)
            }
            return res.status(400).send('Bad request')
        }
    }else{
        return res.status(400).send('Bad request')
    }
}


// Update method to be called on PATCH method call
const replace = async (req, res) => {

    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }

    if(!req.body.name || !req.body.description || !req.body.manufacturer || !req.body.sku || !req.body.quantity ){
        return res.status(400).send("Bad Request")
    }

    //should not allow user to update username, account created/updated
    if(Object.keys(req.body).length === 5 && !req.body.id && !req.body.owner_user_id && !req.body.account_created && !req.body.account_updated)
    {
        //decode auth
        const authenticated = await authenticate(req,res)

        if(!isNaN(authenticated)){

            // update product
            const product = await Products.update(
                {
                    name: req.body.name,
                    description: req.body.description,
                    sku: req.body.sku,
                    manufacturer: req.body.manufacturer,
                    quantity : req.body.quantity,
                    date_last_updated : (new Date()).toJSON()
                },
                {where: { id: req.params.id }})

            if(product == 1){
                return res.status(204).send(product)
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

    let user = await User.findOne({where: { username: basicAuth[0] }})

    if(user){
        // check the auth
        if(req.params.id) {

            let product = await Products.findOne({where: { id: req.params.id }})

            if(product != null && user.id != product.owner_user_id){
                return res.status(401).send('Unauthorized')
            }else{
                return user.id
            }

        }else{
            
            const authenticated = await bcrypt.compare(basicAuth[1], user.password)

            if(authenticated && basicAuth[0] == user.username) {
                return user.id
            }else{
                return res.status(403).send('Forbidden')
            }
        }
    }else{
        return res.status(401).send('Unauthorized')
    }
}


module.exports = {
    add,
    retrieve,
    update,
    replace,
    remove
}


