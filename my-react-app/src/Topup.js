import React, { useState } from 'react';
import { db, auth } from './firebase';
import { ref as dbRef, push } from 'firebase/database';
import NavBar from './NavBar';
import QRCode from 'react-qr-code'; // Import QRCode component

function TopUp() {
  const [amount, setAmount] = useState('');
  const [transaction] = useState('topup');
  const [ status ] = useState('pending'); 
  const [qrCodeData, setQRCodeData] = useState(null); // State to store QR code data
  const user = auth.currentUser;

  const handleTopUp = () => {
    if (!amount) {
      alert("Please select an amount to top up.");
      return;
    }

    const tempDatabaseRef = dbRef(db, 'transaction');

    const topUpData = {
      userId: user ? user.uid : null,
      amount: amount,
      timestamp: Date.now(),
      transactionStatus: status,  
      transactionType: transaction,
    };

    push(tempDatabaseRef, topUpData)
      .then((newRef) => {
        console.log("Top-up transaction added to database successfully!");
        const refKey = newRef.key; // Get the reference key from the newly added transaction
        setQRCodeData(refKey); // Set the refKey as QR code data
      })
      .catch((error) => {
        console.error("Error adding top-up transaction to database:", error);
      });
  };

  return (
    <>
      <NavBar />
      <div className="file-management">
      <div className="payment-method">
        <h2>Top Up </h2>
        <div className="amount-options">
          <h3>Top Up Amount:</h3>
          <input
            type="radio"
            name="amount"
            value="10"
            id="ten"
            onChange={() => setAmount('10')}
          />
          <label htmlFor="ten">₱10</label>
          <input
            type="radio"
            name="amount"
            value="20"
            id="twenty"
            onChange={() => setAmount('20')}
          />
          <label htmlFor="twenty">₱20</label>
          <input
            type="radio"
            name="amount"
            value="50"
            id="fifty"
            onChange={() => setAmount('50')}
          />
          <label htmlFor="fifty">₱50</label>
          <input
            type="radio"
            name="amount"
            value="100"
            id="hundred"
            onChange={() => setAmount('100')}
          />
          <label htmlFor="hundred">₱100</label>
        </div>
        <button onClick={handleTopUp}>Top Up</button>
        {qrCodeData && ( // Display QR code if data is available
          <div className="qr-code">
            <h3>QR Code:</h3>
            <QRCode value={qrCodeData} /> {/* Generate QR code with the reference key */}
          </div>
        )}
      </div>
      </div>
    </>
  );
}

export default TopUp;
