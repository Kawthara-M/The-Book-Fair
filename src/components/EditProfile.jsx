import { useState } from "react"
import validator from "validator"
import User from "../services/api"

const EditProfile = ({ profile, setProfile, setView }) => {
  const [formValues, setFormValues] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    oldPassword: "",
    newPassword: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const validateField = (name, value) => {
    let message = ""

    if (name === "newPassword") {
      if (
        value &&
        !validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        message = "Weak password!"
      }
    } else if (name === "phone") {
      if (!/^\d+$/.test(value)) {
        message = "Phone number should only contain digits!"
      }
    } else if (name === "confirmPassword") {
      if (value !== formValues.password) {
        message = "Passwords do not match!"
      }
    }

    setErrors((prev) => ({ ...prev, [name]: message }))
  }

  const handleSave = async () => {
    try {
      await User.put("/profile", formValues)

      setProfile((prev) => ({
        ...prev,
        name: formValues.name,
        phone: formValues.phone,
        email: formValues.email,
      }))

      setView("details")
    } catch (err) {
      console.error("Failed to update profile:", err)

      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Failed to update profile."

      setErrors((prev) => ({ ...prev, submit: errorMsg }))
    }
  }

  const handlePasswordUpdate = async () => {
    if (!formValues.oldPassword) {
      setErrors((prev) => ({
        ...prev,
        oldPassword: "Please enter current password.",
      }))
      return
    }
    if (!formValues.newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Please enter new password.",
      }))
      return
    }

    try {
      await User.put("/auth/update-password", {
        oldPassword: formValues.oldPassword,
        newPassword: formValues.newPassword,
      })

      setFormValues((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }))
      setErrors((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }))

      setView("details")
    } catch (err) {
      console.error("Failed to update password:", err)
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        "Failed to update password."

      setErrors((prev) => ({ ...prev, submit: errorMsg }))
    }
  }

  const isProfileValid =
    formValues.name &&
    formValues.phone &&
    formValues.email &&
    !errors.name &&
    !errors.phone &&
    !errors.email

  const isPasswordValid =
    formValues.oldPassword &&
    formValues.newPassword &&
    !errors.newPassword &&
    !errors.oldPassword

  return (
    <div className="edit-profile">
      <h1>Edit Profile</h1>

      <label>Name:</label>
      <input
        name="name"
        value={formValues.name}
        onChange={handleChange}
        required
      />

      <label>Phone:</label>
      <input
        name="phone"
        value={formValues.phone}
        onChange={handleChange}
        className={errors.phone ? "input-error" : ""}
        required
      />
      {errors.phone && <p className="error">{errors.phone}</p>}

      <label>Email:</label>
      <input
        name="email"
        type="email"
        value={formValues.email}
        onChange={handleChange}
        required
      />
      {errors.email && <p className="error">{errors.email}</p>}
      {errors.submit && <p className="error">{errors.submit}</p>}
      <button onClick={handleSave} disabled={!isProfileValid}>
        Save Changes
      </button>

      <h3>Change Password</h3>

      <label>Old Password:</label>
      <input
        type="password"
        name="oldPassword"
        value={formValues.oldPassword}
        onChange={handleChange}
        className={errors.oldPassword ? "input-error" : ""}
      />
      {errors.oldPassword && <p className="error">{errors.oldPassword}</p>}

      <label>New Password:</label>
      <input
        type="password"
        name="newPassword"
        value={formValues.newPassword}
        onChange={handleChange}
        className={errors.newPassword ? "input-error" : ""}
      />
      {errors.newPassword && <p className="error">{errors.newPassword}</p>}
      {errors.submit && <p className="error">{errors.submit}</p>}
      <div className="password-buttons">
        <button onClick={handlePasswordUpdate} disabled={!isPasswordValid}>
          Update Password
        </button>

        <button onClick={() => setView("details")}>Cancel</button>
      </div>
    </div>
  )
}

export default EditProfile
