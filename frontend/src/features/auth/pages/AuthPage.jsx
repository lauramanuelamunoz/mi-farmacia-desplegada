import React from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';



const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return isLogin ? <Login /> : <Register />;
};

export default AuthPage;