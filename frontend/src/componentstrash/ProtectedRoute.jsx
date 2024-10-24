import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const ProtectedRoute = ({ component: Component }) => {
  const { authTokens } = useContext(AuthContext);

  return authTokens ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
