import React from 'react';
import useAuthenticated from '../hooks/useAuthenticated';
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoutes: React.FC = () => {
  const authenticated = useAuthenticated();

  if (authenticated) {
    return <Navigate to='/home' />;
  }

  return <Outlet />;
};

export default GuestRoutes;
