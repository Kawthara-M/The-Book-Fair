import { Link } from "react-router-dom"
import { useContext } from "react"
import { useUser } from "../context/UserContext"
import { ThemeContext } from "../context/ThemeContext"
import themeIcon from "../assets/themeIcon.png"
import userIcon from "../assets/userIcon.png"

import "../../public/stylesheets/navbar.css"

const Navbar = () => {
  const { user, setUser } = useUser()
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <>
        <nav className="topNav">
          <div className="topNav-left">
            <Link to="/" className="brand-logo">
              The Book Fair
            </Link>
          </div>

          <div className={`topNav-center`}>
            <Link to="/Home">Home</Link>
            <Link to="/fairs">Fairs</Link>
          </div>

          <div className="topNav-right">
            <button
              className="icon-btn"
              id="theme"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              onClick={toggleTheme}
            >
              <img src={themeIcon} alt="toggle theme" className="icon" />
            </button>

            {user ? (
              <Link
                to={`/profile/${user.id}`}
                className="icon-btn"
                title="User"
              >
                <img src={userIcon} alt="user icon" className="icon" />
              </Link>
            ) : (
              <Link to={`/auth`} className="icon-btn" title="User">
                <img src={userIcon} alt="user icon" className="icon" />
              </Link>
            )}
          </div>
        </nav>

    </>
  )
}

export default Navbar
