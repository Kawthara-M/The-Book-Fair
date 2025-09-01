import { useUser } from "../context/UserContext"
import { useEffect, useState } from "react"
import NewForm from "../components/NewForm"
import Fair from "../components/Fair"
import User from "../services/api"

import "../../public/stylesheets/fairs.css"

const Fairs = () => {
  const { user } = useUser()
  const [fairs, setFairs] = useState([])
  const [view, setView] = useState("")

  useEffect(() => {
    const getFairs = async () => {
      const response = await User.get("/fairs")
      setFairs(response.data)
    }
    getFairs()
    if (!user) {
      setView("guest")
    }
    if (user?.role === "Exhibitor") {
      setView("openForBooking")
    } else if (user?.role === "Attendee") {
      setView("ongoing")
    }
    console.log(view)
  }, [view])

  const filteredFairs = fairs.filter((fair) => {
    console.log(fair)
    if (view === "ongoing" && fair.mainManager?._id === user.id)
      return fair.status === "ongoing"
    if (view === "upcoming" && fair.mainManager?._id === user.id)
      return fair.status === "upcoming"
    if (view === "new") return fair.status === "new"
    if (view === "openForBooking" && (fair.mainManager?._id === user.id || user.role==="Exhibitor"))
      return fair.status === "openForBooking"
    if (view === "guest") {
      return fair.status === "openForBooking" || fair.status === "ongoing"
    }
  })

  return (
    <div className="fairs-page-wrapper">
      {user?.role === "Admin" && (
        <div className="admin-nav">
          <h4 onClick={() => setView("upcoming")}>Upcoming Fairs</h4>
          <h4 onClick={() => setView("openForBooking")}>
            Open For Booking Fairs
          </h4>
          <h4 onClick={() => setView("ongoing")}>Ongoing Fairs</h4>
          <h4 onClick={() => setView("new")}>New Fair</h4>
        </div>
      )}
      <div className="fairs-wrapper">
        {view === "new" ? (
          <>
            {" "}
            <NewForm />
            <div>{/* this empty comment is for flex thing in style */}</div>
          </>
        ) : null}

        {view != "new"
          ? filteredFairs.length > 0
            ? filteredFairs.map((fair) => (
                <Fair key={fair.id} fair={fair} />
                
              ))
            : "No fairs"
          : null}
      </div>
    </div>
  )
}

export default Fairs
