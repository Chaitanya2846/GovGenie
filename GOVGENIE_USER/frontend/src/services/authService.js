// Mock authentication service

// Simulate local storage for user data
const USER_STORAGE_KEY = "govgenie_user"

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    password: "password123", // In a real app, passwords would be hashed
  },
]

// Check if user is already logged in
export const mockCheckAuth = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      if (storedUser) {
        resolve(JSON.parse(storedUser))
      } else {
        reject(new Error("No user logged in"))
      }
    }, 500)
  })
}

// Mock login function
export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email && u.password === password)

      if (user) {
        // Create a copy without the password
        const { password, ...userWithoutPassword } = user
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword))
        resolve(userWithoutPassword)
      } else {
        reject(new Error("Invalid email or password"))
      }
    }, 1000)
  })
}

// Mock register function
export const mockRegister = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists
      const existingUser = mockUsers.find((u) => u.email === userData.email)

      if (existingUser) {
        reject(new Error("Email already in use"))
      } else {
        // Create new user
        const newUser = {
          id: String(mockUsers.length + 1),
          ...userData,
        }

        mockUsers.push(newUser)

        // Create a copy without the password
        const { password, ...userWithoutPassword } = newUser
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword))
        resolve(userWithoutPassword)
      }
    }, 1000)
  })
}

// Mock logout function
export const mockLogout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem(USER_STORAGE_KEY)
      resolve()
    }, 500)
  })
}

