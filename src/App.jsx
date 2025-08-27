import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AboutUs from "./pages/AboutUs"
import Authentication from "./pages/Authentication"
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import Home from "./pages/Home" 
import Profile from "./pages/Profile" 
import { useUser } from "./context/UserContext"
import "./App.css"

function App() {
  const { user, handleLogOut } = useUser()

  return (
    <>
    <div className='app-container'>
      <Navbar handleLogOut={handleLogOut} user={user}  />
      <main>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/auth" element={<Authentication/>} />
          <Route path="/auth/sign-in" element={<SignIn/>} />
          <Route path="/auth/sign-up" element={<SignUp/>} />
          <Route path="/about" element={<AboutUs/>} />
          <Route path={user ?`/profile/${user.id}`: '/auth'} element={user? <Profile/> : <Authentication />} />
        </Routes>
      </main>
      <Footer/></div>
    </>
  )
}

export default App
