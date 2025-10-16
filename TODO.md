# TODO: Change Package Payment to STK Push via Paystack

## Steps to Complete
- [x] Install @paystack/inline-js dependency
- [x] Update HowToPayCard.js to display STK Push instructions (enter phone number)
- [x] Modify ValidatePayments.js: Change modal to input phone number, integrate Paystack STK Push, remove M-PESA message validation
- [x] Update package.json with new dependency (react-paystack installed)
- [ ] Test the payment flow (Paystack public key added)
- [ ] Remove or ignore mpesaPaymentDetails from gist fetch if not needed

## Notes
- Use Paystack public key placeholder (replace with actual key)
- On successful payment, update subscribedPackage state and navigate to /home
- Ensure phone number input is validated (Kenya format)

# TODO: Make Backend Functional

## Steps to Complete
- [x] Update backend/package.json: Add start script and correct main entry
- [x] Create backend/.env with PAYSTACK_SECRET_KEY placeholder
- [x] Install backend dependencies (npm install in backend directory)
- [x] Test server startup

## Notes
- Ensure .env is not committed to version control
- Replace placeholder with actual Paystack secret key

# TODO: Implement Paystack Webhook

## Steps to Complete
- [x] Create Vercel function for webhook handling (/api/paystack-webhook.js)
- [x] Update vercel.json to include webhook route and build configuration
- [x] Mark backend webhook endpoint as deprecated
- [ ] Deploy to Vercel and test webhook functionality
- [ ] Add PAYSTACK_SECRET_KEY to Vercel environment variables
- [ ] Configure webhook URL in Paystack dashboard: https://pandassurvey.vercel.app/api/paystack-webhook

## Notes
- Webhook verifies Paystack signature for security
- Currently logs successful payments - needs database integration for subscription updates
- Ensure PAYSTACK_SECRET_KEY is set in Vercel environment variables
