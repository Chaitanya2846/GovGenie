import express from "express";
import { chatWithGenie } from "../controllers/genie.controller.js";

const router = express.Router();

// Chat endpoint
router.post("/chat", chatWithGenie);
export default router;