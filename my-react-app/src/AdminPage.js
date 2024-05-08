import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import AdminNavbar from './AdminNavbar';
import './accountpage.css';
import 'typeface-montserrat';

// Function to format a timestamp into a readable date and time string
function formatTimestampToDateString(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function AdminPage() {
  const navigate = useNavigate();

  // State variables for transactions and total page counts
  const [transactions, setTransactions] = useState([]);
  const [totalPrintedShort, setTotalPrintedShort] = useState(0);
  const [totalPrintedLong, setTotalPrintedLong] = useState(0);
  const [totalPrintedCombined, setTotalPrintedCombined] = useState(0);
  const [lowPaperWarning, setLowPaperWarning] = useState(false);
  const [outOfPaperWarning, setOutOfPaperWarning] = useState(false);

  // Fetch transactions from Firebase and check paper levels
  const fetchTransactions = async () => {
    try {
      const transactionsRef = firebase.database().ref('transaction');
      const snapshot = await transactionsRef.once('value');
      const transactionsData = snapshot.val();
      const transactionsArray = transactionsData ? Object.values(transactionsData) : [];

      // Calculate the total printed pages for short and long paper sizes with "scanned" status
      const totalShort = transactionsArray
        .filter((transaction) => transaction.status === 'scanned' && transaction.papersize === 'short')
        .reduce((acc, transaction) => acc + (transaction.totalPages || 0), 0);

      const totalLong = transactionsArray
        .filter((transaction) => transaction.status === 'scanned' && transaction.papersize === 'long')
        .reduce((acc, transaction) => acc + (transaction.totalPages || 0), 0);

      const combinedTotal = totalShort + totalLong;

      // Determine if a warning message should be displayed
      setLowPaperWarning(combinedTotal >= 10 && combinedTotal <= 19);
      setOutOfPaperWarning(combinedTotal >= 20);

      // Update state with calculated totals
      setTransactions(transactionsArray);
      setTotalPrintedShort(totalShort);
      setTotalPrintedLong(totalLong);
      setTotalPrintedCombined(combinedTotal);

      // Update Firebase with the combined total
      const counterPageRef = firebase.database().ref('counterPage/countedPage');
      await counterPageRef.set(combinedTotal);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions(); 
  }, []);

  // Handle paper refill and change "scanned" status to "done"
  const handleRefillPaper = async () => {
    try {
      // Fetch the current combined paper count from Firebase
      const counterPageRef = firebase.database().ref('counterPage/countedPage');
      const snapshot = await counterPageRef.once('value');
      const currentCombinedTotal = snapshot.val() || 0;
  
      // Prompt for refill amount
      const refillAmount = window.prompt('Enter the refill paper count:', '10');
      const refillValue = parseInt(refillAmount, 10);
  
      if (!isNaN(refillValue)) {
        const newTotal = currentCombinedTotal - refillValue;
  
        // Ensure the new total is not negative
        if (newTotal < 0) {
          alert('Refill count exceeds the current paper count. Please enter a lower value.');
        } else {
          // Update the combined total in Firebase
          await counterPageRef.set(newTotal);
          setTotalPrintedCombined(newTotal);
  
          // Update transactions with "scanned" status to "done"
          const transactionsRef = firebase.database().ref('transaction');
  
          // Re-fetch transactions to ensure keys are correct
          const snapshot = await transactionsRef.once('value');
          const transactionsData = snapshot.val();
  
          // Check if transactionsData exists and has content
          if (transactionsData) {
            const updates = {};
  
            // Loop through the object to get each key and corresponding data
            Object.entries(transactionsData).forEach(([key, transaction]) => {
              if (transaction.status === 'scanned') {
                updates[`/${key}/status`] = 'done'; // Use the key to update the correct path
              }
            });
  
            await transactionsRef.update(updates); // Apply the updates to Firebase
  
            // Update local state with correct keys and updated status
            setTransactions((prevTransactions) =>
              prevTransactions.map((t) =>
                t.status === 'scanned' ? { ...t, status: 'done' } : t
              )
            );
          }
        }
      }
    } catch (error) {
      console.error('Error during paper refill or status update:', error);
    }
  };

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <>
      <AdminNavbar />
      <div className="account-container">
        <div className="account">
          <h2>Transactions</h2>
          
          {/* Buttons to log out and refill paper */}
          <div className="button-container">
            <button onClick={handleLogout} className="button-logout">
              Logout
            </button>
            <button onClick={handleRefillPaper} className="button-refill-paper">
              Refill Paper
            </button>
          </div>

          {/* Display paper warnings if needed */}
          {lowPaperWarning && (
            <div className="warning">
              <p>Low paper warning. {formatTimestampToDateString(Date.now())}</p>
            </div>
          )}
          {outOfPaperWarning && (
            <div classfim="warning">
              <p>Out of paper warning. {formatTimestampToDateString(Date.now())}</p>
            </div>
          )}

          {/* Display total printed pages for short and long paper sizes */}
          <div className="printed-page-summary">
            <p>Total Printed Short Paper: {totalPrintedShort}</p>
            <p>Total Printed Long Paper: {totalPrintedLong}</p>
            <p>Total Printed Pages: {totalPrintedCombined}</p>
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

                    {transactions.slice().reverse().map((transaction, index) => (
                      <tr key={index}>
                        <td>{formatTimestampToDateString(transaction.timestamp) || '-'}</td>
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
