"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function logger(req, res, next) {
    console.log(req.method, req.body, 'to', req.path);
    next();
}
exports.logger = logger;
