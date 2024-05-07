import React, { useEffect, useState } from 'react';
import { database, auth } from './firebase';
import { ref as dbRef, push } from 'firebase/database';
import NavBar from './NavBar';
import 'typeface-montserrat';
import './filemanage.css';

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

function TopUp() {
    const [qrCodeImageUrl, setQRCodeImageUrl] = useState(null);
    const user = auth.currentUser;

    const handleTopUp = async () => {
        if (!user) {
            console.log('No user is logged in');
            return;
        }

        const userTransactionRef = dbRef(database, 'transaction');
        try {
            const userId = user.uid;
            const topUpData = {
                name: 'Top Up',
                timestamp: formatTimestampToDateString(Date.now()),
                paymenttype: 'TopUp',
                status: 'pending', 
                userID: userId,
                topupBalance: 0, 
                transactionType: 'top-up', 
            };

            const newTransactionRef = push(userTransactionRef, topUpData);
            const newTransactionID = newTransactionRef.key;

            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${newTransactionID}&size=150x150`;

            setQRCodeImageUrl(qrCodeUrl); // Set QR code URL
        } catch (error) {
            console.error('Error processing top-up:', error);
            window.alert("An error occurred while generating the QR code.");
        }
    };

    useEffect(() => {
        if (qrCodeImageUrl) {
            window.alert("QR code generated successfully. Please scan it to top up.");
        }
    }, [qrCodeImageUrl]); 

    return (
        <>
            <NavBar />
            <div className="file-management">
                <div className="payment-method">
                    <h2>Top Up</h2>
                    <p className='toptext'>Generate a ticket to add balance to your account</p>
                    <button onClick={handleTopUp}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-qr-code me-2" viewBox="0 0 16 16">
                            <path d="M2 2h2v2H2z"/>
                            <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z"/>
                            <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z"/>
                            <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z"/>
                        </svg>
                        Generate Ticket
                    </button>
                    <div className="qr-code">
                        <h3>QR Code:</h3>
                        {qrCodeImageUrl && (
                            <img src={qrCodeImageUrl} alt="QR Code" />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TopUp;
