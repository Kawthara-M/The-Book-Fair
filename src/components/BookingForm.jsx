import User from "../services/api"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"

const BookingForm = () => {
  const { fairId } = useParams()
  const [requirements, setRequirements] = useState({})
  const [standTypes, setStandTypes] = useState([])
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedStandType, setSelectedStandType] = useState("")
  const [standCount, setStandCount] = useState(1)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const getRequirements = async () => {
      try {
        const fairResponse = await User.get(`/fairs/${fairId}`)
        const hallsResponse = await User.get(`/fairs/${fairId}/halls`)
        const halls = hallsResponse.data

        const standMap = {}

        halls.forEach((hall) => {
          hall.stands.forEach((stand) => {
            const type = stand.type
            if (!standMap[type]) {
              standMap[type] = {
                type,
                totalAvailability: 0,
                fee: stand.fee,
              }
            }

            standMap[type].totalAvailability += stand.availability
          })
        })

        const groupedStands = Object.values(standMap)

        setRequirements({
          exhibitorRoles: fairResponse.data.exhibitorRoles,
        })

        setStandTypes(groupedStands)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    getRequirements()
  }, [fairId])

  const handleBooking = async () => {
    try {
      const payload = {
        exhibitorRole: selectedRole,
        stands: [
          {
            requestedType: selectedStandType,
            requestedCount: standCount,
          },
        ],
      }

      const res = await User.post(`/bookings/${fairId}`, payload)
      setMessage(res.data.message || "Booking successful!")
      setSelectedRole("")
      setSelectedStandType("")
      setStandCount(1)
      setMessage("")
    } catch (error) {
      setMessage(error.response?.data?.error || "Booking failed.")
    }
  }

  return (
    <>
      <form className="booking-form">
        <h1>Booking Details</h1>
        <div>
          <h2>Exhibitor Role</h2>
          {requirements?.exhibitorRoles?.map((role) => (
            <>
              <div key={role._id} className="line">
                <label htmlFor={`role-${role._id}`}>
                  <strong> {role.name}</strong>
                </label>
                <input
                  type="radio"
                  id={`role-${role._id}`}
                  name="selectedRole"
                  value={role.name}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
              </div>
              <p>{role.description}</p>
            </>
          ))}
        </div>

        <h2>Stand Type</h2>

        {standTypes.map((stand) => (
          <div className="stand" key={stand.type}>
            <div className="line">
              <label htmlFor={stand.type}>
                <strong>{stand.type}</strong> — {stand.fee} BHD
              </label>
              <input
                type="radio"
                id={stand.type}
                name="selectedStand"
                value={stand.type}
                disabled={stand.totalAvailability < 1}
                onChange={(e) => setSelectedStandType(e.target.value)}
              />
            </div>
            <p>
              Availability:{" "}
              {stand.totalAvailability > 0
                ? stand.totalAvailability
                : "Sold Out"}
            </p>
          </div>
        ))}

        <div>
          <label htmlFor="count">Stand Count: </label>
          <input
            type="number"
            id="count"
            min="1"
            value={standCount}
            onChange={(e) => setStandCount(Number(e.target.value))}
          />
        </div>

        <div className="center">
          <button
            onClick={handleBooking}
            disabled={!selectedRole || !selectedStandType}
          >
            Submit Booking
          </button>
        </div>

        {message && <p>{message}</p>}
      </form>
    </>
  )
}

export default BookingForm
