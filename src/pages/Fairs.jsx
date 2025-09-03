import { useUser } from "../context/UserContext"
import { useEffect, useState } from "react"
import NewForm from "../components/NewForm"
import Fair from "../components/Fair"
import User from "../services/api"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

import "../../public/stylesheets/fairs.css"

const Fairs = () => {
  const { user } = useUser()
  const [fairs, setFairs] = useState([])
  const [view, setView] = useState("ongoing")

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
  }, [view])

  const filteredFairs = fairs.filter((fair) => {
    if (view === "ongoing") {
      if (user?.role === "Admin") {
        if (fair.mainManager?._id === user.id) {
          return fair.status === "ongoing"
        }
      } else {
        return fair.status === "ongoing"
      }
    }
    if (view === "upcoming" && fair.mainManager?._id === user.id)
      return fair.status === "upcoming"
    if (view === "new") return fair.status === "new"
    if (
      view === "openForBooking" &&
      (fair.mainManager?._id === user.id || user.role === "Exhibitor")
    )
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
            <NewForm direct={setView} />
            <div></div>
          </>
        ) : null}

        {view != "new" ? (
          filteredFairs.length > 0 ? (
            filteredFairs.map((fair) => (
              <Fair key={fair._id} fair={fair} setView={setView} />
            ))
          ) : (
            <div className="align-vertical">
              {" "}
              <DotLottieReact
                src="https://lottie.host/44585f85-6ff4-42c4-af8a-06f11b3cf601/Q6yXY3LTES.lottie"
                loop
                autoplay
              />{" "}
              {`No ${
                view === "ongoing" || view === "upcoming"
                  ? view
                  : view === "openForBooking"
                  ? "Open For Booking"
                  : view === "guest"
                  ? "ongoing"
                  : null
              } Fairs`}{" "}
            </div>
          )
        ) : null}
      </div>
    </div>
  )
}

export default Fairs
