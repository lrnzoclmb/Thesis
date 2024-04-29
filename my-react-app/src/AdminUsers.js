import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import AdminNavbar from './AdminNavbar';
import './accountpage.css';
import 'typeface-montserrat';
import { Link } from "react-router-dom";

function AdminUsers() { 
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = firebase.database().ref('userData');
                usersRef.on('value', (snapshot) => {
                    const usersData = snapshot.val();
                    const usersArray = usersData ? Object.values(usersData) : [];
                    setUsers(usersArray);
                });
            } catch (error) {
                console.error('Error fetching Users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <>
            <AdminNavbar />
            <div className='account-container'>
                <div className="account">
                    <h2>Users</h2>
                    <div className="history">
                        <p className="history-title">User Account List</p>
                        {users.length > 0 ? (
                            <div className="table-container">
                                <table className="transaction-table">
                                    <thead>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>User ID</th>
                                            <th>Email</th>
                                            <th>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index}>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>{user.userUID}</td>
                                                <td>{user.email}</td>
                                                <td>{user.balance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="no-users">No users available.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminUsers;
