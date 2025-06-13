"use client"

import React from "react"
import { motion } from "framer-motion"
import { Menu as MenuIcon } from "lucide-react"
import { useResponsive } from "@/modules/hooks/useResponsive"
import { Sidebar } from "./sidebar"
import { Navbar } from "./Navbar"

type LayoutProps = {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Get responsive flags
  const { isMobile } = useResponsive()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  // Page animation variants
  const containerVariants = {
    hidden:  { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -10 }
  }
  const containerTransition = {
    type:     "tween" as const,
    ease:     "anticipate" as const,
    duration: 0.3
  }

  return (
    <motion.div
      data-theme="dracula"
      className="flex flex-col h-screen bg-base-100 text-base-content"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      transition={containerTransition}
    >
      {/* Navbar: show hamburger on mobile */}
      <Navbar>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 focus:outline-none"
            aria-label="Open sidebar"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        )}
      </Navbar>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isMobile ? sidebarOpen : true}
          onRequestClose={() => setSidebarOpen(false)}
          onCollapseChange={() => {}}
        />
        <motion.main
          className="flex-1 overflow-auto p-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          {children}
        </motion.main>
      </div>
    </motion.div>
  )
}
