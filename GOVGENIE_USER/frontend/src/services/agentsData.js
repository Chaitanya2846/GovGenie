// Mock agents data
export const agents = [
  {
    id: "1",
    name: "Rahul Sharma",
    avatar: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 124,
    location: "Mumbai, Maharashtra",
    experience: "5 years",
    services: ["1", "2", "6"], // Service IDs
    pricing: {
      1: 350, // Service ID: Price
      2: 500,
      6: 1200,
    },
    availability: {
      monday: { start: "09:00", end: "18:00" },
      tuesday: { start: "09:00", end: "18:00" },
      wednesday: { start: "09:00", end: "18:00" },
      thursday: { start: "09:00", end: "18:00" },
      friday: { start: "09:00", end: "18:00" },
      saturday: { start: "10:00", end: "15:00" },
      sunday: null,
    },
    bio: "Experienced agent specializing in identity documents and tax filing. I ensure a smooth and hassle-free experience for all government services.",
  },
  {
    id: "2",
    name: "Priya Patel",
    avatar: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 98,
    location: "Delhi, NCR",
    experience: "7 years",
    services: ["1", "3", "4", "5"], // Service IDs
    pricing: {
      1: 400, // Service ID: Price
      3: 300,
      4: 350,
      5: 1500,
    },
    availability: {
      monday: { start: "10:00", end: "19:00" },
      tuesday: { start: "10:00", end: "19:00" },
      wednesday: { start: "10:00", end: "19:00" },
      thursday: { start: "10:00", end: "19:00" },
      friday: { start: "10:00", end: "19:00" },
      saturday: { start: "11:00", end: "16:00" },
      sunday: null,
    },
    bio: "Former government employee with extensive knowledge of certificate processes. I help clients navigate complex government procedures with ease.",
  },
  {
    id: "3",
    name: "Amit Kumar",
    avatar: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 156,
    location: "Bangalore, Karnataka",
    experience: "4 years",
    services: ["2", "3", "6"], // Service IDs
    pricing: {
      2: 450, // Service ID: Price
      3: 250,
      6: 1000,
    },
    availability: {
      monday: { start: "09:30", end: "18:30" },
      tuesday: { start: "09:30", end: "18:30" },
      wednesday: { start: "09:30", end: "18:30" },
      thursday: { start: "09:30", end: "18:30" },
      friday: { start: "09:30", end: "18:30" },
      saturday: null,
      sunday: null,
    },
    bio: "Financial expert specializing in tax filing and PAN card services. I provide personalized assistance to ensure maximum benefits for my clients.",
  },
  {
    id: "4",
    name: "Sneha Gupta",
    avatar: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 87,
    location: "Hyderabad, Telangana",
    experience: "3 years",
    services: ["1", "4", "5"], // Service IDs
    pricing: {
      1: 300, // Service ID: Price
      4: 400,
      5: 1800,
    },
    availability: {
      monday: { start: "10:00", end: "18:00" },
      tuesday: { start: "10:00", end: "18:00" },
      wednesday: { start: "10:00", end: "18:00" },
      thursday: { start: "10:00", end: "18:00" },
      friday: { start: "10:00", end: "18:00" },
      saturday: { start: "10:00", end: "14:00" },
      sunday: null,
    },
    bio: "Legal expert with focus on gazette notifications and domicile certificates. I ensure all documentation is properly handled for a smooth process.",
  },
]

// Get all agents
export const getAllAgents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(agents)
    }, 500)
  })
}

// Get agent by ID
export const getAgentById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const agent = agents.find((a) => a.id === id)
      if (agent) {
        resolve(agent)
      } else {
        reject(new Error("Agent not found"))
      }
    }, 500)
  })
}

// Get agents by service
export const getAgentsByService = (serviceId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredAgents = agents.filter((a) => a.services.includes(serviceId))
      resolve(filteredAgents)
    }, 500)
  })
}

// Get agents by location
export const getAgentsByLocation = (location) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredAgents = agents.filter((a) => a.location.toLowerCase().includes(location.toLowerCase()))
      resolve(filteredAgents)
    }, 500)
  })
}

