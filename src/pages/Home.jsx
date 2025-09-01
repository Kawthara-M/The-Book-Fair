import "../../public/stylesheets/Home.css"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()
  return (
    <>
      <section className="hero-section section">
        <div className="container">
          <h1 className="hero-heading">
            Discover Book Fairs That Celebrate Ideas, Culture, and Creativity
          </h1>
          <p className="hero-subheading">
            Join us in exploring events that bring communities together.
          </p>
          <div className="hero-buttons">
            <a  className="btn" onClick={()=>{navigate("/fairs")}}>
              View Upcoming Fairs
            </a>
            <a onClick={()=>{navigate("/fairs")}} className="btn secondary">
              Get Involved
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
