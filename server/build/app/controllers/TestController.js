"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.TestController = void 0;
var decorators_1 = require("./decorators");
var logger_1 = require("./middleware/logger");
var Controller_1 = require("../controllers/Controller");
var vm2_1 = require("vm2");
function deepEqual(object1, object2) {
    var keys1 = Object.keys(object1);
    var keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
        var key = keys1_1[_i];
        var val1 = object1[key];
        var val2 = object2[key];
        var areObjects = isObject(val1) && isObject(val2);
        if (areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2) {
            return false;
        }
    }
    return true;
}
function isObject(object) {
    return object != null && typeof object === 'object';
}
function ObjectCompareResult(usersObject, correctObject) {
    var keys1 = Object.keys(usersObject);
    var keys2 = Object.keys(correctObject);
    if (keys1.length !== keys2.length) {
        return "some properties are missing!";
    }
    for (var _i = 0, keys1_2 = keys1; _i < keys1_2.length; _i++) {
        var key = keys1_2[_i];
        var val1 = usersObject[key];
        var val2 = correctObject[key];
        var areObjects = isObject(val1) && isObject(val2);
        if (areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2) {
            //throw new Error(`${val1} is not equal to ${val2}`)
            return "".concat(key, " should not be ").concat(val1);
        }
    }
    return "Correct";
}
// set defaults for VM
var vm = new vm2_1.NodeVM({
    console: 'inherit',
    sandbox: {},
    eval: false,
    wasm: false,
    require: {
        external: false,
        builtin: [],
        root: "./",
        mock: {}
    }
});
var TestController = /** @class */ (function (_super) {
    __extends(TestController, _super);
    function TestController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestController.prototype.varDeclaration = function (req, res) {
        var snippet = req.body.snippet;
        if (snippet === '') {
            res.status(422).send('Invalid snippet received.');
        }
        try {
            var testFunction = vm.run("".concat(snippet, "\n      \n      module.exports = function() {\n          return {\n            results: {\n              open: open\n            }\n          }\n        }\n      "));
            console.log("results: ", testFunction().results.open);
            if (testFunction().results.open === true) {
                res.status(200).send({ message: 'Test passed' });
            }
            else {
                res.status(200).send({ message: 'Test failed',
                    error: {
                        message: "open is ".concat(testFunction().results.open, ", should be true"),
                        name: 'Incorrect',
                        stack: '',
                        lineNumber: 0
                    } });
            }
            // any errors in the users code will br thrown as an actual error here
            // however we still want to respond normally to the client with 200 and their error msg
        }
        catch (error) {
            // vm2 function sends back plain object as error, cast this to SyntaxError
            var err = error;
            // if the error from vm was other than users syntax, throw real error
            if (!err.stack)
                err.stack = 'stack undefined';
            res.status(200).send({ message: 'invalid JS.',
                error: {
                    message: err.message,
                    name: err.name,
                    stack: err.stack,
                    lineNumber: err.stack.split('\n')[0].replace('vm.js:', '')
                } });
        }
    };
    TestController.prototype.primitiveTypes = function (req, res) {
        var snippet = req.body.snippet;
        if (snippet === '') {
            res.status(422).send('Invalid snippet received.');
        }
        try {
            var testFunction = vm.run("".concat(snippet, "\n\n      module.exports = function() {\n          return {\n            results: {\n              userName: userName,\n              passCode: passCode,\n              open: open\n            }\n          }\n      }"));
            //compare results of users code to correct answer
            var result = ObjectCompareResult(testFunction().results, {
                userName: "Admin",
                passCode: 8897,
                open: true
            });
            // if result is not correct it will be an error message so use that in response
            if (result === "Correct") {
                res.status(200).send({ message: 'Test passed' });
            }
            else {
                res.status(200).send({ message: 'Test failed',
                    error: {
                        message: result,
                        name: 'Incorrect',
                        stack: '',
                        lineNumber: 0
                    } });
            }
            // any errors in the users code will br thrown as an actual error here
            // however we still want to respond normally to the client with 200 and their error msg
        }
        catch (error) {
            // vm2 function sends back plain object as error, cast this to SyntaxError
            var err = error;
            // if the error from vm was other than users syntax, throw real error
            if (!err.stack)
                err.stack = 'stack undefined';
            res.status(200).send({ message: 'invalid JS.',
                error: {
                    message: err.message,
                    name: err.name,
                    stack: err.stack,
                    lineNumber: err.stack.split('\n')[0].replace('vm.js:', '')
                } });
        }
    };
    __decorate([
        (0, decorators_1.post)('/vardeclaration'),
        (0, decorators_1.bodyValidator)('snippet'),
        (0, decorators_1.use)(logger_1.logger),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], TestController.prototype, "varDeclaration", null);
    __decorate([
        (0, decorators_1.post)('/primitivetypes'),
        (0, decorators_1.bodyValidator)('snippet'),
        (0, decorators_1.use)(logger_1.logger),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], TestController.prototype, "primitiveTypes", null);
    TestController = __decorate([
        (0, decorators_1.controller)('/tests')
    ], TestController);
    return TestController;
}(Controller_1.Controller));
exports.TestController = TestController;
