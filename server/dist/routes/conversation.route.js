"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_middleware_1 = require("../middlewares/Auth.middleware");
const conversation_controller_1 = require("../controllers/conversation.controller");
const router = express_1.default.Router();
router.get("/", Auth_middleware_1.verifyToken, conversation_controller_1.getConversations);
router.post("/", Auth_middleware_1.verifyToken, conversation_controller_1.createConversation);
router.get("/single/:id", Auth_middleware_1.verifyToken, conversation_controller_1.getSingleConversation);
router.put("/:id", Auth_middleware_1.verifyToken, conversation_controller_1.updateConversation);
router.put("/read/:id", Auth_middleware_1.verifyToken, conversation_controller_1.readConversation);
exports.default = router;
