import { useState, useEffect } from "react"
import { SignUpUser } from "../services/auth"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import validator from "validator"
import login from "../assets/login.jpg"

import "../../public/styleSheets/auth.css"

const SignUp = () => {
  let navigate = useNavigate()
  const location = useLocation()
  const roleFromState = location.state?.role 
  console.log(roleFromState)

  const [countries, setCountries] = useState([])
  const [selectedCode, setSelectedCode] = useState("+973")
  const [errors, setErrors] = useState({})

  const initialState = {
    name: "",
    email: "",
    phone: "",
    role: roleFromState,
    password: "",
    confirmPassword: "",
  }

  const [formValues, setFormValues] = useState(initialState)

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }
  const validate = (e) => {
    const { name, value } = e.target
    let message = ""

    if (name === "password") {
      if (
        !validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        message = "Weak Password!"
      }
    } else if (name === "phone") {
      if (!/^\d+$/.test(value)) {
        message = "Phone number should consist of digits only!"
      }
    } else if (name === "confirmPassword") {
      if (value !== formValues.password) {
        message = "Passwords do not match!"
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: message,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    const fullPhoneNumber = `${selectedCode.replace("+", "")}${formValues.phone}`

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
      const msg = error.message

      setErrors((prev) => ({
        ...prev,
        email: msg.includes("email") ? msg : "",
      }))
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,idd"
        )
        const data = res.data

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
        setErrorMessage("Loading country codes failed!")
      }
    }

    fetchCountries()
  }, [])

  return (
    <div className="authentication-card">
      <div className="illustration-panel">
        <img src={`${login}`} alt="Book Fair" />
      </div>
      <div className="form-panel">
      <a onClick={()=>navigate("/auth")}> ←</a> 
        <h2>Welcome . . .</h2>
        <p>
          Fulfill your information to continue as an{" "}
          <strong>{roleFromState}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="name-row">
            <label>
              Name
            </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={formValues.name}
                required
              />
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
          {errors.email && <p className="error">{errors.email}</p>}
          <label htmlFor="phoneNumber">Phone Number</label>
          <div className="phone-input-wrapper">
            <select
              className="phone-code"
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              required
            >
              {countries.map((country) => (
                <option
                  key={`${country.name}-${country.code}`}
                  value={country.code}
                >
                  {country.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="0000 0000"
              onChange={(e) => {
                handleChange(e)
                validate(e)
              }}
              value={formValues.phone}
              className={errors.phone ? "input-error" : ""}
              required
            />
          </div>
          {errors.phone && <p className="error">{errors.phone}</p>}

          <div className="password-group">
            <div className="label-with-icon">
              <label htmlFor="password">Password</label>
              <span
                className={`tooltip-icon ${
                  errors.password ? "tooltip-error" : ""
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
                validate(e)
              }}
              value={formValues.password}
              required
              autoComplete="off"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <p className="error">{errors.password}</p>}
            <label htmlFor="confirmPassword">Comfirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={(e) => {
                handleChange(e)
                validate(e)
              }}
              value={formValues.confirmPassword}
              required
              autoComplete="off"
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>
          {errors.submit && <p className="error">{errors.submit}</p>}

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
          <p onClick={() => navigate("/auth/sign-in")} className="switch">
            Has an account? <strong>Sign In</strong>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUp
