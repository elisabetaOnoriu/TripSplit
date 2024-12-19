import React, { useEffect, useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import CreateTrip from './Pages/CreateTrip/CreateTrip';
import MyProfile from './Pages/MyProfile/MyProfile';
import GenerateReports from './Pages/GenerateReports/GenerateReports';
import Welcome from './Components/Welcome/Welcome';
import Register from './Components/Register/Register'; 
import Login from './Components/Login/Login';
import Home from './Pages/Home/Home';
import MyTrips from './Pages/MyTrips/MyTrips';

const App = () => {

  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  return (
    <Router>
      <AppRoutes theme={theme} setTheme={setTheme} />
    </Router>
  );
}

const AppRoutes = ({ theme, setTheme }) => {
  const location = useLocation(); 

  const showNavbar = !['/', '/register', '/login'].includes(location.pathname);

  return (
    <div className={`container ${theme}`}>
      {showNavbar && <Navbar theme={theme} setTheme={setTheme} />}
      <Routes>
        <Route path="/" element={<Welcome theme={theme} setTheme={setTheme} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/MyProfile" element={<MyProfile theme={theme} />} />
        <Route path="/Notifications" element={<h1>Notifications</h1>} />
        <Route path="/MyTrips" element={<MyTrips/>} />
        <Route path="/CreateTrip" element={<CreateTrip />} />
        <Route path="/GenerateReport" element={<GenerateReports theme={theme} />} />
        <Route path="/ManageUsers_admin" element={<h1>Manage Users</h1>} />

      </Routes>
    </div>
  );
}

export default App;
