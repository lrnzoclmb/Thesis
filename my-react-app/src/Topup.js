import { useState } from 'react';
import { db, auth } from './firebase'; // Import Firebase Realtime Database and Auth modules
import { push, ref as dbRef } from 'firebase/database'; // Import push and ref from Firebase database module
import { v4 } from 'uuid';
import QRCode from 'react-qr-code';
import NavBar from './NavBar';
import './filemanage.css';

const Topup = () => {
  const [amount, setAmount] = useState(null); // State to store the selected amount
  const [qrCodeData, setQrCodeData] = useState(null); // State to store the QR code data

  // Function to update user balance in Firebase Realtime Database
  const updateBalance = async () => {
    // Check if amount is selected
    if (!amount) {
      alert('Please select an amount.');
      return;
    }
  
    // Generate a unique ticket ID
    const ticketId = v4();
  
    // Add user balance to the database
    try {
      await push(dbRef(db, 'userBalance'), {
        amount: amount,
        ticketId: ticketId,
      });
  
      // Set QR code data to include ticket ID and amount
      setQrCodeData(JSON.stringify({ ticketId: ticketId, amount: amount }));
  
      // Update user balance in the database
      const user = auth.currentUser;
      if (user) {
        await dbRef(db, `users/${user.uid}/balance`).set(amount);
        console.log("User balance updated successfully!");
      } else {
        console.error("User not authenticated.");
        // Redirect to login or handle unauthenticated user
      }
    } catch (error) {
      console.error('Error updating user balance:', error);
      alert('Failed to update user balance. Please try again later.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="file-management">
        <div className="paper-size">
          <h3>Top Up</h3>
          <input
            type="radio"
            name="amount"
            value="10"
            id="ten"
            onChange={() => setAmount('10')}
          />
          <label htmlFor="ten">10</label>
          <input
            type="radio"
            name="amount"
            value="20"
            id="twenty"
            onChange={() => setAmount('20')}
          />
          <label htmlFor="twenty">20</label>
          <input
            type="radio"
            name="amount"
            value="50"
            id="fifty"
            onChange={() => setAmount('50')}
          />
          <label htmlFor="fifty">50</label>
          <input
            type="radio"
            name="amount"
            value="100"
            id="hundred"
            onChange={() => setAmount('100')}
          />
          <label htmlFor="hundred">100</label>
        </div>
        <button onClick={updateBalance}>Generate Ticket</button>
        {qrCodeData && (
          <div className="qr-code">
            <h3>QR Code:</h3>
            <QRCode value={qrCodeData} />
          </div>
        )}
      </div>
    </>
  );
};

export default Topup;
