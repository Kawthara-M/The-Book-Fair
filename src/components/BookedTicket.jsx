import { useState, useEffect } from "react"
import User from "../services/api"
import TicketTypes from "./TicketTypes"

const BookedTicket = ({ ticket, removeTicket, setView, setClickedTicket }) => {
  const [ticketInfo, setTicketInfo] = useState(ticket)

  useEffect(() => {
    setTicketInfo(ticket)
  }, [ticket])

  if (!ticketInfo) return null

  useEffect(() => {
    //idk if this actually work
    const checkIfExpired = async () => {
      if (!ticketInfo?.endDate || ticketInfo.status === "expired") return

      const today = new Date()
      const endDate = new Date(ticketInfo.endDate)

      if (endDate < today && ticketInfo.status !== "expired") {
        try {
          const res = await User.put(`/tickets/update-status/${ticketInfo._id}`)
          if (res.status === 200) {
            setTicketInfo(res.data.ticket)
          }
        } catch (err) {
          console.error("Failed to update ticket status:", err)
        }
      }
    }
    checkIfExpired()
  }, [ticketInfo])

  const deleteTicket = async () => {
    await User.delete(`/tickets/${ticket._id}`)
    removeTicket(ticket._id)
  }

  return (
    <div className="booked-ticket">
      <h1>{ticketInfo.fairName}</h1>
      <h4>{ticketInfo.type}</h4>

      <div className="line">
        <p>
          <strong>Valid from</strong> {ticketInfo.startDate} <strong>to</strong>{" "}
          {ticketInfo.endDate} since <strong>{ticketInfo.entryTime}</strong>
        </p>
        <p>{ticketInfo.fee} BD</p>
      </div>

      {ticketInfo.status === "unpaid" && (
        <>
          <TicketTypes ticket={ticketInfo} setTicketInfo={setTicketInfo} />
          <div className="booked-ticket-buttons">
            <button
              onClick={() => {
                setClickedTicket(ticket)
                setView("payment")
              }}
            >
              Pay
            </button>
            <button
              onClick={() => {
                deleteTicket()
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default BookedTicket
