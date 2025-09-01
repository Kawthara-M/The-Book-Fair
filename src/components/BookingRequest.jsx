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
      const response = await User.put(
        `/bookings/update-status/${booking._id}`,
        { status }
      )

      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b._id === booking._id
            ? { ...b, status: response.data.booking.status }
            : b
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
            <div key={booking._id} className="single-request">
              <div className="info-wrapper">
                {" "}
                <h4>Role: </h4>
                <p>{booking.exhibitorRole}</p>
              </div>
              <a
                href={`mailto:${booking.exhibitor.user.email}`}
                className="info-wrapper"
              >
                <h4>Request By: </h4>
                <p>{booking.exhibitor.user.name}</p>
              </a>
              <div className="info-wrapper">
                <h4>Stand Requested: </h4>
                <p>{booking.stands[0]?.type}</p>
              </div>
              <div className="info-wrapper">
                <h4>Status: </h4>
                <p>{booking.status}</p>
              </div>

              {portfolioUrl ? (
                <>
                  <div className="info-wrapper">
                    <h4>Portfolio: </h4>
                    <p>{portfolioFileName}</p>
                  </div>
                </>
              ) : (
                <h4>No portfolio</h4>
              )}

              {booking.status === "pending" && (
                <>
                  <div className="req-buttons">
                    <button onClick={() => updateStatus(booking, "accepted")}>
                      ✓
                    </button>
                    <button onClick={() => updateStatus(booking, "rejected")}>
                      ✗
                    </button>
                    <a
                      href={portfolioUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button>⤓</button>
                    </a>
                  </div>
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
