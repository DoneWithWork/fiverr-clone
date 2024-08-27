import express from "express";
import { Login, Logout, Register } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/Auth.middleware";

const router = express.Router();

router.post("/login", Login);
router.post("/register", Register);
router.post("/logout", verifyToken, Logout);
router.get("/protected", verifyToken, (req, res) => {
  console.log("hit");
  res.status(200).send("You are authorized!");
});

export default router;
