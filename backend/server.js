const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PORT = process.env.PORT || 5000;

// Endpoint to initiate STK Push payment
app.post('/api/initiate-payment', async (req, res) => {
  const { email, amount, phone } = req.body;

  try {
    const response = await axios.post(
      'https://api.paystack.co/charge',
      {
        email,
        amount: amount * 100, // Convert to kobo
        mobile_money: {
          phone,
          provider: 'Mpesa',
        },
        currency: 'KES',
        callback_url: 'http://localhost:3000/validate-payments', // Frontend callback URL
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Paystack API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// Webhook endpoint for Paystack events (deprecated - now using Vercel function)
app.post('/api/paystack-webhook', (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body;
  if (event.event === 'charge.success') {
    // Handle successful payment
    console.log('Payment successful:', event.data);
    // Update user subscription here
  }

  res.sendStatus(200);
});

// Endpoint to verify payment status
app.get('/api/verify-payment/:reference', async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
