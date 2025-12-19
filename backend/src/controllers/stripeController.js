import Stripe from 'stripe';
import Donation from '../models/Donation.js';
import Bar from '../models/Bar.js';

// Initialize Stripe lazily to ensure environment variables are loaded
let stripeInstance = null;

function getStripe() {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeInstance = new Stripe(apiKey);
  }
  return stripeInstance;
}

// Create a checkout session for card payment (redirects to Stripe)
export const createCardCheckoutSession = async (req, res) => {
  try {
    const { barId, amount } = req.body;

    if (!barId || !amount) {
      return res.status(400).json({ error: 'barId and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const bar = await Bar.findById(barId);
    if (!bar) {
      return res.status(404).json({ error: 'Bar not found' });
    }

    // Create a pending donation record first
    const donation = new Donation({
      barId,
      amount,
      paymentMethod: 'card',
      stripePaymentStatus: 'pending',
    });
    await donation.save();

    // Create checkout session with Stripe
    const stripe = getStripe();
    const baseUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `Donation to ${bar.label}`,
              description: `Donation to ${bar.label}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to öre (Swedish cents)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}?payment_success=true&session_id={CHECKOUT_SESSION_ID}&bar_id=${barId}`,
      cancel_url: `${baseUrl}?payment_canceled=true&bar_id=${barId}`,
      metadata: {
        barId: barId.toString(),
        barLabel: bar.label,
        donationId: donation._id.toString(),
      },
    });

    // Update donation with checkout session ID
    donation.stripePaymentIntentId = session.id; // Store session ID
    await donation.save();

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
      donationId: donation._id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};

// Webhook handler for Stripe events
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
    }
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: error.message });
  }
};

// Handle checkout session completed
async function handleCheckoutSessionCompleted(session) {
  try {
    const donationId = session.metadata?.donationId;
    if (!donationId) {
      console.error(`Donation ID not found in checkout session ${session.id}`);
      return;
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      console.error(`Donation not found for ID ${donationId}`);
      return;
    }

    // Only update if payment was pending (avoid double processing)
    if (donation.stripePaymentStatus === 'pending') {
      donation.stripePaymentStatus = 'succeeded';
      donation.stripePaymentIntentId = session.id;
      await donation.save();

      // Update bar current value
      const bar = await Bar.findById(donation.barId);
      if (bar) {
        bar.currentValue += donation.amount;
        await bar.save();
      }
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}

// Handle successful payment
async function handlePaymentSuccess(paymentIntent) {
  try {
    const donation = await Donation.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!donation) {
      console.error(`Donation not found for payment intent ${paymentIntent.id}`);
      return;
    }

    // Only update if payment was pending (avoid double processing)
    if (donation.stripePaymentStatus === 'pending') {
      donation.stripePaymentStatus = 'succeeded';
      await donation.save();

      // Update bar current value
      const bar = await Bar.findById(donation.barId);
      if (bar) {
        bar.currentValue += donation.amount;
        await bar.save();
      }
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailure(paymentIntent) {
  try {
    const donation = await Donation.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (donation) {
      donation.stripePaymentStatus = 'failed';
      await donation.save();
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

// Handle canceled payment
async function handlePaymentCanceled(paymentIntent) {
  try {
    const donation = await Donation.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (donation) {
      donation.stripePaymentStatus = 'canceled';
      await donation.save();
    }
  } catch (error) {
    console.error('Error handling payment canceled:', error);
    throw error;
  }
}

// Verify payment status (works with both checkout sessions and payment intents)
export const verifyPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const stripe = getStripe();
    
    // Try to retrieve as checkout session first
    let session = null;
    let paymentIntent = null;
    let status = null;

    try {
      session = await stripe.checkout.sessions.retrieve(paymentIntentId);
      status = session.payment_status === 'paid' ? 'succeeded' : session.payment_status;
    } catch (err) {
      // If not a checkout session, try as payment intent
      try {
        paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        status = paymentIntent.status;
      } catch (err2) {
        return res.status(404).json({ error: 'Payment not found' });
      }
    }

    const donation = await Donation.findOne({
      stripePaymentIntentId: paymentIntentId,
    });

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // If payment succeeded but donation status is still pending, update it
    if (status === 'succeeded' && donation.stripePaymentStatus === 'pending') {
      donation.stripePaymentStatus = 'succeeded';
      await donation.save();

      const bar = await Bar.findById(donation.barId);
      if (bar) {
        bar.currentValue += donation.amount;
        await bar.save();
      }
    }

    res.json({
      status: status,
      donationStatus: donation.stripePaymentStatus,
      amount: donation.amount,
      barId: donation.barId,
    });
  } catch (error) {
    console.error('Error verifying payment status:', error);
    res.status(500).json({ error: error.message });
  }
};
