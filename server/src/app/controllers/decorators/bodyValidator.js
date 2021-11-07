"use strict";
exports.__esModule = true;
exports.bodyValidator = void 0;
require("reflect-metadata");
var MetadataKeys_1 = require("./MetadataKeys");
function bodyValidator() {
    var keys = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        keys[_i] = arguments[_i];
    }
    /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
    return function (target, key, desc) {
        Reflect.defineMetadata(MetadataKeys_1.MetadataKeys.validator, keys, target, key);
    };
}
exports.bodyValidator = bodyValidator;
