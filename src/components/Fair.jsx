import { useUser } from "../context/UserContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Fair = ({ fair }) => {
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  const getButtonContent = (status) => {
    switch (status) {
      case "upcoming":
        return "Participate!"
      case "active":
        return "Book Tickets!"
      default:
        return null
    }
  }
  const getLoggedInButtonContent = () => {
    switch (user.role) {
      case "Admin":
        return "Stats!"
      case "Attendee":
        return "Book Tickets!"
      case "Exhibitor":
        return "Participate!"
      default:
        return null
    }
  }

  return (
    <>
      <div className="fair">
        <img src="#" alt={`${fair.name}`} id="fair-img"></img>
        <h3>{fair.name}</h3>
        <p>{fair.description}</p>
        {!user ? (
          <button
            onClick={() => {
              navigate("/auth/sign-up", { state: { role: user.role } })
            }}
          >
            {getButtonContent(fair.status)}
          </button>
        ) : (
          <button
            onClick={() => {
             
            }}
          >
            {getLoggedInButtonContent()}
          </button>
        )}
      </div>
    </>
  )
}

export default Fair
