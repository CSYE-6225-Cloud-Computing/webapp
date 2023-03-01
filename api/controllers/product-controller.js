const bcrypt = require('bcrypt')
const moment = require('moment')
const db = require('../models')

const User = db.users
const Products = db.products
const Images = db.images

const imageController = require('./image-controller.js')
const {deleteFile} = require('../../s3')

// will be called for POST Method
const add = async (req, res) => {

    //check if Auth block exist in request
    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }

    // check if user is authorized
    const authenticated = await authenticate(req,res)
    
    if(!isNaN(authenticated)){

        if(
            Object.keys(req.body).length != 5 || 

            (!req.body.name) || req.body.name === null || typeof req.body.name != 'string' ||  req.body.name.trim().length === 0 || 
            
            (!req.body.description) || req.body.description === null || typeof req.body.description != 'string' || req.body.description.trim().length === 0 || 
                        
            (!req.body.sku) || req.body.sku === null || typeof req.body.sku != 'string' || req.body.sku.trim().length === 0 || 
                        
            (!req.body.manufacturer) || req.body.manufacturer === null || typeof req.body.manufacturer != 'string' || req.body.manufacturer.trim().length === 0 || 
                        
            req.body.quantity === null || typeof req.body.quantity != 'number' ||  req.body.quantity < 0 || req.body.quantity > 100 || req.body.quantity % 1 != 0 || 
                        
            req.body.id || req.body.owner_user_id || req.body.account_created || req.body.account_updated
        ){
            return res.status(400).send('Bad request')
        }

        var date = moment().tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss.sss')

        // structuring JSON object with Info
        let newProduct = {
            name: req.body.name,
            description: req.body.description,
            sku: req.body.sku,
            manufacturer: req.body.manufacturer,
            quantity : req.body.quantity,
            date_added: date,
            date_last_updated: date,
            owner_user_id: authenticated
        }

        //check if product already exist
        let isSKUExist = await Products.findOne({where: { sku: req.body.sku }})

        //reject post if product exist already
        if(isSKUExist != null){
            return res.status(400).send("SKU already Exist")
        }else{
            await Products.create(newProduct)

            // retrieving back the created user to send it back in response
            let response = await Products.findOne({where: { sku: req.body.sku }})
            return res.status(201).send(response)
        }
    }
}

// method to be executed on GET method call
const retrieve = async (req, res) => {

    if(isNaN(req.params.id)){
        return res.status(400).json('Bad request');
    }

    let product = await Products.findOne({where: { id: req.params.id }})

    //check if product exist
    if(product != null){
        return res.status(200).send(product)
    }else{
        return res.status(404).send("Not Found")
    }

}

const remove = async (req,res) => {

    if(isNaN(req.params.id)){
        return res.status(400).json('Bad request');
    }

    //check if auth block exist in request
    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }

    //decode auth
    const authenticated = await authenticate(req,res)

    if(!isNaN(authenticated)){
        
        // retrieve product data based on parameter id
        let product = await Products.findOne({where: { id: req.params.id }})

        let images = await Images.findAll({where: { product_id: req.params.id }})

        for(img in images){
            if(img != null){
                await deleteFile(img.file_name)
                await Images.destroy({where: { product_id: req.params.id }})
            }
        }

        //check if product exist and delete
        if(product != null){
            const product = await Products.destroy({where: { id: req.params.id }})
            return res.status(204).send()
        }else{
            return res.status(404).send("Not Found")
        }
    }
    
}

