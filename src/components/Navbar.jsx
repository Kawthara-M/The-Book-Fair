import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"

import userIcon from "../assets/userIcon.png"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import "../../public/stylesheets/navbar.css"

const Navbar = () => {
  const { user, setUser } = useUser()

  return (
    <>
      <nav className="topNav">
        <div className="topNav-left">
          <DotLottieReact
            className="books-animation"
            src="https://lottie.host/a74e21fb-5010-4f76-8705-128681aece65/A8nS4hYKQu.lottie"
            loop
            autoplay
          />
          <Link to="/" className="brand-logo">The Book Fair</Link>
          
        </div>

        <div className={`topNav-center`}>
          <Link to="/Home">Home</Link>
          <Link to="/fairs">Fairs</Link>
        </div>

        <div className="topNav-right">
          {user ? (
            <Link to={`/profile/${user.id}`} className="icon-btn" title="User">
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
