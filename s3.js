require('dotenv').config() 
const path = require('path');
const { Upload } = require("@aws-sdk/lib-storage");
const { S3 } = require("@aws-sdk/client-s3");
const moment = require('moment')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION

const s3 = new S3({
    // credentials: {
    //     accessKeyId: process.env.ACCESS_KEY_ID,
    //     secretAccessKey: process.env.SECRET_ACCESS_KEY
    // },
        region})

function uploadFile(req) {
    const file = req.file
    const extension = path.parse(file.originalname).ext
    const filename = path.parse(file.originalname).name

    var date = moment().tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss.sss')

    const uploadParams = {
        Bucket: bucketName,
        Body: file.buffer,
        Key: req.params.id+'/'+filename + '_' + date + extension,
        ContentType: file.mimetype
    }

    return new Upload({
        client: s3,
        params: uploadParams
    }).done();
}

function deleteFile(file) {

    const uploadParams = {
        Bucket: bucketName,
        Key: file
    }

    return s3.deleteObject(uploadParams);
    
}


module.exports = {
    uploadFile,
    deleteFile
}

