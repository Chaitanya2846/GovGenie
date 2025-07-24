import Document from "../models/user.document.model.js";
import bcrypt from "bcryptjs";
import {  cloudinary } from "../middleware/cloudinary.config.js";

// Upload Document
export const uploadDocument = async (req, res) => {
  try {
    const { password } = req.body;
    const filename = req.body.filename || req.file.originalname; // Get filename from req.body or req.file
    const userId = req.userId; // Get user from auth middleware
    console.log("uploadDocument data", filename);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDocument = new Document({
      user: userId,
      filename,
      url: req.file.path,
      password: hashedPassword,
    });

    await newDocument.save();
    res.status(201).json({ message: "Document uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload document" });
  }
};

// View All User Documents (List Documents)
export const listUserDocuments = async (req, res) => {
  try {
    console.log("hhhhhhhhhhhhhhhhhh");
      const userId = req.userId;
      if (!userId) {
        return res
          .status(401)
          .json({ error: "Unauthorized - no user ID found" });
      }

      console.log(" debugging   dre.userId :", userId);
      const documents = await Document.find({ user: userId })
        .select("-password")
        .sort({ createdAt: -1 }); // Sort by creation date in descending order; // Exclude password field
      res.json(documents);
    } catch (error) {
    res.status(500).json({ error: "Failed to retrieve documents" });
  }
};

// View Single Document (Password Protected)
export const viewDocument = async (req, res) => {
  try {
      const { id, password } = req.body;
      console.log(" view doc ", password )
    const document = await Document.findById(id);
      console.log("fetch passwprd", document.password);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const isMatch = await bcrypt.compare(password, document.password);
      if (!isMatch) {
        console.log("password did not match")
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({ url: document.url });
  } catch (error) {
    res.status(500).json({ error: "Error accessing document" });
  }
};

// Delete Only Selected Document
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    console.log(" delete data", id)
    const document = await Document.findOne({ _id: id, user: userId });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Delete from Cloudinary
    const publicId = document.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    // Delete from MongoDB
    await Document.findByIdAndDelete(id);

    res.json({ message: "Document deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete document" });
  }
};
