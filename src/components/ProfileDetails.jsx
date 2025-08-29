import { useUser } from "../context/UserContext"
import { useEffect, useState } from "react"
import User from "../services/api"

const ProfileDetails = ({ view, setView }) => {
  const { user, setUser } = useUser()
  const [profile, setProfile] = useState(null)
  const [exhibitor, setExhibitor] = useState(null)
  const [portfolioFile, setPortfolioFile] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const response = await User.get("/profile")
      setExhibitor(response.data.exhibitor)
      setProfile(response.data.user)
    }
    getUser()
  }, [])

  const updateProfile = async () => {
    try {
      const formData = new FormData()
      formData.append("cr", exhibitor?.cr || "")
      formData.append("job", exhibitor?.job || "")

      if (portfolioFile) {
        formData.append("portfolio", portfolioFile)
      }

      await User.put("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setView("portfolio")
    } catch (err) {
      console.error("Error updating profile:", err)
    }
  }

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
          <>
            {" "}
            <div className="portfolio">
              <h5>C.R: {exhibitor?.cr}</h5>
              <h5>job: {exhibitor?.job}</h5>
              <h5>
                Portfolio:{" "}
                {exhibitor?.portfolio
                  ? (() => {
                      const fileName = exhibitor.portfolio
                        .split("/")
                        .pop()
                        .replace(/\+/g, " ") // we use pop because the name of the file itself is at the end, and replace +, because in urls sometimes space character is replaced with '+'
                      return decodeURIComponent(fileName) // used to convert chracters back to how they are if they get url encoded
                    })()
                  : "No portfolio uploaded"}
              </h5>
            </div>
            <button
              onClick={() => {
                setView("portfolio-edit")
              }}
            >
              {exhibitor.cr && exhibitor.job && exhibitor.portfolio
                ? "Update Profile"
                : "Complete Profile!"}
            </button>
          </>
        ) : null}
        {view === "portfolio-edit" ? (
          <div className="portfolio-edit">
            <label>
              C.R:
              <input
                type="text"
                value={exhibitor?.cr || ""}
                onChange={(e) =>
                  setExhibitor({ ...exhibitor, cr: e.target.value })
                }
              />
            </label>
            <label>
              Job:
              <input
                type="text"
                value={exhibitor?.job || ""}
                onChange={(e) =>
                  setExhibitor({ ...exhibitor, job: e.target.value })
                }
              />
            </label>
            <label>
              Portfolio (.pdf):
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPortfolioFile(e.target.files[0])}
              />
              {exhibitor?.portfolio && (
                <p>
                  Current file:{" "}
                  {decodeURIComponent(exhibitor.portfolio.split("/").pop())}
                </p>
              )}
            </label>
            <button onClick={updateProfile}>Save</button>
            <button onClick={() => setView("portfolio")}>Cancel</button>
          </div>
        ) : null}
        {
          view === "fairs"
          //show fairs of exhibitor
        }
        {
          view === "tickets"
          // show tickets of this user
        }
      </div>
    </>
  )
}

export default ProfileDetails
