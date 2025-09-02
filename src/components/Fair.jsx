import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import User from "../services/api"

const Fair = ({ fair, setView }) => {
  const { user } = useUser()
  const navigate = useNavigate()

  const getButtonContent = (status) => {
    switch (status) {
      case "openForBooking":
        return "Participate"
      case "ongoing":
        return "Book Tickets"
      default:
        return null
    }
  }
  const getLoggedInButtonContent = () => {
    switch (user.role) {
      case "Admin":
        if (fair?.status === "upcoming") return "Manage Fair"
        else if (fair?.status === "ongoing") return "View Sold Tickets"
        else if (fair?.status === "openForBooking") return "Exhibitors"
      case "Attendee":
        return "Book Tickets"
      case "Exhibitor":
        return "Participate"
      default:
        return null
    }
  }

  const updateStatus = async () => {
    await User.put(`/fairs/update-status/${fair._id}`)
    setTimeout(() => {
      setView("ongoing")
    }, 1000)
  }

  return (
    <>
      {
        <div className="fair">
          {/* <img src="#" alt={`${fair.name}`} id="fair-img" /> */}
          <h2>{fair.name}</h2>
          <div className="guest-div">
            <p>{fair.description}</p>
            {!user ? (
              <button
                onClick={() => {
                  navigate("/auth/sign-up", {
                    state: {
                      role:
                        fair.status === "ongoing" ? "Attendee" : "Exhibitor",
                    },
                  })
                }}
              >
                {getButtonContent(fair.status)}
              </button>
            ) : (
              <div className="center-open-for-booking">
                <button
                  onClick={() => {
                    navigate(`/fairs/${fair._id}`)
                  }}
                >
                  {getLoggedInButtonContent()}
                </button>
                {fair.status === "openForBooking" && user?.role==="Admin" ? (
                  <button
                    onClick={() => {
                      updateStatus()
                    }}
                  >
                    Activate Fair
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      }
    </>
  )
}

export default Fair
