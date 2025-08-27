import { useState } from "react"
import { SignInUser } from "../services/auth"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"

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
       // console.log(user)
        navigate("/Home")
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="wrapper">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="sign-in">
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            id="email"
            type="email"
            name="email"
            placeholder="user@example.com"
            value={formValues.email}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={(e) => {
              handleChange(e)
            }}
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            required
          />
          {errorMessage === "" ? null : <span className="error">{errorMessage}</span>}
        </div>
        <button disabled={!formValues.email || !formValues.password}>
          Sign In
        </button>
      </form>
      <p id="otherAuth">
        Don't have an Account?
        <button
          className="switch"
          type="button"
          onClick={() => navigate("/auth/sign-up")}
        >
          Sign Up
        </button>
      </p>
    </div>
  )
}

export default SignIn
