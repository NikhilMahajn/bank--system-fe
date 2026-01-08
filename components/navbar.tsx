"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { logout, getRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut, Landmark } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const role = getRole()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href={role === "ROLE_ADMIN" ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2">
            <Landmark className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">SecureBank</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{role === "ROLE_ADMIN" ? "Admin" : "User"}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
