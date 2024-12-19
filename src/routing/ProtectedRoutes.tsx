import React from 'react';
import useAuthenticated from '../hooks/useAuthenticated';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';

const ProtectedRoutes: React.FC = () => {
  const authenticated = useAuthenticated();

  if (!authenticated) {
    return <Navigate to='/login' />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedRoutes;
