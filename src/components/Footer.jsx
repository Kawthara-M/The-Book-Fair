import { useContext } from "react"
import { Link } from "react-router-dom"

import { ThemeContext } from "../context/ThemeContext"
import "../../public/stylesheets/footer.css"

const Footer = () => {
  const { toggleTheme, theme } = useContext(ThemeContext)

  return (
    <>
      <footer>
        <p>About Book Fair 2025</p>
        <p id="brand">© 2025 Book Fair</p>
      </footer>
    </>
  )
}
export default Footer
