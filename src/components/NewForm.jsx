import { useUser } from "../context/UserContext"
import RequiredRoles from "./RequiredRoles"
import FairTickets from "./FairTickets"
import StandTypes from "./StandsTypes"
import { useState } from "react"
import User from "../services/api"

const NewForm = ({ direct }) => {
  const { user } = useUser()

  const [view, setView] = useState(0)
  const [error, setError] = useState("")

  const initialState = {
    name: "",
    address: "",
    startDate: "",
    endDate: "",
    mainManager: user.id,
    description: "",
    status: "upcoming",
    exhibitorRoles: [],
    tickets: [],
    halls: [],
  }

  const [formValues, setFormValues] = useState(initialState)

  const handleChange = (e) => {
    if (error) setError("")
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleHallsCountChange = (e) => {
    const count = parseInt(e.target.value, 10)
    const newHalls =
      count > 0
        ? Array.from(
            { length: count },
            (_, i) => formValues.halls[i] || { name: "", stands: [] }
          )
        : []

    setFormValues((prev) => ({
      ...prev,
      halls: newHalls,
    }))
  }

  const handleHallChange = (index, field, value) => {
    const updatedHalls = [...formValues.halls]
    updatedHalls[index][field] = value
    setFormValues({ ...formValues, halls: updatedHalls })
  }

  const handleStandChange = (hallIndex, standIndex, field, value) => {
    const updatedHalls = [...formValues.halls]
    updatedHalls[hallIndex].stands[standIndex][field] = value
    setFormValues({ ...formValues, halls: updatedHalls })
  }

  const handleStandsCountChange = (hallIndex, count) => {
    const updatedHalls = [...formValues.halls]
    const currentStands = updatedHalls[hallIndex].stands || []
    updatedHalls[hallIndex].stands =
      count > 0
        ? Array.from(
            { length: count },
            (_, i) =>
              currentStands[i] || { type: "", fee: "", availability: "" }
          )
        : []
    setFormValues({ ...formValues, halls: updatedHalls })
  }

  const handleRolesChange = (updatedRoles) => {
    setFormValues((prev) => ({
      ...prev,
      exhibitorRoles: updatedRoles,
    }))
  }

  const handleTicketsChange = (updatedTickets) => {
    setFormValues((prev) => ({
      ...prev,
      tickets: updatedTickets,
    }))
  }

  const sumStands = () => {
    return formValues.halls.reduce((total, hall) => {
      return (
        total +
        hall.stands.reduce((subTotal, stand) => {
          return subTotal + Number(stand.availability || 0)
        }, 0)
      )
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
   console.log("Form Values:", formValues)
console.log("Fair Start Date:", new Date(formValues.startDate))
console.log("Fair End Date:", new Date(formValues.endDate))
console.log("Ticket Start Date:", new Date(formValues.tickets[0]?.startDate))
console.log("Ticket End Date:", new Date(formValues.tickets[0]?.endDate))

      const response = await User.post(
        "/fairs/",
        formValues
      )
      if (!response || !response.data || response.status !== 201) {
        setError("Server did not return a valid response.")
        return
      }
      setFormValues(initialState)
      direct("upcoming")
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to create fair, please try again."
      )
    }
  }

  return (
    <div className="new">
      <h2>New Fair Details</h2>

      <form className="new-form-panel" onSubmit={handleSubmit}>
        {view === 0 && (
          <>
            <label>Fair Name</label>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
            />
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formValues.address}
              onChange={handleChange}
            />
            <label>Description</label>
            <textarea
              type="text"
              cols="53"
              rows="5"
              name="description"
              value={formValues.description}
              onChange={handleChange}
            />
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formValues.startDate}
              onChange={handleChange}
            />
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formValues.endDate}
              onChange={handleChange}
            />
            <label>Halls Available</label>
            <input
              type="number"
              min="1"
              value={formValues.halls.length}
              onChange={handleHallsCountChange}
            />

            <button
              type="button"
              onClick={() => setView(view + 1)}
              disabled={
                !formValues.name ||
                !formValues.address ||
                !formValues.startDate ||
                !formValues.endDate ||
                formValues.halls.length === 0
              }
            >
              Continue
            </button>
          </>
        )}

        {view === 1 && (
          <>
            <h2>Hall Details</h2>
            {formValues.halls.map((hall, index) => (
              <div key={index}>
                <label>Hall {index + 1} Name</label>
                <input
                  type="text"
                  value={hall.name}
                  onChange={(e) =>
                    handleHallChange(index, "name", e.target.value)
                  }
                />
                <StandTypes
                  stands={hall.stands || []}
                  onStandChange={(standIndex, field, value) =>
                    handleStandChange(index, standIndex, field, value)
                  }
                  onStandsCountChange={(count) =>
                    handleStandsCountChange(index, count)
                  }
                />
              </div>
            ))}
            <div className="hall-buttons">
              <button type="button" onClick={() => setView(view - 1)}>
                Back
              </button>
              <button
                type="button"
                onClick={() => setView(view + 1)}
                disabled={formValues.halls.some(
                  (hall) =>
                    !hall.name ||
                    hall.stands.length === 0 ||
                    hall.stands.some(
                      (stand) =>
                        !stand.type || !stand.fee || !stand.availability
                    )
                )}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {view === 2 && (
          <>
            <h2>Required Roles</h2>
            <RequiredRoles
              sumStands={sumStands()}
              halls={formValues.halls}
              handleRolesChange={handleRolesChange}
            />
            <div className="roles-buttons">
              <button type="button" onClick={() => setView(view - 1)}>
                Back
              </button>
              <button
                type="button"
                onClick={() => setView(view + 1)}
                disabled={formValues.exhibitorRoles.length === 0}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {view === 3 && (
          <>
            <h2> Fair Tickets</h2>
            <FairTickets
              tickets={formValues.tickets}
              onTicketsChange={handleTicketsChange}
              endDate={formValues.endDate}
              startDate={formValues.startDate}
            />
            <div className="roles-buttons">
              <button type="button" onClick={() => setView(view - 1)}>
                Back
              </button>
              <button type="submit">Submit</button>
            </div>
          </>
        )}

        {error && <p className="add-error">{error}</p>}
      </form>
    </div>
  )
}

export default NewForm
