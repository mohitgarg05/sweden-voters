# Stripe Swish Payment Integration Setup

This guide explains how to set up Stripe Swish payments for the donation bars application.

## Prerequisites

1. A Stripe account with Swish enabled (Swish is in private preview, contact Stripe to enable it)
2. Stripe API keys (publishable and secret keys)

## Environment Variables

### Backend (.env file in `backend/` directory)

Add the following environment variables:

```env
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...  # Your Stripe webhook signing secret
```

### Frontend (.env file in root directory)

Add the following environment variable:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key
```

## Stripe Webhook Setup

1. Go to your Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
5. Copy the webhook signing secret and add it to your backend `.env` file as `STRIPE_WEBHOOK_SECRET`

## Testing

For testing, use Stripe test mode:
- Use test API keys (starting with `sk_test_` and `pk_test_`)
- Use Stripe's test Swish payment flow
- Test webhooks using Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## How It Works

1. User enters donation amount and clicks "Add amount by Swish"
2. Frontend creates a payment intent via backend API
3. Backend creates a pending donation record
4. User is redirected to Swish app to complete payment
5. After payment, user returns to the site
6. Stripe webhook confirms payment and updates donation status
7. Bar value is updated only after successful payment

## Important Notes

- Donations are only recorded in the database after successful payment confirmation
- The webhook handler ensures donations are recorded even if the user doesn't return to the site
- Payment intents are stored with donation records for tracking
