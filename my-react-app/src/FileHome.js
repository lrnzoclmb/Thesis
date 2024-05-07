import React, { useState, useEffect } from 'react';
import 'firebase/compat/database';
import { storage, database } from './firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push, set } from 'firebase/database'; // Include set for writing to rfid database
import { v4 as uuidv4 } from 'uuid';
import LandingBar from './LandingBar';
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

function FileHome() {
    const [fileUpload, setFileUpload] = useState(null);
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [qrCodeImageUrl, setQRCodeImageUrl] = useState(null); 
    const [numPages, setNumPages] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [transactionType,] = useState('printing');
    const [status] = useState('pending');
    const [payment] = useState('TapID');

    useEffect(() => {
        const priceMap = {
            colored: 5,
            bnw: 1,
            long: 2,
            short: 1,
        };
        const colorPrice = priceMap[color] || 0;
        const sizePrice = priceMap[size] || 0;
        const totalPrice = (colorPrice + sizePrice) * (numPages || 0);
        setTotalPrice(totalPrice);
    }, [color, size, numPages]);

    const validateSelections = () => {
        return color && size;
    };

    const isPDF = (file) => file && file.type === 'application/pdf';

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

        if (numPages > 20) {
            alert("The maximum number of pages allowed is 20. Please upload a file with 20 pages or fewer.");
            return;
        }

        const fileRef = storageRef(storage, `files/${uuidv4()}`);
        const transactionRef = dbRef(database, 'transaction');
        const rfidRef = dbRef(database, 'rfid'); 

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
                            status: status,
                            paymenttype: payment, 
                            totalPages: numPages,
                            totalPrice: totalPrice,
                            transactionType: transactionType, 
                        };

                        const newTransactionRef = push(transactionRef, fileData);
                        const newTransactionID = newTransactionRef.key;
                        setQRCodeImageUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${newTransactionID}&size=150x150`);
                        window.alert("QR code generated successfully. Please scan it to start printing.");

                        const rfid = generateRFID();
    
                        set(rfidRef, rfid); 

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

    };

    const onFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile && isPDF(uploadedFile)) {
            setFileUpload(uploadedFile);
            countPages(uploadedFile);
        } else {
            alert("Please select a valid PDF file.");
            setFileUpload(null);
            setNumPages(null);
            setTotalPrice(0);
        }
    };
    
    const countPages = async (selectedFile) => {
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const buffer = reader.result;
                const typedArray = new Uint8Array(buffer);
                const pdf = await pdfjs.getDocument(typedArray).promise;
                setNumPages(pdf.numPages);
            } catch (error) {
                console.error("Error processing PDF file:", error);
                alert("An error occurred while processing the PDF file.");
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const downloadQRCode = () => {
        if (qrCodeImageUrl) {
            const a = document.createElement('a');
            a.href = qrCodeImageUrl;
            a.download = 'QR_Code.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };


    const generateRFID = () => {

        return uuidv4();
    };

    return (
        <>
            <LandingBar />
            <div className="file-management">
                <h2>File Uploading</h2>
                <input type="file" accept=".pdf" id="upload" onChange={onFileChange} />
                {numPages && (
                    <p>Total Pages: {numPages}</p>
                )}
                <p>Total Price: ₱{totalPrice}</p>
                <div className="color-mode">
                    <h3>Color Mode:</h3>
                    <input
                        type="radio"
                        name="color"
                        value="colored"
                        id="colored"
                        onChange={() => setColor('colored')}
                    />
                    <label htmlFor="colored">Colored</label>
                    <input
                        type="radio"
                        name="color"
                        value="bnw"
                        id="bnw"
                        onChange={() => setColor('bnw')}
                    />
                    <label htmlFor="bnw">Black & White</label>
                </div>

                <div className="paper-size">
                    <h3>Paper Size:</h3>
                    <input
                        type="radio"
                        name="size"
                        value="long"
                        id="long"
                        onChange={() => setSize('long')}
                    />
                    <label htmlFor="long">Long</label>
                    <input
                        type="radio"
                        name="size"
                        value="short"
                        id="short"
                        onChange={() => setSize('short')}
                    />
                    <label htmlFor="short">Short</label>
                </div>
                <label className='note'><strong>Note:</strong> This feature is for Adamsonian Student with ID.</label>
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
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-qr-code me-2" viewBox="0 0 16 16">
                                <path d="M2 2h2v2H2z"/>
                                <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z"/>
                                <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z"/>
                                <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z"/>
                                <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z"/>
                            </svg>
                            Generate Ticket
                        </>
                    )}
                </button>

                {qrCodeImageUrl && (
                    <div className="qr-code">
                        <h3>QR Code:</h3>
                        <img id="qr-code-image" src={qrCodeImageUrl} alt="QR Code" onContextMenu={downloadQRCode} />                       
                    </div>
                )}
            </div>
        </>
    );
}

export default FileHome;
