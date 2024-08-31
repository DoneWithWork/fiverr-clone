"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies["accessToken"];
    if (!token) {
        throw new Error("Token is not provided!");
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            throw new Error("Token is not provided!");
        }
        if (typeof decoded === "object" && decoded !== null) {
            const payload = decoded;
            req.userId = payload.id;
            console.log(payload);
            req.isSeller = payload.isSeller;
        }
        else {
            return next(new Error("Token payload is not valid!"));
        }
        next();
    });
};
exports.verifyToken = verifyToken;
