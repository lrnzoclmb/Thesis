import { useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'; 
import Carousel from "./Carousel";
import { countries } from "./Data";
import "./Homepage.css";
import NavBar from './NavBar';
import { Link } from 'react-router-dom';

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


  return (
    <>
      <NavBar />
      <div className="App">
      {/* Carousel */}
      <Carousel images={countries} />
      <button><Link to="/Filemanagement" className="start" >Get Started</Link></button>
    </div>
    </>
  );
};

export default Homepage;