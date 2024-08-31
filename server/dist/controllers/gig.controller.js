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
exports.getUserWithGig = exports.NewGig = exports.editGig = exports.deleteGig = exports.getGigById = exports.getGigs = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Gig_model_1 = require("../models/Gig.model");
const User_model_1 = require("../models/User.model");
exports.getGigs = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = req.query;
    console.log(q);
    const filters = Object.assign(Object.assign(Object.assign(Object.assign({}, (q.userId && { userId: q.userId })), (q.cat && { cat: q.cat })), ((q.min || q.max) && {
        price: Object.assign(Object.assign({}, (q.min && { $gt: q.min })), (q.max && { $lt: q.max })),
    })), (q.search && { title: { $regex: q.search, $options: "i" } }));
    const gigs = yield Gig_model_1.GigModel.find(filters).populate({
        path: "userId",
        select: "-password -email -phone",
    });
    res.status(200).json(gigs);
}));
exports.getGigById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("hit");
    if (!id) {
        res.status(400).json({ message: "Gig id is required" });
        return;
    }
    const gig = yield Gig_model_1.GigModel.findById(id).populate({
        path: "userId",
        select: "-password -email -phone",
    });
    if (!gig) {
        res.status(404).json({ message: "Gig not found" });
        return;
    }
    res.status(200).json(gig);
}));
exports.deleteGig = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.UserModel.findById(req.userId);
    if (!user) {
        res.status(401).json({ message: "you cannot delete gig" });
        return;
    }
    const gig = yield Gig_model_1.GigModel.findOneAndDelete({ userId: req.userId });
    if (!gig) {
        res.status(404).json({ message: "Gig not found" });
        return;
    }
    console.log("Gig deleted");
    res.status(200).json({ message: "Gig deleted" });
}));
exports.editGig = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, price, desc, category, imageUrl } = req.body;
    if (!title || !price || !desc || !category || !imageUrl) {
        res.status(400).json({
            message: "Title, price, desc, category, and imageUrl are required",
        });
        return;
    }
    const gig = yield Gig_model_1.GigModel.findByIdAndUpdate(id, { title, price, desc, category, imageUrl }, { new: true });
    if (!gig) {
        res.status(404).json({ message: "Gig not found" });
        return;
    }
    res.status(200).json(gig);
}));
exports.NewGig = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price, description, category, images, coverImage, deliveryTime, revisions, features, published, } = req.body;
    console.log(req.body);
    if (!title ||
        !price ||
        !description ||
        !category ||
        !coverImage ||
        !deliveryTime ||
        !revisions ||
        !features) {
        res.status(400).json({
            message: "Title, price, description, category, cover image, delivery time, and revision number are required",
        });
        return;
    }
    const user = yield User_model_1.UserModel.findById(req.userId);
    if (!user) {
        res.status(401).json({ message: "you cannot create gig" });
        return;
    }
    if (!user.isSeller) {
        res.status(401).json({ message: "you cannot create gig" });
        return;
    }
    const gig = yield Gig_model_1.GigModel.create({
        userId: req.userId,
        title,
        price,
        desc: description,
        cat: category,
        cover: coverImage,
        images,
        deliveryTime,
        revisionNumber: revisions,
        published,
        features,
    });
    res.status(201).json(gig);
}));
exports.getUserWithGig = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "User id is required" });
        return;
    }
    //find all gigs of a user
    const user = yield User_model_1.UserModel.findById(id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const gigs = yield Gig_model_1.GigModel.find({ userId: id });
    //put gigs in user object
    res.status(200).json({ user, gigs });
    return;
}));
