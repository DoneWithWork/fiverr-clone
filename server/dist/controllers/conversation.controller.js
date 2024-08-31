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
exports.readConversation = exports.updateConversation = exports.getSingleConversation = exports.createConversation = exports.getConversations = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Conversation_model_1 = __importDefault(require("../models/Conversation.model"));
exports.getConversations = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversations = yield Conversation_model_1.default.find({
        participantIds: { $in: [req.userId] }, // Ensure userId is part of the array
    });
    res.status(200).json(conversations);
}));
exports.createConversation = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.userId === req.body.receiverId) {
        res
            .status(400)
            .json({ message: "You cannot create a conversation with yourself" });
        return;
    }
    let conversation = yield Conversation_model_1.default.findOne({
        participantIds: {
            $all: [req.userId, req.body.receiverId],
        },
    });
    if (!conversation) {
        conversation = new Conversation_model_1.default({
            participantIds: [req.userId, req.body.receiverId],
            readBy: [
                {
                    userId: req.userId,
                    read: true,
                },
                {
                    userId: req.body.receiverId,
                    read: false,
                },
            ],
        });
        yield conversation.save();
    }
    res.status(201).json(conversation);
}));
exports.getSingleConversation = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield Conversation_model_1.default.findOne({
        id: req.params.id,
    });
    if (!conversation) {
        res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json(conversation);
}));
// Update the conversation with the new message content
// Mark the message as read by the sender and unread by the receiver
exports.updateConversation = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageContent, senderId } = req.body;
    // Update the conversation
    const updatedConversation = yield Conversation_model_1.default.findOneAndUpdate({
        id: req.params.id,
    }, {
        $set: {
            lastMessage: messageContent, // Update the lastMessage with the new message content
            readBy: [
                {
                    userId: senderId,
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
    if (!updatedConversation) {
        res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json({ updatedConversation });
}));
exports.readConversation = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Update the conversation to mark the message as read by the receiver
    const updatedConversation = yield Conversation_model_1.default.findOneAndUpdate({
        id: req.params.id,
    }, {
        $set: {
            readBy: [
                {
                    userId: req.userId,
                    read: true,
                },
            ],
        },
    }, {
        new: true,
    });
    if (!updatedConversation) {
        res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json({ updatedConversation });
}));
