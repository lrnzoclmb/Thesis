import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import AdminNavbar from './AdminNavbar';
import './accountpage.css';
import 'typeface-montserrat';

function AdminPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [lowShortPaperWarning, setLowShortPaperWarning] = useState(false);
  const [lowLongPaperWarning, setLowLongPaperWarning] = useState(false);
  const [outOfPaperShortWarning, setOutOfPaperShortWarning] = useState(false);
  const [outOfPaperLongWarning, setOutOfPaperLongWarning] = useState(false);

  const fetchTransactions = async () => {
    try {
      const transactionsRef = firebase.database().ref('transaction');
      const snapshot = await transactionsRef.once('value');
      const transactionsData = snapshot.val();
      const transactionsArray = transactionsData ? Object.values(transactionsData) : [];
      setTransactions(transactionsArray);

      let shortPages = 0;
      let longPages = 0;

      transactionsArray.forEach((transaction) => {
        if (transaction.papersize === 'short') {
          shortPages += transaction.totalPages || 0;
        } else if (transaction.papersize === 'long') {
          longPages += transaction.totalPages || 0;
        }
      });

      const shortPaperWarning = shortPages >= 40 && shortPages <= 49;
      const longPaperWarning = longPages >= 40 && longPages <= 49;
      const outOfShortPaper = shortPages > 50;
      const outOfLongPaper = longPages > 50;

      setLowShortPaperWarning(shortPaperWarning);
      setLowLongPaperWarning(longPaperWarning);
      setOutOfPaperShortWarning(outOfShortPaper);
      setOutOfPaperLongWarning(outOfLongPaper);

    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut()
        .then(() => {
            navigate('/login');
        })
        .catch(error => {
            console.error('Error signing out:', error);
        });
};

  return (
    <>
      <AdminNavbar />
      <div className='account-container'>
        <div className="account">
          <h2>Transactions</h2>
          {lowShortPaperWarning && (
            <div className="warning">
              <p>Low paper warning for short paper size <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16" style={{ color: 'yellow' }}>
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg></p>
            </div>
          )}
          {lowLongPaperWarning && (
            <div className="warning">
<div className="warning">
  <p>
    Low paper warning for long paper size <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16" style={{ color: 'yellow' }}>
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg>
  </p>
</div>

            </div>
          )}
          {outOfPaperShortWarning && (
            <div className="warning">
              <p>Out of short paper warning, please add paper.  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16" style={{ color: 'red' }}>
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg></p>
            </div>
          )}
          {outOfPaperLongWarning && (
            <div className="warning">
              <p>Out of long paper warning, please add paper.  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16" style={{ color: 'red' }}>
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg></p>
            </div>
          )}
          <div className='button-container'>
                                <button className="button-logout" onClick={handleLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                    </svg> Logout
                                </button>
                            </div>
          <div className="history">
            <p className="history-title">Transaction History</p>
            {transactions.length > 0 ? (
              <div className="table-container">
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Transaction Name</th>
                      <th>UserID</th>
                      <th>ColorType</th>
                      <th>PaperSize</th>
                      <th>PaymentType</th>
                      <th>TotalPages</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>{transaction.timestamp || '-'}</td>
                        <td>{transaction.name || '-'}</td>
                        <td>{transaction.userID || '-'}</td>
                        <td>{transaction.colortype || '-'}</td>
                        <td>{transaction.papersize || '-'}</td>
                        <td>{transaction.paymenttype || '-'}</td>
                        <td>{transaction.totalPages || '-'}</td>
                        <td>
                          {transaction.transactionType === 'top-up' ? (
                            <>₱{transaction.topupBalance || '-'}</>
                          ) : (
                            <>₱{transaction.transactionType === 'printing' ? transaction.totalPrice || '-' : '-'}</>
                          )}
                        </td>
                        <td>{transaction.status || '-'}</td>
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

export default AdminPage;
