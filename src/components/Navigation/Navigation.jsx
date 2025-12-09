import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <div className="navigation__brand">Admin Dashboard</div>
        <div className="navigation__links">
          {isAuthenticated && (
            <button className="navigation__logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

