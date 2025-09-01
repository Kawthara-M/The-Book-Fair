import "../../public/stylesheets/Home.css"
import { useNavigate } from "react-router-dom"
// import { DotLottieReact } from "@lottiefiles/dotlottie-react"
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
            <a
              className="btn"
              onClick={() => {
                navigate("/fairs")
              }}
            >
              View Upcoming Fairs
            </a>
            <a
              onClick={() => {
                navigate("/fairs")
              }}
              className="btn secondary"
            >
              Get Involved
            </a>
          </div>
        </div>
      </section>

      {/* <DotLottieReact
      src="https://lottie.host/44585f85-6ff4-42c4-af8a-06f11b3cf601/Q6yXY3LTES.lottie"
      loop
      autoplay
    /> */}
    </>
  )
}

export default Home
