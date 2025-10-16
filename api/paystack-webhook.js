const crypto = require('crypto');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = req.body;
  console.log('Webhook event received:', event.event);

  if (event.event === 'charge.success') {
    console.log('Payment successful:', event.data);
    // TODO: Update user subscription in database
    // Example: Update user's subscribed package based on event.data.reference or email
  }

  res.status(200).json({ received: true });
}
