/**
 * Centralized API Service for Expense Tracker
 * Communicates with Django REST Framework backend on http://localhost:8000/api
 */

const BASE_URL = 'http://localhost:8000/api';

/**
 * Helper function to handle fetch requests with standard error parsing
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new Error('Unable to connect to server. Please make sure the backend is running.');
  }

  // Handle 204 No Content (commonly returned by DELETE)
  if (response.status === 204) {
    return { success: true };
  }

  // Parse JSON response body
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (response.status === 404) {
      const msg = (data && data.detail) ? data.detail : 'Expense not found.';
      const err = new Error(msg);
      err.status = 404;
      err.data = data;
      throw err;
    }

    if (response.status === 400) {
      // Validation error dictionary or detail
      const err = new Error('Validation failed. Please check the input fields.');
      err.status = 400;
      err.data = data; // { title: [...], amount: [...] }
      throw err;
    }

    if (response.status >= 500) {
      const msg = (data && data.detail) ? data.detail : 'An unexpected server error occurred. Please try again later.';
      const err = new Error(msg);
      err.status = response.status;
      throw err;
    }

    const defaultMsg = (data && data.detail) || `Request failed with status ${response.status}`;
    const err = new Error(defaultMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

/**
 * Fetch all expenses from backend
 * GET /api/expenses/
 */
export async function getExpenses() {
  return await request('/expenses/');
}

/**
 * Fetch a single expense by ID
 * GET /api/expenses/<id>/
 */
export async function getExpense(id) {
  return await request(`/expenses/${id}/`);
}

/**
 * Create a new expense
 * POST /api/expenses/
 */
export async function createExpense(expenseData) {
  return await request('/expenses/', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  });
}

/**
 * Update an existing expense
 * PUT /api/expenses/<id>/
 */
export async function updateExpense(id, expenseData) {
  return await request(`/expenses/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(expenseData),
  });
}

/**
 * Delete an expense by ID
 * DELETE /api/expenses/<id>/
 */
export async function deleteExpense(id) {
  return await request(`/expenses/${id}/`, {
    method: 'DELETE',
  });
}
