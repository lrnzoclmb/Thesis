import { useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'; 
import ImageSlider from "./ImageSlider";
import NavBar from './NavBar';

const Homepage = () => {
  useEffect(() => {
 
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {

        const userId = user.uid;
        const userRef = firebase.database().ref('users/' + userId);
        userRef.once('value', snapshot => {
          const userData = snapshot.val();
          console.log(userData); 
        });
      } else {

        console.log('User is signed out');
      }
    });

    
    return () => unsubscribe();
  }, []);

  const slides = [
    { url: "http://localhost:3000/image-1.jpg", title: "beach" },
    { url: "http://localhost:3000/image-2.jpg", title: "boat" },
    { url: "http://localhost:3000/image-3.jpg", title: "forest" },
    { url: "http://localhost:3000/image-4.jpg", title: "city" },
    { url: "http://localhost:3000/image-5.jpg", title: "italy" },
  ];
  const containerStyles = {
    width: "500px",
    height: "280px",
    margin: "0 auto",
  };

  return (
    <>
      <NavBar />
      <div>
      <h1>Hello monsterlessons</h1>
      <div style={containerStyles}>
        <ImageSlider slides={slides} />
      </div>
    </div>
    
      <div>
        <button>Get started</button>
      </div>
    </>
  );
};

export default Homepage;