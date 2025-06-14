// src/ui/sidebar/components/SidebarNavItem.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useTranslations } from "next-intl";
import { SidebarModal } from "../modal";

interface NavItemProps {
  i18nKey: string;
  href: string;
  icon: string;
  modalI18nKey?: string | null;
  collapsed: boolean;
  isActive: boolean;
}

export function SidebarNavItem({
  i18nKey,
  href,
  icon,
  modalI18nKey,
  collapsed,
  isActive,
}: NavItemProps) {
  const t = useTranslations("sidebar");
  const [isOpen, setIsOpen] = useState(false);
  const Icon = (Icons as any)[icon];

  const label = t(i18nKey);
  const modalContent = modalI18nKey ? t(modalI18nKey) : null;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className={classNames(
          "flex items-center cursor-pointer p-2 rounded",
          {
            "bg-primary text-primary-foreground": isActive,
            "justify-center": collapsed,
            "gap-3": !collapsed,
          }
        )}
        onClick={(e) => {
          if (modalContent) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <Icon className="h-5 w-5" />
        {!collapsed && <span>{label}</span>}
      </motion.div>

      {modalContent && (
        <SidebarModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={label}
          content={modalContent}
        />
      )}

      {!modalContent && (
        <Link href={href} passHref legacyBehavior>
          <a className="sr-only">{label}</a>
        </Link>
      )}
    </>
  );
}
