import { createContext, useContext, useState, useEffect } from "react"
import { CheckSession } from "../services/auth"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const checkToken = async () => {
    const userData = await CheckSession()
    setUser(userData)
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
