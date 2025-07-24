// Mock services data
export const services = [
  {
    id: "1",
    name: "Aadhar Card",
    description: "Apply for a new Aadhar card or update your existing one",
    icon: "id-card",
    category: "Identity",
    processingTime: "15-30 days",
    price: {
      min: 200,
      max: 500,
    },
    requirements: ["Proof of Identity", "Proof of Address", "Passport size photograph"],
    steps: ["Fill the application form", "Submit required documents", "Biometric verification", "Receive Aadhar card"],
  },
  {
    id: "2",
    name: "PAN Card",
    description: "Apply for a new PAN card or request a duplicate",
    icon: "credit-card",
    category: "Identity",
    processingTime: "7-15 days",
    price: {
      min: 300,
      max: 700,
    },
    requirements: ["Proof of Identity", "Proof of Address", "Passport size photograph", "Date of Birth proof"],
    steps: ["Fill the application form", "Submit required documents", "Pay the fees", "Receive PAN card"],
  },
  {
    id: "3",
    name: "Income Certificate",
    description: "Get an official certificate of your income",
    icon: "document-text",
    category: "Certificates",
    processingTime: "5-10 days",
    price: {
      min: 150,
      max: 400,
    },
    requirements: ["Proof of Identity", "Proof of Address", "Income proof documents", "Passport size photograph"],
    steps: [
      "Fill the application form",
      "Submit required documents",
      "Verification by authorities",
      "Receive Income Certificate",
    ],
  },
  {
    id: "4",
    name: "Domicile Certificate",
    description: "Obtain a certificate proving your residence status",
    icon: "home",
    category: "Certificates",
    processingTime: "7-14 days",
    price: {
      min: 200,
      max: 500,
    },
    requirements: ["Proof of Identity", "Proof of Address (for the required duration)", "Passport size photograph"],
    steps: [
      "Fill the application form",
      "Submit required documents",
      "Verification by authorities",
      "Receive Domicile Certificate",
    ],
  },
  {
    id: "5",
    name: "Gazette Notification",
    description: "Publish official notifications in the government gazette",
    icon: "newspaper",
    category: "Legal",
    processingTime: "15-30 days",
    price: {
      min: 1000,
      max: 3000,
    },
    requirements: ["Proof of Identity", "Application with details for publication", "Supporting documents"],
    steps: [
      "Fill the application form",
      "Submit required documents",
      "Pay the fees",
      "Verification and processing",
      "Publication in Gazette",
    ],
  },
  {
    id: "6",
    name: "Tax Filing",
    description: "File your income tax returns with expert assistance",
    icon: "calculator",
    category: "Financial",
    processingTime: "3-7 days",
    price: {
      min: 500,
      max: 2000,
    },
    requirements: ["PAN Card", "Income statements", "Investment proofs", "Tax deduction documents"],
    steps: [
      "Provide required documents",
      "Verification and calculation",
      "Filing of returns",
      "Receive acknowledgment",
    ],
  },
]

// Get all services
export const getAllServices = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(services)
    }, 500)
  })
}

// Get service by ID
export const getServiceById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const service = services.find((s) => s.id === id)
      if (service) {
        resolve(service)
      } else {
        reject(new Error("Service not found"))
      }
    }, 500)
  })
}

// Get services by category
export const getServicesByCategory = (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredServices = services.filter((s) => s.category === category)
      resolve(filteredServices)
    }, 500)
  })
}

