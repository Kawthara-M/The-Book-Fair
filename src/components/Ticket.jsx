import { useState } from "react"
import { useUser } from "../context/UserContext"
import Payment from "./Payment"
import User from "../services/api"

const Ticket = ({
  ticket,
  fairId,
  fairName,
  view,
  setView,
  setBookedTicket,
  bookedTicket,
}) => {
  const { user } = useUser()

  const [ticketAvailability, setTicketAvailability] = useState(
    ticket?.availability
  )
  const [errorMsg, setErrorMsg] = useState("")

  const postTicket = async () => {
    try {
      const response = await User.post(`/tickets/${fairId}`, {
        type: ticket.type,
      })

      setTicketAvailability((prev) => prev - 1)

      setBookedTicket({
        ...ticket,
        status: "unpaid",
        fairName: fairName,
        _id: response.data.ticket._id,
      })

      setView("payment")
    } catch (error) {
      if (
        error.response?.data?.msg ||
        error.response?.data?.error ||
        "Ticket wan't booked, try again later"
      ) {
        setErrorMsg(msg)
      }
    }
  }

  return (
    <>
      {ticket ? (
        <div className="ticket">
          {ticket.fairName ? <h1> {ticket.fairName} </h1> : null}

          <h3>{ticket.type}</h3>

          <div className="line">
            <p>
              <strong>Valid from</strong> {ticket.startDate}{" "}
              <strong>to </strong>
              {ticket.endDate} since <strong>{ticket.entryTime}</strong>
            </p>
            <p>{ticket.fee} BD</p>
          </div>

          {errorMsg && <div className="ticket-error">{errorMsg}</div>}
          {(view && view === "Tickets") || view === "guest" ? (
            <div className="center-button">
              <button disabled={!user || ticketAvailability === 0} onClick={() => postTicket()}>
                Book
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      {view === "payment" && bookedTicket ? (
        <Payment bookedTicket={bookedTicket} setView={setView} />
      ) : null}
    </>
  )
}

export default Ticket
