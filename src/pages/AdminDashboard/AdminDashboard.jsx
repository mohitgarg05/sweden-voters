import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchBarsAdmin, createBar, updateBar, deleteBar } from '../../services/api';
import { fetchDonations, fetchDonationStats } from '../../services/api';
import BarManagement from '../../components/BarManagement/BarManagement';
import DonationsView from '../../components/DonationsView/DonationsView';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bars');
  const [bars, setBars] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    document.title = 'Intelligence meter website';
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [barsData, donationsData, statsData] = await Promise.all([
        fetchBarsAdmin(),
        fetchDonations({ limit: 100 }),
        fetchDonationStats(),
      ]);
      setBars(barsData);
      setDonations(donationsData.donations || donationsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBar = async (barData) => {
    try {
      const newBar = await createBar(barData);
      setBars([...bars, newBar]);
      return newBar;
    } catch (err) {
      console.error('Failed to create bar:', err);
      throw err;
    }
  };

  const handleUpdateBar = async (barId, barData) => {
    try {
      const updatedBar = await updateBar(barId, barData);
      setBars(bars.map((bar) => (bar._id === barId || bar.id === barId ? updatedBar : bar)));
      return updatedBar;
    } catch (err) {
      console.error('Failed to update bar:', err);
      throw err;
    }
  };

  const handleDeleteBar = async (barId) => {
    try {
      await deleteBar(barId);
      setBars(bars.filter((bar) => (bar._id || bar.id) !== barId));
    } catch (err) {
      console.error('Failed to delete bar:', err);
      throw err;
    }
  };

  return (
    <div className="admin-dashboard">
        <div className="admin-dashboard__container">
        {loading && <div className="admin-dashboard__loading">Loading...</div>}
        {error && <div className="admin-dashboard__error">Error: {error}</div>}
        {!loading && !error && (
          <>
        <div className="admin-dashboard__header">
          <h1 className="admin-dashboard__title">Admin Dashboard</h1>
          <button className="admin-dashboard__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="admin-dashboard__tabs">
          <button
            className={`admin-dashboard__tab ${activeTab === 'bars' ? 'active' : ''}`}
            onClick={() => setActiveTab('bars')}
          >
            Bars Management
          </button>
          <button
            className={`admin-dashboard__tab ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            Donations
          </button>
        </div>

        <div className="admin-dashboard__content">
          {activeTab === 'bars' && (
            <BarManagement
              bars={bars}
              onCreateBar={handleCreateBar}
              onUpdateBar={handleUpdateBar}
              onDeleteBar={handleDeleteBar}
              onReload={loadData}
            />
          )}
          {activeTab === 'donations' && (
            <DonationsView donations={donations} stats={stats} onReload={loadData} />
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}

