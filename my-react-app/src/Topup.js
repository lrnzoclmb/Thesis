import React, { useState } from 'react';
import { database, auth } from './firebase';
import { ref as dbRef, push } from 'firebase/database';
import NavBar from './NavBar';
import QRCode from 'react-qr-code';
import 'typeface-montserrat'; 

function TopUp() {
  const [transaction] = useState('topup');
  const [status] = useState('pending'); 
  const [qrCodeData, setQRCodeData] = useState(null); 
  const user = auth.currentUser;

  const handleTopUp = () => {
   
    const tempDatabaseRef = dbRef( database, 'transaction');

    const topUpData = {
      userId: user ? user.uid : null,
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
