import { useCallback } from 'react';
import { useDonationBars } from '../../hooks/useDonationBars';
import DonationChart from '../../components/DonationChart/DonationChart';
import DonationBarCard from '../../components/DonationBarCard/DonationBarCard';
import './DonationBars.css';

export default function DonationBars() {
  const { bars, loading, error, addDonationToBar } = useDonationBars();

  const handleDonate = useCallback(
    async (barIndex, amount) => {
      await addDonationToBar(barIndex, amount);
    },
    [addDonationToBar]
  );

  if (loading) {
    return (
      <div className="donation-bars-page">
        <div className="donation-bars-page__loading">
          Loading donation bars...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="donation-bars-page">
        <div className="donation-bars-page__error">
          Error loading donation bars: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="donation-bars-page">
      <div className="donation-bars-page__container">
        <header className="donation-bars-page__header">
          <h1>Interactive Donation Bars</h1>
          <p className="donation-bars-page__description">
            Click a donate button (Swish or PayPal) or enter an amount and press
            the green button to simulate a donation. The bar will increase in real
            time (animated over ~1.5s). Replace the placeholder Swish numbers /
            PayPal IDs below with your actual mobile/paypal links.
          </p>
        </header>

        <div className="donation-bars-page__chart-wrap">
          <DonationChart bars={bars} />

          <div className="donation-bars-page__controls">
            {bars.map((bar, index) => (
              <DonationBarCard
                key={bar.id || index}
                bar={bar}
                onDonate={(amount) => handleDonate(index, amount)}
              />
            ))}
          </div>
        </div>

        <footer className="donation-bars-page__footer">
          <p className="donation-bars-page__notes">
            <strong>Notes:</strong> The page generates QR codes using a client-side
            library (qrcode.react). For production you may prefer to generate QR codes
            server-side or secure your payment links. Swish links and PayPal links
            below are placeholders — replace them with your actual Swish mobile
            numbers (format +467xxxxxxxx) or PayPal.me usernames.
          </p>
        </footer>
      </div>
    </div>
  );
}

