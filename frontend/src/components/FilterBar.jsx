import React from 'react';

const CATEGORIES = [
  'All',
  'Food',
  'Travel',
  'Shopping',
  'Education',
  'Bills',
  'Health',
  'Entertainment',
  'Other',
];

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date: Newest First' },
  { value: 'date-asc', label: 'Date: Oldest First' },
  { value: 'amount-asc', label: 'Amount: Low to High' },
  { value: 'amount-desc', label: 'Amount: High to Low' },
];

function FilterBar({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}) {
  return (
    <div className="filter-bar-container">
      {/* Category Filter Pills / Dropdown */}
      <div className="filter-category-group">
        <label className="filter-group-label" htmlFor="category-select">
          Category:
        </label>
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
              id={`filter-category-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile select fallback */}
        <select
          id="category-select"
          className="category-mobile-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              Category: {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting Dropdown & Reset */}
      <div className="filter-controls-right">
        <div className="sort-wrapper">
          <label htmlFor="sort-select" className="sort-label">
            Sort by:
          </label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn-reset-filters"
            onClick={onResetFilters}
            title="Reset filters and sorting"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="reset-icon">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
