"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import axiosInstance from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Transaction {
  id: number
  type: string
  amount: number
  senderAccount?: string
  recieverAccount?: string
  date: string
  description: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get("/transactions/my-transactions")
        setTransactions(response.data)
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <ProtectedRoute requiredRole="ROLE_CUSTOMER">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Transactions</h1>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No transactions found</p>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.type === "CREDIT" ? "bg-primary/10" : "bg-destructive/10"
                              }`}
                            >
                              {transaction.type === "CREDIT" ? (
                                <ArrowDownRight className="h-5 w-5 text-primary" />
                              ) : (
                                <ArrowUpRight className="h-5 w-5 text-destructive" />
                              )}
                            </div>
                           <div className="text-sm space-y-1">
                            {transaction.type === "CREDIT" && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">RECIEVED FROM  :</span>
                                <span className="font-medium">{transaction.senderAccount}</span>
                              </div>
                            )}

                            {transaction.type === "DEBIT" && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">SEND TO  :</span>
                                <span className="font-medium">{transaction.recieverAccount}</span>
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground pt-2">
                              {new Date(transaction.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>

                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold ${
                                transaction.type === "CREDIT" ? "text-primary" : "text-destructive"
                              }`}
                            >
                              {transaction.type === "CREDIT" ? "+" : "-"}${transaction.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
