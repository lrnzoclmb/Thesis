import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import NavBar from './NavBar'; 

function Account() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid;
        const userRef = firebase.database().ref(`userData/${uid}`);
        userRef.once('value').then(snapshot => {
          const userData = snapshot.val();
          setUserData(userData || {}); // Ensure userData is an object
          setLoading(false);
        }).catch(error => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
      } else {
        setUserData({});
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
    <NavBar />
    <div>
      <h1>Account Page</h1>
      {loading && <p>Loading...</p>}
      {!loading && Object.keys(userData).length > 0 && (
        <div>
          <p>User ID: {userData.uid}</p>
          <p>Name: {userData.firstName} {userData.lastName}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
    </div>
    </>
  );
}

export default Account;
