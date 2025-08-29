import { useUser } from "../context/UserContext"
import { useEffect, useState } from "react"
import NewForm from "../components/NewForm"
import Fair from "../components/Fair"
import User from "../services/api"

import "../../public/stylesheets/fairs.css"

const Fairs = () => {
  const { user } = useUser()
  const [fairs, setFairs] = useState([])
  const [view, setView] = useState("active")

  useEffect(() => {
    const getFairs = async () => {
      const response = await User.get("/fairs")
      setFairs(response.data)
    }
    getFairs()
  }, [])

  const filteredFairs = fairs.filter((fair) => {
    if (view === "active") return fair.status === "active"
    if (view === "upcoming") return fair.status === "upcoming"
    if (view === "new") return fair.status === "new"
    return true
  })

  return (
    <div className="fairs-page-wrapper">
      {user?.role === "Admin" && (
        <div className="admin-nav">
          <h4 onClick={() => setView("upcoming")}>Upcoming Fairs</h4>
          <h4 onClick={() => setView("active")}>Active Fairs</h4>
          <h4 onClick={() => setView("new")}>New Fair</h4>
        </div>
      )}

      {user?.role === "Admin" && view === "new" ? (
        <>
          {" "}
          <NewForm />
          <div>{/* this empty comment is for flex thing in style */}</div>
        </>
      ) : (
        <div className="fairs-wrapper">
          {user?.role === "Admin"
            ? filteredFairs.length > 0
              ? filteredFairs.map((fair) => <Fair key={fair.id} fair={fair} />)
              : `No ${view} Fairs.`
            : fairs.length > 0
            ? fairs.map((fair) => <Fair key={fair.id} fair={fair} />)
            : "No Fairs."}
        </div>
      )}
    </div>
  )
}

export default Fairs
