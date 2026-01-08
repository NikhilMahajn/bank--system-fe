import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  sub: string
  role: string
  exp: number
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch (error) {
    console.error("Failed to decode token:", error)
    return null
  }
}

export const getRole = (): string | null => {
  const token = localStorage.getItem("token")
  if (!token) return null

  const decoded = decodeToken(token)
  return decoded?.role || null
}

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token")
  if (!token) return false

  const decoded = decodeToken(token)
  if (!decoded) return false

  // Check if token is expired
  const currentTime = Date.now() / 1000
  return decoded.exp > currentTime
}

export const logout = (): void => {
  localStorage.removeItem("token")
  localStorage.removeItem("role")
  window.location.href = "/login"
}
