import { useUser } from "../context/UserContext"
import { useState } from "react"

import "../../public/stylesheets/profile.css"


const ProfileNav = ({view, setView}) => {
  const { user, setUser } = useUser()

  return (
    <>
      <div className="profile-nav">
        <h4>Profile</h4>
        {user.role === "Exhibitor" ? (
          <>
            <h4 onClick={()=>{setView("portfolio")}}>Portfolio</h4>
            <h4 onClick={()=>{setView("fairs")}}>Fairs</h4>
          </>
        ) : null}
        {user.role === "Attendee" ? (
          <>
            <h4 onClick={()=>{setView("tickets")}}>Tickets</h4>
          </>
        ) : null}
      </div>
    </>
  )
}

export default ProfileNav
