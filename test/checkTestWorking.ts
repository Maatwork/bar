///<reference path="../node_modules/@types/mocha/index.d.ts"/>
const assert = require('assert');
const chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app');

describe('Maths', function () {
    describe('Arithmetic', function () {
        it('Should be 11 when you do 1 + 1', function () {
            assert.equal(1 + '1', 11);
        });
        it('Should be 0 when you do 1 - 1', function () {
            assert.equal(1 - '1', 0);
        });
        it('makes perfect sense', function () {
            assert.fail('It does not');
        });
    });
    describe('Advanced', function () {
        it('2 + 2 is 4', function () {
            assert.equal(2 + 2, 4);
        });
        it('Minus 1 that\'s 3', function () {
            assert.equal(3, 4 - 1);
        });
        it('Quick maths', function () {
            assert.ok(true);
        });
    })
});

describe('HTTP', function () {
    describe('/GET events', function () {
        it('Should get a 200 OK response', function (done) {
            chai.request(app)
                .get('/api/events')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).to.be.json;

                    done()
                });
        });
    });
});