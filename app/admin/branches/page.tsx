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
import { AlertCircle, CheckCircle, Building2 } from "lucide-react"

interface Branch {
  id: number
  name: string
  city: string
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [newBranch, setNewBranch] = useState({ branchName: "", city: "",})
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get("/branch/get-branches")
      setBranches(response.data)
    } catch (err) {
      console.error("Failed to fetch branches:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newBranch.branchName || !newBranch.city) {
      setError("Please fill in all fields")
      return
    }

    try {
      await axiosInstance.post("/branch/create-branch", newBranch)
      setSuccess("Branch added successfully!")
      setNewBranch({ branchName: "", city: ""})
      await fetchBranches()
      setTimeout(() => setSuccess(""), 5000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add branch")
    }
  }

  return (
    <ProtectedRoute requiredRole="ROLE_ADMIN">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-8">Bank Branches</h1>

              <Card>
                <CardHeader>
                  <CardTitle>Add New Branch</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddBranch} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Branch Name</label>
                        <Input
                          type="text"
                          placeholder="Main Branch"
                          value={newBranch.branchName}
                          onChange={(e) => setNewBranch({ ...newBranch, branchName: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">City</label>
                        <Input
                          type="text"
                          placeholder="New York"
                          value={newBranch.city}
                          onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
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

                    <Button type="submit">Add Branch</Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">All Branches</h2>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : branches.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No branches found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {branches.map((branch) => (
                    <Card key={branch.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Building2 className="h-8 w-8 text-primary mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{branch.name}</h3>
                            <p className="text-sm text-muted-foreground">{branch.city}</p>
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
