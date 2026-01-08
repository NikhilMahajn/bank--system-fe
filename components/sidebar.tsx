"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ArrowLeftRight, Receipt, Plus, Minus, Users, Building2, BarChart3 } from "lucide-react"
import { getRole } from "@/lib/auth"

export default function Sidebar() {
  const pathname = usePathname()
  const role = getRole()

  const customerLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transactions", icon: Receipt },
    { href: "/transfer", label: "Transfer", icon: ArrowLeftRight },
    { href: "/deposit", label: "Deposit", icon: Plus },
    { href: "/withdraw", label: "Withdraw", icon: Minus },
  ]

  const employeeLinks = [
    { href: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employee/customers", label: "Customers", icon: Users },
    { href: "/employee/analytics", label: "Analytics", icon: BarChart3 },
  ]

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/branches", label: "Branches", icon: Building2 },
    { href: "/admin/employees", label: "Employees", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ]

  let links = customerLinks
  if (role === "ROLE_ADMIN") {
    links = adminLinks
  } else if (role === "ROLE_EMPLOYEE") {
    links = employeeLinks
  }

  return (
    <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
