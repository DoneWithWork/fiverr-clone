"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const OrderSchema = new mongoose_2.Schema({
    sellerId: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    buyerId: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    gigId: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "Gig",
        required: true,
    },
    rating: {
        type: Number,
        required: false,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    payed: {
        type: Boolean,
        default: false,
    },
    paymentIntent: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.OrderModel = mongoose_1.default.model("Order", OrderSchema);
