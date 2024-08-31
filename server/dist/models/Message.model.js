"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const MessageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId, // Correcting the nesting issue
        ref: "Conversation",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId, // Correcting the nesting issue
        ref: "User",
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Message", MessageSchema);
