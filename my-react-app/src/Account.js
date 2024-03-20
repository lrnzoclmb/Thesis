import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'; 
import NavBar from './NavBar';

function Account() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid;
        const userRef = firebase.database().ref('userData/' + uid);
        userRef.once('value').then(snapshot => {
          const userData = snapshot.val();
          setUserData(userData);
 
        }).catch(error => {
          console.error("Error fetching user data:", error);
        });
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
    <NavBar />
    <div>
      <h1>Account Page</h1>
 
        <div>
          <p>UID: {userData.uid}</p>
          <p>Name: {userData.firstName} {userData.lastName}</p>
          <p>Email: {userData.email}</p>
        </div>
  
    </div>
    </>
  );
}

export default Account;
