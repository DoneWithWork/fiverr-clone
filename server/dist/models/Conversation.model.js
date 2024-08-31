"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const ConversationSchema = new Schema({
    participantIds: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    readBy: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            read: {
                type: Boolean,
                default: false,
            },
        },
    ],
    lastMessage: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Conversation", ConversationSchema);
