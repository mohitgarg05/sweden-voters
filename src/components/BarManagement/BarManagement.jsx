import { useState } from 'react';
import BarForm from '../BarForm/BarForm';
import BarList from '../BarList/BarList';
import './BarManagement.css';

export default function BarManagement({ bars, onCreateBar, onUpdateBar, onDeleteBar, onReload }) {
  const [editingBar, setEditingBar] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (bar) => {
    setEditingBar(bar);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingBar(null);
    setShowForm(false);
  };

  const handleSubmit = async (barData) => {
    try {
      if (editingBar) {
        const barId = editingBar._id || editingBar.id;
        await onUpdateBar(barId, barData);
      } else {
        await onCreateBar(barData);
      }
      handleCancel();
      if (onReload) await onReload();
    } catch (error) {
      alert(error.message || 'Failed to save bar');
    }
  };

  const handleDelete = async (barId) => {
    if (window.confirm('Are you sure you want to delete this bar?')) {
      try {
        await onDeleteBar(barId);
        if (onReload) await onReload();
      } catch (error) {
        alert(error.message || 'Failed to delete bar');
      }
    }
  };

  return (
    <div className="bar-management">
      <div className="bar-management__header">
        <h2>Bars Management</h2>
        <button
          className="bar-management__add-btn"
          onClick={() => {
            setEditingBar(null);
            setShowForm(true);
          }}
        >
          + Add New Bar
        </button>
      </div>

      {showForm && (
        <div className="bar-management__form-wrapper">
          <BarForm
            bar={editingBar}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      <BarList bars={bars} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

