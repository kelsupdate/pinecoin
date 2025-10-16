const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000; // Or use a service like Heroku

require('dotenv').config();

app.use(express.json());

// Endpoint to initiate STK Push
app.post('/initiate-stk', async (req, res) => {
  const { phone, amount } = req.body; // Get from frontend
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortCode = process.env.MPESA_SHORT_CODE; // Your business short code
  const passkey = process.env.MPESA_PASSKEY;

  // Generate access token
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const tokenResponse = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` },
  });
  const accessToken = tokenResponse.data.access_token;

  // STK Push payload
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ''); // Format timestamp
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64'); // Generate password

  const stkPayload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone, // User's phone number, e.g., 2547xxxxxxxx
    PartyB: shortCode,
    PhoneNumber: phone,
    CallBackURL: 'https://yourcallbackurl.com', // Your server endpoint for callbacks
    AccountReference: 'Pinecoin Payment',
    TransactionDesc: 'Payment for services',
  };

  try {
    const stkResponse = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', stkPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(stkResponse.data); // Send response back to frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));