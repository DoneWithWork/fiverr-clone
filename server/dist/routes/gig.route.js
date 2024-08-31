"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_middleware_1 = require("../middlewares/Auth.middleware");
const gig_controller_1 = require("../controllers/gig.controller");
const router = express_1.default.Router();
router.get("/getgigs", gig_controller_1.getGigs);
router.get("/:id", gig_controller_1.getGigById);
router.post("/deletegig", Auth_middleware_1.verifyToken, gig_controller_1.deleteGig);
router.post("/updategig", Auth_middleware_1.verifyToken, gig_controller_1.editGig);
router.post("/newgig", Auth_middleware_1.verifyToken, gig_controller_1.NewGig);
router.get("/getuser/:id", gig_controller_1.getUserWithGig);
exports.default = router;
