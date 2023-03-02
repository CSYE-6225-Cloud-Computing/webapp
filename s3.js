require('dotenv').config() 
const path = require('path');
const S3 = require('aws-sdk/clients/s3')
const moment = require('moment')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION

const s3 = new S3({region})

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

    return s3.upload(uploadParams).promise()
}

function deleteFile(file) {

    const uploadParams = {
        Bucket: bucketName,
        Key: file
    }

    return s3.deleteObject(uploadParams).promise()
    
}


module.exports = {
    uploadFile,
    deleteFile
}

