import React, { useState } from 'react'
import './signup.css'
import { Link, useNavigate } from 'react-router-dom'
import firebase from './firebase'


const Login = () => {
  
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const navigate = useNavigate()
   
  const submit = async(e) =>
  {
      e.preventDefault()
      try
      {
          const user = await firebase.auth().signInWithEmailAndPassword(email, pass)
          if (user)
          {
            
              alert("Login successfully")
              navigate("/FileManagement");
          }
      } 
      catch (error)
      {
          alert(error)
      }
  }
  return (
    <>
    <div className='main_container_signup'>
      <div className='header'>
        <h2>Login</h2>
      </div>

      <div className='box'>
        <input type='text' value={email} placeholder='E-mail' onChange={(e) => setEmail(e.target.value)}></input>
      </div>
      <div className='box'>
        <input type='password' value={pass} placeholder='Password' onChange={(e) => setPass(e.target.value)}></input>
      </div>
      <p>Don't have an Account <Link to="/signup">Create Account</Link></p>
      <button onClick={submit}>Login</button>
            
    </div>
    </>
  )
}

export default Login