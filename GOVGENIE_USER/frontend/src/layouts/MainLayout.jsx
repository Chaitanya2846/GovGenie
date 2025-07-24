"use client"

import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/navigation/Navbar"
import Sidebar from "../components/navigation/Sidebar"
import Footer from "../components/navigation/Footer"
import NotificationContainer from "../components/common/NotificationContainer"
import { useAuthStore } from "../store/authStore";
// import { useAuth } from "../contexts/AuthContext"

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuthStore()
  const location = useLocation()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex flex-row min-h-screen bg-gray-50 dark:bg-dark-200">
      {/* Sidebar for authenticated users */}
      {user && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

        {/* <Footer /> */}
      </div>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  )
}

export default MainLayout

