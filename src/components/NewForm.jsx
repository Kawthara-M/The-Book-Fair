import { useUser } from "../context/UserContext"
import RequiredRoles from "./RequiredRoles"
import FairTickets from "./FairTickets"
import StandTypes from "./StandsTypes"
import { useState, useEffect } from "react"
import axios from "axios"

const NewForm = () => {
  const { user } = useUser()
  const [showHallInput, setShowHallInput] = useState(false)

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

  useEffect(() => {
    if (formValues.halls.length > 0) {
      setShowHallInput(true)
    } else {
      setShowHallInput(false)
    }
  }, [formValues.halls.length])

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

  useEffect(() => {
    console.log("Updated exhibitorRoles:", formValues.exhibitorRoles)
  }, [formValues.exhibitorRoles])

  // to submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        ...formValues,
      }
      console.log("payload", payload)

      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:3010/fairs/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setFormValues(initialState)
    } catch (err) {
      // setError(
      //   err.response?.data?.error || "Failed to create fair, please try again."
      // )
    }
  }

  return (
    <>
      <div className="new">
        <form>
          <label htmlFor="name">Fair,</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
          ></input>
          <label htmlFor="Address">Address</label>
          <input
            type="text"
            name="address"
            value={formValues.address}
            onChange={handleChange}
          ></input>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={formValues.description}
            onChange={handleChange}
          ></input>
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formValues.startDate}
            onChange={handleChange}
          ></input>
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formValues.endDate}
            onChange={handleChange}
          ></input>

          {formValues.name &&
          formValues.address &&
          formValues.startDate &&
          formValues.endDate ? (
            <>
              {" "}
              <label htmlFor="hallsCount">Halls Available</label>
              <input
                type="number"
                name="hallsCount"
                min="1"
                value={formValues.halls.length}
                onChange={handleHallsCountChange}
              ></input>
              {showHallInput
                ? formValues.halls?.map((hall, index) => (
                    <div key={index}>
                      <h4>Hall {index + 1}</h4>
                      <label>Hall Name</label>
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
                  ))
                : null}
              {formValues.halls?.length > 0 &&
              sumStands() > 0 &&
              formValues.halls.every((hall) => {
                return (
                  hall.name &&
                  hall.stands.every(
                    (stand) => stand.type && stand.price && stand.availability
                  )
                )
              }) ? (
                <>
                  <label htmlFor="requiredRoles">Required Roles</label>
                  <RequiredRoles
                    sumStands={sumStands()}
                    halls={formValues.halls}
                    handleRolesChange={handleRolesChange}
                  />
                  {formValues.exhibitorRoles?.length > 0 ? (
                    <FairTickets
                      tickets={formValues.tickets}
                      onTicketsChange={handleTicketsChange}
                     
                    />
                  ) : null}
                </>
              ) : null}{" "}
            </>
          ) : null}
          <button type="submit" onClick={handleSubmit}>
            {" "}
            Submit
          </button>
        </form>
      </div>
    </>
  )
}

export default NewForm
