import { useState, useEffect } from "react"

const FairTickets = ({ tickets = [], onTicketsChange }) => {
  const [localTickets, setLocalTickets] = useState(tickets)

  useEffect(() => {
    onTicketsChange?.(localTickets)
  }, [localTickets])

  const handleChange = (index, field, value) => {
    const updated = [...localTickets]
    updated[index][field] =
      field === "fee" || field === "availability"
        ? parseFloat(value) || 0
        : value
    setLocalTickets(updated)
  }

  const addTicket = () => {
    setLocalTickets((prev) => [
      ...prev,
      {
        type: "",
        fee: 0,
        availability: 0,
        entryTime: "",
        startDate: "",
        endDate: "",
      },
    ])
  }

  const removeTicket = (index) => {
    const updated = [...localTickets]
    updated.splice(index, 1)
    setLocalTickets(updated)
  }

  return (
    <div className="tickets">
      <h4>Fair Tickets</h4>
      {localTickets.map((ticket, index) => (
        <div
          key={ticket._id}
        >
          <label>Type</label>
          <input
            type="text"
            value={ticket.type}
            onChange={(e) => handleChange(index, "type", e.target.value)}
          />
          <label>Fee</label>
          <input
            type="number"
            min="0"
            value={ticket.fee}
            onChange={(e) => handleChange(index, "fee", e.target.value)}
          />
          <label>Entry Time</label>
          <input
            type="time"
            value={ticket.entryTime}
            onChange={(e) => handleChange(index, "entryTime", e.target.value)}
          />
          <label>Total Availability</label>
          <input
            type="number"
            min="0"
            value={ticket.availability}
            onChange={(e) => handleChange(index, "availability", e.target.value)}
          />
          <label>Start Date</label>
          <input
            type="date"
            value={ticket.startDate?.slice(0, 10) || ""}
            onChange={(e) => handleChange(index, "startDate", e.target.value)}
          />
          <label>End Date</label>
          <input
            type="date"
            value={ticket.endDate?.slice(0, 10) || ""}
            onChange={(e) => handleChange(index, "endDate", e.target.value)}
          />
          <button type="button" onClick={() => removeTicket(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addTicket}>
        Add Ticket Type
      </button>
    </div>
  )
}

export default FairTickets
