import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"

const Fair = ({ fair }) => {
  const { user } = useUser()
  const navigate = useNavigate()

  const getButtonContent = (status) => {
    switch (status) {
      case "upcoming":
        return "Participate!"
      case "ongoing":
        return "Book Tickets!"
      default:
        return null
    }
  }
  const getLoggedInButtonContent = () => {
    switch (user.role) {
      case "Admin":
        if (fair?.status === "upcoming") return "Manage Fair"
        else if (fair?.status === "ongoing") return "View Sold Tickets"
        else if (fair?.status === "openForBooking")
          return "Review Booking Requests"
      case "Attendee":
        return "Book Tickets!"
      case "Exhibitor":
        return "Participate!"
      default:
        return null
    }
  }

  return (
    <>
      {
        <div className="fair">
          {/* <img src="#" alt={`${fair.name}`} id="fair-img" /> */}
            <h3>{fair.name}</h3>
          <div>
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
              <button
                onClick={() => {
                  navigate(`/fairs/${fair._id}`)
                }}
              >
                {getLoggedInButtonContent()}
              </button>
            )}
          </div>
        </div>
      }
    </>
  )
}

export default Fair
