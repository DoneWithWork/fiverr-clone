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
exports.totalEarnings = exports.confirmPayment = exports.getOrder = exports.getOrdersBuyer = exports.rateGig = exports.completeGig = exports.getOrdersSeller = exports.intent = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Order_model_1 = require("../models/Order.model");
const Gig_model_1 = require("../models/Gig.model");
const stripe_1 = __importDefault(require("stripe"));
exports.intent = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET, {});
    const { id } = req.params;
    console.log("hi intent");
    const gig = yield Gig_model_1.GigModel.findById(id);
    if (!gig) {
        res.status(404).json({ message: "Gig not found" });
        return;
    }
    const buyerId = req.userId;
    const sellerId = gig === null || gig === void 0 ? void 0 : gig.userId; //creater of gig is the seller
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: (gig === null || gig === void 0 ? void 0 : gig.price) * 100,
        currency: "myr",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });
    //create new order
    const order = yield Order_model_1.OrderModel.create({
        sellerId,
        buyerId,
        gigId: id,
        paymentIntent: paymentIntent.id,
    });
    res.status(200).json({ client_secret: paymentIntent.client_secret });
    return;
}));
//return orders to seller
exports.getOrdersSeller = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isSeller) {
        res.status(401).json({ message: "You are not a seller" });
        return;
    }
    const orders = yield Order_model_1.OrderModel.find({ sellerId: req.userId }).populate({
        path: "gigId",
    });
    res.status(200).json(orders);
    return;
}));
//only seller can complete gig
exports.completeGig = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.isSeller) {
        res.status(401).json({ message: "You are not a seller" });
        return;
    }
    const order = yield Order_model_1.OrderModel.findByIdAndUpdate(id, {
        completed: true,
    }, { new: true }).lean();
    if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
    }
    //increase sales by 1 in gigModel
    const gig = yield Gig_model_1.GigModel.findByIdAndUpdate(order.gigId, {
        $inc: { sales: 1 },
    }, {
        new: true,
    });
    if (!gig) {
        res.status(404).json({ message: "Gig not found" });
        return;
    }
    res.status(200).json(order);
}));
//only buyer can rate gig
exports.rateGig = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //we must be the buyer to rate the gig and only if gig is completed
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "Order id is required" });
        return;
    }
    const { rating } = req.body;
    if (!rating) {
        res.status(400).json({ message: "Rating is required" });
        return;
    }
    const order = yield Order_model_1.OrderModel.findById(id);
    if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
    }
    if (order.buyerId.toString() !== req.userId) {
        res.status(401).json({ message: "You are not the buyer" });
        return;
    }
    if (!order.isCompleted) {
        res.status(400).json({ message: "Order is not completed" });
        return;
    }
    const ratedOrder = yield Order_model_1.OrderModel.findByIdAndUpdate(id, {
        rating,
    }, { new: true }).lean();
    //update total rating on the gigmodel
    const gig = yield Gig_model_1.GigModel.findByIdAndUpdate(order.gigId, {
        $inc: { totalStars: rating, starNumber: 1 },
    }, {
        new: true,
    });
    if (!gig) {
        res.status(404).json({ message: "Gig not found" });
        return;
    }
    res.status(200).json(ratedOrder);
}));
//only returns orders that belong to the buyer
exports.getOrdersBuyer = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_model_1.OrderModel.find({ buyerId: req.userId }).populate({
        path: "gigId",
    });
    res.status(200).json(orders);
    return;
}));
//buyer/seller can get specific order
exports.getOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //check if user if a seller or buyer
    const order = yield Order_model_1.OrderModel.findById(id);
    if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
    }
    if (order.buyerId.toString() !== req.userId &&
        order.sellerId.toString() !== req.userId) {
        res.status(401).json({ message: "You are not the buyer or seller" });
        return;
    }
    res.status(200).json(order);
}));
exports.confirmPayment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("confirm payment");
    console.log(req.body);
    if (!req.body.payment_intent) {
        res.status(400).json({ message: "Payment intent is required" });
        return;
    }
    const order = yield Order_model_1.OrderModel.findOneAndUpdate({
        paymentIntent: req.body.payment_intent,
    }, {
        payed: true,
    }, {
        new: true,
    });
    if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
    }
    res.status(200).json({ message: "Order payed" });
    return;
}));
exports.totalEarnings = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isSeller) {
        res.status(401).json({ message: "You are not a seller" });
        return;
    }
    const orders = yield Order_model_1.OrderModel.find({
        sellerId: req.userId,
    }).populate({
        path: "gigId",
        select: "price",
    });
    const earnings = orders.reduce((acc, order) => {
        if (order.payed && typeof order.gigId !== "string") {
            // Check if gigId is populated
            const gig = order.gigId;
            return acc + gig.price;
        }
        return acc;
    }, 0);
    res.status(200).json({ earnings });
    return;
}));
