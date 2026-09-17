import React, { useMemo } from 'react';

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

function Dashboard({ expenses = [] }) {
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentYearMonth = todayStr.substring(0, 7); // YYYY-MM

    let totalAmount = 0;
    let todayAmount = 0;
    let monthAmount = 0;

    expenses.forEach((item) => {
      const amt = parseFloat(item.amount) || 0;
      totalAmount += amt;

      if (item.date === todayStr) {
        todayAmount += amt;
      }

      if (item.date && item.date.startsWith(currentYearMonth)) {
        monthAmount += amt;
      }
    });

    return {
      totalAmount,
      totalCount: expenses.length,
      todayAmount,
      monthAmount,
    };
  }, [expenses]);

  return (
    <section className="dashboard-section" aria-label="Expenses Financial Overview">
      <div className="dashboard-grid">
        {/* Card 1: Total Expenses */}
        <div className="stat-card stat-primary">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="stat-badge">All Time</span>
          </div>
          <div className="stat-card-body">
            <p className="stat-label">Total Expenses</p>
            <h2 className="stat-value" id="dashboard-total-expenses">
              {formatCurrency(stats.totalAmount)}
            </h2>
          </div>
          <div className="stat-card-footer">
            <span className="stat-subtext">Sum of all tracked expenditures</span>
          </div>
        </div>

        {/* Card 2: Today's Expenses */}
        <div className="stat-card stat-warning">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper icon-amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="stat-badge">Today</span>
          </div>
          <div className="stat-card-body">
            <p className="stat-label">Today's Expenses</p>
            <h2 className="stat-value" id="dashboard-today-expenses">
              {formatCurrency(stats.todayAmount)}
            </h2>
          </div>
          <div className="stat-card-footer">
            <span className="stat-subtext">Expenses logged for current day</span>
          </div>
        </div>

        {/* Card 3: Current Month Expenses */}
        <div className="stat-card stat-success">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper icon-emerald">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="stat-badge">This Month</span>
          </div>
          <div className="stat-card-body">
            <p className="stat-label">This Month</p>
            <h2 className="stat-value" id="dashboard-month-expenses">
              {formatCurrency(stats.monthAmount)}
            </h2>
          </div>
          <div className="stat-card-footer">
            <span className="stat-subtext">Monthly expenditure progress</span>
          </div>
        </div>

        {/* Card 4: Total Records Count */}
        <div className="stat-card stat-purple">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper icon-violet">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <span className="stat-badge">Database</span>
          </div>
          <div className="stat-card-body">
            <p className="stat-label">Total Records</p>
            <h2 className="stat-value" id="dashboard-total-records">
              {stats.totalCount}
            </h2>
          </div>
          <div className="stat-card-footer">
            <span className="stat-subtext">Logged transactions in SQLite</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
