"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_controller_1 = require("../controllers/order.controller");
const Auth_middleware_1 = require("../middlewares/Auth.middleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//only seller can access these routes
router.get("/allordersseller", Auth_middleware_1.verifyToken, order_controller_1.getOrdersSeller);
router.post("/completegig/:id", Auth_middleware_1.verifyToken, order_controller_1.completeGig);
//only a buyer can access these routes
router.get("/allordersbuyer", Auth_middleware_1.verifyToken, order_controller_1.getOrdersBuyer);
router.post("/rategig/:id", Auth_middleware_1.verifyToken, order_controller_1.rateGig);
//both buyer and seller can access these routes
router.get("/getorder", Auth_middleware_1.verifyToken, order_controller_1.getOrder);
//payment routes
router.post("/create-payment-intent/:id", Auth_middleware_1.verifyToken, order_controller_1.intent);
router.put("/comfirmpayment", Auth_middleware_1.verifyToken, order_controller_1.confirmPayment);
//only seller
router.get("/totalEarnings", Auth_middleware_1.verifyToken, order_controller_1.totalEarnings);
exports.default = router;
