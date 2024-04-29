import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './signup';
import Login from './login';
import Homepage from './Homepage';
import FileManagement from './FileManagement';
import Accountpage from './Accountpage';
import Topup from './Topup';
import ChangePassword from './ChangePassword';
import Admin from './admin';
import AdminPage from './AdminPage';
import AdminUsers from './AdminUsers';
import 'typeface-montserrat';

const Rout = () => {
  const [userProfile, setUserProfile] = useState(null);

  const handleLogin = (profile) => {
    setUserProfile(profile);
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/admin" element={<Admin onLogin={handleLogin} />}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/Homepage" element={<Homepage />} />
      <Route path="/FileManagement" element={<FileManagement userProfile={userProfile} />}/>
      <Route path="/Topup" element={<Topup userProfile={userProfile} />}/>
      <Route path="/Accountpage" element={<Accountpage userProfile={userProfile} />} />
      <Route path="/ChangePassword" element={<ChangePassword userProfile={userProfile} />}/>
      <Route path="/AdminPage" element={<AdminPage userProfile={userProfile} />} />
      <Route path="/AdminUsers" element={<AdminUsers userProfile={userProfile} />} />
    </Routes>
  );
};

export default Rout;
