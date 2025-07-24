import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import agentRoutes from "./routes/agent.route.js";
import ipAddressRoutes from "./utils/ipAddressApi.js";
import upload from "./middleware/cloudinary.config.js"; // Import Cloudinary storage
import agentInfoRoutes from "./routes/agent.info.route.js";
import agentServiceRoute from "./routes/agent.service.route.js";
import agentTransaction from "./routes/agent.transcation.route.js";
import agentOrders from "./routes/order.route.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse incoming cookies


// Upload Route (Handles JPEG, PNG, PDF)
app.post("/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File upload failed" });
  }
  res.json({ url: req.file.path }); // Return Cloudinary file URL
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/ip-address", ipAddressRoutes);
app.use("/api", agentInfoRoutes);
app.use("/api/services", agentServiceRoute);
app.use("/api/transactions", agentTransaction);
app.use("/api/orders", agentOrders);

//app.use(express.static(path.join(__dirname, "frontend", "dist"))); // Serve static frontend files


// Handle frontend routing (SPA support)
// app.get("*", (req, res) => {
// res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
