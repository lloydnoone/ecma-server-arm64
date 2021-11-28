"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.use = void 0;
require("reflect-metadata");
var MetadataKeys_1 = require("./MetadataKeys");
function use(middleware) {
    //target is controller, key is the function middleware is added to
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    return function (target, key, desc) {
        // get middlewares that have already been added or return empty array
        var middlewares = Reflect.getMetadata(MetadataKeys_1.MetadataKeys.middleware, target, key) || [];
        // then add the current middleware to the array and set that as new metadata
        Reflect.defineMetadata(MetadataKeys_1.MetadataKeys.middleware, __spreadArray(__spreadArray([], middlewares, true), [middleware], false), target, key);
    };
}
exports.use = use;
