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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.Register = exports.Login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_model_1 = require("../models/User.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.Login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Login HIt");
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
    }
    const user = yield User_model_1.UserModel.findOne({ username });
    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const isValidPassword = bcrypt_1.default.compareSync(password, user.password);
    if (!isValidPassword) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, isSeller: user.isSeller }, process.env.JWT_SECRET);
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });
    const _a = user.toObject(), { password: userPassword } = _a, userWithoutPassword = __rest(_a, ["password"]);
    console.log("Successfull login");
    res.status(200).send(userWithoutPassword);
    return;
}));
exports.Register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, country, imageUrl, isSeller, description, phone, } = req.body;
    if (!username ||
        !email ||
        !password ||
        !country ||
        !imageUrl ||
        !isSeller ||
        !description ||
        !phone) {
        res
            .status(400)
            .json({ message: "Username, email, and password are required" });
    }
    const user = yield User_model_1.UserModel.create({
        username,
        email,
        password: bcrypt_1.default.hashSync(password, 10),
        country,
        imageUrl,
        desc: description,
        phone,
        isSeller,
    });
    if (!user) {
        res.status(400).json({ message: "User not created" });
        return;
    }
    res.status(201).json({ message: "User created" });
}));
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .clearCookie("accessToken", {
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
    })
        .status(200)
        .send("User has been logged out.");
});
exports.Logout = Logout;
