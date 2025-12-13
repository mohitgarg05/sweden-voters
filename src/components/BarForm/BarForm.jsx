import { useState, useEffect } from 'react';
import './BarForm.css';

export default function BarForm({ bar, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    label: '',
    currentValue: 0,
    swishNumber: '',
    paypalUser: '',
    order: 0,
    isActive: true,
    about: '',
    color: '#2b7a78',
  });

  useEffect(() => {
    if (bar) {
      setFormData({
        label: bar.label || '',
        currentValue: bar.currentValue || 0,
        swishNumber: bar.swishNumber || '',
        paypalUser: bar.paypalUser || '',
        order: bar.order || 0,
        isActive: bar.isActive !== undefined ? bar.isActive : true,
        about: bar.about || '',
        color: bar.color || '#2b7a78',
      });
    }
  }, [bar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="bar-form" onSubmit={handleSubmit}>
      <h3 className="bar-form__title">{bar ? 'Edit Bar' : 'Create New Bar'}</h3>

      <div className="bar-form__row">
        <div className="bar-form__field">
          <label>Label</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bar-form__field">
          <label>Current Value</label>
          <input
            type="number"
            name="currentValue"
            value={formData.currentValue}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
      </div>

      <div className="bar-form__row">
        <div className="bar-form__field">
          <label>Swish Number</label>
          <input
            type="text"
            name="swishNumber"
            value={formData.swishNumber}
            onChange={handleChange}
            placeholder="+46700000001"
            required
          />
        </div>

        <div className="bar-form__field">
          <label>PayPal User</label>
          <input
            type="text"
            name="paypalUser"
            value={formData.paypalUser}
            onChange={handleChange}
            placeholder="yourname/"
            required
          />
        </div>
      </div>

      <div className="bar-form__row">
        <div className="bar-form__field">
          <label>Order</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="bar-form__field">
          <label className="bar-form__checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Active
          </label>
        </div>
      </div>

      <div className="bar-form__row">
        <div className="bar-form__field bar-form__field--full">
          <label>About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Enter information about this bar..."
            rows="3"
          />
        </div>
      </div>

      <div className="bar-form__row">
        <div className="bar-form__field">
          <label>Color</label>
          <div className="bar-form__color-wrapper">
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="bar-form__color-input"
            />
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="#2b7a78 or rgb(43, 122, 120)"
              className="bar-form__color-text"
            />
          </div>
        </div>
      </div>

      <div className="bar-form__actions">
        <button type="submit" className="bar-form__submit">
          {bar ? 'Update' : 'Create'}
        </button>
        <button type="button" className="bar-form__cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

