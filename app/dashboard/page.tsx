"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import axiosInstance from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, PlusCircle } from "lucide-react"
import Link from "next/link"


interface AccountData {
  accountNumber: string
  balance: number
  accountType: string
}

export default function DashboardPage() {
  const [account, setAccount] = useState<AccountData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await axiosInstance.get("/accounts/get-account")
        setAccount(response.data)
      } catch (error) {
        console.error("Failed to fetch account:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccount()
  }, [])

  return (
    <ProtectedRoute requiredRole="ROLE_CUSTOMER">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Account Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      ${account?.balance.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{account?.accountType || "Savings Account"}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Account Number</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {account?.accountNumber || "****-****-****"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Active</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
                  </CardHeader>
                 <CardContent className="space-y-2">
                    <Link href="/transfer" className="flex items-center gap-2 text-sm hover:underline">
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                      <span className="text-foreground">Transfer Money</span>
                    </Link>

                    <Link href="/transactions" className="flex items-center gap-2 text-sm hover:underline">
                      <ArrowDownRight className="h-4 w-4 text-primary" />
                      <span className="text-foreground">View Transactions</span>
                    </Link>

                    <Link href="/deposit" className="flex items-center gap-2 text-sm hover:underline">
                      <PlusCircle className="h-4 w-4 text-primary" />
                      <span className="text-foreground">Deposit Money</span>
                    </Link>
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
