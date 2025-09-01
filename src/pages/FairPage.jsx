import { useParams } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Ticket from "../components/Ticket"
import BookingForm from "../components/BookingForm"
import BookingRequest from "../components/BookingRequest"
import User from "../services/api"

const FairPage = () => {
  const { user } = useUser()
  const [fair, setFair] = useState(null)
  const [view, setView] = useState("")
  const [bookedTicket, setBookedTicket] = useState(null)
  const navigate = useNavigate()

  const { fairId } = useParams()

  useEffect(() => {
    const getFair = async () => {
      const response = await User.get(`/fairs/${fairId}`)
      setFair(response.data)
    }

    getFair()
  }, [fairId])

  useEffect(() => {
    if (!user || !fair) return

    if (user.role === "Exhibitor") {
      setView("Booking")
    } else if (user.role === "Attendee") {
      setView("Tickets")
    } else if (user.role === "Admin") {
      switch (fair.status) {
        case "upcoming":
          setView("editFair")
          break
        case "ongoing":
          setView("ticketsSales")
          break
        case "openForBooking":
          setView("bookingRequests")
          break
        default:
          setView("guest")
      }
    } else {
      setView("guest")
    }
  }, [user, fair])

  const updateStatus = async () => {
    const response = await User.put(`fairs/update-status/${fair._id}`)
    setTimeout(() => {
      navigate("/fairs")
    }, 2000)
  }

  return (
    <>
      <div className="fair-card">
        {fair ? (
          <>
            {" "}
            <div className="fair-description">
              <h1>{fair?.name}</h1>
              <div>
                <h3>Description:</h3>
                <p>{fair?.description}</p>
              </div>
              <div>
                <h3>Address:</h3>
                <p>{fair?.address}</p>
              </div>
            </div>
            <div className="fair-options">
              {(view === "Tickets" || view === "guest") &&
              fair.tickets?.length > 0
                ? fair.tickets.map((ticket) => (
                    <Ticket
                      key={ticket._id}
                      ticket={ticket}
                      fairId={fair._id}
                      fairName={fair.name}
                      view={view}
                      setBookedTicket={setBookedTicket}
                      setView={setView}
                    />
                  ))
                : null}
              {view === "Booking" ? (
                <BookingForm />
              ) : (
                <span class="loader"></span>
              )}
              {view === "bookingRequests" ? (
                <BookingRequest fair={fair} />
              ) : null}
              {view === "editFair" ? (
                <button
                  onClick={() => {
                    updateStatus()
                  }}
                >
                  Open For Booking
                </button>
              ) : null}
              {view === "payment" ? (
                <Ticket
                  bookedTicket={bookedTicket}
                  fairName={fair.name}
                  view={view}
                  setView={setView}
                />
              ) : null}
            </div>
          </>
        ) : (
          <span class="loader"></span>
        )}
      </div>
    </>
  )
}

export default FairPage
