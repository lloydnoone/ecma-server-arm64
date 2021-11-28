"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("../../test/helper");
var loginCorrect = {
    email: 'lloyd@email.com',
    password: 'pass'
};
var loginIncorrect = {
    email: 'test@test.test',
    password: 'wrong'
};
describe('GET /login', function () {
    test('should return a 200 response', function (done) {
        helper_1.request
            .get('/auth/login')
            .end(function (err, res) {
            expect(res.status).toBe(200);
            done();
        });
    });
});
describe('POST /login', function () {
    test('should return a 401 unauthorised response for incorrect login details', function (done) {
        helper_1.request
            .post('/auth/login')
            .type('form')
            .send(loginIncorrect)
            .end(function (err, res) {
            expect(res.status).toBe(401);
            done();
        });
    });
    test('should return a 302 redirect response for correct login details', function (done) {
        helper_1.request
            .post('/auth/login')
            .type('form')
            .send(loginCorrect)
            .end(function (err, res) {
            expect(res.status).toBe(302);
            done();
        });
    });
});
describe('GET /logout', function () {
    test('should return 302 redirect response', function (done) {
        helper_1.request
            .get('/auth/logout')
            .end(function (err, res) {
            expect(res.status).toBe(302);
            done();
        });
    });
});
