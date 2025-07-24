// Mock documents data
export const documents = [
  {
    id: "doc-1001",
    name: "Aadhar Card",
    type: "identity",
    fileName: "aadhar_card.pdf",
    fileSize: 1240000, // in bytes
    uploadedAt: "2023-01-15T10:30:00Z",
    isProtected: false,
    thumbnail: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "doc-1002",
    name: "PAN Card",
    type: "identity",
    fileName: "pan_card.pdf",
    fileSize: 890000, // in bytes
    uploadedAt: "2023-01-20T14:45:00Z",
    isProtected: true,
    thumbnail: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "doc-1003",
    name: "Passport",
    type: "identity",
    fileName: "passport.pdf",
    fileSize: 2450000, // in bytes
    uploadedAt: "2023-02-05T09:15:00Z",
    isProtected: true,
    thumbnail: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "doc-1004",
    name: "Electricity Bill",
    type: "address",
    fileName: "electricity_bill_feb2023.pdf",
    fileSize: 1050000, // in bytes
    uploadedAt: "2023-02-10T16:20:00Z",
    isProtected: false,
    thumbnail: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "doc-1005",
    name: "Income Tax Return",
    type: "financial",
    fileName: "itr_fy2022_23.pdf",
    fileSize: 1850000, // in bytes
    uploadedAt: "2023-03-01T11:30:00Z",
    isProtected: true,
    thumbnail: "/placeholder.svg?height=200&width=200",
  },
]

// Get all documents for a user
export const getUserDocuments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(documents)
    }, 500)
  })
}

// Get document by ID
export const getDocumentById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const document = documents.find((d) => d.id === id)
      if (document) {
        resolve(document)
      } else {
        reject(new Error("Document not found"))
      }
    }, 500)
  })
}

// Upload a new document
export const uploadDocument = (documentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDocument = {
        id: `doc-${Math.floor(1000 + Math.random() * 9000)}`,
        uploadedAt: new Date().toISOString(),
        ...documentData,
      }

      documents.unshift(newDocument)
      resolve(newDocument)
    }, 1000)
  })
}

// Update document protection status
export const updateDocumentProtection = (id, isProtected) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const documentIndex = documents.findIndex((d) => d.id === id)
      if (documentIndex !== -1) {
        documents[documentIndex].isProtected = isProtected
        resolve(documents[documentIndex])
      } else {
        reject(new Error("Document not found"))
      }
    }, 500)
  })
}

// Delete a document
export const deleteDocument = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const documentIndex = documents.findIndex((d) => d.id === id)
      if (documentIndex !== -1) {
        const deletedDocument = documents.splice(documentIndex, 1)[0]
        resolve(deletedDocument)
      } else {
        reject(new Error("Document not found"))
      }
    }, 500)
  })
}

