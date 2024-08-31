import express from "express";
import { verifyToken } from "../middlewares/Auth.middleware";
import {
  createConversation,
  getConversations,
  getSingleConversation,
  readConversation,
  updateConversation,
} from "../controllers/conversation.controller";

const router = express.Router();

router.get("/", verifyToken, getConversations);
router.post("/", verifyToken, createConversation);
router.get("/single/:id", verifyToken, getSingleConversation);
router.put("/:id", verifyToken, updateConversation);
router.put("/read/:id", verifyToken, readConversation);
export default router;
