import React, { useEffect } from 'react';

function DeleteModal({ expense, isOpen, onConfirm, onCancel, isDeleting }) {
  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !expense) {
    return null;
  }

  const formattedAmount = `₹${(parseFloat(expense.amount) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-warning-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h3 id="modal-title" className="modal-title">Confirm Deletion</h3>
        <p className="modal-message">
          Are you sure you want to delete this expense?
        </p>

        {/* Expense Summary Box */}
        <div className="modal-target-card">
          <div className="modal-target-row">
            <span className="target-label">Title:</span>
            <span className="target-value">{expense.title}</span>
          </div>
          <div className="modal-target-row">
            <span className="target-label">Amount:</span>
            <span className="target-value target-amount">{formattedAmount}</span>
          </div>
          <div className="modal-target-row">
            <span className="target-label">Category / Date:</span>
            <span className="target-value">{expense.category} • {expense.date}</span>
          </div>
        </div>

        <p className="modal-subtext">This action will permanently remove the record from the database.</p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
            id="modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(expense.id)}
            disabled={isDeleting}
            id="modal-confirm-delete-btn"
          >
            {isDeleting ? (
              <>
                <span className="spinner-small"></span>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
