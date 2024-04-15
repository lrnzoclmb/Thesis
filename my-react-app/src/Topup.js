import React, { useState, useEffect } from 'react';
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

  // Convert QR code data to a data URL
  const convertQRCodeToDataURL = (qrCodeData) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const qrCodeElement = <QRCode value={qrCodeData} size={256} />;
      // Render the QR code onto the canvas
      const qrCodeSvg = new XMLSerializer().serializeToString(qrCodeElement);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (error) => reject(error);
      img.src = `data:image/svg+xml;base64,${btoa(qrCodeSvg)}`;
    });
  };

  const handleTopUp = async () => {
    const tempDatabaseRef = dbRef(database, 'transaction');

    const topUpData = {
      userId: user ? user.uid : null,
      timestamp: Date.now(),
      transactionStatus: status,
      transactionType: transaction,
    };

    try {
      const newRef = await push(tempDatabaseRef, topUpData);
      console.log("Top-up transaction added to database successfully!");
      const refKey = newRef.key;
      setQRCodeData(refKey);

      // Convert the QR code data to a data URL
      const qrCodeDataURL = await convertQRCodeToDataURL(refKey);
      
      // Display the QR code image in an alert
      alert(`Your QR Code:\n\n${qrCodeDataURL}`);
      
    } catch (error) {
      console.error("Error adding top-up transaction to database:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="file-management">
        <div className="payment-method">
          <h2>Top Up</h2>
          <button onClick={handleTopUp}>Top Up</button>
          {qrCodeData && (
            <div className="qr-code">
              <h3>QR Code:</h3>
              <QRCode value={qrCodeData} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TopUp;
