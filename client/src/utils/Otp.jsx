import React, { useState } from 'react';
import axios from 'axios';

const OTPVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const sendOTP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { email });
      setMessage(response.data);
    } catch (error) {
      setMessage('Error sending OTP');
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      setMessage(response.data);
    } catch (error) {
      setMessage('Error verifying OTP');
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button onClick={sendOTP}>Send OTP</button>
      </div>
      <div>
        <label>OTP:</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button onClick={verifyOTP}>Verify OTP</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OTPVerification;
