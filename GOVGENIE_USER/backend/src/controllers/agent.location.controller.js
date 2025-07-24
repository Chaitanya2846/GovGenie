// import express from "express";
// import mongoose from "mongoose";

// const router = express.Router();

// // Function to calculate Haversine distance
// const toRadians = (degrees) => degrees * (Math.PI / 180);
// const getDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Radius of Earth in km
//   const dLat = toRadians(lat2 - lat1);
//   const dLon = toRadians(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRadians(lat1)) *
//       Math.cos(toRadians(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// };

// // API to find nearby agents without using Mongoose model
// router.get("/find-nearby-agents", async (req, res) => {
//   try {
//     const { latitude, longitude, radius } = req.query;

//     if (!latitude || !longitude) {
//       return res
//         .status(400)
//         .json({ message: "Latitude and longitude are required" });
//     }

//     const maxDistance = radius ? Number(radius) : 5; // Default: 5 km

//     // Directly fetch agents from MongoDB without Mongoose model
//     const agentsCollection = mongoose.connection.db.collection("agentinfos");
//     const agents = await agentsCollection.find({}).toArray();

//     // Filter and sort nearby agents
//     const nearbyAgents = agents
//       .map((agent) => {
//         const distance = getDistance(
//           parseFloat(latitude),
//           parseFloat(longitude),
//           parseFloat(agent.latitude),
//           parseFloat(agent.longitude)
//         );

//         return { ...agent, distance };
//       })
//       .filter((agent) => agent.distance <= maxDistance)
//       .sort((a, b) => a.distance - b.distance);

//     res.json({ success: true, agents: nearbyAgents });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// export default router;



// import mongoose from "mongoose";

// // Function to calculate Haversine distance
// const toRadians = (degrees) => degrees * (Math.PI / 180);
// const getDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Radius of Earth in km
//   const dLat = toRadians(lat2 - lat1);
//   const dLon = toRadians(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRadians(lat1)) *
//       Math.cos(toRadians(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// };

// // Controller to get nearby agents
// export const findNearbyAgents = async (req, res) => {
//     try {

//     const { latitude, longitude, radius } = req.query;

//     if (!latitude || !longitude) {
//       return res
//         .status(400)
//         .json({ message: "Latitude and longitude are required" });
//     }

//     const maxDistance = radius ? Number(radius) : 500; // Default radius: 5 km

//     // Access MongoDB collection directly
//     const agentsCollection = mongoose.connection.db.collection("agentinfos");
//         const agents = await agentsCollection.find({}).toArray();
//         console.log("agents details", agents);

//     // Filter and sort nearby agents
//     const nearbyAgents = agents
//       .map((agent) => {
//         const distance = getDistance(
//           parseFloat(latitude),
//           parseFloat(longitude),
//           parseFloat(agent.latitude),
//           parseFloat(agent.longitude)
//         );
//           console.log("return data ", distance);
//           console.log("return agent ", agent);
//         return { ...agent, distance };
//       })
//       .filter((agent) => agent.distance <= maxDistance)
//       .sort((a, b) => a.distance - b.distance);
//         console.log("nearby agent ", nearbyAgents);
//     res.json({ success: true, agents: nearbyAgents });
//   } catch (error) {
//     console.error("Error fetching nearby agents:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

import mongoose from "mongoose";

// Function to convert degrees to radians
const toRadians = (degrees) => degrees * (Math.PI / 180);

// Function to calculate Haversine distance
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Controller function to get nearby agents
export const findNearbyAgents = async (req, res) => {
  try {
    console.log("find nearby agent ", req.query);
    const { latitude, longitude, radius } = req.query;
      console.log("user dist", radius);
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const maxDistance = radius ? Number(radius) : 50000; // Default radius: 5 km

    // Fetch agents from MongoDB
    const agentsCollection = mongoose.connection.db.collection("agentinfos");
    const agents = await agentsCollection.find({}).toArray();

    console.log("Fetched Agents:", agents);

    // Filter and sort nearby agents
    const nearbyAgents = agents
      .map((agent) => {
        // Convert stored latitude & longitude to numbers before calculation
        const distance = getDistance(
          Number(latitude),
          Number(longitude),
          Number(agent.latitude),
          Number(agent.longitude)
        );

        console.log(
          `Agent: ${agent.firstName} ${agent.lastName}, Distance: ${distance} km`
        );

        return { ...agent, distance };
      })
      .filter((agent) => agent.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    console.log("Nearby Agents:", nearbyAgents);

    res.json({ success: true, agents: nearbyAgents });
  } catch (error) {
    console.error("Error fetching nearby agents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
