"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const ErrorHandler_middleware_1 = __importDefault(require("./middlewares/ErrorHandler.middleware"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("*", (req, res) => {
    res.status(404).send("Not Found");
});
app.use(ErrorHandler_middleware_1.default);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
