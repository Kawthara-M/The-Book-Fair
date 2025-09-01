import { useEffect, useState } from "react"
import User from "../services/api"

const BookingRequest = ({ fair }) => {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const getBookings = async () => {
      try {
        const response = await User.get(`/bookings/${fair._id}`)
        setBookings(response.data)
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      }
    }

    getBookings()
  }, [fair._id])

  const updateStatus = async (booking, status) => {
    try {
      const response = await User.put(`/bookings/update-status/${booking._id}`, { status })

      // Update state locally to reflect the new status
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b._id === booking._id ? { ...b, status: response.data.booking.status } : b
        )
      )
    } catch (error) {
      console.error("Failed to update booking status:", error)
    }
  }

  return (
    <>
      {bookings.length > 0 ? (
        bookings.map((booking) => {
          const portfolioUrl = booking.exhibitor?.portfolio
          const portfolioFileName = portfolioUrl
            ? decodeURIComponent(
                portfolioUrl.split("/").pop().replace(/\+/g, " ")
              )
            : null

          return (
            <div key={booking._id} >
              <h4>Role: {booking.exhibitorRole}</h4>

              <a href={`mailto:${booking.exhibitor.user.email}`}>
                <h4>Request By: {booking.exhibitor.user.name}</h4>
              </a>

              <h4>Stand Requested: {booking.stands[0]?.type || "N/A"}</h4>
              <h4>Status: {booking.status}</h4>

              {portfolioUrl ? (
                <>
                  <h4>Portfolio: {portfolioFileName}</h4>
                  <a
                    href={portfolioUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button>Download Portfolio</button>
                  </a>
                </>
              ) : (
                <h4>No portfolio</h4>
              )}

              {booking.status === "pending" && (
                <>
                  <button onClick={() => updateStatus(booking, "accepted")}>Accept</button>
                  <button onClick={() => updateStatus(booking, "rejected")}>Reject</button>
                </>
              )}
            </div>
          )
        })
      ) : (
        <p>No Booking Requests</p>
      )}
    </>
  )
}

export default BookingRequest
