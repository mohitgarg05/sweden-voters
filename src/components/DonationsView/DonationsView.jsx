import { useState } from 'react';
import { completeSwishDonation } from '../../services/api';
import './DonationsView.css';

export default function DonationsView({ donations, stats, onReload }) {
  const [filterBar, setFilterBar] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleCompleteSwish = async (donationId) => {
    if (!window.confirm('Mark this Swish donation as completed and update the bar total?')) {
      return;
    }
    try {
      await completeSwishDonation(donationId);
      if (onReload) {
        await onReload();
      }
    } catch (error) {
      console.error('Failed to complete Swish donation:', error);
      alert('Failed to complete Swish donation. Please try again.');
    }
  };

  const filteredDonations = filterBar
    ? donations.filter((d) => (d.barId?._id || d.barId?.id || d.barId) === filterBar)
    : donations;

  return (
    <div className="donations-view">
      <div className="donations-view__header">
        <h2>Donations</h2>
        <button className="donations-view__refresh-btn" onClick={onReload}>
          Refresh
        </button>
      </div>

      {stats && (
        <div className="donations-view__stats">
          <div className="donations-view__stat">
            <span className="donations-view__stat-label">Total Donations</span>
            <span className="donations-view__stat-value">{stats.totalDonations || 0}</span>
          </div>
          <div className="donations-view__stat">
            <span className="donations-view__stat-label">Total Amount</span>
            <span className="donations-view__stat-value">
              {stats.totalAmount?.toFixed(2) || '0.00'} SEK
            </span>
          </div>
          <div className="donations-view__stat">
            <span className="donations-view__stat-label">Average Amount</span>
            <span className="donations-view__stat-value">
              {stats.averageAmount?.toFixed(2) || '0.00'} SEK
            </span>
          </div>
        </div>
      )}

      <div className="donations-view__filter">
        <select
          value={filterBar}
          onChange={(e) => setFilterBar(e.target.value)}
          className="donations-view__filter-select"
        >
          <option value="">All Bars</option>
        </select>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="donations-view__empty">No donations found.</div>
      ) : (
        <div className="donations-view__table-wrapper">
          <table className="donations-view__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Bar</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Order / Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((donation) => {
                const id = donation._id || donation.id;
                const isSwish = donation.paymentMethod === 'swish';
                const swishStatus = donation.swishStatus || 'pending';
                const statusLabel =
                  isSwish ? `Swish: ${swishStatus}` : donation.stripePaymentStatus || 'pending';
                const orderOrMessage =
                  donation.swishOrderId ||
                  donation.donorInfo?.message ||
                  donation.donorInfo?.note ||
                  '';

                return (
                  <tr key={id}>
                    <td>{formatDate(donation.createdAt)}</td>
                    <td>{donation.barId?.label || 'N/A'}</td>
                    <td className="donations-view__amount">{donation.amount} SEK</td>
                    <td>
                      <span className={`donations-view__method ${donation.paymentMethod || 'manual'}`}>
                        {donation.paymentMethod || 'manual'}
                      </span>
                    </td>
                    <td>
                      <span className={`donations-view__status ${statusLabel.replace(/\s+/g, '-').toLowerCase()}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td>{orderOrMessage}</td>
                    <td>
                      {isSwish && swishStatus === 'pending' && (
                        <button
                          type="button"
                          className="donations-view__action-btn"
                          onClick={() => handleCompleteSwish(id)}
                        >
                          Mark Swish as Completed
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

