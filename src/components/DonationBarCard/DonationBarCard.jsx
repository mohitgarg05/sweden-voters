import { useState, useEffect, useRef } from 'react';
import { createCardCheckoutSession, verifyPaymentStatus } from '../../services/api';
import { makeSwishLink } from '../../utils/payment';
import QRCode from '../QRCode';
import './DonationBarCard.css';

export default function DonationBarCard({ bar, onDonate, onPaymentSuccess }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [swishUrl, setSwishUrl] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const processedSessionRef = useRef(new Set()); // Track processed session IDs

  // Check for payment success in URL (return from Stripe Checkout)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const sessionId = urlParams.get('session_id');
    const barId = urlParams.get('bar_id');

    // Check if this session was already processed
    if (sessionId && processedSessionRef.current.has(sessionId)) {
      return; // Already processed, skip
    }

    if (paymentSuccess === 'true' && sessionId && barId && (bar._id === barId || bar.id === barId)) {
      // Mark as processed immediately to prevent duplicates
      processedSessionRef.current.add(sessionId);
      
      // Clean URL immediately to prevent re-processing on re-renders
      window.history.replaceState({}, document.title, window.location.pathname);
      
      verifyPaymentStatus(sessionId)
        .then((status) => {
          if (status.status === 'succeeded' || status.donationStatus === 'succeeded') {
            // Payment was successful
            alert('Payment successful! Thank you for your donation.');
            setAmount('');
            
            // Call callback after a short delay to ensure state updates
            if (onPaymentSuccess) {
              setTimeout(() => {
                onPaymentSuccess();
              }, 100);
            }
          }
        })
        .catch((error) => {
          console.error('Error verifying payment:', error);
          // Remove from processed set on error so it can retry
          processedSessionRef.current.delete(sessionId);
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

  const handleCardPayment = async (e) => {
    e.preventDefault();
    const donationAmount = Number(amount);

    if (!donationAmount || donationAmount <= 0) {
      alert('Please enter a donation amount');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentMethod('card');

    try {
      // Create checkout session and redirect to Stripe
      const { url } = await createCardCheckoutSession(
        bar._id || bar.id,
        donationAmount
      );

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
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
            onClick={handleCardPayment}
            className="donation-bar-card__button donation-bar-card__button--card"
            disabled={isProcessingPayment || !amount}
          >
            {isProcessingPayment ? 'Redirecting to Stripe...' : 'Add amount by Card'}
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
