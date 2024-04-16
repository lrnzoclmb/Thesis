import React, { useState } from 'react';
import { database, auth } from './firebase';
import { ref as dbRef, get } from 'firebase/database';
import NavBar from './NavBar';
import QRCode from 'react-qr-code';
import 'typeface-montserrat';

function TopUp() {
    const [qrCodeData, setQRCodeData] = useState(null);
    const user = auth.currentUser;

    // Function to handle top-up
    const handleTopUp = async () => {
        if (user) {
            // Define the reference to the user's data in the Firebase database
            const userRef = dbRef(database, `userData/${user.uid}`);

            // Fetch the user's data from the database
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    // The push key is the path of userRef, which can be determined by the user's UID
                    const pushKey = user.uid;

                    // Set the QR code data to be the push key
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
