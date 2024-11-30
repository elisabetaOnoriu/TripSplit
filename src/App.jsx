import React, { useEffect, useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {

  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');
  const [profileImage, setProfileImage] = useState(null);
  const handleLogin = () => {
    
  }
  useEffect(() => {
    localStorage.setItem('current_theme', theme)
  }, [theme])

  return (
    <Router>
      <div className = {`container ${theme}`}>
       <Navbar theme = {theme} setTheme = {setTheme}/>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/profile" element={<h1>Profile</h1>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App