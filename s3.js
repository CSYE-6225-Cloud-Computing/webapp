require('dotenv').config() 
const path = require('path');
const S3 = require('aws-sdk/clients/s3')
const moment = require('moment')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

function uploadFile(file) {
    const extension = path.parse(file.originalname).ext
    const filename = path.parse(file.originalname).name

    var date = moment().tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss.sss')

    const uploadParams = {
        Bucket: bucketName,
        Body: file.buffer,
        Key: filename + '_' + date + extension,
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

