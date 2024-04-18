import React, { useState } from 'react';
import { database, auth } from './firebase';
import { ref as dbRef, get } from 'firebase/database';
import NavBar from './NavBar';
import QRCode from 'react-qr-code';
import 'typeface-montserrat';
import './filemanage.css';

function TopUp() {
    const [qrCodeData, setQRCodeData] = useState(null);
    const user = auth.currentUser;

    const handleTopUp = async () => {
        if (user) {

            const userRef = dbRef(database, `userData/${user.uid}`);

            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
   
                    const pushKey = user.uid;

                    setQRCodeData(pushKey);
                } else {
                    console.log('No data available for the user.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            console.log('No user is logged in');
        }
    };

    return (
        <>
            <NavBar />
            <div className="file-management">
                <div className="payment-method">
                    <h2>Top Up</h2>
                    <p className='toptext'>Generate a ticket to add balance to your account</p>
                    <button onClick={handleTopUp}>Generate Ticket</button>
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
