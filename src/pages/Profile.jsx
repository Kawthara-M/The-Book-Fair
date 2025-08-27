import { useUser } from "../context/UserContext"
import { useState } from "react"
import ProfileNav from "../components/profileNav"
import ProfileDetails from "../components/ProfileDetails"
import "../../public/stylesheets/profile.css"

const Profile = () => {
  const { user, setUser } = useUser()
  const [view, setView] = useState("details")

  return (
    <>
      <div className="profile-wrapper">
        <ProfileNav view={view} setView={setView}/>
        <ProfileDetails view={view} setView={setView}/>
        {user.role === "Admin" ? console.log("admin") : ""}
        {user.role === "Attendee" ? console.log("Attendee") : ""}
        {user.role === "Exhibitor" ? console.log("exhibitor") : ""}
      </div>
    </>
  )
}

export default Profile
