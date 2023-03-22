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

            request(app).post('/v1/product').send({ sku:'test'}).end(function(err, res) {

                expect(res.statusCode).to.be.equal(401)
                
                done()
            })
        })

        it('Return the product for post if auth does not exist', function(done) {
            
            request(app).post('/v1/product/').send({}).end(function(err, res) {
                
                expect(res.statusCode).to.be.equal(401);                
                
                done();
            });
        });

        it('Return the image for post if auth does not exist', function(done) {
                        
            request(app).post('/v1/product/1/image').send({}).end(function(err, res) {
                
                expect(res.statusCode).to.be.equal(401);                
                
                done();
            });
        });

    })
})