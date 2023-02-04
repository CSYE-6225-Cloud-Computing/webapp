//test case to check the application behavior

const app = require('./api/app.js')

const request = require('supertest')

const chai = require('chai')

const expect = chai.expect

describe('Authentication Tests', function() {

    describe('Successes', function() {

        it('POST method Failure', function(done) {

            request(app).post('/v1/user').send({ username:'test@gmail.com'}).end(function(err, res) {

                expect(res.statusCode).to.be.equal(500)
                
                done()
            })
        })
    })
})