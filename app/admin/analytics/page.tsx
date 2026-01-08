"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import axiosInstance from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, CreditCard, TrendingUp } from "lucide-react"

interface AnalyticsData {
  totalCustomers: number
  totalBranches: number
  totalEmployees: number
  totalBalance: number
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get("/admin/analytics")
        setAnalytics(response.data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <ProtectedRoute requiredRole="ROLE_ADMIN">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Bank Analytics</h1>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics?.totalCustomers || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all branches</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Branches</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics?.totalBranches || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Operating branches</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics?.totalEmployees || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Staff members</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${analytics?.totalBalance?.toLocaleString("en-US", { maximumFractionDigits: 0 }) || "0"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">System-wide assets</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
