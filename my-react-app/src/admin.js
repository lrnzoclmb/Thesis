import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import 'typeface-montserrat';

const Admin = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async () => {
        setLoading(true);
        try {

            if (email === 'admin' && pass === 'admin123456') {
 
                navigate('/AdminPage');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='main_container_signup'>
                <img src="\logo192.png" alt="Picture" className="logo" />
                <div className='header'>
                    <h2>Admin Login</h2>
                </div>

                <div className='box'>
                    <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='User' />
                </div>
                <div className='box'>
                    <input type='password' value={pass} onChange={(e) => setPass(e.target.value)} placeholder='Password' />
                </div>
                <button onClick={submit}>
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        'Login'
                    )}
                </button>
                <p>Access to User Login <Link to="/">here.</Link></p>
            </div>
        </>
    );
};

export default Admin;
