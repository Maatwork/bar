///<reference path="../node_modules/@types/mocha/index.d.ts"/>
const assert = require('assert');
const chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app');

describe('Questions', function () {
    let question = {};
    describe('/GET all questions ', function () {
        it('Should get more than 1 question and then get the first of these questions specifically.', function (done) {
            chai.request(app)
                .get('/api/questions')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).to.be.json;
                    assert.equal(res.body.length > 1, true);
                    question.id = res.body[0].id;
                    question.text = res.body[0].text;
                    console.log('question: ');
                    console.log(question);
                    chai.request(app)
                        .get('/api/questions/' + question.id)
                        .end((err, res) => {
                            console.log('hi!');
                            chai.expect(res).to.have.status(200);
                            chai.expect(res).to.be.json;
                            console.log('question: ');
                            console.log(question);
                            console.log(res.body);
                            assert.equal(res.body.text, question.text);
                            done();
                        });
                });
        });
    });
    describe('/POST, /PUT, /DELETE and /GET a new question ', () => {
        describe('/POST new question', () => {
            it('Should be able to post a new question and get back the same name with a 201 status code, in a json string.', (done) => {
                this.timeout(20000);
                chai.request(app)
                    .post('/api/questions/7459b1aa-ce95-4c45-8b15-8a7b094759c2')
                    .set('authorization', 'Bearer bdb3f32507e2716b85fa845ea526b1915cc8dc2c')
                    .send({
                        text: 'TestQuestion',
                        category: 'unittests',
                        answer: 'Yes',
                        quizId: '7459b1aa-ce95-4c45-8b15-8a7b094759c2'
                    })
                    .end((err, res) => {
                        chai.expect(res).to.have.status(201);
                        chai.expect(res).to.be.json;
                        assert.equal(res.body.name, 'TestQuestion');
                        const id = res.body.id;

                        chai.request(app)
                            .get('/api/questions/' + id)
                            .end((err, res) => {
                                chai.expect(res).to.have.status(200);
                                chai.expect(res).to.be.json;
                                assert.equal(res.body.name, 'TestQuestion');
                                chai.request(app)
                                    .put('/api/questions/' + id)
                                    .set('authorization', 'Bearer bdb3f32507e2716b85fa845ea526b1915cc8dc2c')
                                    .send({
                                        text: 'OtherTestQuestion',
                                        category: 'unittests',
                                        answer: 'Yes',
                                        quizId: '7459b1aa-ce95-4c45-8b15-8a7b094759c2'
                                    })
                                    .end((err, res) => {
                                        chai.expect(res).to.have.status(200);

                                        chai.request(app)
                                            .delete('/api/questions/' + id)
                                            .set('authorization', 'Bearer bdb3f32507e2716b85fa845ea526b1915cc8dc2c')
                                            .end((err, res) => {
                                                chai.expect(res).to.have.status(200);
                                                chai.request(app)
                                                    .get('/api/questions/' + id)
                                                    .end((err, res) => {
                                                        assert.equal(res.body.text, undefined);
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