import { useUser } from "../context/UserContext"
import { useEffect, useState } from "react"
import User from "../services/api"

const ProfileDetails = ({ view, setView }) => {
  const { user, setUser } = useUser()
  const [profile, setProfile] = useState(null)
  const [portfolio, setPortfolio] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const response = await User.get("/profile")
      setProfile(response.data.user)
    }
    getUser()
  }, [])

  return (
    <>
      <div className="details-wrapper">
        {user.role === "Admin" ? (
          <>
            <div id="welcome">
              <h1>Admin,</h1> <h5> {profile ? profile.name : ""}</h5>
            </div>
          </>
        ) : (
          ""
        )}
        {user.role === "Attendee" ? (
          <>
            <div id="welcome">
              <h1> {profile ? profile.name : ""}</h1>
            </div>
          </>
        ) : (
          ""
        )}
        {user.role === "Exhibitor" ? (
          <>
            <div id="welcome">
              <h1>Exhibitor,</h1> <h5> {profile ? profile.name : ""}</h5>
            </div>
          </>
        ) : (
          ""
        )}
        {view === "details" ? (
          <div className="details">
            <h5>Phone: {profile ? profile.phone : ""}</h5>
            <h5>Email: {profile ? profile.email : ""}</h5>
            <h5>Password: {"*".repeat(10)}</h5>
          </div>
        ) : null}
        {view === "portfolio" ? (
          <div className="portfolio">
            <h5>meow: </h5>
            <h5>Email: </h5>
            <h5>Password: </h5>
          </div>
        ) : null}

        {/* <p>details</p> */}
      </div>
    </>
  )
}

export default ProfileDetails
