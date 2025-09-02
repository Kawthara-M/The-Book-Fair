import { useState, useEffect } from "react"

const FairTickets = ({ tickets = [], onTicketsChange, startDate, endDate }) => {
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
      {localTickets.map((ticket, index) => (
        <div key={ticket._id}>
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
            onChange={(e) =>
              handleChange(index, "availability", e.target.value)
            }
          />
          <label>Start Date</label>
          <input
            type="date"
            min={startDate}
            value={ticket.startDate?.slice(0, 10)}
            onChange={(e) => handleChange(index, "startDate", e.target.value)}
          />
          <label>End Date</label>
          <input
            type="date"
            max={endDate}
            value={ticket.endDate?.slice(0, 10)}
            onChange={(e) => handleChange(index, "endDate", e.target.value)}
          />
          <div className="ticket-button-row">
            <button
              type="button"
              className="ticket-buttons"
              onClick={() => removeTicket(index)}
            >
              Remove
            </button>
            {index === localTickets.length - 1 && (
              <button
                type="button"
                className="ticket-buttons"
                onClick={addTicket}
              >
                Add Ticket Type
              </button>
            )}
          </div>
        </div>
      ))}
      {localTickets.length === 0 && (
        <div className="center">
          <button type="button" className="ticket-buttons" onClick={addTicket}>
            Add Ticket Type
          </button>
        </div>
      )}
    </div>
  )
}

export default FairTickets
