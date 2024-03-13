import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './signup';
import Login from './login';
import Homepage from './Homepage';
import FileManagement from './FileManagement';
import Account from './Account';

const Rout = () => {
  const [userProfile, setUserProfile] = useState(null);

  const handleLogin = (profile) => {
    setUserProfile(profile);
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/Homepage" element={<Homepage />} />
      <Route
        path="/FileManagement"
        element={<FileManagement userProfile={userProfile} />}
      />
      <Route path="/Account" element={<Account userProfile={userProfile} />} />
    </Routes>
  );
};

export default Rout;
