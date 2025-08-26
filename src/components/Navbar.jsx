import { Link } from "react-router-dom"
import { useState } from "react"
import { useUser } from "../context/UserContext"
import userIcon from "../assets/userIcon.png"

import "../../public/stylesheets/navbar.css"

const Navbar = () => {
  const { user, setUser } = useUser()

  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div className="top-wrapper">
        <nav className="topNav">
          <div className="topNav-left">
            <button className="toggleBtn" onClick={toggleMenu}>
              ☰
            </button>
          </div>

          <div className={`topNav-center ${isOpen ? "hide-on-mobile" : ""}`}>
            <Link to="/" className="brand-logo">
              Book Fair
            </Link>
          </div>

          <div className="topNav-right">
            {user? (
              <Link
                to={`/profile/${user.id}`}
                className="icon-btn"
                title="User"
              >
                <img src={userIcon} alt="user icon" className="icon" />
              </Link>
            ) : (
              <span
                className="icon-btn disabled-link"
                title="Sign in to view profile"
              >
                <img src={userIcon} alt="user icon" className="icon" />
              </span>
            )}
          </div>
        </nav>

        <nav className="pages-navbar desktop-navbar">
          <Link to="/Home">Home</Link>
          <Link to="/fairs">Fairs</Link>
        </nav>

        <div className={`sideNav ${isOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <Link to="/" className="brand-logo-mobile" onClick={closeMenu}>
              Fair
            </Link>
          </div>
          <nav className="pages-navbar side-navbar-links">
            <Link to="/jewelry" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/jewelry/rings" onClick={closeMenu}>
              Rings
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Navbar
