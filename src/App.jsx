import { useState, useEffect } from "react"
import { CheckSession } from "./services/auth"
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AboutUs from "./pages/AboutUs"
import Authentication from "./pages/Authentication"
import Home from "./pages/Home" 
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
          <Route path="/about" element={<AboutUs/>} />
        </Routes>
      </main>
      <Footer/></div>
    </>
  )
}

export default App
