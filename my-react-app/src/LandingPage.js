import { useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'; 
import Carousel from "./Carousel";
import { countries } from "./Data";
import "./Homepage.css";
import LandingBar from './LandingBar';
import { useNavigate } from 'react-router-dom';
import 'typeface-montserrat';

const LandingPage = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/FileHome');
  };

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


  return (
    <>
      <LandingBar />
      <div className="App">
      {/* Carousel */}
      <Carousel images={countries} />
      <button onClick={handleClick} className="start">
      Get Started
    </button>
    </div>
    </>
  );
};

export default LandingPage;