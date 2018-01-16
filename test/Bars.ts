///<reference path="../node_modules/@types/mocha/index.d.ts"/>
const assert = require('assert');
const chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app');

describe('Bars', function () {
    describe('/GET all bars ', function () {
        it('Should get multiple bars', function (done) {
            chai.request(app)
                .get('/api/bars')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).to.be.json;
                    assert.equal(res.body.length > 1, true);
                    done()

                });
        });
    });
    describe('/POST, /PATCH and /GET a new bar ', () => {
        describe('/POST new bar', () => {
            it('Should be able to post a new bar and get back the same name, in a json string.', (done) => {
                this.timeout(20000);
                chai.request(app)
                    .post('/api/bars')
                    .set('authorization', 'Bearer bdb3f32507e2716b85fa845ea526b1915cc8dc2c')
                    .send({
                        name: 'Test',
                        description: 'Testing',
                        city: 'Eindtester',
                        zipcode: '5612AH',
                        address: 'Lollaan 12',
                        photos: '{"profile_image":"https://res.cloudinary.com/ixbitz/image/upload/v1512563442/ookw1a3qyozrheierdsc.jpg","images":["https://res.cloudinary.com/ixbitz/image/upload/v1512563448/cg4tnywhbxzt466k1lfp.jpg","https://res.cloudinary.com/ixbitz/image/upload/v1512563448/jbar5t4qzfrp2nnuxbvb.jpg","https://res.cloudinary.com/ixbitz/image/upload/v1512563448/l0u7c0bgwha7e8auqmu8.jpg"]}'
                    })
                    .end((err, res) => {
                        chai.expect(res).to.have.status(201);
                        chai.expect(res).to.be.json;
                        assert.equal(res.body.name == 'Test', true);
                        const id = res.body.id;

                        chai.request(app)
                            .get('/api/bars/' + id)
                            .end((err, res) => {
                                chai.expect(res).to.have.status(200);
                                chai.expect(res).to.be.json;
                                assert.equal(res.body.name == 'Test', true);
                                chai.request(app)
                                    .patch('/api/bars/' + id)
                                    .set('authorization', 'Bearer bdb3f32507e2716b85fa845ea526b1915cc8dc2c')
                                    .send({name: 'OtherTest'})
                                    .end((err, res) => {
                                        chai.expect(res).to.have.status(200);
                                        done()
                                    })
                            });
                    })
            })
        });
    });
});