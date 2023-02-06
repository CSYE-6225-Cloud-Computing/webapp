// defining routes to route request calls to corresponding methods

const productController = require('../controllers/product-controller.js')

const router = require('express').Router()

//Route for POST method
router.post('/', productController.add)

//Route for GET method
router.get('/:id', productController.retrieve)

//Route for PUT method
router.put('/:id', productController.update)

//Route for PATCH method
router.patch('/:id', productController.replace)

//Route for DELETE method
router.delete('/:id', productController.remove)

module.exports = router