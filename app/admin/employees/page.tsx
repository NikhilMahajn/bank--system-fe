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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Employee {
  id: number
  employeeName: string
  email: string
  mobileNumber: string
  bankBranch: Branch
  status : String
}

interface Branch {
  branchName : String
  branchCode : String
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmployee, setNewEmployee] = useState({ employeeName: "", email: "", mobileNumber: "", branchCode: "", position: "" })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/employee/get-employees")
      setEmployees(response.data)
    } catch (err) {
      console.error("Failed to fetch employees:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newEmployee.employeeName || !newEmployee.email || !newEmployee.mobileNumber || !newEmployee.branchCode) {
      setError("Please fill in all fields")
      return
    }

    try {
      await axiosInstance.post("/employee/add-employee", newEmployee)
      setSuccess("Employee added successfully!")
      setNewEmployee({ employeeName: "", email: "", mobileNumber: "", branchCode: "", position: "" })
      await fetchEmployees()
      setTimeout(() => setSuccess(""), 5000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add employee")
    }
  }

  const handleRemoveEmployee = async (employeeId: number) => {
    try {
      await axiosInstance.delete(`/employee/${employeeId}`)
      await fetchEmployees()
      setSuccess("Employee removed successfully!")
      setTimeout(() => setSuccess(""), 5000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove employee")
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
              <h1 className="text-3xl font-bold mb-8">Employees</h1>

              <Card>
                <CardHeader>
                  <CardTitle>Add New Employee</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddEmployee} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                        <Input
                          type="text"
                          placeholder="Employee name"
                          value={newEmployee.employeeName}
                          onChange={(e) => setNewEmployee({ ...newEmployee, employeeName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                        <Input
                          type="email"
                          placeholder="employee@bank.com"
                          value={newEmployee.email}
                          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                        <Input
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={newEmployee.mobileNumber}
                          onChange={(e) => setNewEmployee({ ...newEmployee, mobileNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Position</label>
                        <Input
                          type="text"
                          placeholder="e.g., Manager, Teller"
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">Branch</label>
                        <Input
                          type="text"
                          placeholder="Branch Code"
                          value={newEmployee.branchCode}
                          onChange={(e) => setNewEmployee({ ...newEmployee, branchCode: e.target.value })}
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

                    <Button type="submit">Add Employee</Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">All Employees</h2>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : employees.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No employees found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <Card key={employee.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {employee.employeeName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{employee.employeeName}</h3>
                              <p className="text-sm text-muted-foreground">{employee.email}</p>
                              <p className="text-sm text-muted-foreground">{employee.mobileNumber}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {employee.employeeName} at {employee.bankBranch.branchCode}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveEmployee(employee.id)}>
                              Remove
                            </Button>
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
