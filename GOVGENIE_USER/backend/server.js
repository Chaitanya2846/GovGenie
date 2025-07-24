// import express from "express";
// import http from "http";
// import mongoose from "mongoose";
// import { Server } from "socket.io";
// import cors from "cors";
// import Chat from "./models/Chat.js"; // Import Chat Model
// import { encryptMessage, decryptMessage } from "./utils/encryption.js";

// const app = express();
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/govgenie_chat", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// const onlineUsers = new Map();
// const onlineAgents = new Map();

// io.on("connection", (socket) => {
//   console.log(`🟢 New connection: ${socket.id}`);

//   // When a user or agent joins
//   socket.on("join", async ({ userId, role }) => {
//     if (role === "user") {
//       onlineUsers.set(userId, socket.id);
//     } else if (role === "agent") {
//       onlineAgents.set(userId, socket.id);
//     }

//     console.log(`✅ ${role} Joined: ${userId}`);

//     io.emit("update_online_status", {
//       users: Array.from(onlineUsers.keys()),
//       agents: Array.from(onlineAgents.keys()),
//     });

//     // **Retrieve pending messages for offline users**
//     const pendingMessages = await Chat.find({
//       receiverId: userId,
//       status: "sent",
//     });

//     if (pendingMessages.length > 0) {
//       io.to(socket.id).emit(
//         "pending_messages",
//         pendingMessages.map((msg) => ({
//           ...msg._doc,
//           message: decryptMessage(msg.message), // Decrypt before sending
//         }))
//       );

//       // Mark messages as delivered
//       await Chat.updateMany(
//         { receiverId: userId, status: "sent" },
//         { status: "delivered" }
//       );
//     }
//   });

//   // **Handle sending messages**
//   socket.on("send_message", async ({ senderId, receiverId, message, role }) => {
//     const encryptedMessage = encryptMessage(message);
//     const timestamp = new Date();
//     const targetSocket =
//       role === "user"
//         ? onlineAgents.get(receiverId)
//         : onlineUsers.get(receiverId);

//     // Save message in MongoDB (Encrypted)
//     const newMessage = new Chat({
//       senderId,
//       receiverId,
//       message: encryptedMessage,
//       timestamp,
//       status: "sent",
//     });

//     await newMessage.save();

//     if (targetSocket) {
//       io.to(targetSocket).emit("receive_message", {
//         senderId,
//         message, // Send decrypted version to the client
//         timestamp,
//       });

//       console.log(`📩 Message sent from ${senderId} to ${receiverId}`);

//       // Update message status to delivered
//       await Chat.updateOne({ _id: newMessage._id }, { status: "delivered" });
//     } else {
//       console.log(`⚠️ User ${receiverId} is offline. Message saved.`);
//     }
//   });

//   // **Handle user disconnect**
//   socket.on("disconnect", () => {
//     let disconnectedUser = null;

//     for (const [key, value] of onlineUsers.entries()) {
//       if (value === socket.id) {
//         onlineUsers.delete(key);
//         disconnectedUser = key;
//         break;
//       }
//     }

//     for (const [key, value] of onlineAgents.entries()) {
//       if (value === socket.id) {
//         onlineAgents.delete(key);
//         disconnectedUser = key;
//         break;
//       }
//     }

//     console.log(`❌ User Disconnected: ${disconnectedUser}`);

//     io.emit("update_online_status", {
//       users: Array.from(onlineUsers.keys()),
//       agents: Array.from(onlineAgents.keys()),
//     });
//   });
// });

// server.listen(7000, () =>
//   console.log("✅ WebSocket Server running on port 7000")
// );













// import express from "express";
// import http from "http";
// import mongoose from "mongoose";
// import { Server } from "socket.io";
// import dotenv from "dotenv";
// import cors from "cors";
// import Chat from "../models/message.model.js";
// import { encryptMessage, decryptMessage } from "../utils/encryption.js";
// dotenv.config();
// const app = express();
// app.use(cors());
// // const conn = await mongoose.connect(process.env.MONGO_URI);
// mongoose.connect(process.env.MONGO_URI);
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// const onlineUsers = new Map();
// const onlineAgents = new Map();

