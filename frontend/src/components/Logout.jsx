import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem("username");
    localStorage.removeItem("user");
  }, []);

  return <Navigate to="/login" />;
};

export default Logout;
