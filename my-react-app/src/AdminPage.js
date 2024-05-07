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

  // State variables for transactions and various counts
  const [transactions, setTransactions] = useState([]);
  const [shortPaperCount, setShortPaperCount] = useState(0);
  const [longPaperCount, setLongPaperCount] = useState(0);
  const [coloredInkCount, setColoredInkCount] = useState(0);
  const [bwInkCount, setBwInkCount] = useState(0);

  // State variables for warnings
  const [lowShortPaperWarning, setLowShortPaperWarning] = useState(false);
  const [lowLongPaperWarning, setLowLongPaperWarning] = useState(false);
  const [outOfPaperShortWarning, setOutOfPaperShortWarning] = useState(false);
  const [outOfPaperLongWarning, setOutOfPaperLongWarning] = useState(false);
  const [lowColoredInkWarning, setLowColoredInkWarning] = useState(false);
  const [lowBnWInkWarning, setLowBnWInkWarning] = useState(false);

  // Function to calculate counts from transactions
  const calculateCounts = (transactionsArray) => {
    let shortPages = 0;
    let longPages = 0;
    let coloredPages = 0;
    let bwPages = 0;

    transactionsArray.forEach((transaction) => {
      if (transaction.papersize === 'short') {
        shortPages += transaction.totalPages || 0;
      } else if (transaction.papersize === 'long') {
        longPages += transaction.totalPages || 0;
      }

      if (transaction.colortype === 'colored') {
        coloredPages += 1;
      } else if (transaction.colortype === 'bnw') {
        bwPages += 1;
      }
    });

    setShortPaperCount(shortPages);
    setLongPaperCount(longPages);
    setColoredInkCount(coloredPages);
    setBwInkCount(bwPages);

    setLowShortPaperWarning(shortPages >= 10 && shortPages <= 19);
    setLowLongPaperWarning(longPages >= 10 && longPages <= 19);
    setOutOfPaperShortWarning(shortPages > 20);
    setOutOfPaperLongWarning(longPages > 20);

    setLowColoredInkWarning(coloredPages >= 20);
    setLowBnWInkWarning(bwPages >= 20);
  };

  // Fetch transactions from Firebase
  const fetchTransactions = async () => {
    try {
      const transactionsRef = firebase.database().ref('transaction');
      const snapshot = await transactionsRef.once('value');
      const transactionsData = snapshot.val();
      const transactionsArray = transactionsData ? Object.values(transactionsData) : [];

      setTransactions(transactionsArray);
      calculateCounts(transactionsArray);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // ComponentDidMount lifecycle equivalent
  useEffect(() => {
    fetchTransactions(); 
  }, []);

  // Logout handler
  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  // Refill paper handler
  const refillPaper = () => {
    const paperType = window.prompt(
      'Are you refilling "short" or "long" paper?',
      'short or long'
    );

    if (paperType === 'short' || 'long') {
      const refillAmount = window.prompt('How much paper are you refilling?', 'Enter a number');

      if (refillAmount !== null && !isNaN(refillAmount)) {
        const refillValue = parseInt(refillAmount, 10);

        if (refillValue > 0) {
          if (paperType === 'short') {
            setShortPaperCount((prev) => prev + refillValue); // Increment short paper count
            setLowShortPaperWarning(false);
            setOutOfPaperShortWarning(false);
          } else if (paperType === 'long') {
            setLongPaperCount((prev) => prev + refillValue); // Increment long paper count
            setLowLongPaperWarning(false);
            setOutOfPaperLongWarning(false);
          }
        }
      }
    }
  };


  const refillInk = () => {
    setColoredInkCount(0); 
    setBwInkCount(0);
    setLowColoredInkWarning(false);
    setLowBnWInkWarning(false);
  };

  return (
    <>
      <AdminNavbar />
      <div className="account-container">
        <div className="account">
          <h2>Transactions</h2>
          
          {/* Display warnings for paper and ink */}
          {lowColoredInkWarning && (
            <div className="warning">
              <p>Low colored ink warning</p>
            </div>
          )}
          {lowBnWInkWarning && (
            <div className="warning">
              <p>Low B&W ink warning</p>
            </div>
          )}
          {lowShortPaperWarning && (
            <div className="warning">
              <p>Low paper warning for short paper size</p>
            </div>
          )}
          {lowLongPaperWarning && (
            <div className="warning">
              <p>Low paper warning for long paper size</p>
            </div>
          )}
          {outOfPaperShortWarning && (
            <div className="warning">
              <p>Out of short paper warning, please add paper</p>
            </div>
          )}
          {outOfPaperLongWarning && (
            <div className="warning">
              <p>Out of long paper warning, please add paper</p>
            </div>
          )}

          {/* Buttons for logout, refill paper, and refill ink */}
          <div className="button-container">
            <button onClick={handleLogout} className="button-logout">
              Logout
            </button>
            <button onClick={refillPaper} className="btn-change-password">
              Refill Paper
            </button>
            <button onClick={refillInk} className="btn-change-password">
              Refill Ink
            </button>
          </div>

          {/* Transaction History */}
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
                      <th>Color Type</th>
                      <th>Paper Size</th>
                      <th>Payment Type</th>
                      <th>Total Pages</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice().reverse().map((transaction, index) => (
                      <tr key={index}>
                        <td>{transaction.timestamp || '-'}</td>
                        <td>{transaction.name || '-'}</td>
                        <td>{transaction.userID || '-'}</td>
                        <td>{transaction.colortype || '-'}</td>
                        <td>{transaction.papersize || '-'}</td>
                        <td>{transaction.paymenttype || '-'}</td>
                        <td>{transaction.totalPages || '-'}</td>
                        <td>
                          {transaction.transactionType === 'printing'
                            ? `₱${transaction.totalPrice}`
                            : transaction.transactionType === 'top-up'
                              ? `₱${transaction.topupBalance}` 
                              : '-'}
                        </td>
                        <td>{transaction.status || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-history">No transaction history available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