// io.on("connection", (socket) => {
//   console.log(`New connection: ${socket.id}`);

//   // User/Agent joins chat
//     socket.on("join", async ({ userId, role }) => {
//     console.log(`🟢 ${role} joined: ${userId}`);
//     if (role === "user") onlineUsers.set(userId, socket.id);
//     else if (role === "agent") onlineAgents.set(userId, socket.id);

//     io.emit("update_online_status", {
//       users: Array.from(onlineUsers.keys()),
//       agents: Array.from(onlineAgents.keys()),
//     });

//     // Load undelivered messages
//     const pendingMessages = await Chat.find({
//       receiverId: userId,
//       status: "sent",
//     });
//     if (pendingMessages.length > 0) {
//       io.to(socket.id).emit(
//         "pending_messages",
//         pendingMessages.map((msg) => ({
//           ...msg._doc,
//           message: decryptMessage(msg.message),
//         }))
//       );
//       await Chat.updateMany(
//         { receiverId: userId, status: "sent" },
//         { status: "delivered" }
//       );
//     }
//   });

//   // Typing Indicator
//   socket.on("typing", ({ senderId, receiverId }) => {
//     const targetSocket =
//       onlineUsers.get(receiverId) || onlineAgents.get(receiverId);
//     if (targetSocket) io.to(targetSocket).emit("user_typing", { senderId });
//   });

//   socket.on("stop_typing", ({ senderId, receiverId }) => {
//     const targetSocket =
//       onlineUsers.get(receiverId) || onlineAgents.get(receiverId);
//     if (targetSocket)
//       io.to(targetSocket).emit("user_stopped_typing", { senderId });
//   });

//   // Sending Message
//   socket.on("send_message", async ({ senderId, receiverId, message, role }) => {
//     const encryptedMessage = encryptMessage(message);
//     const timestamp = new Date();
//     const targetSocket =
//       role === "user"
//         ? onlineAgents.get(receiverId)
//         : onlineUsers.get(receiverId);

//     const newMessage = new Chat({
//       senderId,
//       receiverId,
//       message: encryptedMessage,
//       timestamp,
//       status: "sent",
//     });
//     await newMessage.save();

//     if (targetSocket) {
//       io.to(targetSocket).emit("receive_message", {
//         senderId,
//         message,
//         timestamp,
//       });

//       await Chat.updateOne({ _id: newMessage._id }, { status: "delivered" });
//     }

//     // Send push notification
//     io.to(targetSocket).emit("new_message_notification", { senderId, message });
//   });

//   // Read Receipts
//   socket.on("mark_as_read", async ({ messageId, receiverId }) => {
//     await Chat.updateOne({ _id: messageId }, { status: "read" });
//     const senderSocket =
//       onlineUsers.get(receiverId) || onlineAgents.get(receiverId);
//     if (senderSocket) io.to(senderSocket).emit("message_read", { messageId });
//   });

//   // Handle Disconnection
//   socket.on("disconnect", () => {
//     onlineUsers.forEach((value, key) => {
//       if (value === socket.id) onlineUsers.delete(key);
//     });
//     onlineAgents.forEach((value, key) => {
//       if (value === socket.id) onlineAgents.delete(key);
//     });

//     io.emit("update_online_status", {
//       users: Array.from(onlineUsers.keys()),
//       agents: Array.from(onlineAgents.keys()),
//     });
//   });
// });

// server.listen(7000, () =>
//   console.log("✅ WebSocket Server running on port 7000")
// );


import dotenv from "dotenv";
import express from "express";
import http from "http";
import socketServer from "./src/lib/socket.js";
import messageRoutes from "./src/routes/message.route.js";
import { connectDB } from "./src/db/connectDB.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
console.log("MongoDB URI:", process.env.MONGO_URI);
// Start WebSocket on port 7000
const io = socketServer(server);

// Middleware & Routes
app.use(express.json());
app.use("/api", messageRoutes);

// Start HTTP & WebSocket server
server.listen(7000, () => {
  connectDB();
  console.log("WebSocket server running on port 7000");
});