// Update method to be called on PUT method call
const update = async (req, res) => {

    if(isNaN(req.params.id)){
        return res.status(400).json('Bad request');
    }

    //check if auth block exist
    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }

    const authenticated = await authenticate(req,res)

    if(
        Object.keys(req.body).length != 5 || 

        (!req.body.name) || req.body.name === null || typeof req.body.name != 'string' ||  req.body.name.trim().length === 0 || 
            
        (!req.body.description) || req.body.description === null || typeof req.body.description != 'string' || req.body.description.trim().length === 0 || 
                    
        (!req.body.sku) || req.body.sku === null || typeof req.body.sku != 'string' || req.body.sku.trim().length === 0 || 
                    
        (!req.body.manufacturer) || req.body.manufacturer === null || typeof req.body.manufacturer != 'string' || req.body.manufacturer.trim().length === 0 || 
                    
        req.body.quantity === null || typeof req.body.quantity != 'number' ||  req.body.quantity < 0 || req.body.quantity > 100 || req.body.quantity % 1 != 0 || 
                    
        req.body.id || req.body.owner_user_id || req.body.account_created || req.body.account_updated
    ){
        return res.status(400).send('Bad request')
    }

        //check if SKU exist
        let isSKUExist = await Products.findOne({where: { sku: req.body.sku }})

        if(isSKUExist != null && isSKUExist.id != req.params.id){
            return res.status(400).send("SKU already Exist")
        }

        var date = moment().tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss.sss')

        // update product
        const product = await Products.update(
            {
                name: req.body.name,
                description: req.body.description,
                sku: req.body.sku,
                manufacturer: req.body.manufacturer,
                quantity : req.body.quantity,
                date_last_updated : date
            },
            {where: { id: req.params.id }})

        if(product == 1){
            return res.status(204).send(product)
        }else{
            return res.status(400).send('Bad request')
        }
    }



// Update method to be called on PATCH method call
const replace = async (req, res) => {

    if(isNaN(req.params.id)){
        return res.status(400).json('Bad request');
    }

    if(!req.get('Authorization')){
        return res.status(401).send('Unauthorized')
    }

    const authenticated = await authenticate(req,res)

    if(!isNaN(authenticated)){

        const bodyAllowedList = new Set (['name', 'description','manufacturer','quantity','sku'])

        //check if req is valid with no unwanted fields
        for (const prop in req.body) {
            if(req.body.hasOwnProperty(prop) && !bodyAllowedList.has(prop)) {
                return res.status(400).json('Bad request');
            }
        }

        //check if req body is valid
        if( 
            ((req.body.name) && (req.body.name === null || typeof req.body.name != 'string' ||  req.body.name.trim().length === 0)) || 
            
            ((req.body.description) && (req.body.description === null || typeof req.body.description != 'string' || req.body.description.trim().length === 0)) || 
                        
            ((req.body.sku) && (req.body.sku === null || typeof req.body.sku != 'string' || req.body.sku.trim().length === 0)) || 
                        
            ((req.body.manufacturer) && (req.body.manufacturer === null || typeof req.body.manufacturer != 'string' || req.body.manufacturer.trim().length === 0)) || 
                        
            ((req.body.quantity) && (req.body.quantity === null || typeof req.body.quantity != 'number' || req.body.quantity < 0 || req.body.quantity > 100 || req.body.quantity % 1 != 0)) || 
                        
            req.body.id || req.body.owner_user_id || req.body.account_created || req.body.account_updated
        ){
            return res.status(400).send('Bad request')
        }

        //check if product already exists
        if(req.body.sku){
            let isSKUExist = await Products.findOne({where: { sku: req.body.sku }})

            if(isSKUExist != null && isSKUExist.id != req.params.id){
                return res.status(400).send("SKU already Exist")
            }
        }

        var date = moment().tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss.sss')
                    
        // update product
        const product = await Products.update(
            {
                name: req.body.name,
                description: req.body.description,
                sku: req.body.sku,
                manufacturer: req.body.manufacturer,
                quantity : req.body.quantity,
                date_last_updated : date
            },
            {where: { id: req.params.id }})

        if(product == 1){
            return res.status(204).send(product)
        }else{
            return res.status(400).send('Bad request')
        }
    }
}

// function to authenticate a user
async function authenticate (req, res) {
    // decrypt auth
    var basicAuth = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':')

    let user = await User.findOne({where: { username: basicAuth[0] }})

    if(user){
        // will run for PUT, Replace and Delete calls
        if(req.params.id) {
            const authenticated = await bcrypt.compare(basicAuth[1], user.password)

            if(authenticated){
                let product = await Products.findOne({where: { id: req.params.id }})
                
                if(product != null){
                    if(user.id != product.owner_user_id){
                        return res.status(403).send('Forbidden')
                    }else{
                        return user.id
                    }
                } else{
                    return res.status(404).send('Not Found')
                }
                    
                
            }else{
                return res.status(401).send('Unauthorized')
            }
        }else{
            //will run for POST method call
            const authenticated = await bcrypt.compare(basicAuth[1], user.password)
            if(authenticated){ 
                if(basicAuth[0] == user.username) {
                    return user.id
                }else{
                    return res.status(403).send('Forbidden')
                }
            }else{
                return res.status(401).send('Unauthorized')
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