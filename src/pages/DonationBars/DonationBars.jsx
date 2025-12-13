import { useCallback, useEffect } from 'react';
import { useDonationBars } from '../../hooks/useDonationBars';
import DonationChart from '../../components/DonationChart/DonationChart';
import DonationBarCard from '../../components/DonationBarCard/DonationBarCard';
import './DonationBars.css';

export default function DonationBars() {
  const { bars, loading, error, addDonationToBar } = useDonationBars();

  useEffect(() => {
    document.title = 'Intelligence meter website';
  }, []);

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
          <h1>Intelligence meter</h1>
          <p className="donation-bars-page__description">
          Support our website's work in investigating which parliamentary party
          in Sweden you think former spy Thomas Nordholm should reveal
          intelligence to in July 2026. Donate below. The party with the highest
          bar in July 2026 is the one that the people consider most honest to turn
          to.
          </p>
        </header>

        <div className="donation-bars-page__chart-wrap">
          <DonationChart bars={bars} />

          <div className="donation-bars-page__controls">
            {bars.map((bar, index) => (
              <DonationBarCard
                key={bar._id || bar.id || index}
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

