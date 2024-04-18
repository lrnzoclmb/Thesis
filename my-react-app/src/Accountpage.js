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
                    <div className="profile">
                        <div className="profile-info">
                            <p className='name'>{name}</p>
                            <p className='email'>{email}</p>
                            <p className='balance'>Balance: ₱{balance !== null ? balance : 'Loading...'}</p>
                            <p className='topup'>Insufficient balance? Add funds <Link to="/Topup">here.</Link></p>
                            <div className='button-container'>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    </div>
    <div className="history">
    <p className="history-title">Transaction History</p>
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
