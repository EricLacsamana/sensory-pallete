// components/DefaultLayout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Access Redux state

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  console.log('test', user);
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="default-layout">
      {children} 
    </div>
  );
};

export default DefaultLayout;
