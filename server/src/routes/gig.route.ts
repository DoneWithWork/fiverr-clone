import express from "express";

import { verifyToken } from "../middlewares/Auth.middleware";
import {
  deleteGig,
  editGig,
  getGigById,
  getGigForSeller,
  getGigs,
  getUserWithGig,
  NewGig,
} from "../controllers/gig.controller";

const router = express.Router();

router.get("/getgigs", getGigs);
router.get("/:id", getGigById);
router.post("/deletegig", verifyToken, deleteGig);
router.post("/updategig", verifyToken, editGig);
router.post("/newgig", verifyToken, NewGig);

router.get("/getuser/:id", getUserWithGig);
router.get("/seller/getgigseller", verifyToken, getGigForSeller);
export default router;
