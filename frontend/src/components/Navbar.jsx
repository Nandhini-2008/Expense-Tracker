import React from 'react';

function Navbar({ totalExpensesCount, serverConnected }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <circle cx="16" cy="15" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">Expense Tracker</h1>
            <p className="brand-subtitle">Smart Personal Finance & Budget Management</p>
          </div>
        </div>

        <div className="navbar-stats">
          <div className={`status-indicator ${serverConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            <span className="status-text">{serverConnected ? 'Backend Connected' : 'Server Offline'}</span>
          </div>

          <div className="navbar-badge">
            <span className="badge-label">Active Records:</span>
            <span className="badge-count" id="navbar-total-records">{totalExpensesCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
