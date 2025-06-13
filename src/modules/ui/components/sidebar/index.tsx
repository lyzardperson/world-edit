"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import classNames from "classnames"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X as CloseIcon } from "lucide-react"
import { NAV_ITEMS, SIDEBAR_ANIMATION_VARIANTS } from "./constants"
import { useTranslations } from "next-intl"
import { Button } from "../Button"
import { useResponsive } from "@/modules/hooks/useResponsive"

export const Sidebar: React.FC<{
  isOpen: boolean
  onRequestClose: () => void
  onCollapseChange?: (collapsed: boolean) => void
}> = ({ isOpen, onRequestClose, onCollapseChange }) => {
  const path = usePathname() || ""
  const t = useTranslations("sidebar")
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const { isMobile } = useResponsive()

  const toggleCollapse = () => {
    const next = !isCollapsed
    setIsCollapsed(next)
    onCollapseChange?.(next)
  }

  const collapsed = isMobile ? false : isCollapsed
  const widthClass = collapsed ? "w-16" : "w-60"

  const getRelative = (href: string) =>
    href.startsWith("/es/editor/") ? href.slice(11) : href

  // MOBILE DRAWER
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={onRequestClose}
              aria-label="Close sidebar"
            />

            <motion.aside
              className="absolute top-0 left-0 h-full bg-base-200 flex flex-col shadow-xl z-50 w-64"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 40 }}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex justify-end p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  noAnimation
                  onClick={onRequestClose}
                  aria-label="Close menu"
                >
                  <CloseIcon className="w-6 h-6" />
                </Button>
              </div>

              {/* Corregido: Añadido padding vertical para evitar recorte de texto */}
              <nav className="relative flex-1 px-4 py-2">
                <AnimatePresence>
                  {NAV_ITEMS.map((item, idx) =>
                    getRelative(path) === getRelative(item.href) ? (
                      <motion.div
                        key="active-indicator"
                        className="absolute inset-x-4 bg-primary rounded-md"
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ 
                          opacity: 1, 
                          // Corregido: Alineación vertical precisa
                          y: idx * (40) // 40px de altura + 8px de espacio
                        }}
                        exit={{ opacity: 0 }}
                        style={{ height: 40 }}
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 50,
                          mass: 0.8,
                        }}
                      />
                    ) : null
                  )}
                </AnimatePresence>

                {/* Corregido: Espaciado consistente y altura fija */}
                <div className="space-y-2">
                  {NAV_ITEMS.map(({ i18nKey, href, Icon }) => {
                    const isActive = getRelative(path) === getRelative(href)
                    return (
                      <Button
                        key={href}
                        as={Link}
                        href={href}
                        variant="ghost"
                        block
                        noAnimation
                        onClick={onRequestClose}
                        className={classNames(
                          "justify-start h-10",
                          "transition-colors duration-200", // Suavizar transiciones
                          {
                            "text-primary-content": isActive,
                            "hover:bg-base-300": !isActive,
                            "active:bg-base-300": !isActive,
                          }
                        )}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {t(i18nKey)}
                      </Button>
                    )
                  })}
                </div>
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // DESKTOP SIDEBAR
  return (
    <motion.aside
      className={classNames(
        "bg-base-200 text-base-content flex flex-col transition-all duration-200 ease-in-out",
        widthClass,
        "z-10"
      )}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={SIDEBAR_ANIMATION_VARIANTS}
      transition={{ type: "tween", duration: 0.2 }}
      layout
    >
      {/* Corregido: Añadido padding vertical */}
      <nav className="mt-4 flex-1 space-y-1 relative px-2">
        <AnimatePresence>
          {NAV_ITEMS.map((item, idx) => {
            const isActive = getRelative(path) === getRelative(item.href)
            return isActive ? (
              <motion.div
                key="active-indicator"
                className={classNames(
                  "absolute inset-x-0 bg-primary  rounded-md z-10",
                  collapsed ? "mx-2" : "mx-2" 
                )}
                initial={{ opacity: 0, y: 0 }}
                animate={{ 
                  opacity: 1, 
                  // Corregido: Cálculo preciso de posición
                  y: idx * (40) // 40px de altura + 4px de espacio
                }}
                exit={{ opacity: 0 }}
                style={{ height: 40 }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 50,
                  mass: 0.8,
                }}
                layoutId="active-bg"
              />
            ) : null
          })}
        </AnimatePresence>

        {NAV_ITEMS.map(({ i18nKey, href, Icon }) => {
          const isActive = getRelative(path) === getRelative(href)
          return (
            <Button
              key={href}
              as={Link}
              href={href}
              variant="ghost"
              block
              noAnimation
              className={classNames(
                "justify-start h-10 relative z-20",
                "transition-colors duration-200", 
                {
                  "text-primary-content": isActive,
                  "hover:bg-primary-800": !isActive,
                  "active:bg-base-500 active:glass active:border-2 active:border-green-500": !isActive,
                },
                collapsed ? "px-2" : "px-3" 
              )}
            >
              <Icon
                className={classNames("h-5 w-5", {
                  "mr-3": !collapsed, 
                })}
              />
              {!collapsed && <span>{t(i18nKey)}</span>}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-base-300 brightness-75 hover:brightness-100">
        <Button
          onClick={toggleCollapse}
          variant="ghost"
          block
          noAnimation
          className={classNames(
            "justify-center h-10",
            "hover:bg-base-300", 
            collapsed ? "px-2" : "px-4"
          )}
          aria-label={collapsed ? t("expand") : t("collapse")}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span>{t("toggle")}</span>
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  )
}