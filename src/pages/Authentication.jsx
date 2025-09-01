import { useNavigate } from "react-router-dom"
import login from "../assets/login.jpg"

const Authentication = () => {
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    navigate("/auth/sign-up", { state: { role } })
  }

  return (
    <>
      <div className="authentication-card">
        <div className="illustration-panel">
          <img src={`${login}`} alt="Book Fair" />
        </div>
        <div className="form-panel">
          <h2>Sign Up</h2>
          <p>How would you like to access?</p>
          <div className="auth-options">
            <div>
              <button
                type="submit"
                className="authentication"
                onClick={() => handleRoleSelect("Attendee")}
              >
                As Attendee
              </button>
              <button
                type="submit"
                className="authentication"
                onClick={() => handleRoleSelect("Exhibitor")}
              >
                As Exhibitor
              </button>
            </div>
          </div>
          <div className="center-wrapper">
            {" "}
            <a onClick={()=>{navigate("/auth/sign-in")}}>Already has an Account? Sign In</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Authentication
