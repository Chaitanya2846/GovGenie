// Mock orders data
export const orders = [
  {
    id: "ORD-1234",
    serviceId: "1",
    serviceName: "Aadhar Card Update",
    agentId: "1",
    agentName: "Rahul Sharma",
    status: "completed",
    createdAt: "2023-03-01T10:30:00Z",
    updatedAt: "2023-03-15T14:45:00Z",
    amount: 350,
    paymentStatus: "paid",
    documents: [
      {
        id: "doc-1",
        name: "Identity Proof",
        status: "approved",
        uploadedAt: "2023-03-02T11:20:00Z",
      },
      {
        id: "doc-2",
        name: "Address Proof",
        status: "approved",
        uploadedAt: "2023-03-02T11:25:00Z",
      },
    ],
    timeline: [
      {
        status: "created",
        timestamp: "2023-03-01T10:30:00Z",
        note: "Order created",
      },
      {
        status: "documents_uploaded",
        timestamp: "2023-03-02T11:25:00Z",
        note: "All required documents uploaded",
      },
      {
        status: "processing",
        timestamp: "2023-03-05T09:15:00Z",
        note: "Application submitted to authorities",
      },
      {
        status: "completed",
        timestamp: "2023-03-15T14:45:00Z",
        note: "Aadhar card update completed",
      },
    ],
    messages: [
      {
        id: "msg-1",
        senderId: "1", // Agent ID
        senderType: "agent",
        content: "Your application has been submitted. We will update you on the progress.",
        timestamp: "2023-03-05T09:20:00Z",
      },
      {
        id: "msg-2",
        senderId: "user-1", // User ID
        senderType: "user",
        content: "Thank you for the update. How long will it take?",
        timestamp: "2023-03-05T10:05:00Z",
      },
      {
        id: "msg-3",
        senderId: "1", // Agent ID
        senderType: "agent",
        content: "It usually takes 10-15 days. I will try to expedite it.",
        timestamp: "2023-03-05T10:15:00Z",
      },
    ],
  },
  {
    id: "ORD-1235",
    serviceId: "2",
    serviceName: "PAN Card Application",
    agentId: "3",
    agentName: "Amit Kumar",
    status: "in_progress",
    createdAt: "2023-03-10T14:20:00Z",
    updatedAt: "2023-03-12T11:30:00Z",
    amount: 450,
    paymentStatus: "paid",
    documents: [
      {
        id: "doc-3",
        name: "Identity Proof",
        status: "approved",
        uploadedAt: "2023-03-11T09:45:00Z",
      },
      {
        id: "doc-4",
        name: "Address Proof",
        status: "approved",
        uploadedAt: "2023-03-11T09:50:00Z",
      },
      {
        id: "doc-5",
        name: "Photograph",
        status: "pending",
        uploadedAt: "2023-03-11T09:55:00Z",
      },
    ],
    timeline: [
      {
        status: "created",
        timestamp: "2023-03-10T14:20:00Z",
        note: "Order created",
      },
      {
        status: "documents_uploaded",
        timestamp: "2023-03-11T09:55:00Z",
        note: "All required documents uploaded",
      },
      {
        status: "processing",
        timestamp: "2023-03-12T11:30:00Z",
        note: "Application submitted to authorities",
      },
    ],
    messages: [
      {
        id: "msg-4",
        senderId: "3", // Agent ID
        senderType: "agent",
        content: "I need a clearer photograph. The one you uploaded is blurry.",
        timestamp: "2023-03-11T10:30:00Z",
      },
      {
        id: "msg-5",
        senderId: "user-1", // User ID
        senderType: "user",
        content: "I will upload a new one shortly.",
        timestamp: "2023-03-11T11:15:00Z",
      },
    ],
  },
  {
    id: "ORD-1236",
    serviceId: "4",
    serviceName: "Domicile Certificate",
    agentId: "4",
    agentName: "Sneha Gupta",
    status: "pending",
    createdAt: "2023-03-15T09:10:00Z",
    updatedAt: "2023-03-15T09:10:00Z",
    amount: 400,
    paymentStatus: "pending",
    documents: [],
    timeline: [
      {
        status: "created",
        timestamp: "2023-03-15T09:10:00Z",
        note: "Order created",
      },
    ],
    messages: [],
  },
]

// Get all orders for a user
export const getUserOrders = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orders)
    }, 500)
  })
}

// Get order by ID
export const getOrderById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = orders.find((o) => o.id === id)
      if (order) {
        resolve(order)
      } else {
        reject(new Error("Order not found"))
      }
    }, 500)
  })
}

// Create a new order
export const createOrder = (orderData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "pending",
        paymentStatus: "pending",
        documents: [],
        timeline: [
          {
            status: "created",
            timestamp: new Date().toISOString(),
            note: "Order created",
          },
        ],
        messages: [],
        ...orderData,
      }

      orders.unshift(newOrder)
      resolve(newOrder)
    }, 1000)
  })
}

// Update order status
export const updateOrderStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderIndex = orders.findIndex((o) => o.id === id)
      if (orderIndex !== -1) {
        orders[orderIndex].status = status
        orders[orderIndex].updatedAt = new Date().toISOString()

        // Add to timeline
        orders[orderIndex].timeline.push({
          status,
          timestamp: new Date().toISOString(),
          note: `Status updated to ${status}`,
        })

        resolve(orders[orderIndex])
      } else {
        reject(new Error("Order not found"))
      }
    }, 500)
  })
}

// Add a message to an order
export const addOrderMessage = (orderId, message) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderIndex = orders.findIndex((o) => o.id === orderId)
      if (orderIndex !== -1) {
        const newMessage = {
          id: `msg-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          ...message,
        }

        orders[orderIndex].messages.push(newMessage)
        resolve(newMessage)
      } else {
        reject(new Error("Order not found"))
      }
    }, 500)
  })
}

