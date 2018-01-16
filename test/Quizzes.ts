///<reference path="../node_modules/@types/mocha/index.d.ts"/>
const assert = require('assert');
const chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app');

describe('Quizzes', function () {
    let question = {};
    describe('/GET all quizzes ', function () {
        it('Should get more than 1 quiz', function (done) {
            chai.request(app)
                .get('/api/questions')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).to.be.json;
                    assert.equal(res.body.length > 1, true);
                    done();
                });
        });
    });
    describe('/POST, /PUT a Quiz ', () => {
        describe('/POST new Quiz', () => {
            it('Should be able to post a new Quiz and get back the same name with a 201 status code, in a json string.', (done) => {

                this.timeout(20000);
                chai.request(app)
                    .post('/api/quizzes')
                    .set('authorization', 'Bearer bdb3f32507e2716b85fa845ea526b1915cc8dc2c')
                    .send({
                        title: 'Quizzy',
                        category: 'unittests',
                        description: 'Bad, bad quiz',
                    })
                    .end((err, res) => {
                        chai.expect(res).to.have.status(201);
                        chai.expect(res).to.be.json;
                        assert.equal(res.body.name, 'Quizzy');
                        const id = res.body.id;
                        done();
                        chai.request(app)
                            .put('/api/quizzes/' + id)
                            .set('authorization', 'Bearer bdb3f32507e2716b85fa845ea526b1915cc8dc2c')
                            .send({
                                title: 'Quizzy2',
                                category: 'unittests',
                                description: 'Desc',
                            })
                            .end((err, res) => {
                                chai.expect(res).to.have.status(200);
                                assert.equal(res.body.name, "Quizzy2");
                                done();
                            })
                    });
            })
        })
    });
});