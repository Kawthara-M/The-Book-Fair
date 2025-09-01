import { useState, useEffect } from "react"
import { useUser } from "../context/UserContext"
import Payment from "./Payment"
import TicketTypes from "./TicketTypes"

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

  const postTicket = async () => {
    const response = await User.post(`/tickets/${fairId}`, {
      type: ticket.type,
    })
    setTicketAvailability((prev) => prev - 1)

    setBookedTicket({
      ...ticket,
      status: "unpaid",
      fairName: fairName,
    })

    setView("payment")
  }

  return (
    <>
      {ticket ? (
        <div className="ticket">
          {ticket.fairName ? <h1> {ticket.fairName} </h1> : null}

          <h3>{ticket.type}</h3>

          <div className="line">
            <p>
              <strong>Valid from</strong> {ticket.startDate} <strong>to </strong>
              {ticket.endDate} since <strong>{ticket.entryTime}</strong>
            </p>
            <p>{ticket.fee} BD</p>
          </div>

          {/* {ticketAvailability > 0 ? (
            <p>Availability {ticketAvailability}</p>
          ) : null} */}

          {(view && view === "Tickets") || view === "guest" ? (
            <div className="center-button">
            <button disabled={!user} onClick={() => postTicket()}>
              Book
            </button></div>
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
