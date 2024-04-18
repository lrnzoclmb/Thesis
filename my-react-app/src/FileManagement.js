import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { storage, auth, database } from './firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'react-qr-code';
import NavBar from './NavBar';
import { pdfjs } from 'react-pdf';
import './filemanage.css';
import 'typeface-montserrat';
import 'bootstrap/dist/css/bootstrap.min.css';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

function FileManagement() {
    const [fileUpload, setFileUpload] = useState(null);
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [payment, setPayment] = useState('');
    const [qrCodeData, setQRCodeData] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [balance, setBalance] = useState(null);
    const [userBalanceRef, setUserBalanceRef] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

    const user = auth.currentUser;

    const priceMap = {
        Colored: 5,
        BnW: 1,
        Long: 2,
        Short: 1,
    };

    useEffect(() => {
        if (user) {
            const userDataRef = firebase.database().ref(`userData/${user.uid}`);
            const balanceRef = userDataRef.child('balance');
            
            setUserBalanceRef(balanceRef);
            
            balanceRef.on('value', (snapshot) => {
                const userBalance = snapshot.val();
                setBalance(userBalance || 0);
            });
        }
    }, [user]);

    useEffect(() => {
        const colorPrice = priceMap[color] || 0;
        const sizePrice = priceMap[size] || 0;
        const totalPrice = (colorPrice + sizePrice) * (numPages || 0);
        setTotalPrice(totalPrice);
    }, [color, size, numPages]);

    const validateSelections = () => {
        return color && size && payment;
    };

    const handleOnlinePayment = () => {
        if (payment === 'OnlinePayment' && userBalanceRef) {
            const updatedBalance = balance - totalPrice;

            userBalanceRef.set(updatedBalance)
                .then(() => {
                    console.log('Balance updated successfully.');
                })
                .catch((error) => {
                    console.error('Error updating balance:', error);
                });
        }
    };

    const isPDF = (file) => file.type === "application/pdf";

    const uploadFile = () => {
        if (fileUpload == null) return;

        if (!isPDF(fileUpload)) {
            alert("Please select a PDF file.");
            return;
        }

        if (!validateSelections()) {
            alert("Please make all selections: color mode, paper size, and payment method.");
            return;
        }

        if (payment === 'OnlinePayment') {
            if (balance < totalPrice) {
                alert("Insufficient balance for online payment. Please top up your balance or choose a different payment method.");
                return;
            }
        }

        let status = '';
        if (payment === 'OnlinePayment') {
            status = 'paid';
        } else if (payment === 'TapID' || payment === 'Coin') {
            status = 'pending';
        }

        const fileRef = storageRef(storage, `files/${uuidv4()}`);
        const transactionRef = dbRef(database, 'transaction');
        const userTransactionHistoryRef = dbRef(database, `transactionHistory/${user.uid}`);

        setLoading(true);

        uploadBytes(fileRef, fileUpload)
            .then(() => {
                getDownloadURL(fileRef)
                    .then((downloadURL) => {
                        const fileData = {
                            name: fileUpload.name,
                            url: downloadURL,
                            timestamp: formatTimestampToDateString(Date.now()),
                            colortype: color,
                            papersize: size,
                            paymenttype: payment,
                            status: status,
                            userID: user ? user.uid : null,
                            totalPages: numPages,
                            totalPrice: totalPrice,
                        };

                        const newTransactionRef = push(transactionRef, fileData);
                        const newTransactionID = newTransactionRef.key;
                        setQRCodeData(newTransactionID);

                        console.log('File data:', fileData);

                        push(userTransactionHistoryRef, fileData)
                            .catch((error) => {
                                console.error("Error pushing data to user's transaction history:", error);
                            });

                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error fetching file URL:", error);

                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error("Error uploading file to storage:", error);

                setLoading(false);
            });

        handleOnlinePayment();
    };

    const onFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFileUpload(uploadedFile);
        countPages(uploadedFile);
    };

    const countPages = async (selectedFile) => {
        const reader = new FileReader();
        reader.onload = async () => {
            const buffer = reader.result;
            const typedArray = new Uint8Array(buffer);
            const pdf = await pdfjs.getDocument(typedArray).promise;
            setNumPages(pdf.numPages);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    return (
        <>
            <NavBar />
            <div className="file-management">
                <h2>File Uploading</h2>
                <input
                    type="file"
                    accept=".pdf"
                    id="upload"
                    onChange={onFileChange}
                />
                {numPages && (
                    <p>Total Pages: {numPages}</p>
                )}
                <p>Total Price: ₱{totalPrice}</p>
                <div className="color-mode">
                    <h3>Color Mode:</h3>
                    <input
                        type="radio"
                        name="color"
                        value="Colored"
                        id="colored"
                        onChange={() => setColor('Colored')}
                    />
                    <label htmlFor="colored">Colored</label>
                    <input
                        type="radio"
                        name="color"
                        value="BnW"
                        id="bnw"
                        onChange={() => setColor('BnW')}
                    />
                    <label htmlFor="bnw">Black & White</label>
                </div>
                <div className="paper-size">
                    <h3>Paper Size:</h3>
                    <input
                        type="radio"
                        name="size"
                        value="Long"
                        id="long"
                        onChange={() => setSize('Long')}
                    />
                    <label htmlFor="long">Long</label>
                    <input
                        type="radio"
                        name="size"
                        value="Short"
                        id="short"
                        onChange={() => setSize('Short')}
                    />
                    <label htmlFor="short">Short</label>
                </div>
                <div className="payment-method">
                    <h3>Payment Methods:</h3>
                    <input
                        type="radio"
                        name="payment"
                        value="TapID"
                        id="TapId"
                        onChange={() => setPayment('TapID')}
                    />
                    <label htmlFor="TapId">Tap ID</label>
                    <input
                        type="radio"
                        name="payment"
                        value="OnlinePayment"
                        id="Online"
                        onChange={() => setPayment('OnlinePayment')}
                    />
                    <label htmlFor="Online">Online Payment</label>
                    <input
                        type="radio"
                        name="payment"
                        value="Coin"
                        id="insert"
                        onChange={() => setPayment('Coin')}
                    />
                    <label htmlFor="insert">Insert Coin</label>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={uploadFile}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </>
                    ) : (
                        'Generate Ticket'
                    )}
                </button>

                {qrCodeData && (
                    <div className="qr-code">
                        <h3>QR Code:</h3>
                        <QRCode value={qrCodeData} />
                    </div>
                )}
            </div>
        </>
    );
}

export default FileManagement;
