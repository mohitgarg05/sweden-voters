import { useCallback, useEffect } from 'react';
import { useDonationBars } from '../../hooks/useDonationBars';
import DonationChart from '../../components/DonationChart/DonationChart';
import DonationBarCard from '../../components/DonationBarCard/DonationBarCard';
import Footer from '../../components/Footer';
import './DonationBars.css';

export default function DonationBars() {
  const { bars, loading, error, addDonationToBar, reloadBars } = useDonationBars();

  useEffect(() => {
    document.title = 'Intelligence meter website';
  }, []);

  const handleDonate = useCallback(
    async (barIndex, amount) => {
      await addDonationToBar(barIndex, amount);
    },
    [addDonationToBar]
  );

  const handlePaymentSuccess = useCallback(() => {
    // Reload bars to get updated values after successful Stripe payment
    // (donation is already recorded by webhook)
    reloadBars();
  }, [reloadBars]);

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
          in Sweden you think Thomas Nordholm with a background as a spy should
          reveal
          intelligence to by August 1 in 2026. Follow the donation instructions.

          The party with the highest bar in August 1 in 2026 is the one that the
          people consider most honest to turn
          to. Nordholm has empirically decided two previous parliamentary
          elections.
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
                onPaymentSuccess={handlePaymentSuccess}
              />
            ))}
          </div>
        </div>

        <footer className="donation-bars-page__footer">
          <p className="donation-bars-page__notes">
            <strong>Notes:</strong> Payments are processed securely through Stripe. Swish payments are
            handled via the Stripe payment platform.
          </p>
        </footer>
      </div>
      <Footer />
    </div>
  );
}
