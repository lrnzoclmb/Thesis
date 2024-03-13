import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'; 

function Account() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid;
        const userRef = firebase.database().ref('userData/' + uid);
        userRef.once('value').then(snapshot => {
          const userData = snapshot.val();
          setUserData(userData);
          setLoading(false); // Update loading state
        }).catch(error => {
          console.error("Error fetching user data:", error);
          setLoading(false); // Update loading state even in case of error
        });
      } else {
        setUserData(null);
        setLoading(false); // Update loading state if no user is signed in
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Account Page</h1>
      {loading && <p>Loading...</p>}
      {!loading && userData && (
        <div>
          <p>UID: {userData.uid}</p>
          <p>Name: {userData.firstName} {userData.lastName}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
    </div>
  );
}

export default Account;
