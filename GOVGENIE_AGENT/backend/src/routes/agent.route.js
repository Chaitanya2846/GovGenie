import express from "express";
import upload from "../middleware/cloudinary.config.js";
import { registerAgent } from "../controllers/agent.controller.js";
import { verifyToken } from "../middleware/VerifyToken.js"; // Token authentication middleware
import Agent from "../models/agent.model.js"; // Import Agent model

const router = express.Router();

// ✅ Agent registration route (Authenticated + File Uploads)
router.post(
  "/register",
  verifyToken,
  (req, res, next) => {
    upload.fields([
      { name: "aadharCard", maxCount: 1 },
      { name: "panCard", maxCount: 1 },
      { name: "govCertificate", maxCount: 1 },
      { name: "profilePhoto", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res
          .status(400)
          .json({ error: "File upload failed!", details: err.message });
      }
      next();
    });
  },
  registerAgent
);

// ✅ Agent verification update route (Authenticated)
router.post("/update-verification", verifyToken, async (req, res) => {
  const { agentId, isIPV_Verified, ipv_otp } = req.body;

  try {
    const agent = await Agent.findOneAndUpdate(
      { agentId }, // ✅ Make sure this matches your MongoDB schema field
      { isIPV_Verified, ipv_otp }, // ✅ Update verification fields
      { new: true }
    );

    if (!agent) return res.status(404).json({ message: "Agent not found!" });

    res.json({ message: "Agent verification updated successfully!", agent });
  } catch (error) {
    console.error("Error updating agent verification:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

export default router;
