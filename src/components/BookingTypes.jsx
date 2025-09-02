import { useEffect, useState } from "react"
import User from "../services/api"

const BookingTypes = ({ booking, selectedStand, setSelectedStand, getStandFee }) => {
  const [availableTypes, setAvailableTypes] = useState([])
  const [selectedType, setSelectedType] = useState("")

  useEffect(() => {
    const fetchStandTypes = async () => {
      try {
        const res = await User.get(`/fairs/${booking.fair._id}/halls`)
        const halls = res.data

        const uniqueTypes = new Set()

        halls.forEach((hall) => {
          hall.stands.forEach((stand) => {
            if (stand.availability > 0) {
              uniqueTypes.add(stand.type)
            }
          })
        })


        setAvailableTypes([...uniqueTypes])
      } catch (err) {
        console.error("Failed to fetch halls or stand types", err)
      }
    }

    fetchStandTypes()
  }, [selectedType])

  const handleChange = async (e) => {
    const newType = e.target.value
    setSelectedType(newType)
    getStandFee(newType)

    try {
      const updatedBooking = await User.put(`/bookings/${booking._id}`, {
        requestedType: newType,
      })
      const bookingStands = await User.get(
        `bookings/${updatedBooking.data.booking._id}/stands`
      )
      setSelectedStand({
        type: newType,
        name: bookingStands.data.stands.stands[0].name,
        fee: bookingStands.data.stands.stands[0].fee,
      })
    } catch (err) {
      console.error("Failed to update stand type", err)
      alert("Could not update stand type.")
    }
  }

  return (
    <select value={selectedType} onChange={handleChange}>
      <option value="" disabled>
        Select stand type
      </option>
      {availableTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  )
}

export default BookingTypes
