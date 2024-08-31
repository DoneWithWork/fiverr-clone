import express from "express";
import { verifyToken } from "../middlewares/Auth.middleware";
import { createMessage, getMessages } from "../controllers/message.controller";

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:id", verifyToken, getMessages);

export default router;
