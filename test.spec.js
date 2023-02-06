//test case to check the application behavior

const app = require('./api/app.js')

const request = require('supertest')

const chai = require('chai')

const expect = chai.expect

describe('Authentication Tests', function() {

    describe('Successes', function() {

        it('POST method Failure for Users', function(done) {

            request(app).post('/v1/user').send({ username:'test@gmail.com'}).end(function(err, res) {

                expect(res.statusCode).to.be.equal(400)
                
                done()
            })
        })

        it('POST method Failure for Products', function(done) {

            request(app).post('/v1/product').send({ username:'test@gmail.com'}).end(function(err, res) {

                expect(res.statusCode).to.be.equal(401)
                
                done()
            })
        })
    })
})