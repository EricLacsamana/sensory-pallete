import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { Outlet } from 'react-router-dom';

const AuthenticatedLayout = () => {
  const navigate = useNavigate(); 
  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
 
    if (!user) {
      navigate('/login'); 
    }
  }, [user, navigate]);

  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
