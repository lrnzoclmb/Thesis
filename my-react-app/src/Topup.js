import { useState, useEffect } from 'react';
import { auth } from './firebase'; // Import Firebase Realtime Database and Auth modules
import QRCode from 'react-qr-code';
import NavBar from './NavBar';
import './filemanage.css';

const Topup = () => {
  const [amount, setAmount] = useState(null); // State to store the selected amount
  const [qrCodeData, setQrCodeData] = useState(null); // State to store the QR code data
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user

  // Function to fetch the current user on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to generate the QR code data
  const generateQRCodeData = () => {
    if (amount && currentUser) {
      const data = {
        userId: currentUser.uid,
        amount: amount,
        timestamp: Date.now(), // Include timestamp for uniqueness
      };
      const qrData = JSON.stringify(data);
      setQrCodeData(qrData);
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
        <button onClick={generateQRCodeData}>Generate Ticket</button> {/* Call generateQRCodeData function */}
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
