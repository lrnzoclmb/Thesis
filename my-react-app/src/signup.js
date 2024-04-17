import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import firebase from './firebase';
import 'typeface-montserrat';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [userBalance] = useState(0);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        // Check if password and confirm password match
        if (pass !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Create a new user with email and password
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, pass);
            const user = userCredential.user;

            // Update the user's profile with display name
            await user.updateProfile({
                displayName: `${firstName} ${lastName}`,
            });

            // Add user data to Realtime Database using the user's UID as the key
            await firebase.database().ref(`userData/${user.uid}`).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                balance: userBalance,
            });

            // Notify the user that the account was created successfully
            alert("Account created successfully");
            navigate("/");
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <div className='main_container_signup'>
                <img src="/logo192.png" alt="Picture" className="logo" />
                <div className='header'>
                    <h2>Signup</h2>
                </div>
                <div className='box'>
                    <input
                        type='text'
                        value={firstName}
                        placeholder='First Name'
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className='box'>
                    <input
                        type='text'
                        value={lastName}
                        placeholder='Last Name'
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className='box'>
                    <input
                        type='email'
                        value={email}
                        placeholder='E-mail'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='box'>
                    <input
                        type='password'
                        value={pass}
                        placeholder='Password'
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>
                <div className='box'>
                    <input
                        type='password'
                        value={confirmPass}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmPass(e.target.value)}
                    />
                </div>
                <p>
                    Already have an account? <Link to="/">Login Now</Link>
                </p>

                <button onClick={submit}>Signup</button>
            </div>
        </>
    );
};

export default Signup;
