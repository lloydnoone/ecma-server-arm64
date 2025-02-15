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
var bodyValidator_1 = require("../../../app/controllers/decorators/bodyValidator");
var TestClass = /** @class */ (function () {
    function TestClass() {
    }
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    TestClass.prototype.testFunc = function () { };
    __decorate([
        (0, bodyValidator_1.bodyValidator)('name', 'pass'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TestClass.prototype, "testFunc", null);
    return TestClass;
}());
describe('bodyValidator test suite', function () {
    test('Should store validators as metadata on a function', function () {
        var requiredBodyProps = Reflect.getMetadata('validator', TestClass.prototype, 'testFunc') || [];
        expect(requiredBodyProps).toEqual(['name', 'pass']);
    });
});
