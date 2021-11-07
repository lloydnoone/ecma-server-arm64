"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
var Controller_1 = require("../controllers/Controller");
var vm2_1 = require("vm2");
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
    TestController.prototype.postSnippet = function (req, res) {
        var snippet = req.body.snippet;
        // const functionInSandbox = vm.run("module.exports = function(who) { console.log('hello '+ who); }");
        // functionInSandbox('world');
        if (snippet === '') {
            res.status(422).send('Invalid snippet received.');
        }
        try {
            var testFunction = vm.run(snippet + "\n\n      module.exports = function() {\n        if(testvar === 1) {\n          const results = {pass: true, testvar: testvar}\n          return results\n        } else {\n          const results = {pass: false, testvar: testvar}\n          return results\n        }\n      }");
            if (testFunction().pass) {
                res.status(200).send({ message: 'Test passed' });
            }
            else {
                res.status(200).send({ message: 'Test failed', error: {
                        message: "testvar = " + testFunction().testvar + ", should be 1",
                        name: 'Incorrect',
                        stack: '',
                        lineNumber: 0
                    } });
            }
            // any errors in the users code will br thrown as an actual error here
            // however we still want respond normally to the client with 200 and their error msg
        }
        catch (err) {
            if (!(err instanceof Error)) {
                throw err;
            }
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
        decorators_1.post('/test'),
        decorators_1.bodyValidator('snippet'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], TestController.prototype, "postSnippet", null);
    TestController = __decorate([
        decorators_1.controller('/tests')
    ], TestController);
    return TestController;
}(Controller_1.Controller));
exports.TestController = TestController;
