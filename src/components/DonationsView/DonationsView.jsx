import { useState } from 'react';
import './DonationsView.css';

export default function DonationsView({ donations, stats, onReload }) {
  const [filterBar, setFilterBar] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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
                <th>Donor Info</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((donation) => (
                <tr key={donation._id || donation.id}>
                  <td>{formatDate(donation.createdAt)}</td>
                  <td>{donation.barId?.label || 'N/A'}</td>
                  <td className="donations-view__amount">{donation.amount} SEK</td>
                  <td>
                    <span className={`donations-view__method ${donation.paymentMethod || 'manual'}`}>
                      {donation.paymentMethod || 'manual'}
                    </span>
                  </td>
                  <td>
                    {donation.donorInfo?.name && (
                      <div>{donation.donorInfo.name}</div>
                    )}
                    {donation.donorInfo?.email && (
                      <div className="donations-view__email">{donation.donorInfo.email}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

