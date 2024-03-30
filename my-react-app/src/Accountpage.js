import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import NavBar from './NavBar';

function Accountpage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState(null); // Initialize balance as null

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          setName(user.displayName || ''); // Set the user's name
          setEmail(user.email);

          // Reference to the userData node
          const userDataRef = firebase.database().ref('userData');

          // Fetch user data
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

    fetchUserBalance(); // Call fetchUserBalance function
  }, []); // Empty dependency array to run once on mount

  return (
    <>
      <NavBar />
      <div>
        <div>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Balance: {balance !== null ? balance : 'Loading...'}</p> {/* Display 'Loading...' while balance is being fetched */}
        </div>
      </div>
    </>
  );
}

export default Accountpage;
