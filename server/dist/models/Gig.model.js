"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GigModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const GigSchema = new mongoose_2.Schema({
    userId: {
        type: mongoose_2.Schema.Types.ObjectId, // Correcting the nesting issue
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    totalStars: {
        type: Number,
        default: 0,
    },
    starNumber: {
        type: Number,
        default: 0,
    },
    cat: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: false,
    },
    deliveryTime: {
        type: Number,
        required: true,
    },
    revisionNumber: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        required: false,
    },
    sales: {
        type: Number,
        default: 0,
    },
    published: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.GigModel = mongoose_1.default.model("Gig", GigSchema);
