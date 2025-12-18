import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { createPayPalPaymentIntent, verifyPaymentStatus } from '../../services/api';
import { makeSwishLink } from '../../utils/payment';
import QRCode from '../QRCode';
import './DonationBarCard.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export default function DonationBarCard({ bar, onDonate, onPaymentSuccess }) {
  const [amount, setAmount] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [swishUrl, setSwishUrl] = useState('');

  // Check for payment intent in URL (return from redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const barId = urlParams.get('bar_id');

    if (paymentIntentId && barId && (bar._id === barId || bar.id === barId)) {
      verifyPaymentStatus(paymentIntentId)
        .then((status) => {
          if (status.status === 'succeeded' && status.donationStatus === 'succeeded') {
            // Payment was successful and donation was recorded by webhook
            // Just reload bars to get updated values
            if (onPaymentSuccess) {
              onPaymentSuccess();
            }
            alert('Payment successful! Thank you for your donation.');
            setAmount('');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        })
        .catch((error) => {
          console.error('Error verifying payment:', error);
        });
    }
  }, [bar._id, bar.id, onPaymentSuccess]);

  const handleSwishPayment = async (e) => {
    e.preventDefault();
    const donationAmount = Number(amount);

    if (!donationAmount || donationAmount <= 0) {
      alert('Please enter a donation amount');
      return;
    }

    const random4 = Math.floor(1000 + Math.random() * 9000); // 1000-9999
    const orderId = `SW-${random4}-${Date.now()}`;
    const message = `Order ${orderId} - Donation to ${bar.label}`;

    setPaymentMethod('swish');

    try {
      // Create a pending Swish donation entry in the backend without updating the bar total yet
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barId: bar._id || bar.id,
          amount: donationAmount,
          paymentMethod: 'swish',
          donorInfo: {
            message,
          },
          swishOrderId: orderId,
          skipBarUpdate: true,
        }),
      });
    } catch (error) {
      console.error('Failed to create Swish donation record:', error);
      // Continue to show QR so user can still pay, but admin will have to reconcile manually
    }

    const url = makeSwishLink("+46764361382", donationAmount, message, []); // amount & message locked by default
    setSwishUrl(url);
  };

  const handlePayPalPayment = async (e) => {
    e.preventDefault();
    const donationAmount = Number(amount);

    if (!donationAmount || donationAmount <= 0) {
      alert('Please enter a donation amount');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentMethod('paypal');
    try {
      // Create payment intent
      const { clientSecret, paymentIntentId } = await createPayPalPaymentIntent(
        bar._id || bar.id,
        donationAmount
      );

      // Initialize Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize. Please check your Stripe publishable key.');
      }

      // Confirm payment with PayPal (redirects to PayPal)
      const { error } = await stripe.confirmPayPalPayment(clientSecret, {
        return_url: `${window.location.origin}?payment_intent=${paymentIntentId}&bar_id=${bar._id || bar.id}`,
      });

      if (error) {
        console.error('Payment error:', error);
        alert(`Payment failed: ${error.message}`);
        setIsProcessingPayment(false);
        setPaymentMethod(null);
      }
      // If no error, user will be redirected to PayPal
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Failed to process payment. Please try again.');
      setIsProcessingPayment(false);
      setPaymentMethod(null);
    }
  };

  return (
    <div className="donation-bar-card">
      <div className="donation-bar-card__title">{bar.label}</div>
      
      {bar.about && (
        <div className="donation-bar-card__about">
          {bar.about}
        </div>
      )}

      <div className="donation-bar-card__value">
        Current: {bar.currentValue}
      </div>

      <div className="donation-bar-card__form">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="donation-bar-card__input"
          placeholder="Enter donation amount (kr)"
          disabled={isProcessingPayment}
          required
          min="1"
          step="1"
        />

        <div className="donation-bar-card__buttons">
          <button
            type="button"
            onClick={handleSwishPayment}
            className="donation-bar-card__button donation-bar-card__button--swish"
            disabled={!amount}
          >
            Add amount by Swish
          </button>

          <button
            type="button"
            onClick={handlePayPalPayment}
            className="donation-bar-card__button donation-bar-card__button--paypal"
            disabled={isProcessingPayment || !amount}
          >
            {isProcessingPayment && paymentMethod === 'paypal' ? 'Processing...' : 'Add amount by PayPal'}
          </button>
        </div>

        {paymentMethod === 'swish' && swishUrl && (
          <div className="donation-bar-card__qr">
            <QRCode
              value={swishUrl}
              title={`Scan with Swish to donate to ${bar.label}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
