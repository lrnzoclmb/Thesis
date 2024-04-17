import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import NavBar from './NavBar';
import './accountpage.css';
import 'typeface-montserrat';
import { Link } from "react-router-dom";

function Accountpage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          // Set name and email
          setName(user.displayName || '');
          setEmail(user.email);
          
          // Access the user's data in the Realtime Database using UID
          const userDataRef = firebase.database().ref(`userData/${user.uid}`);
          const balanceRef = userDataRef.child('balance');

          // Fetch user's balance
          const balanceSnapshot = await balanceRef.once('value');
          const userBalance = balanceSnapshot.val();
          setBalance(userBalance);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <>
      <NavBar />
      <div className='account-container'>
        <div className="account">
          <div className="profile">
            <img src="\profile.jpg" alt="Picture" className="profile-picture" />
            <div className="profile-info">
              <p className='name'>{name}</p>
              <p className='email'>{email}</p>
              <p className='balance'>Balance: ₱{balance !== null ? balance : 'Loading...'}</p>
              <p className='topup'>Insufficient balance? Add funds <Link to="/Topup">here.</Link></p>
              <div className='button-container'>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
          <div className='history'>
            <p>Transaction History</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Accountpage;
