import { useEffect, useState } from "react"
import User from "../services/api"

const TicketTypes = ({ ticket, setTicketInfo }) => {
  const [types, setTypes] = useState([])
  const [selectedType, setSelectedType] = useState("")

  useEffect(() => {
    const fetchTypes = async () => {
      const res = await User.get(`/fairs/${ticket.fairId}`)
      setTypes(
        res.data.tickets.map((t) => ({
          type: t.type,
          fee: t.fee,
          startDate: t.startDate,
          endDate: t.endDate,
          entryTime: t.entryTime,
        }))
      )
    }
    fetchTypes()
  }, [])

  const handleChange = async (e) => {
    const newType = e.target.value
    setSelectedType(newType)

    try {
      await User.put(`/tickets/${ticket._id}`, { newType })

      const updatedDetails = types.find((t) => t.type === newType)

      if (!updatedDetails) return

      setTicketInfo?.({
        ...ticket,
        ...updatedDetails,
        type: newType,
      })

      alert(`Ticket type updated to ${newType}!`)
    } catch (err) {
      console.error("Failed to update ticket", err)
    }
  }

  return (
    <select value={selectedType} onChange={handleChange} className="select-type">
      <option value="" disabled>
        Select ticket type
      </option>
      {types.map(({ type }) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  )
}

export default TicketTypes
