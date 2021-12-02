"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var decorators_1 = require("../../../app/controllers/decorators");
var App_1 = require("../../../app/App");
jest.mock('../../../app/controllers/RootController', function () { return jest.fn(); });
jest.mock('../../../app/controllers/LoginController', function () { return jest.fn(); });
/* eslint-disable-next-line @typescript-eslint/no-empty-function */
function testMiddleware() { }
var TestClass = /** @class */ (function () {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    function TestClass() {
    }
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    TestClass.prototype.testFunc = function () { };
    __decorate([
        (0, decorators_1.post)('/test'),
        (0, decorators_1.use)(testMiddleware),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TestClass.prototype, "testFunc", null);
    TestClass = __decorate([
        (0, decorators_1.controller)('/tests')
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    ], TestClass);
    return TestClass;
}());
var app = new App_1.App();
beforeAll(function (done) {
    app.ApplyMiddleware();
    app.startServer();
    done();
});
afterAll(function () {
    app.closeServer();
});
describe('controller decorator test suite', function () {
    test('Should add correct route, method and middleware to router', function () {
        //pull off details from express router
        var route;
        // define array to hold routes from express handler
        var routes = [];
        //get middleware for each route on the router
        app.getApp()._router.stack.forEach(function (middleware) {
            if (middleware.name === 'router') { // router middleware
                middleware.handle.stack.forEach(function (handler) {
                    handler.route && routes.push(handler.route);
                });
            }
        });
        expect(routes[1].path).toBe('/tests/test');
        expect(routes[1].methods.post).toBe(true);
        expect(routes[1].stack[0].handle).toBe(testMiddleware);
    });
});
