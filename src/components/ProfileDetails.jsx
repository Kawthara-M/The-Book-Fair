import { useUser } from "../context/UserContext"
import { useEffect, useState } from "react"
import Payment from "./Payment"
import User from "../services/api"
import EditProfile from "./EditProfile"
import BookedTicket from "./BookedTicket"
import Booking from "../components/Booking"

import editIcon from "../assets/edit.png"

const ProfileDetails = ({ view, setView }) => {
  const { user } = useUser()
  const [profile, setProfile] = useState(null)
  const [exhibitor, setExhibitor] = useState(null)
  const [portfolioFile, setPortfolioFile] = useState(null)
  const [tickets, setTickets] = useState(null)
  const [clickedTicket, setClickedTicket] = useState(null)
  const [bookings, setBookings] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const response = await User.get("/profile")
      setExhibitor(response.data.exhibitor)
      setProfile(response.data.user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const getTickets = async () => {
      const response = await User.get(`/tickets`)
      const filledTickets = []

      for (const ticket of response.data) {
        let fairId = ticket.fair._id
        const fairResponse = await User.get(`/fairs/${fairId}`)
        const fair = fairResponse.data
        const detailedTicket = fair.tickets.find((t) => t.type === ticket.type)

        filledTickets.push({
          ...detailedTicket,
          ...ticket,
          fairId: fair._id,
          fairName: fair.name,
        })
      }
      setTickets(filledTickets)
    }

    const getBookings = async () => {
      const response = await User.get(`/bookings/exhibitor-bookings`)
      setBookings(response.data)
    }

    if (view === "Profile-Tickets") {
      getTickets()
    } else if (view === "bookings") {
      getBookings()
    }
  }, [view])

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
  const removeTicket = (ticketId) => {
    setTickets((prev) => prev.filter((t) => t._id !== ticketId))
  }
  const removeBooking = (bookingId) => {
    setBookings((prev) => prev.filter((b) => b._id !== bookingId))
  }

  return (
    <>
      {user.role ? (
        <div className="details-wrapper">
          {user && view === "details" ? (
            <>
              <div id="welcome">
                <div>
                  <h1>
                    <>
                      {(user.role === "Admin" || user.role === "Exhibitor") &&
                        `${user.role} `}
                      {profile?.name || ""}
                    </>
                  </h1>
                </div>
                <button
                  onClick={() => setView("edit-profile")}
                  className="icon-btn"
                >
                  <img src={editIcon} alt="edit profile" className="icon" />
                </button>
              </div>
            </>
          ) : null}

          {view === "details" ? (
            <div className="details">
              <div className="info-wrapper">
                {" "}
                <h4>Phone: </h4> <p>{profile ? profile.phone : ""}</p>
              </div>
              <div className="info-wrapper">
                {" "}
                <h4>Email: </h4>
                <p>{profile ? profile.email : ""}</p>
              </div>
              <div className="info-wrapper">
                <h4>Password: </h4>
                <p>{"*".repeat(10)}</p>
              </div>
            </div>
          ) : null}

          {view === "portfolio" ? (
            <>
              {" "}
              <div className="portfolio">
                <h2>Exhibitor Information</h2>
                <div className="info-wrapper">
                  <h4>C.R: </h4> <p>{exhibitor?.cr}</p>
                </div>
                <div className="info-wrapper">
                  <h4>Job: </h4> <p>{exhibitor?.job}</p>
                </div>
                <h4>
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
                </h4>
              </div>
              <div className="center-wrapper">
                <button
                  className="portfolio-button"
                  onClick={() => {
                    setView("portfolio-edit")
                  }}
                >
                  {exhibitor.cr && exhibitor.job && exhibitor.portfolio
                    ? "Update Profile"
                    : "Complete Profile"}
                </button>
              </div>
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
              <div className="custom-file-upload">
                <label htmlFor="portfolio-upload" className="upload-button">
                  Upload Portfolio (.pdf)
                </label>
                <input
                  id="portfolio-upload"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPortfolioFile(e.target.files[0])}
                />
                {portfolioFile && (
                  <p className="file-name">{portfolioFile.name}</p>
                )}
              </div>
              <div className="update-buttons">
                <button onClick={updateProfile}>Save</button>
                <button onClick={() => setView("portfolio")}>Cancel</button>
              </div>
            </div>
          ) : null}
          {view === "edit-profile" ? (
            <EditProfile
              profile={profile}
              setProfile={setProfile}
              setView={setView}
            />
          ) : null}
          {view === "bookings" ? (
            bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <Booking
                  key={booking._id}
                  removeBooking={removeBooking}
                  booking={booking}
                />
              ))
            ) : (
              <div className="not-found">
                <p>No Bookings.</p>
              </div>
            )
          ) : null}

          {view === "Profile-Tickets" ? (
            tickets && tickets.length > 0 ? (
              tickets.map((ticket) => (
                <BookedTicket
                  key={ticket._id}
                  ticket={ticket}
                  removeTicket={removeTicket}
                  setView={setView}
                  setClickedTicket={setClickedTicket}
                />
              ))
            ) : (
              <div className="not-found">
                {" "}
                <p>No Tickets Booked.</p>{" "}
              </div>
            )
          ) : null}
          {view === "payment" ? (
            <Payment
              bookedTicket={clickedTicket}
              fairName={clickedTicket.fairName}
              setView={setView}
              newView={"Profile-Tickets"}
            />
          ) : null}
        </div>
      ) : (
        <>
        {console.log("Iam here")}
        <span clasName="loader"></span> </>
      )}
    </>
  )
}

export default ProfileDetails
