"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("../../test/helper");
var snippetCorrect = {
    snippet: "const testvar = 1"
};
var snippetIncorrect = {
    snippet: ""
};
var invalidJavaScript = {
    snippet: "const 123 + 123"
};
describe('POST /tests/test', function () {
    test('should return a 422 unproccessible entity response for empty string', function (done) {
        helper_1.request
            .post('/tests/test')
            .type('form')
            .send(snippetIncorrect)
            .end(function (err, res) {
            expect(res.status).toBe(422);
            done();
        });
    });
    test('should return the snippets errors if there are any.', function (done) {
        // request
        //   .post('/tests/test')
        //   .type('form')
        //   .send(invalidJavaScript)
        //   .end((err: Error, res: Response) => {
        //     expect(res.status).toBe(422)
        //     done()
        //   })
        helper_1.request
            .post('/tests/test')
            .type('form')
            .send(invalidJavaScript)
            .end(function (err, res) {
            expect(res.body).toEqual({
                message: expect.any(String),
                error: {
                    message: expect.any(String),
                    name: expect.any(String),
                    stack: expect.any(String),
                    lineNumber: expect.any(String)
                }
            });
            expect(res.body.message).toEqual('invalid JS.');
            done();
        });
    });
    test('should return a 200 ok response for a snippet that is a string', function (done) {
        helper_1.request
            .post('/tests/test')
            .type('form')
            .send(snippetCorrect)
            .end(function (err, res) {
            expect(res.status).toBe(200);
            done();
        });
    });
});
