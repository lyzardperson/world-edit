// src/ui/sidebar/components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X as CloseIcon } from "lucide-react";
import navItems from "@/constants/hotkeys/nav-items.json";
import { useTranslations } from "next-intl";
import { Button } from "../Button";
import { useResponsive } from "@/modules/hooks/useResponsive";

export interface SidebarProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onRequestClose,
  onCollapseChange,
}) => {
  const t = useTranslations("sidebar");
  const path = usePathname() || "";
  const { isMobile } = useResponsive();
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapseChange?.(next);
  };

  // on mobile, sidebar is always expanded
  const isCollapsed = isMobile ? false : collapsed;
  const widthClass = isCollapsed ? "w-16" : "w-60";

  const getRelative = (href: string) =>
    href.startsWith("/es/editor/") ? href.slice(11) : href;

  // MOBILE
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
              aria-label={t("toggle")}
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
                  aria-label={t("toggle")}
                >
                  <CloseIcon className="w-6 h-6" />
                </Button>
              </div>

              <nav className="flex-1 px-4 py-2 space-y-2">
                {navItems.map(({ i18nKey, href, icon }) => {
                  const isActive =
                    getRelative(path) === getRelative(href);
                  const ItemIcon = (require("lucide-react")[icon] ||
                    CloseIcon) as React.FC<{ className: string }>;

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
                        "justify-start h-10 transition-colors duration-200",
                        {
                          "text-primary-content": isActive,
                          "hover:bg-base-300": !isActive,
                          "active:bg-base-300": !isActive,
                        }
                      )}
                    >
                      <ItemIcon className="h-5 w-5 mr-2" />
                      {t(i18nKey)}
                    </Button>
                  );
                })}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // DESKTOP
  return (
    <motion.aside
      className={classNames(
        "bg-base-200 text-base-content flex flex-col transition-all duration-200 ease-in-out z-10",
        widthClass
      )}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { width: 0 },
        visible: { width: isCollapsed ? 64 : 240 },
        exit: { width: 0 },
      }}
      transition={{ type: "tween", duration: 0.2 }}
      layout
    >
      <nav className="mt-4 flex-1 space-y-1 relative px-2">
        <AnimatePresence>
          {navItems.map((item, idx) => {
            const rel = getRelative(path);
            const isActive = rel === getRelative(item.href);
            return isActive ? (
              <motion.div
                key="active-indicator"
                className="absolute inset-x-0 bg-primary rounded-md z-10 mx-2"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: idx * 44 }}
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
            ) : null;
          })}
        </AnimatePresence>

        {navItems.map(({ i18nKey, href, icon }) => {
          const rel = getRelative(path);
          const isActive = rel === getRelative(href);
          const ItemIcon = (require("lucide-react")[icon] ||
            ChevronLeft) as React.FC<{ className: string }>;

          return (
            <Button
              key={href}
              as={Link}
              href={href}
              variant="ghost"
              block
              noAnimation
              className={classNames(
                "justify-start h-10 relative z-20 transition-colors duration-200",
                {
                  "text-primary-content": isActive,
                  "hover:bg-primary-800": !isActive,
                  "active:bg-base-500 active:glass active:border-2 active:border-green-500":
                    !isActive,
                },
                isCollapsed ? "px-2" : "px-3"
              )}
            >
              <ItemIcon
                className={classNames("h-5 w-5", {
                  "mr-3": !isCollapsed,
                })}
              />
              {!isCollapsed && <span>{t(i18nKey)}</span>}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-base-300 brightness-75 hover:brightness-100">
        <Button
          onClick={toggleCollapse}
          variant="ghost"
          block
          noAnimation
          className="justify-center h-10"
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
  );
};
