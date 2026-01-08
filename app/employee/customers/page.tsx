"use client"

import type React from "react"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import axiosInstance from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle } from "lucide-react"

interface Customer{
	id: number
  customerName: string
  email: string
  mobileNumber : string
}
interface Account {
  id: number
  customer : Customer
  accountNumber: string
  active: boolean
}

export default function CustomersPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [newCustomer, setNewCustomer] = useState({ customerName: "", email: "", mobileNumber: "" ,password:"Pass@123" })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/accounts/get-accounts")
      setAccounts(response.data)
    } catch (err) {
      console.error("Failed to fetch customers:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newCustomer.customerName || !newCustomer.email || !newCustomer.mobileNumber) {
      setError("Please fill in all fields")
      return
    }

    try {
      await axiosInstance.post("/customer/add-customer", newCustomer)
      setSuccess("Customer added successfully!")
      setNewCustomer({ customerName: "", email: "", mobileNumber: "" ,password:"Pass@123"})
      await fetchCustomers()
      setTimeout(() => setSuccess(""), 5000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add customer")
    }
  }

  const handleBlockCustomer = async (customerId: number) => {
    try {
      await axiosInstance.post(`/employee/customers/${customerId}/block`)
      await fetchCustomers()
      setSuccess("Customer blocked successfully!")
      setTimeout(() => setSuccess(""), 5000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to block customer")
    }
  }

  return (
    <ProtectedRoute requiredRole="ROLE_EMPLOYEE">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-8">Customer Management</h1>

              <Card>
                <CardHeader>
                  <CardTitle>Add New Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCustomer} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                        <Input
                          type="text"
                          placeholder="Customer name"
                          value={newCustomer.customerName}
                          onChange={(e) => setNewCustomer({ ...newCustomer, customerName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                        <Input
                          type="email"
                          placeholder="customer@example.com"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                        <Input
                          type="tel"
                          placeholder="123-456-7890"
                          value={newCustomer.mobileNumber}
                          onChange={(e) => setNewCustomer({ ...newCustomer, mobileNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <span className="text-sm text-destructive">{error}</span>
                      </div>
                    )}

                    {success && (
                      <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-600">{success}</span>
                      </div>
                    )}

                    <Button type="submit">Add Customer</Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Customers List</h2>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : accounts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No customers found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {accounts.map((account) => (
                    <Card key={account.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{account.customer.customerName}</h3>
                            <p className="text-sm text-muted-foreground">{account.customer.email}</p>
                            <p className="text-sm text-muted-foreground">{account.customer.mobileNumber}</p>
                            <p className="text-sm text-muted-foreground">Account: {account.accountNumber}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                account.active == true? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              Status
                            </span>
                            {account.active == true && (
                              <Button variant="destructive" size="sm" onClick={() => handleBlockCustomer(account.id)}>
                                Block
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
