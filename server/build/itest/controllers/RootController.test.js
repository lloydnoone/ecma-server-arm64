"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("../../test/helper");
describe('GET /', function () {
    test('should return a 200 response', function (done) {
        helper_1.request
            .get('/')
            .end(function (err, res) {
            expect(res.status).toBe(200);
            done();
        });
    });
});
describe('GET /protected', function () {
    test('should return a 200 response if logged in', function (done) {
        helper_1.request
            .get('/')
            .set('session', 'loggedIn=true')
            .end(function (err, res) {
            expect(res.status).toBe(200);
            done();
        });
    });
});
