import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import ExpenseList from './components/ExpenseList';
import DeleteModal from './components/DeleteModal';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from './services/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverConnected, setServerConnected] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Search, Filter, Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  // Interactive modal/form states
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Show notification helper with auto-clear
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all expenses from backend
  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setGlobalError(null);
    try {
      const data = await getExpenses();
      setExpenses(Array.isArray(data) ? data : []);
      setServerConnected(true);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setServerConnected(false);
      setGlobalError(err.message || 'Unable to connect to server. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Handle Add or Update Expense
  const handleSaveExpense = async (formData, expenseId) => {
    setIsSubmitting(true);
    try {
      if (expenseId) {
        // PUT update
        const updated = await updateExpense(expenseId, formData);
        setExpenses((prev) =>
          prev.map((item) => (item.id === expenseId ? updated : item))
        );
        showNotification(`Expense "${updated.title}" updated successfully!`, 'success');
        setEditingExpense(null);
      } else {
        // POST create
        const created = await createExpense(formData);
        // Prepend new expense
        setExpenses((prev) => [created, ...prev]);
        showNotification(`Expense "${created.title}" added successfully!`, 'success');
      }
      setServerConnected(true);
      return true;
    } catch (err) {
      console.error('Save expense failed:', err);
      let errorMsg = err.message || 'Failed to save expense.';
      if (err.data && typeof err.data === 'object') {
        // Extract validation field errors
        const details = Object.entries(err.data)
          .map(([key, msgs]) => `${key}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(' | ');
        errorMsg = details || errorMsg;
      }
      showNotification(errorMsg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit initiation (scroll smoothly to form)
  const handleEditInitiate = (expense) => {
    setEditingExpense(expense);
    const formElement = document.getElementById('expense-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await deleteExpense(id);
      const deletedTitle = deletingExpense ? deletingExpense.title : `Record #${id}`;
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      showNotification(`Expense "${deletedTitle}" deleted successfully!`, 'success');
      setDeletingExpense(null);
      // If currently editing this item, cancel editing
      if (editingExpense && editingExpense.id === id) {
        setEditingExpense(null);
      }
    } catch (err) {
      console.error('Delete expense failed:', err);
      showNotification(err.message || 'Failed to delete expense.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset all search and filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('date-desc');
  };

  // Filter and Sort Pipeline
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // 1. Search Query filter (Title & Description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // 2. Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'amount-asc') {
        return parseFloat(a.amount) - parseFloat(b.amount);
      }
      if (sortBy === 'amount-desc') {
        return parseFloat(b.amount) - parseFloat(a.amount);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      }
      // Default: date-desc (newest date first, then by highest ID)
      const dateComparison = new Date(b.date) - new Date(a.date);
      if (dateComparison !== 0) return dateComparison;
      return (b.id || 0) - (a.id || 0);
    });

    return result;
  }, [expenses, searchQuery, selectedCategory, sortBy]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || sortBy !== 'date-desc';

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`toast-notification toast-${notification.type}`} role="alert">
          <div className="toast-icon">
            {notification.type === 'success' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>
          <p className="toast-message">{notification.message}</p>
          <button
            type="button"
            className="toast-close"
            onClick={() => setNotification(null)}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        totalExpensesCount={expenses.length}
        serverConnected={serverConnected}
      />

      <main className="main-content">
        {/* Global Connection Error Banner */}
        {globalError && (
          <div className="global-error-banner" role="alert">
            <div className="error-banner-content">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <strong>Backend Unavailable:</strong> {globalError}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fetchExpenses}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Financial Overview Dashboard */}
        <Dashboard expenses={expenses} />

        {/* Two-Column or Stacked Workspace: Form on Left, List & Controls on Right */}
        <div className="workspace-grid">
          {/* Form Column */}
          <aside className="workspace-sidebar">
            <ExpenseForm
              editingExpense={editingExpense}
              onSave={handleSaveExpense}
              onCancelEdit={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </aside>

          {/* List & Controls Column */}
          <section className="workspace-main">
            {/* Search and Filters */}
            <div className="controls-card">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                totalMatches={filteredAndSortedExpenses.length}
              />

              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* Expense Records List */}
            <ExpenseList
              expenses={filteredAndSortedExpenses}
              totalRawExpenses={expenses.length}
              isLoading={isLoading}
              onEdit={handleEditInitiate}
              onInitiateDelete={(exp) => setDeletingExpense(exp)}
              onClearFilters={handleResetFilters}
            />
          </section>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        expense={deletingExpense}
        isOpen={Boolean(deletingExpense)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingExpense(null)}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Expense Tracker CRUD Application &bull; Built with React, Vite, Django REST Framework, and SQLite
        </p>
      </footer>
    </div>
  );
}

export default App;
