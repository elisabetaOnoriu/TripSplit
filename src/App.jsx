import React, { useEffect, useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CreateTrip from './Pages/CreateTrip/CreateTrip';
import MyProfile from './Pages/MyProfile/MyProfile';
import GenerateReports from './Pages/GenerateReports/GenerateReports';

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
        <Route path="/MyProfile" element={<MyProfile theme={theme}/>} />
        <Route path="/Notifications" element={<h1>Notifications</h1>} />
        <Route path="/MyTrips" element={<h1>My Trips</h1>} />
        <Route path="/CreateTrip" element={<CreateTrip/>} />
        <Route path="/MyContributions" element={<h1>My Contributions</h1>} />
        <Route path="/GenerateReport" element={<GenerateReports theme={theme} />} />
        <Route path="/TripHistory" element={<h1>Trip History</h1>} />
        <Route path="/ManageUsers_admin" element={<h1>Manage Users</h1>} />
        <Route path="/Settings" element={<h1>Settings</h1>} />
      </Routes>
      </div>
    </Router>
  )
}

export default App