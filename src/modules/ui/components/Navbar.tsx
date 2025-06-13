"use client"

import React, { ReactNode, useCallback } from "react"
import { Settings } from "lucide-react"
import { Button } from "./Button"

interface NavbarProps {
  /** Title text shown on the left */
  title?: string
  /** Optional extra content (e.g. mobile menu button) */
  children?: ReactNode
  /** Called when the settings icon is clicked */
  onSettingsClick?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  title = "Map Creator",
  children,
  onSettingsClick,
}) => {
  /**
   * Memoize the settings-click handler so it never
   * changes identity unless a new callback is passed.
   */
  const handleSettingsClick = useCallback(() => {
    if (onSettingsClick) {
      onSettingsClick()
    } else {
      console.log("Settings clicked")
    }
  }, [onSettingsClick])

  return (
    <header className="bg-base-200 text-base-content shadow-md">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-12 px-4">
        {/* Left: Title */}
        <h1 className="text-lg font-semibold">{title}</h1>

        {/* Right: any children (e.g. menu button) + settings button */}
        <div className="flex items-center gap-2">
          {children}

          <Button
            variant="ghost"
            onClick={handleSettingsClick}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
