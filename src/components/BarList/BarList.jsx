import './BarList.css';

export default function BarList({ bars, onEdit, onDelete }) {
  if (bars.length === 0) {
    return <div className="bar-list__empty">No bars found. Create your first bar!</div>;
  }

  return (
    <div className="bar-list">
      <table className="bar-list__table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Current Value</th>
            <th>Swish Number</th>
            <th>PayPal User</th>
            <th>Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bars.map((bar) => (
            <tr key={bar._id || bar.id}>
              <td>{bar.label}</td>
              <td>{bar.currentValue}</td>
              <td>{bar.swishNumber}</td>
              <td>{bar.paypalUser}</td>
              <td>{bar.order}</td>
              <td>
                <span className={`bar-list__status ${bar.isActive ? 'active' : 'inactive'}`}>
                  {bar.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="bar-list__actions">
                  <button
                    className="bar-list__edit-btn"
                    onClick={() => onEdit(bar)}
                  >
                    Edit
                  </button>
                  <button
                    className="bar-list__delete-btn"
                    onClick={() => onDelete(bar._id || bar.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

