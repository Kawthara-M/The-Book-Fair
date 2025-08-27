import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"

const Authentication = () => {
  const [showSignUp, setShowSignUp] = useState(false)
  const [role, setRole] = useState("Attendee") 

  const navigate = useNavigate()

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    navigate("/auth/sign-up", { state: { role: selectedRole } })
  }

  return (
    <>
      {showSignUp ? (
        <SignIn setShowSignUp={setShowSignUp} role={role} />
      ) :  (
        <div className="authentication-wrapper">
          <h2>Access</h2>
          <div className="auth-options">
            <button className="authentication" onClick={() => handleRoleSelect("Attendee")}>
              As Attendee
            </button>
            <button className="authentication" onClick={() => handleRoleSelect("Exhibitor")}>
              As Exhibitor
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Authentication
