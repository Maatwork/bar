///<reference path="../node_modules/@types/mocha/index.d.ts"/>
const assert = require('assert');
const chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app');

describe('Events', function () {
    describe('/GET 3 events in the city of Eindhoven ', function () {
        it('Should get 3 or less valid events with Eindhoven as City', function (done) {
            chai.request(app)
                .get('/api/events')
                .query({city: 'Eindhoven', limit: 3})
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).to.be.json;
                    assert.equal(res.body.length > 3, false);

                    res.body.forEach(e => {
                        if (e['bar.city'] != 'Eindhoven') assert.fail('City parameter not functioning');
                    });
                    done()

                });
        });
    });
    describe('/POST, /PUT, /DELETE and /GET a new event ', () => {
        describe('/POST new event', () => {
            it('Should be able to post a new event and get back the same name with a 201 status code, in a json string.', (done) => {
                this.timeout(20000);
                chai.request(app)
                    .post('/api/events')
                    .set('authorization', 'Bearer bdb3f32507e2716b85fa845ea526b1915cc8dc2c')
                    .send({name: 'Test', start: Date.now()})
                    .end((err, res) => {
                        chai.expect(res).to.have.status(201);
                        chai.expect(res).to.be.json;
                        assert.equal(res.body.name == 'Test', true);
                        const id = res.body.id;

                        chai.request(app)
                            .get('/api/events/' + id)
                            .end((err, res) => {
                                chai.expect(res).to.have.status(200);
                                chai.expect(res).to.be.json;
                                assert.equal(res.body.name == 'Test', true);
                                console.log('hi!');
                                chai.request(app)
                                    .put('/api/events/' + id)
                                    .set('authorization', 'Bearer bdb3f32507e2716b85fa845ea526b1915cc8dc2c')
                                    .send({name: 'OtherTest', start: Date.now()})
                                    .end((err, res) => {
                                        chai.expect(res).to.have.status(200);

                                        chai.request(app)
                                            .delete('/api/events/' + id)
                                            .set('authorization', 'Bearer bdb3f32507e2716b85fa845ea526b1915cc8dc2c')
                                            .end((err, res) => {
                                                chai.expect(res).to.have.status(200);
                                                chai.request(app)
                                                    .get('/api/events/' + id)
                                                    .end((err, res) => {
                                                        assert.equal(res.body.name, false);
                                                        done();
                                                    });
                                            });

                                    })
                            });
                    })
            })
        });
    });
});