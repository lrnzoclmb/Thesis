import React, { useState } from 'react';
import { database, auth } from './firebase';
import { ref as dbRef, push } from 'firebase/database';
import NavBar from './NavBar';
import QRCode from 'react-qr-code';
import 'typeface-montserrat'; 

function TopUp() {
  const [amount, setAmount] = useState(null); // Changed to null to represent no selection
  const [transaction] = useState('topup');
  const [status] = useState('pending'); 
  const [qrCodeData, setQRCodeData] = useState(null); 
  const user = auth.currentUser;

  const handleTopUp = () => {
    if (!amount) {
      alert("Please select an amount to top up.");
      return;
    }

    const tempDatabaseRef = dbRef( database, 'transaction');

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
        const refKey = newRef.key; 
        setQRCodeData(refKey); 
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
            value={10}
            id="ten"
            onChange={() => setAmount(10)}
          />
          <label htmlFor="ten">₱10</label>
          <input
            type="radio"
            name="amount"
            value={20}
            id="twenty"
            onChange={() => setAmount(20)}
          />
          <label htmlFor="twenty">₱20</label>
          <input
            type="radio"
            name="amount"
            value={50}
            id="fifty"
            onChange={() => setAmount(50)}
          />
          <label htmlFor="fifty">₱50</label>
          <input
            type="radio"
            name="amount"
            value={100}
            id="hundred"
            onChange={() => setAmount(100)}
          />
          <label htmlFor="hundred">₱100</label>
        </div>
        <button onClick={handleTopUp}>Top Up</button>
        {qrCodeData && ( 
          <div className="qr-code">
            <h3>QR Code:</h3>
            <QRCode value={qrCodeData} /> { }
          </div>
        )}
      </div>
      </div>
    </>
  );
}

export default TopUp;
