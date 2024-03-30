import React, { useState, useEffect } from 'react';
import { storage, db, auth } from './firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push } from 'firebase/database';
import { v4 } from 'uuid';
import QRCode from 'react-qr-code';
import NavBar from './NavBar';
import { pdfjs } from 'react-pdf';
import './filemanage.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function FileManagement() {
  const [fileUpload, setFileUpload] = useState(null);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [payment, setPayment] = useState('');
  const [qrCodeData, setQRCodeData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [status] = useState('pending');
  const [transaction] = useState('printing');
  const [totalPrice, setTotalPrice] = useState(0); 
  const user = auth.currentUser;

  
  const priceMap = {
    Colored: 5,
    BnW: 1,
    Long: 2,
    Short: 1
  };

  
  useEffect(() => {
    const colorPrice = priceMap[color] || 0;
    const sizePrice = priceMap[size] || 0;
    const totalPrice = (colorPrice + sizePrice) * (numPages || 0); 
    setTotalPrice(totalPrice);
  }, [color, size, numPages]); 
  

  const isPDF = (file) => {
    return file.type === "application/pdf";
  };

  const uploadFile = () => {
    if (fileUpload == null) return;

    if (!isPDF(fileUpload)) {
      alert("Please select a PDF file.");
      return;
    }

    const fileRef = storageRef(storage, `files/${v4()}`);
    const tempDatabaseRef = dbRef(db, 'transaction');

    uploadBytes(fileRef, fileUpload).then(() => {
      getDownloadURL(fileRef).then((downloadURL) => {
        const fileData = {
          name: fileUpload.name,
          url: downloadURL,
          timestamp: Date.now(),
          colortype: color,
          papersize: size,
          paymenttype: payment,
          userID: user ? user.uid : null,
          totalPages: numPages,
          transactionStatus: status,
          transactionType: transaction,
          totalPrice: totalPrice // Include total price in the data to be stored
        };

        push(tempDatabaseRef, fileData).then((newRef) => {
          const newID = newRef.key;
          setQRCodeData(newID);
        }).catch((error) => {
          console.error("Error pushing data to database:", error);
        });
      });
    }).catch((error) => {
      console.error("Error uploading file to storage:", error);
    });
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
        <input 
          type="file"
          accept=".pdf"
          id="upload"
          onChange={onFileChange} 
        />
        {numPages && ( 
          <p>Total Pages: {numPages}</p>
        )}
        <p>Total Price: ₱{totalPrice}</p> {}
        <div className="payment-method">
          <h3>Payment Methods: </h3>
          <input
            type="radio"
            name="payments"
            value="TapID"
            id="TapId"
            onChange={() => setPayment('TapID')}
          />
          <label htmlFor="TapId">Tap ID</label>
          <input
            type="radio"
            name="payments"
            value="OnlinePayment"
            id="TOnlinepayment"
            onChange={() => setPayment('OnlinePayment')}
          />
          <label htmlFor="TapId">Online Payment</label>
          <input
            type="radio"
            name="payments"
            value="Coin"
            id="insert"
            onChange={() => setPayment('Coin')}
          />
          <label htmlFor="insert">Insert Coin</label>
        </div>
        <div className="color-mode">
          <h3>Color Mode: </h3>
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
          <h3>Paper Size: </h3>
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
        
        <button onClick={uploadFile}>Generate Ticket</button>
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
