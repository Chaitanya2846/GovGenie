// import User from "../models/user.model.js";
// import Message from "../models/message.model.js";

// import cloudinary from "../lib/cloudinary.js";
// import { getReceiverSocketId, io } from "../lib/socket.js";

// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;
//     const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     console.error("Error in getUsersForSidebar: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getMessages = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params;
//     const myId = req.user._id;

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: userToChatId },
//         { senderId: userToChatId, receiverId: myId },
//       ],
//     });

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log("Error in getMessages controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     let imageUrl;
//     if (image) {
//       // Upload base64 image to cloudinary
//       const uploadResponse = await cloudinary.uploader.upload(image);
//       imageUrl = uploadResponse.secure_url;
//     }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl,
//     });

//     await newMessage.save();

//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// import Chat from "../models/message.model.js";
// import { encryptMessage, decryptMessage } from "../utils/encryption.js";

// /**
//  * Fetch chat history between user and agent.
//  */
// export const getMessages = async (req, res) => {
//   try {
//     const { userId, agentId } = req.params;
//     const messages = await Chat.find({
//       $or: [
//         { senderId: userId, receiverId: agentId },
//         { senderId: agentId, receiverId: userId },
//       ],
//     }).sort({ timestamp: 1 });

//     const decryptedMessages = messages.map((msg) => ({
//       ...msg._doc,
//       message: decryptMessage(msg.message),
//     }));

//     res.status(200).json(decryptedMessages);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching messages" });
//   }
// };

// /**
//  * Send a new message (Alternative to WebSocket).
//  */
// export const sendMessage = async (req, res) => {
//   try {
//     const { senderId, receiverId, message } = req.body;
//     const encryptedMessage = encryptMessage(message);
//     const newMessage = new Chat({
//       senderId,
//       receiverId,
//       message: encryptedMessage,
//       timestamp: new Date(),
//       status: "sent",
//     });

//     await newMessage.save();
//     res.status(201).json({ message: "Message sent successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error sending message" });
//   }
// };

// /**
//  * Mark messages as read.
//  */
// export const markAsRead = async (req, res) => {
//   try {
//     const { messageId } = req.body;
//     await Chat.updateOne({ _id: messageId }, { status: "read" });
//     res.status(200).json({ message: "Message marked as read" });
//   } catch (error) {
//     res.status(500).json({ error: "Error marking message as read" });
//   }
// };

// /**
//  * Get unread message count for user/agent.
//  */
// export const getUnreadMessages = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const unreadCount = await Chat.countDocuments({
//       receiverId: userId,
//       status: "sent",
//     });
//     res.status(200).json({ unreadCount });
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching unread messages" });
//   }
// };


import Chat from "../models/message.model.js";
import Order from "../models/order.model.js";
import { encryptMessage, decryptMessage } from "../utils/encryption.js";
import { cloudinary } from "../middleware/cloudinary.config.js";

/**
 * Fetch chat history between a user and an agent.
 */
export const getMessages = async (req, res) => {
  try {
    const { userId, agentId } = req.params;

    // Validate order exists between user & agent
    const order = await Order.findOne({ userId, agentId });
    if (!order) {
      return res.status(403).json({ error: "Unauthorized chat access" });
    }

    // Fetch messages
    const messages = await Chat.find({
      $or: [
        { senderId: userId, receiverId: agentId },
        { senderId: agentId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    const decryptedMessages = messages.map((msg) => ({
      ...msg._doc,
      text: decryptMessage(msg.text),
    }));

    // Mark all unread messages as delivered
    await Chat.updateMany(
      { receiverId: userId, status: "sent" },
      { status: "delivered" }
    );

    res.status(200).json(decryptedMessages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};

/**
 * Send a new message (supports file upload).
 */
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    let fileUrl = "";

    // Validate user-agent order
    const order = await Order.findOne({
      $or: [
        { userId: senderId, agentId: receiverId },
        { userId: receiverId, agentId: senderId },
      ],
    });

    if (!order) {
      return res.status(403).json({ error: "Unauthorized message sending" });
    }

    // Handle file upload (if any)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      });
      fileUrl = result.secure_url;
    }

    // Encrypt text message
    const encryptedText = text ? encryptMessage(text) : "";

    // Save message
    const newMessage = new Chat({
      senderId,
      receiverId,
      text: encryptedText,
      fileUrl,
      status: "sent",
    });

    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
};

/**
 * Mark messages as seen.
 */
export const markAsSeen = async (req, res) => {
  try {
    const { messageId } = req.body;
    await Chat.updateOne({ _id: messageId }, { status: "seen" });
    res.status(200).json({ message: "Message marked as seen" });
  } catch (error) {
    res.status(500).json({ error: "Error marking message as seen" });
  }
};

/**
 * Get unread message count.
 */
export const getUnreadMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const unreadCount = await Chat.countDocuments({
      receiverId: userId,
      status: "sent",
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: "Error fetching unread messages" });
  }
};
