import { useState } from 'react';
import QRCode from '../QRCode/QRCode';
import { makeSwishLink, makePaypalLink } from '../../utils/payment';
import './DonationBarCard.css';

export default function DonationBarCard({ bar, onDonate }) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const donationAmount = Number(amount);

    if (donationAmount <= 0) {
      alert('Please enter an amount greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await onDonate(donationAmount);
      setAmount('');
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Failed to process donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const swishLink = makeSwishLink(bar.swishNumber);
  const paypalLink = makePaypalLink(bar.paypalUser);

  return (
    <div className="donation-bar-card">
      <div className="donation-bar-card__title">{bar.label}</div>
      
      <div className="donation-bar-card__value">
        Current: {bar.currentValue}
      </div>

      <form onSubmit={handleSubmit} className="donation-bar-card__form">
        <input
          type="number"
          min="1"
          step="1"
          placeholder="Amount (e.g. 50)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="donation-bar-card__input"
          disabled={isSubmitting}
        />

        <button
          type="submit"
          className="donation-bar-card__button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Add amount (simulate)'}
        </button>
      </form>

      <div className="donation-bar-card__qr">
        <QRCode
          value={swishLink}
          title={`Swish: ${bar.swishNumber}`}
          onClick={() => window.open(swishLink, '_blank')}
        />
        <QRCode
          value={paypalLink}
          title={`PayPal: ${bar.paypalUser}`}
          onClick={() => window.open(paypalLink, '_blank')}
        />
      </div>
    </div>
  );
}

