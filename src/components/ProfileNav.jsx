import { useContext } from "react"
import { useUser } from "../context/UserContext"
import { ThemeContext } from "../context/ThemeContext"
import themeIcon from "../assets/themeIcon.png"
import "../../public/stylesheets/profile.css"

const ProfileNav = ({ view, setView }) => {
  const { user, setUser } = useUser()
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <>
      <div className="profile-nav">
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
                setView("fairs")
              }}
            >
              Fairs
            </h4>
          </>
        ) : null}
        {user.role === "Attendee" ? (
          <>
            <h4
              onClick={() => {
                setView("tickets")
              }}
            >
              Tickets
            </h4>
          </>
        ) : null}
        <h4>
          <button
            className="icon-btn"
            id="theme"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={toggleTheme}
          >
            <img src={themeIcon} alt="toggle theme" className="icon" />
          </button>
        </h4>
      </div>
    </>
  )
}

export default ProfileNav
