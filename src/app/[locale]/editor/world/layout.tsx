import React from "react"
import { Layout as UiLayout } from "@/modules/ui/components/Layout"

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-full">
      {children}
    </main>
  )
}
