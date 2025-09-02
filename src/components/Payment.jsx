import { useUser } from "../context/UserContext"
import { useState } from "react"
import User from "../services/api"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "../../public/stylesheets/payment.css"

const Payment = ({ bookedTicket, setView, fairName, newView }) => {
  const { user } = useUser()
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")

  const validate = () => {
    const newErrors = {}

    if (!form.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required"
    }

    const cleanedCardNumber = form.cardNumber.replace(/\s/g, "")

    if (!/^\d{16}$/.test(cleanedCardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits"
    }

    if (!form.expiry || !/^\d{4}-\d{2}$/.test(form.expiry)) {
      newErrors.expiry = "Expiry date is required"
    }

    if (!/^\d{3}$/.test(form.cvv)) {
      newErrors.cvv = "CVV must be 3 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "cardNumber") {
      const rawValue = value.replace(/\D/g, "")

      const formattedValue = rawValue.replace(/(.{4})/g, "$1 ").trim()

      setForm({ ...form, [name]: formattedValue })
      setErrors({ ...errors, [name]: "" })
    } else {
      setForm({ ...form, [name]: value })
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      try {
        const res = await User.put(`/tickets/update-status/${bookedTicket._id}`)
        setView(newView || "Tickets")
      } catch (error) {
        if (error.response) {
          const msg =
            error.response.data?.msg ||
            error.response.data?.error ||
            "Something went wrong. Please try again."
          setSubmitError(msg)
        } else {
          setSubmitError("Network error. Please check your connection.")
        }
      }
    }
  }

  return (
    <>
      <div>
        {bookedTicket ? (
          <>
            <div className="payment-details">
              <div className="payment-header">
                <h2>Checkout</h2>
                <h3>Ticket Type: {bookedTicket.type}</h3>
                <h3>Price: {bookedTicket.fee} BD</h3>
              </div>
              <form onSubmit={handleSubmit} noValidate>
                {submitError && (
                  <div className="submit-error">{submitError}</div>
                )}
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={form.cardName}
                    onChange={handleChange}
                  />
                  {errors.cardName && (
                    <small className="error">{errors.cardName}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    maxLength="19"
                    value={form.cardNumber}
                    onChange={handleChange}
                    inputMode="numeric"
                  />
                  {errors.cardNumber && (
                    <small className="error">{errors.cardNumber}</small>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <DatePicker
                      selected={form.expiryDate}
                      onChange={(date) => {
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        )
                        const year = date.getFullYear()
                        setForm({ ...form, expiry: `${year}-${month}` })
                      }}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      maxLength="3"
                      value={form.cvv}
                      onChange={handleChange}
                      inputMode="numeric"
                    />
                    {errors.cvv && (
                      <small className="error">{errors.cvv}</small>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" id="payment-button">
                    Pay Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setView(newView)}
                    id="later-button"
                  >
                    Pay Later
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}

export default Payment
