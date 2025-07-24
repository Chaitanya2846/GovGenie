import Order from "../models/order.model.js";
import Transaction from "../models/transaction.model.js";
import { User } from "../models/user.model.js"; 
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Handle booking service
// Handle booking service
export const handleBookService = async (req, res) => {
  try {
    const { agentId, customer, service, amount, dueDate } = req.body;
    console.log("Order data received:", req.body);

    // Validate required fields
    if (!agentId || !customer || !service || !amount || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Calculate 50% advance and 5% platform fee
    const advanceAmount = amount * 0.5; // 50% of the service amount
    const platformFee = amount * 0.05; // 5% platform fee
    const totalAmount = advanceAmount + platformFee; // Total amount to be paid

    console.log("Advance Amount:", advanceAmount);
    console.log("Platform Fee:", platformFee);
    console.log("Total Amount (in INR):", totalAmount);

    // Convert total amount to paisa (for Razorpay)
    const totalAmountInPaisa = Math.round(totalAmount * 100);

    // Create a Razorpay order
    const options = {
      amount: totalAmountInPaisa, // Amount in paisa
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"), // Unique receipt ID
    };

    const order = await razorpay.orders.create(options);
    console.log("Razorpay Order Created:", order);

    // Respond with the Razorpay order details
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount / 100, // Convert back to INR for frontend
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error in handleBookService:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Handle payment verification
export const verifyPayment = async (req, res) => {
  try {
    const {
      order_id,
      payment_id,
      razorpay_signature,
      agentId,
      customer,
      service,
      amount,
      advance,
      dueDate,
    } = req.body;

    console.log("verify payment...", req.body);

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Create order entry
    const newOrder = await Order.create({
      agentId,
      customer,
      service,
      amount,
      advance,
      dueDate,
      paymentStatus: "Paid",
    });

    // Create transaction entry
    await Transaction.create({
      orderId: newOrder._id,
      agentId,
      customer,
      amount: advance,
      type: "Credit",
      status: "Completed",
    });
    // ✅ Update Agent's Total & Available Balance
    const agentsCollection = mongoose.connection.db.collection("agentinfos");
    const agent = await agentsCollection.findOne({
      _id: new mongoose.Types.ObjectId(agentId),
    });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // ✅ Use updateOne() to modify the balances
    await agentsCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(agentId) },
      {
        $inc: { total_earning: advance, avaiable_balance: advance }, // Increment balances
      }
    );

    console.log("Updated Agent Balances:", {
      totalBalance: agent.total_earning + amount,
      availableBalance: agent.avaiable_balance + amount,
    });

    res.json({ success: true, message: "Payment verified and order created" });
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const notificationVerifyPayment = async (req, res) => {
  const { orderId, order_Id, paymentId, razorpaySignature, agentId, customer, amount } =
    req.body;

  console.log("Notification data received:", req.body);

  try {
    // Step 1: Verify Razorpay Signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    console.log("Generated signature:", generated_signature);

    if (generated_signature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Step 2: Find Order by Razorpay Order ID
    const order = await Order.findOne({ _id: order_Id }); // Query using Razorpay orderId
    console.log("Order data:", order);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update payment status
    order.finalPaymentStatus = "Paid";
    await order.save();

    // Step 3: Create Transaction Entry
    const transaction = new Transaction({
      orderId: order._id, // Use MongoDB ObjectId
      agentId,
      customer,
      amount,
      type: "Credit",
      status: "Completed",
    });
    console.log("Transaction data:", transaction);
    await transaction.save();

    // Step 4: Update Agent's Total and Available Balance
    const agentsCollection = mongoose.connection.db.collection("agentinfos");
    const agent = await agentsCollection.findOne({
      _id: new mongoose.Types.ObjectId(agentId),
    });
    console.log("Agent data:", agent);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    await agentsCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(agentId) },
      {
        $inc: { total_earning: amount, avaiable_balance: amount }, // Increment balances
      }
    );

    console.log("Updated Agent Balances:", {
      totalBalance: agent.total_earning + amount,
      availableBalance: agent.avaiable_balance + amount,
    });
    await User.updateOne(
      { _id: customer, "notification.orderId": order_Id },
      { $set: { "notification.$.PaymentRequest": false } }
    );
    // Step 5: Respond with Success
    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};