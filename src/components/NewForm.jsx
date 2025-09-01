import { useUser } from "../context/UserContext"
import RequiredRoles from "./RequiredRoles"
import FairTickets from "./FairTickets"
import StandTypes from "./StandsTypes"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const NewForm = ({ direct }) => {
  const { user } = useUser()
  const navigate = useNavigate()

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
              currentStands[i] || { type: "", price: "", availability: "" }
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
      const token = localStorage.getItem("token")

      await axios.post("http://localhost:3010/fairs/", formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

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
            <input
              type="text"
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
                      !stand.type || !stand.price || !stand.availability
                  )
              )}
            >
              Continue
            </button>
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
          </>
        )}

        {view === 3 && (
          <>
            <h2>Tickets</h2>
            <FairTickets
              tickets={formValues.tickets}
              onTicketsChange={handleTicketsChange}
            />
            <button type="button" onClick={() => setView(view - 1)}>
              Back
            </button>
            <button type="submit">Submit</button>
          </>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  )
}

export default NewForm
