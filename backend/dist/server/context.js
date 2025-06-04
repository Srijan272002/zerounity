"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = createContext;
async function createContext(opts) {
    const { req, res } = opts;
    return {
        req,
        res,
    };
}
