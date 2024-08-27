import express from "express";

import { verifyToken } from "../middlewares/Auth.middleware";

const router = express.Router();

router.get("/getgig");
router.get("/gig/:id");
router.post("/addgig", verifyToken);
router.post("/deletegig", verifyToken);
router.post("/updategig", verifyToken);
export default router;
