import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const AdminRoute = ({ component: Component }) => {
  const { authTokens, user } = useContext(AuthContext);

  return authTokens && user?.is_superuser ? <Component /> : <Navigate to="/login" />;
};

export default AdminRoute;
