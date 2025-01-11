import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateTrip from './Pages/CreateTrip/CreateTrip';
import MyProfile from './Pages/MyProfile/MyProfile';
import Welcome from './Components/Welcome/Welcome';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Home from './Pages/Home/Home';
import MyTrips from './Pages/MyTrips/MyTrips';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import { useAppSelector } from './features/store';
import GuestRoutes from './routing/GuestRoutes';
import ProtectedRoutes from './routing/ProtectedRoutes';
import EmailReset from './Components/EmailReset/EmailReset';
import AdminPage from './Pages/AdminPage/AdminPage';
import AccountValidated from './Components/AccountValidated';
import Notifications from './Pages/Notifications/Notifications'; 
import InviteFriend from './Pages/InviteFriend/InviteFriend';
import About from './Pages/About/About';
import TripPage from './Pages/TripPage/TripPage';
import Contact from './Pages/Contact/Contact';

const App = () => {
  const theme = useAppSelector(state => state.theme.theme);

  return (
    <div className={`container ${theme}`}>
      <Router>
        <Routes>
          <Route element={<GuestRoutes />}>
            <Route path='/' element={<Welcome />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/ResetPassword' element={<ResetPassword />} />
            <Route path="/EmailReset" element={<EmailReset />} />
            <Route path='/AccountValidated' element={<AccountValidated />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path='/Home' element={<Home />} />
            <Route path='/MyProfile' element={<MyProfile />} />
            <Route path='/Notifications' element={<Notifications />} /> {/* Updated */}
            <Route path='/MyTrips' element={<MyTrips />} />
            <Route path='/CreateTrip' element={<CreateTrip />} />
            <Route path='/ManageUsers_admin' element={<h1>Manage Users</h1>} />
            <Route path="/invite/:tripId" element={<InviteFriend />} />
            <Route path='/AdminPage' element={<AdminPage />} />
            <Route path='/About' element={<About />} />
            <Route path='/TripPage' element={<TripPage />} />
            <Route path='/Contact' element={<Contact />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;