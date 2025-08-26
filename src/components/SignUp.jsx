import { useState, useEffect } from "react"
import { SignUpUser } from "../services/auth"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import validator from "validator"

import "../../public/styleSheets/auth.css"

const SignUp = ({ setShowSignUp }) => {
  let navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")

  const [countries, setCountries] = useState([])
  const [selectedCode, setSelectedCode] = useState("+973")

  const initialState = {
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  }

  const [formValues, setFormValues] = useState(initialState)

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }
  const validate = (value) => {
    if (
      validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setErrorMessage("")
    } else {
      setErrorMessage("Weak Password!")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    const fullPhoneNumber = `${selectedCode}${formValues.phone}`

    try {
      const payload = await SignUpUser({
        ...formValues,
        phone: fullPhoneNumber,
      })
      if (payload) {
        setFormValues(initialState)
        navigate("/auth/sign-in")
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get("https://restcountries.com/v3.1/all")
        const data = await res.json()

        const formatted = data
          .map((country) => {
            const code = country.idd?.root + (country.idd?.suffixes?.[0] || "")
            return {
              name: country.name.common,
              code: code || null,
            }
          })
          .filter((c) => c.code)
          .sort((a, b) => a.name.localeCompare(b.name))

        setCountries(formatted)
      } catch (err) {
        console.error("Failed to load country codes", err)
      }
    }

    fetchCountries()
  }, [])

  return (
    <div className="wrapper">
      <h2 className="form-title">Sign Up</h2>
      <div className="signUp-form">
        <form onSubmit={handleSubmit} className="sign-up">
          <div className="name-row">
            <label>
              Name
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={formValues.firstName}
                required
              />
            </label>
          </div>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="user@example.com"
            onChange={handleChange}
            value={formValues.email}
            required
            autoComplete="email"
          />
          <label htmlFor="phoneNumber">Phone Number</label>
          <div className="phone-input-wrapper">
            <select
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              required
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  +{country.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="0000 0000"
              onChange={handleChange}
              value={formValues.phone}
              required
            />
          </div>

          <div className="password-group">
            <div className="label-with-icon">
              <label htmlFor="password">Password</label>
              <span
                className={`tooltip-icon ${
                  errorMessage ? "tooltip-error" : ""
                }`}
                title="Password must be at least 8 characters, include upper & lowercase letters, a number, and a special character."
              >
                ?
              </span>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={(e) => {
                handleChange(e)
                validate(e.target.value)
              }}
              value={formValues.password}
              required
              autoComplete="off"
              className={errorMessage ? "input-error" : ""}
            />
            {errorMessage && <span className="error">{errorMessage}</span>}
          </div>

          <label htmlFor="confirmPassword">Comfirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            onChange={handleChange}
            value={formValues.confirmPassword}
            required
            autoComplete="off"
          />
          <button
            disabled={
              !formValues.name ||
              !formValues.email ||
              !formValues.phone ||
              !formValues.password ||
              !formValues.confirmPassword ||
              (!formValues.password &&
                formValues.password === formValues.confirmPassword)
            }
          >
            Sign Up
          </button>
        </form>
          {errorMessage && <span className="error">{errorMessage}</span>}

        <p id="switch">
          Already have an account?{" "}
          <button
            type="button"
            className="switch"
            onClick={() => setShowSignUp(false)}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignUp
