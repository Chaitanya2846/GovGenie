import express from "express";
import {
  uploadDocument,
  viewDocument,
  listUserDocuments,
  deleteDocument,
} from "../controllers/user.document.controller.js";
import uploads from "../middleware/cloudinary.config.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = express.Router();

// Upload Document
router.post("/upload",verifyToken, uploads.single("file"), uploadDocument);

// View All User Documents
router.get("/list",  verifyToken, listUserDocuments);

// View Single Document (Password Protected)
router.post("/view", verifyToken, viewDocument);

// Delete Selected Document
router.delete("/delete/:id", verifyToken, deleteDocument);

export default router;
