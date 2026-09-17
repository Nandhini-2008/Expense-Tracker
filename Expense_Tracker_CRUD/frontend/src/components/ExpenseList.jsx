import React from 'react';

/**
 * Format currency with Indian Rupee symbol and 2 decimal places
 */
function formatCurrency(num) {
  const parsed = Number(num) || 0;
  return `₹${parsed.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Category badge color mapping
 */
const CATEGORY_COLORS = {
  Food: 'badge-food',
  Travel: 'badge-travel',
  Shopping: 'badge-shopping',
  Education: 'badge-education',
  Bills: 'badge-bills',
  Health: 'badge-health',
  Entertainment: 'badge-entertainment',
  Other: 'badge-other',
};

function ExpenseList({
  expenses,
  totalRawExpenses,
  isLoading,
  onEdit,
  onInitiateDelete,
  onClearFilters,
}) {
  if (isLoading) {
    return (
      <div className="card expense-list-card">
        <div className="state-container loading-state">
          <div className="spinner-large"></div>
          <p className="state-title">Loading expenses from server...</p>
          <p className="state-subtitle">Communicating with SQLite via Django REST API</p>
        </div>
      </div>
    );
  }

  // If the database has 0 total expenses
  if (totalRawExpenses === 0) {
    return (
      <div className="card expense-list-card">
        <div className="state-container empty-state">
          <div className="empty-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <h3 className="empty-title">No expenses found.</h3>
          <p className="empty-description">
            Your expense database is currently empty. Use the form above to log your first expenditure!
          </p>
        </div>
      </div>
    );
  }

  // If database has records, but filters/search yielded 0 matches
  if (expenses.length === 0) {
    return (
      <div className="card expense-list-card">
        <div className="state-container no-match-state">
          <div className="empty-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <h3 className="empty-title">No matching expenses found.</h3>
          <p className="empty-description">
            No records matched your current search query or category filter.
          </p>
          {onClearFilters && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClearFilters}
            >
              Reset Filters & Search
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card expense-list-card">
      <div className="card-header list-card-header">
        <div className="card-title-group">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>
          <div>
            <h2 className="card-title">Expense Transactions</h2>
            <p className="card-subtitle">
              Showing {expenses.length} of {totalRawExpenses} total records stored in SQLite
            </p>
          </div>
        </div>
      </div>

      {/* Desktop & Tablet Table View */}
      <div className="table-responsive">
        <table className="expense-table" id="expense-table">
          <thead>
            <tr>
              <th scope="col" className="col-id">ID</th>
              <th scope="col" className="col-title">Title</th>
              <th scope="col" className="col-amount">Amount</th>
              <th scope="col" className="col-category">Category</th>
              <th scope="col" className="col-date">Date</th>
              <th scope="col" className="col-description">Description</th>
              <th scope="col" className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const categoryBadgeClass = CATEGORY_COLORS[expense.category] || 'badge-other';
              return (
                <tr key={expense.id} className="expense-table-row" id={`expense-row-${expense.id}`}>
                  <td className="col-id">
                    <span className="id-badge">#{expense.id}</span>
                  </td>
                  <td className="col-title font-medium">{expense.title}</td>
                  <td className="col-amount font-semibold">
                    <span className="amount-display">{formatCurrency(expense.amount)}</span>
                  </td>
                  <td className="col-category">
                    <span className={`category-tag ${categoryBadgeClass}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="col-date text-muted">{expense.date}</td>
                  <td className="col-description text-muted">
                    {expense.description ? (
                      <span title={expense.description}>{expense.description}</span>
                    ) : (
                      <span className="no-desc">—</span>
                    )}
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={() => onEdit(expense)}
                        title={`Edit expense #${expense.id}`}
                        aria-label={`Edit expense ${expense.title}`}
                        id={`btn-edit-${expense.id}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="btn-action btn-delete"
                        onClick={() => onInitiateDelete(expense)}
                        title={`Delete expense #${expense.id}`}
                        aria-label={`Delete expense ${expense.title}`}
                        id={`btn-delete-${expense.id}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="mobile-cards-list">
        {expenses.map((expense) => {
          const categoryBadgeClass = CATEGORY_COLORS[expense.category] || 'badge-other';
          return (
            <div key={expense.id} className="mobile-expense-card" id={`mobile-expense-${expense.id}`}>
              <div className="mobile-card-top">
                <div className="mobile-card-title-group">
                  <span className="id-badge">#{expense.id}</span>
                  <h4 className="mobile-card-title">{expense.title}</h4>
                </div>
                <span className="mobile-card-amount">{formatCurrency(expense.amount)}</span>
              </div>

              <div className="mobile-card-meta">
                <span className={`category-tag ${categoryBadgeClass}`}>{expense.category}</span>
                <span className="mobile-card-date">{expense.date}</span>
              </div>

              {expense.description && (
                <p className="mobile-card-desc">{expense.description}</p>
              )}

              <div className="mobile-card-actions">
                <button
                  type="button"
                  className="btn-action btn-edit"
                  onClick={() => onEdit(expense)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-action btn-delete"
                  onClick={() => onInitiateDelete(expense)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExpenseList;
