"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const Auth_middleware_1 = require("../middlewares/Auth.middleware");
const router = express_1.default.Router();
router.post("/login", auth_controller_1.Login);
router.post("/register", auth_controller_1.Register);
router.post("/logout", Auth_middleware_1.verifyToken, auth_controller_1.Logout);
router.get("/protected", Auth_middleware_1.verifyToken, (req, res) => {
    console.log("hit");
    res.status(200).send("You are authorized!");
});
exports.default = router;
