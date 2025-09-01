import { useState } from "react"
import User from "../services/api"
import "../../public/stylesheets/booking.css"

const Booking = ({ booking, removeBooking }) => {
  if (!booking || !booking.stands?.length) {
    return <span className="loader"></span>
  }

  const initialStand = booking.stands[0]
  console.log(booking)
  const [selectedStand, setSelectedStand] = useState(initialStand)
  const [fee, setFee] = useState(initialStand.hall.stands[0]?.fee || 0)

  const getStandFee = (standType) => {
    const match = selectedStand.hall.stands.find((s) => s.type === standType)
    setFee(match?.fee || 0)
  }

  const deleteBooking = async () => {
    await User.delete(`/bookings/${booking._id}`)
    removeBooking(booking._id)
  }

  return (
    <>
      {booking && booking.stands?.length > 0 ? (
        <div className="booking">
<div className="booking-header">
  <h1>{booking.fair.name}</h1>
  {booking.status === "pending" && (
    <span className="delete-x" onClick={deleteBooking} title="Delete Booking">
      ×
    </span>
  )}
</div>

          <div className="line">
            <h4>{selectedStand.name}</h4>
            <p>Fee: {fee}</p>
          </div>

          <div className="line">
            <h4>Managed By</h4>
            <a
              href={`mailto:${booking.fair.mainManager?.email}`}
              title="Contact?"
            >
              <p>{booking.fair.mainManager?.name}</p>
            </a>
          </div>

          <p>Status: {booking.status}</p>

    
        </div>
      ) : (
        <span className="loader"></span>
      )}
    </>
  )
}

export default Booking
