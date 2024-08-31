"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.createMessage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Message_model_1 = __importDefault(require("../models/Message.model"));
const Conversation_model_1 = __importDefault(require("../models/Conversation.model"));
exports.createMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = new Message_model_1.default({
        conversationId: req.body.conversationId,
        userId: req.userId,
        desc: req.body.desc,
    });
    const savedMessage = yield newMessage.save();
    yield Conversation_model_1.default.findByIdAndUpdate(req.body.conversationId, // Find the conversation by ID
    {
        $set: {
            lastMessage: req.body.desc, // Update the lastMessage with the new message content
            readBy: [
                {
                    userId: req.userId, // The ID of the sender
                    read: true, // Mark the message as read by the sender
                },
                {
                    userId: req.body.receiverId, // The ID of the other participant
                    read: false, // Mark the message as unread by the receiver
                },
            ],
        },
    }, {
        new: true, // Return the updated conversation
    });
    res.status(201).json(savedMessage);
}));
exports.getMessages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield Message_model_1.default.find({
        conversationId: req.params.id,
    });
    if (!messages) {
        res.status(404).json({ message: "Messages not found" });
    }
    res.status(200).json(messages);
}));
