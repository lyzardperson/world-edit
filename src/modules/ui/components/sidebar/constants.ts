import { List, Cuboid, Zap } from "lucide-react"
import { LucideIcon } from "lucide-react"

export const SIDEBAR_ANIMATION_VARIANTS = {
  hidden:  { x: -240, opacity: 0 },
  visible: { x: 0,    opacity: 1 },
  exit:    { x: -240, opacity: 0 }
} as const

export const ROUTES = {
  WORLD: 'world',
  ENTITIES: 'entities',
  TRIGGERS: 'triggers',
} as const

type NavItem = {
  i18nKey: string
  href: (typeof ROUTES)[keyof typeof ROUTES]
  Icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { i18nKey: "world",    href: ROUTES.WORLD,    Icon: Cuboid },
  { i18nKey: "entities", href: ROUTES.ENTITIES, Icon: List   },
  { i18nKey: "triggers", href: ROUTES.TRIGGERS, Icon: Zap    },
] 