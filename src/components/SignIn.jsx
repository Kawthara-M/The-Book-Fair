import { useState } from "react"
import { SignInUser } from "../services/auth"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import login from "../assets/login.jpg"

import "../../public/stylesheets/auth.css"

const SignIn = () => {
  const { user, setUser } = useUser()
  let navigate = useNavigate()

  const initialState = { email: "", password: "" }
  const [errorMessage, setErrorMessage] = useState("")

  const [formValues, setFormValues] = useState(initialState)

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    try {
      const payload = await SignInUser(formValues)
      if (payload && payload.id) {
        setFormValues(initialState)
        setUser(payload)
        navigate("/Home")
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="authentication-card">
      <div className="illustration-panel">
        <img src={`${login}`} alt="Book Fair" />
      </div>
      <div className="sign-in-panel">
        <div className="welcome-back">
          <h2>Welcome Back</h2>
          <p>Fulfill your information to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="sign-in-form">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Your password"
            required
          />
          <p className="error">{errorMessage ? errorMessage : null}</p>

          <button type="submit">Login</button>
          <p onClick={() => navigate("/auth/")} className="switch">
            Don't have an Account? <strong>Sign Up</strong>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignIn
