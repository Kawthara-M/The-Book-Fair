import { createContext, useContext, useState, useEffect } from "react"
import { CheckSession } from "../services/auth"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

const checkToken = async () => {
  try {
    const userData = await CheckSession()
    setUser(userData)
  } catch (err) {
    console.error("Invalid token:", err.message)
    localStorage.removeItem("token") 
    setUser(null)
  }
}

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      checkToken()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, handleLogOut }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
