import { useContext } from "react"
import { useUser } from "../context/UserContext"
import { ThemeContext } from "../context/ThemeContext"
import themeIcon from "../assets/themeIcon.png"
import logoutIcon from "../assets/logout.png"
import "../../public/stylesheets/profile.css"

const ProfileNav = ({ setView }) => {
  const { user, handleLogOut } = useUser()
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <>
      <div className="profile-nav">
        <div></div>
        <div>
          {" "}
          <h4
            onClick={() => {
              setView("details")
            }}
          >
            Profile
          </h4>
          {user.role === "Exhibitor" ? (
            <>
              <h4
                onClick={() => {
                  setView("portfolio")
                }}
              >
                Portfolio
              </h4>
              <h4
                onClick={() => {
                  setView("bookings")
                }}
              >
                Bookings
              </h4>
            </>
          ) : user.role === "Attendee" ? (
            <>
              <h4
                onClick={() => {
                  setView("Profile-Tickets")
                }}
              >
                Tickets
              </h4>
            </>
          ) : null}
        </div>
        <div className="profile-buttons">
          <button
            className="icon-btn"
            id="theme"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={toggleTheme}
          >
            <img src={themeIcon} alt="toggle theme" className="icon" />
          </button>

          <button onClick={() => handleLogOut()} className="icon-btn">
            <img src={logoutIcon} alt="Logout" className="icon" />
          </button>
        </div>
      </div>
    </>
  )
}

export default ProfileNav
