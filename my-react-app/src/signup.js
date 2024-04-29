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
    const [wantRFID, setWantRFID] = useState('yes'); // State for RFID account preference
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        if (pass !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);

            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, pass);
            const user = userCredential.user;

            await user.updateProfile({
                displayName: `${firstName} ${lastName}`,
            });

            await firebase.database().ref(`userData/${user.uid}`).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                balance: userBalance,
                userUID: user.uid,
                wantRFID: wantRFID // Include RFID preference
            });

            alert("Account created successfully");
            navigate("/");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
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
                <div className='checkbox-container'>
                    <label>Do you want your student ID to have an account?</label>
                    <input
                        type="radio"
                        value="yes"
                        checked={wantRFID === 'yes'}
                        onChange={() => setWantRFID('yes')}
                    />
                    <label>Yes</label>
                    <input
                        type="radio"
                        value="no"
                        checked={wantRFID === 'no'}
                        onChange={() => setWantRFID('no')}
                    />
                    <label>No</label>
                </div>


                <p>
                    Already have an account? <Link to="/">Login Now</Link>
                </p>

                <button onClick={submit}>
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        'Signup'
                    )}
                </button>
            </div>
        </>
    );
};

export default Signup;
