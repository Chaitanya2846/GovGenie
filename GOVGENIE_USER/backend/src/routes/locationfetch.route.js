import express from "express";
import { findNearbyAgents } from "../controllers/agent.location.controller.js";

const router = express.Router();

// Define route to fetch nearby agents
router.get("/find-nearby-agents", findNearbyAgents);

export default router;
