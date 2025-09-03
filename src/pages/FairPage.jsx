import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
import Ticket from "../components/Ticket"
import BookingForm from "../components/BookingForm"
import BookingRequest from "../components/BookingRequest"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import User from "../services/api"

const FairPage = ({}) => {
  const { user } = useUser()
  const { fairId } = useParams()
  const navigate = useNavigate()

  const [fair, setFair] = useState(null)
  const [view, setView] = useState("")
  const [bookedTicket, setBookedTicket] = useState(null)

  useEffect(() => {
    const getFair = async () => {
      try {
        const response = await User.get(`/fairs/${fairId}`)
        const fetchedFair = response.data
        setFair(fetchedFair.fair)

        if (!user) {
          setView("guest")
          return
        }

        switch (user.role) {
          case "Exhibitor":
            setView("Booking")
            break
          case "Attendee":
            setView("Tickets")
            break
          case "Admin":
            switch (fetchedFair.fair.status) {
              case "upcoming":
                setView("editFair")
                break
              case "ongoing":
                setView("ticketsSales")
                break
              case "openForBooking":
                setView("bookingRequests")
                break
            }
        }
      } catch (error) {
        console.error("Error fetching fair:", error)
      }
    }

    getFair()
  }, [fairId, user])

  const updateStatus = async () => {
    const response = await User.put(`/fairs/update-status/${fair._id}`)
    setTimeout(() => {
      navigate("/fairs")
    }, 1000)
  }

  const cancelFair = async () => {
    const response = await User.put(`/fairs/cancel-fair/${fairId}`)
    setTimeout(() => {
      navigate("/fairs")
    }, 1000)
  }

  return (
    <>
      <div className="fair-card">
        {fair ? (
          <>
            {" "}
            <div className="fair-description">
              <a className="back" onClick={() => navigate("/fairs")}>
                {" "}
                ←
              </a>
              <h1>{fair?.name}</h1>
              <div className="description">
                <h3>Description</h3>
                <p>{fair?.description}</p>
              </div>
              <div>
                <h3>Address:</h3>
                <p>{fair?.address}</p>
              </div>
            </div>
            {(view === "Tickets" || view === "guest") &&
            fair.tickets?.length > 0 ? (
              <div className="fair-options">
                {fair.tickets.map((ticket) => (
                  <Ticket
                    key={ticket._id}
                    ticket={ticket}
                    fairId={fair._id}
                    fairName={fair.name}
                    view={view}
                    newView={"Tickets"}
                    setBookedTicket={setBookedTicket}
                    setView={setView}
                  />
                ))}
              </div>
            ) : null}
            {view === "Booking" ? (
              <div className="fair-booking">
                <BookingForm />
              </div>
            ) : null}
            {view === "bookingRequests" ? (
              <div className="booking-req">
                <h2>Booking Requests</h2>
                <BookingRequest fair={fair} />
              </div>
            ) : null}
            {view === "payment" ? (
              <div className="fair-options">
                <Ticket
                  bookedTicket={bookedTicket}
                  fairName={fair.name}
                  view={view}
                  setView={setView}
                />
              </div>
            ) : null}
            {view === "editFair" ? (
              <div className="edit-fair">
                <button
                  id="cancel-button"
                  onClick={() => {
                    cancelFair()
                  }}
                >
                  ✗
                </button>
                <button
                  id="activate-button"
                  onClick={() => {
                    updateStatus()
                  }}
                >
                  Open for Booking
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="center">
            <DotLottieReact
              className="books-loader"
              src="https://lottie.host/44585f85-6ff4-42c4-af8a-06f11b3cf601/Q6yXY3LTES.lottie"
              loop
              autoplay
            />
          </div>
        )}
      </div>
    </>
  )
}

export default FairPage
