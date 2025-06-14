"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X as XIcon } from "lucide-react";

export interface SidebarModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function SidebarModal({
  isOpen,
  onClose,
  title,
  content,
}: SidebarModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal modal-open fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-box relative w-full max-w-md p-6 bg-base-100 text-base-content rounded-lg shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle absolute right-2 top-2"
              aria-label="Close modal"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <p className="text-sm">{content}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
