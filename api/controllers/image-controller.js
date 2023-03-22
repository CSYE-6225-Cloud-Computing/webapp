const bcrypt = require('bcrypt')
const moment = require('moment')
const db = require('../models')

const client = require('../../metrics')

const Images = db.images
const User = db.users
const Products = db.products

const {uploadFile, deleteFile} = require('../../s3')

const uploadImage = async (req,res) => {

    client.increment("myendpoint.requests.uploadImage.http.post")

    logger.info(`POST: hitting Image upload`);

     //check if Auth block exist in request
     if(!req.get('Authorization')){

        logger.error("POST: Failed to provide credentials to authenticate");

        return res.status(401).send('Unauthorized')
    }

    if(isNaN(req.params.id) || !req.file){

        logger.error("POST: Bad Request (File is missing in the body)");

        return res.status(400).send('Bad request')
    }

    // check if user is authorized
    const authenticated = await authenticate(req,res)

    if(!isNaN(authenticated)){

        const extension = req.file.mimetype

        // check if request body has all the necessary information
        if( extension!= "image/jpeg" && extension != "image/png"){

            logger.error(`POST: file with ${extension} is unsupported`);

            return res.status(400).send('Bad request')
        }

        const result = await uploadFile(req)

        var date = moment().tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss.sss')
        
        // structuring JSON object with Info
        let newImage = {
            product_id: req.params.id,
            file_name: req.file.originalname,
            date_created: date,
            s3_bucket_path : result.key,
        }

        const image = await Images.create(newImage)

        logger.info(`POST: image created for product ${req.params.id}`);

        return res.status(201).send(image)
    }
}

// method to be executed on GET method call
const getImage = async (req, res) => {

    client.increment("myendpoint.requests.getImage.http.get")

    logger.info(`GET: hitting Image retrieval`);

    if(isNaN(req.params.id) || isNaN(req.params.image) ){

        logger.error(`GET: ${req.params.image} is not available for product ${req.params.id}`);

        return res.status(400).json('Bad request');
    }

    //check if auth block exist in request
    if(!req.get('Authorization')){

        logger.error("GET: Failed to provide credentials to authenticate");

        return res.status(401).send('Unauthorized')
    }

    //decode auth
    const authenticated = await authenticate(req,res)

    if(!isNaN(authenticated)){

        let image = await Images.findOne({where: { image_id: req.params.image }})

        //check if product exist
        if(image != null){

            logger.info(`GET: Successfully retrieved image ${req.params.image}`);

            return res.status(200).send(image)

        }else{

            logger.error(`GET: Image ${req.params.image} Not found`);

            return res.status(404).send("Not Found")
        }
    }
}

const getAllImages = async (req, res) => {

    client.increment("myendpoint.requests.getAllImages.http.get")

    logger.info(`GET: hitting All Images retrieval for product ${req.params.id}`);

    if(isNaN(req.params.id)){

        logger.error("PUT: ID in Endpoint URL is NaN");

        return res.status(400).json('Bad request');
    }

    //check if auth block exist in request
    if(!req.get('Authorization')){

        logger.error(`GET:Credentials not provided to authenticate`);

        return res.status(401).send('Unauthorized')
    }

    //decode auth
    const authenticated = await authenticate(req,res)

    if(!isNaN(authenticated)){

        let images = await Images.findAll({where: { product_id: req.params.id }})

        //check if product exist
        if(images != null){

            logger.info(`GET: Images for product ${req.params.id} is fetched`);

            return res.status(200).send(images)
        }else{

            logger.error(`GET: Images for Product ${req.params.id} is Not found`);

            return res.status(404).send("Not Found")
        }
    }
}

const deleteImage = async (req,res) => {

    client.increment("myendpoint.requests.deleteImage.http.delete")

    logger.info("DELETE: hitting Image delete");

    if(isNaN(req.params.id) || isNaN(req.params.image) ){

        logger.error("DELETE: ID in Endpoint URL is NaN");

        return res.status(400).json('Bad request');
    }

    //check if auth block exist in request
    if(!req.get('Authorization')){

        logger.error("DELETE: Failed to provide credentials to authenticate");

        return res.status(401).send('Unauthorized')
    }

    //decode auth
    const authenticated = await authenticate(req,res)

    if(!isNaN(authenticated)){
        
        // retrieve product data based on parameter id
        let image = await Images.findOne({where: { image_id: req.params.image }})

        //check if product exist and delete
        if(image != null){

            await deleteFile(image.s3_bucket_path)

            await Images.destroy({where: { image_id: req.params.image }})

            logger.info(`DELETE: successfully deleted image ${req.params.image}`);

            return res.status(204).send()

        }else{

            logger.error(`DELETE: Image ${req.params.image} Not Found`);

            return res.status(404).send("Not Found")
        }
    }
    
}

// function to authenticate a user
async function authenticate (req, res) {
    // decrypt auth
    var basicAuth = Buffer.from(req.get('Authorization').split(' ')[1], 'base64').toString().split(':')
    let user = await User.findOne({where: { username: basicAuth[0] }})

    if(user){
        const authenticated = await bcrypt.compare(basicAuth[1], user.password)
        if(authenticated){

            if(req.params.id){
                let product = await Products.findOne({where: { id: req.params.id }})
                if(req.params.image){
                    let image = await Images.findOne({where: { product_id: req.params.id, image_id: req.params.image }});
                    if(image == null){
                        return res.status(404).send('Not Found')
                    }
                }
                
                if(product != null){
                    if(product.owner_user_id == user.id){
                        return user.id
                    }else{
                        return res.status(403).send('Forbidden') 
                    }
                }else{
                    return res.status(404).send('Not Found')
                }
            }else{
                return user.id;
            }
            
        }else{
            return res.status(401).send('Unauthorized')
        }

    }else{
        return res.status(401).send('Unauthorized')
    }
}

module.exports = {
    getImage,
    deleteImage,
    uploadImage,
    getAllImages
}