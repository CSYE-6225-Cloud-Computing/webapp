// defining routes to route request calls to corresponding methods

const userController = require('../controllers/users-controller.js')

const router = require('express').Router()

//Route for POST method
router.post('/user', userController.add)

//Route for GET method
router.get('/user/:id', userController.retrieve)

//Route for PUT method
router.put('/user/:id', userController.update)

//Route for GET method // a dummy check method
router.get('/healthz', userController.check)

module.exports = router