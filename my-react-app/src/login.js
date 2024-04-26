import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from './firebase';
import './signup.css';
import 'typeface-montserrat';

const Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false); // State for controlling loading spinner
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); // Show loading spinner

            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, pass);
            if (userCredential.user) {
                const user = userCredential.user;
                const userProfile = {
                    uid: user.uid,
                    email: user.email,
                };
                navigate('/Homepage', { state: { userProfile } });
                alert('Login successful'); // Display alert box for successful login
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    return (
        <>
            <div className='main_container_signup'>
                <img src="\logo192.png" alt="Picture" className="logo" />
                <div className='header'>
                    <h2>Login</h2>
                </div>

                <div className='box'>
                    <input type='text' value={email} placeholder='E-mail' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='box'>
                    <input type='password' value={pass} placeholder='Password' onChange={(e) => setPass(e.target.value)} />
                </div>
                <p>Don't have an Account <Link to="/signup">Create Account</Link></p>
                <button onClick={submit}>
                    {loading ? ( // Show spinner if loading is true
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        'Login'
                    )}
                </button>
            </div>
        </>
    );
};

export default Login;
