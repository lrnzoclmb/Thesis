import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import NavBar from './NavBar';
import './accountpage.css';
import 'typeface-montserrat';
import { Link } from "react-router-dom";

function Accountpage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [balance, setBalance] = useState(null)  ;
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = firebase.auth().currentUser;
                if (user) {
                    setName(user.displayName || '');
                    setEmail(user.email);

                    const userDataRef = firebase.database().ref(`userData/${user.uid}`);
                    const balanceRef = userDataRef.child('balance');

                    const balanceSnapshot = await balanceRef.once('value');
                    const userBalance = balanceSnapshot.val();
                    setBalance(userBalance);

                    const userTransactionHistoryRef = firebase.database().ref(`transactionHistory/${user.uid}`);
                    userTransactionHistoryRef.on('value', (snapshot) => {
                        const transactionsData = snapshot.val();
                        const transactionsArray = transactionsData ? Object.values(transactionsData) : [];
                        setTransactions(transactionsArray);
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        firebase.auth().signOut()
            .then(() => {
                navigate('/');
            })
            .catch(error => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <>
            <NavBar />
            <div className='account-container'>
                <div className="account">
                    <h2>Account Profile</h2>
                    <div className="profile">
                        <div className="profile-info">
                            <p className='name'>{name}</p>
                            <p className='email'>{email}</p>
                            <p className='balance'>Balance: ₱{balance !== null ? balance : 'Loading...'}</p>
                            <p className='topup'>Insufficient balance? Add funds <Link to="/Topup">here.</Link></p>
                            <div className='button-container'>
                            <Link to="/ChangePassword">
                                <button className="btn-change-password" aria-label="Change Password">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                  </svg> Change Password
                                </button>
                            </Link>
                                <button className="button-logout" onClick={handleLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                    </svg> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                <div className="history">
                    <p className="history-title">File Upload History</p>
                    {transactions.length > 0 ? (
                    <div className="table-container"> { }
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>File Name</th>
                                    <th>Pages</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => (
                                 <tr key={index}>
                            <td>{transaction.timestamp}</td>
                            <td>{transaction.name}</td>
                            <td>{transaction.totalPages}</td>
                            <td>₱{transaction.totalPrice}</td>
                            <td>{transaction.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <p className="no-history">No transaction history available.</p>
    )}
</div>

                </div>
            </div>
        </>
    );
}

export default Accountpage;
