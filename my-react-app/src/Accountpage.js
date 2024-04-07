import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import NavBar from './NavBar';
import './accountpage.css';

function Accountpage({ userProfile }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          setName(user.displayName || '');
          setEmail(user.email);

          const userDataRef = firebase.database().ref('userData');
          userDataRef.once('value')
            .then(snapshot => {
              snapshot.forEach(childSnapshot => {
                const key = childSnapshot.key; 
                const balanceRef = userDataRef.child(key).child('balance'); 

                balanceRef.once('value')
                  .then(balanceSnapshot => {
                    const userBalance = balanceSnapshot.val();
                    setBalance(userBalance); 
                  })
                  .catch(error => {
                    console.error('Error fetching balance:', error);
                  });
              });
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
            });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserBalance();
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      
      navigate('/');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <>
      <NavBar />
      <div className="account">
        <div>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Balance: ₱{balance !== null ? balance : 'Loading...'}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default Accountpage;
