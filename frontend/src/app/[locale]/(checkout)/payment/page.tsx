"use client"
import { useState } from 'react';

const Payment = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handlePayment = () => {
    // Handle payment processing logic here
    // For now, just console log the payment details
    console.log('Payment Details:', paymentDetails);
    alert('Payment Successful!');
  };

  return (
    <div>
      <h1>Payment</h1>
      <form onSubmit={handlePayment}>
        <input name="cardNumber" placeholder="Card Number" value={paymentDetails.cardNumber} onChange={handleInputChange} required />
        <input name="expiryDate" placeholder="Expiry Date" value={paymentDetails.expiryDate} onChange={handleInputChange} required />
        <input name="cvv" placeholder="CVV" value={paymentDetails.cvv} onChange={handleInputChange} required />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
