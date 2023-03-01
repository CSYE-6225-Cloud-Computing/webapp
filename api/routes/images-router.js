// defining routes to route request calls to corresponding methods

const imageController = require('../controllers/image-controller.js')

const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const router = require('express').Router()

//Route for get list of all images method
router.get('/product/:id/image', imageController.getAllImages)

//Route for post image method
router.post('/product/:id/image',upload.single('image'), imageController.uploadImage)

//Route for get image method
router.get('/product/:id/image/:image', imageController.getImage)

//Route for DELETE image method
router.delete('/product/:id/image/:image', imageController.deleteImage)

module.exports = router