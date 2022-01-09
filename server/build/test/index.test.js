"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = require("../app/App");
//import { AppRouter } from '../app/AppRouter'
//jest.mock('../app/AppRouter')
//mock decorators
jest.mock('../app/controllers/RootController', function () { return jest.fn(); });
jest.mock('../app/controllers/LoginController', function () { return jest.fn(); });
jest.mock('../app/controllers/TestController', function () { return jest.fn(); });
jest.mock('../app/controllers/decorators/controller', function () { return jest.fn(); });
var app = new App_1.App();
beforeAll(function (done) {
    app.ApplyMiddleware();
    app.startServer();
    done();
});
afterAll(function () {
    app.closeServer();
});
describe('Server test suite', function () {
    test('should be able to create server on port 8888', function (done) {
        setTimeout(function () {
            expect(app.getPort()).toBe(8888);
            done();
        }, 100);
    });
});
