import {
  completeGig,
  confirmPayment,
  getOrder,
  getOrdersBuyer,
  getOrdersSeller,
  intent,
  rateGig,
  totalEarnings,
} from "../controllers/order.controller";
import { verifyToken } from "../middlewares/Auth.middleware";
import express from "express";
const router = express.Router();

//only seller can access these routes
router.get("/allordersseller", verifyToken, getOrdersSeller);
router.post("/completegig/:id", verifyToken, completeGig);

//only a buyer can access these routes
router.get("/allordersbuyer", verifyToken, getOrdersBuyer);
router.post("/rategig/:id", verifyToken, rateGig);
//both buyer and seller can access these routes
router.get("/getorder", verifyToken, getOrder);

//payment routes
router.post("/create-payment-intent/:id", verifyToken, intent);

router.put("/comfirmpayment", verifyToken, confirmPayment);

//only seller
router.get("/totalEarnings", verifyToken, totalEarnings);
export default router;
