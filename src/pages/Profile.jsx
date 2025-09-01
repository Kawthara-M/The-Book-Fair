import { useUser } from "../context/UserContext"
import { useState } from "react"
import ProfileNav from "../components/ProfileNav"
import ProfileDetails from "../components/ProfileDetails"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

import "../../public/stylesheets/profile.css"

const Profile = () => {
  const [view, setView] = useState("details")
  const { user } = useUser()

  return (
    <>
      {user ? (
        <div className="profile-wrapper">
          <ProfileNav view={view} setView={setView} />
          <ProfileDetails view={view} setView={setView} />
        </div>
      ) : (
        <DotLottieReact src="path/to/animation.lottie" loop autoplay />
      )}
    </>
  )
}

export default Profile
