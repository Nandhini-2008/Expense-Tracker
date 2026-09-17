import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Education',
  'Bills',
  'Health',
  'Entertainment',
  'Other',
];

const INITIAL_FORM_STATE = {
  title: '',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
};

function ExpenseForm({ editingExpense, onSave, onCancelEdit, isSubmitting }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  // When editingExpense changes, populate or reset the form
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        category: editingExpense.category || '',
        date: editingExpense.date || new Date().toISOString().split('T')[0],
        description: editingExpense.description || '',
      });
      setErrors({});
    } else {
      setFormData({
        ...INITIAL_FORM_STATE,
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // 1. Title validation
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }

    // 2. Amount validation
    if (formData.amount === '' || formData.amount === null || formData.amount === undefined) {
      newErrors.amount = 'Amount is required.';
    } else {
      const num = Number(formData.amount);
      if (isNaN(num)) {
        newErrors.amount = 'Amount must be a valid number.';
      } else if (num <= 0) {
        newErrors.amount = 'Amount must be greater than 0.';
      }
    }

    // 3. Category validation
    if (!formData.category || !formData.category.trim()) {
      newErrors.category = 'Please select a category.';
    } else if (!CATEGORIES.includes(formData.category)) {
      newErrors.category = 'Please select a valid category from the list.';
    }

    // 4. Date validation
    if (!formData.date || !formData.date.trim()) {
      newErrors.date = 'Date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount).toFixed(2),
      category: formData.category,
      date: formData.date,
      description: formData.description ? formData.description.trim() : '',
    };

    const success = await onSave(payload, editingExpense ? editingExpense.id : null);
    if (success && !editingExpense) {
      // Clear form on add success
      setFormData({
        ...INITIAL_FORM_STATE,
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    }
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
    setFormData({
      ...INITIAL_FORM_STATE,
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  };

  return (
    <div className="card expense-form-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </div>
          <div>
            <h2 className="card-title">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <p className="card-subtitle">
              {editingExpense
                ? `Updating Record #${editingExpense.id} in SQLite database`
                : 'Enter expenditure details to track in real-time'}
            </p>
          </div>
        </div>
        {editingExpense && (
          <span className="badge badge-warning">Editing Mode</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="expense-form" noValidate id="expense-form">
        <div className="form-grid">
          {/* Title Field */}
          <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
            <label htmlFor="expense-title" className="form-label">
              Title <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="expense-title"
              name="title"
              className="form-input"
              placeholder="e.g. Team Lunch, Internet Bill"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.title && <span className="inline-error">{errors.title}</span>}
          </div>

          {/* Amount Field */}
          <div className={`form-group ${errors.amount ? 'has-error' : ''}`}>
            <label htmlFor="expense-amount" className="form-label">
              Amount (₹) <span className="required-star">*</span>
            </label>
            <div className="input-currency-wrapper">
              <span className="currency-prefix">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                id="expense-amount"
                name="amount"
                className="form-input currency-input"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.amount && <span className="inline-error">{errors.amount}</span>}
          </div>

          {/* Category Field */}
          <div className={`form-group ${errors.category ? 'has-error' : ''}`}>
            <label htmlFor="expense-category" className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <select
              id="expense-category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">-- Select Category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <span className="inline-error">{errors.category}</span>}
          </div>

          {/* Date Field */}
          <div className={`form-group ${errors.date ? 'has-error' : ''}`}>
            <label htmlFor="expense-date" className="form-label">
              Date <span className="required-star">*</span>
            </label>
            <input
              type="date"
              id="expense-date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.date && <span className="inline-error">{errors.date}</span>}
          </div>
        </div>

        {/* Description Field (Full Width) */}
        <div className="form-group full-width">
          <label htmlFor="expense-description" className="form-label">
            Description <span className="optional-tag">(Optional)</span>
          </label>
          <textarea
            id="expense-description"
            name="description"
            rows="3"
            className="form-textarea"
            placeholder="Add context, vendor, purpose, or notes..."
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Form Action Buttons */}
        <div className="form-actions">
          {editingExpense && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              id="btn-cancel-edit"
            >
              Cancel Edit
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            id="btn-submit-expense"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span>
                <span>Saving...</span>
              </>
            ) : editingExpense ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Update Expense</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add Expense</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
