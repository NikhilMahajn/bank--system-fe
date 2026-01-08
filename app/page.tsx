"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getRole } from "@/lib/auth"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getRole()
      if (role === "ROLE_ADMIN") {
        router.push("/admin/dashboard")
      } else if (role === "ROLE_EMPLOYEE") {
        router.push("/employee/dashboard")
      } else if (role === "ROLE_CUSTOMER") {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}
