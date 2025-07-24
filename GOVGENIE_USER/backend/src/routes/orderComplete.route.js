import express from "express";
import {
  markOrderAsCompleted,
  updatePaymentStatus,
} from "../controllers/orderComplete.controller.js";

const router = express.Router();

// Route to mark order as completed
router.put("/complete/:orderId", markOrderAsCompleted);

// Route to update payment status
router.put("/pay/:orderId", updatePaymentStatus);

export default router;
