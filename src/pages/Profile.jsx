import { useUser } from "../context/UserContext"
import { useState } from "react"
import ProfileNav from "../components/ProfileNav"
import ProfileDetails from "../components/ProfileDetails"
import "../../public/stylesheets/profile.css"

const Profile = () => {
  const [view, setView] = useState("details")

  return (
    <>
      <div className="profile-wrapper">
        <ProfileNav view={view} setView={setView}/>
        <ProfileDetails view={view} setView={setView}/>
      </div>
    </>
  )
}

export default Profile
