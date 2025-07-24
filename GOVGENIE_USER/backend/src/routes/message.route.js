// import express from "express";
// import {
//   getMessages,
//   sendMessage,
//   markAsRead,
//   getUnreadMessages,
// } from "../controllers/message.controller.js";

// const router = express.Router();

// router.get("/messages/:userId/:agentId", getMessages);
// router.post("/messages/send", sendMessage);
// router.post("/messages/mark-as-read", markAsRead);
// router.get("/messages/unread/:userId", getUnreadMessages);

// export default router;
import express from "express";
import {
  getMessages,
  sendMessage,
  markAsSeen,
  getUnreadMessages,
} from "../controllers/message.controller.js";
import upload from "../middleware/cloudinary.config.js"; // Multer for file uploads

const router = express.Router();

// ✅ Fetch chat history between user & agent
router.get("/:userId/:agentId", getMessages);

// ✅ Send a new message (supports text & file uploads)
router.post("/send", upload.single("file"), sendMessage);

// ✅ Mark a message as "seen"
router.put("/seen", markAsSeen);

// ✅ Get unread message count for a user
router.get("/unread/:userId", getUnreadMessages);

export default router;
