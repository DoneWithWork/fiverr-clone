"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_middleware_1 = require("../middlewares/Auth.middleware");
const message_controller_1 = require("../controllers/message.controller");
const router = express_1.default.Router();
router.post("/", Auth_middleware_1.verifyToken, message_controller_1.createMessage);
router.get("/:id", Auth_middleware_1.verifyToken, message_controller_1.getMessages);
exports.default = router;
