import React, { useState } from 'react'
import './signup.css'
import { Link, useNavigate } from 'react-router-dom'
import firebase from './firebase'
import 'typeface-montserrat';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Signup = () => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [ userbalance ] = useState(0);
  const navigate = useNavigate()

  const submit = async(e) =>
  {
      e.preventDefault()
      try
      {
          const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, pass)
          const user = userCredential.user;

          await user.updateProfile({
              displayName: `${firstName} ${lastName}`
          });

          // Add user data to Realtime Database
          await firebase.database().ref('userData').push({
              uid: user.uid,
              firstName: firstName,
              lastName: lastName,
              email: email,
              balance: userbalance,
          });

          alert("Account Created successfully")
          navigate("/");
      } 
      catch (error)
      {
          alert(error)
      }
  }
  return (
    <>
    
    <div className='main_container_signup'>
    <img src="\logo192.png" alt="Picture" className="logo" />
      <div className='header'>
        <h2>Signup</h2>
      </div>
      <div className='box'>
        <input type='text' value={firstName} placeholder='First Name' onChange={(e) => setFirstName(e.target.value)}></input>
      </div>
      <div className='box'>
        <input type='text' value={lastName} placeholder='Last Name' onChange={(e) => setLastName(e.target.value)}></input>
      </div>
      <div className='box'>
        <input type='email' value={email} placeholder='E-mail' onChange={(e) => setEmail(e.target.value)}></input>
      </div>
      <div className='box'>
        <input type='password' value={pass} placeholder='Password' onChange={(e) => setPass(e.target.value)}></input>
      </div>
      <p>Already have an Account <Link to="/">Login Now</Link></p>
      
      <button onClick={submit}>Signup</button>
      
    </div>
    
    </>
  )
}

export default Signup