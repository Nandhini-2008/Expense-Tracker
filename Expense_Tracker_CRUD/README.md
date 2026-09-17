# EXPENSE TRACKER - Full-Stack CRUD Application

A production-quality, responsive personal finance and expense management web application built with **React (Vite)**, **Django REST Framework (DRF)**, and **SQLite**.

---

## 1. Project Overview

The **Expense Tracker** empowers users to record, categorize, track, analyze, and manage their daily financial expenses in real time. Designed with a clean dark-mode design system, modern typography, dynamic visual statistics, and responsive layouts, it provides an intuitive interface for managing personal budgets while persisting all records in a relational SQLite database via Django ORM.

---

## 2. Problem Statement

Managing personal expenditures without dedicated software often leads to missed expense tracking, lack of visibility into category-wise spending patterns, and difficulty computing daily and monthly budgets. Spreadsheets can be cumbersome and error-prone on mobile devices. There is a need for a lightweight, fast, secure, and intuitive web application providing instant CRUD operations, validation, dynamic filtering, sorting, searching, and real-time dashboard analytics.

---

## 3. Objectives

- Deliver a complete decoupled full-stack architecture with a React SPA frontend and a Django REST Framework backend.
- Ensure strict database persistence using SQLite and Django ORM with zero reliance on mock or local storage data.
- Provide end-to-end CRUD operations (Create, Read, Update, Delete) with confirmation modals.
- Deliver real-time financial metrics (Total Expenses, Today's Spending, This Month's Spending, and Total Record Count).
- Enforce dual-layer validation (both client-side and server-side).
- Provide dynamic search, category filtering, and sorting capabilities.
- Maintain full test coverage with automated backend tests and documented Postman test suites.

---

## 4. Key Features

- **Real-Time Financial Dashboard**:
  - **Total Expenses**: Formatted in currency (₹) calculating all-time spending.
  - **Today's Expenses**: Automatically aggregates transactions logged for the current date.
  - **This Month's Expenses**: Sums all transactions recorded in the current calendar month.
  - **Total Records**: Tracks count of transactions stored in SQLite.
  - All dashboard figures update dynamically whenever an expense is added, edited, or deleted.

- **Expense Management (CRUD)**:
  - **Add Expense**: Form with inputs for Title, Amount, Category dropdown, Date picker, and optional Description.
  - **View Expenses**: Responsive data table on desktop/tablet and structured card view on mobile.
  - **Update Expense**: Click "Edit" to prefill the form, modify fields, and submit updates via `PUT`.
  - **Delete Expense**: Click "Delete" to launch a modal confirmation dialogue preventing accidental deletion.

- **Search, Filter & Sort**:
  - **Search**: Dynamic instant search across both Title and Description.
  - **Category Filter**: Filter by `All`, `Food`, `Travel`, `Shopping`, `Education`, `Bills`, `Health`, `Entertainment`, and `Other`.
  - **Sorting**: 4-way sorting by `Date: Newest First`, `Date: Oldest First`, `Amount: Low to High`, and `Amount: High to Low`.

- **Dual-Layer Validation**:
  - Client-side inline error prompts before API dispatch.
  - Server-side validation via Django REST Framework serializers returning readable HTTP 400 error dictionaries.

- **Resilient Error Handling**:
  - Gracefully detects backend unavailability with a user-friendly reconnect notification.
  - Friendly toast notifications for successful operations and failure notices.

---

## 5. Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: JavaScript (ESModules)
- **Styling**: Vanilla CSS3 (Custom Design System, CSS Variables, Glassmorphism, Responsive Grid/Flexbox)
- **Icons**: Inline SVG Icons
- **Typography**: Plus Jakarta Sans & JetBrains Mono (Google Fonts)

### Backend
- **Language**: Python 3.11+
- **Framework**: Django 5.x
- **API Framework**: Django REST Framework (DRF) 3.15+
- **CORS Handling**: `django-cors-headers`
- **Database**: SQLite 3 (`backend/db.sqlite3`)
- **ORM**: Django Object-Relational Mapping (ORM)

### Testing & Tools
- **API Testing**: Postman Collection / PowerShell REST calls
- **Automated Tests**: Django `rest_framework.test.APITestCase`
- **Version Control**: Git & GitHub

---

## 6. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      User / Web Browser                         │
│                    (http://localhost:5173)                      │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                     User Actions & Input Events
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend Components                    │
│   (Navbar, Dashboard, ExpenseForm, ExpenseList, Search, Filter) │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                   Centralized API Service (fetch)
                    (frontend/src/services/api.js)
                                 │
                HTTP / JSON Requests with CORS Headers
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Django REST Framework Backend                   │
│                     (http://localhost:8000)                     │
│  ├── CORS Middleware (django-cors-headers)                      │
│  ├── URL Router (expense_api/urls.py -> expenses/urls.py)       │
│  ├── Views (ExpenseListCreateView, ExpenseDetailView)           │
│  └── Serializers (ExpenseSerializer with validation)           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                        Django ORM Queries
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SQLite Database Engine                      │
│                      (backend/db.sqlite3)                       │
│                     Table: expenses_expense                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Database Design

The `Expense` model is defined in `backend/expenses/models.py`:

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | BigAutoField | Primary Key, Auto-increment | Unique identifier for each expense record |
| `title` | CharField | `max_length=100`, `null=False`, `blank=False` | Short title or name of the expense |
| `amount` | DecimalField | `max_digits=10`, `decimal_places=2`, `> 0` | Cost in currency, validated via `MinValueValidator` |
| `category` | CharField | `max_length=50`, `choices=CATEGORY_CHOICES` | Category from allowed list |
| `date` | DateField | `null=False`, `blank=False` | Date when expense took place (YYYY-MM-DD) |
| `description` | TextField | `blank=True`, `default=""` | Optional detailed notes |
| `created_at` | DateTimeField | `auto_now_add=True` | Timestamp when record was created |
| `updated_at` | DateTimeField | `auto_now=True` | Timestamp when record was last modified |

### Allowed Categories:
1. `Food`
2. `Travel`
3. `Shopping`
4. `Education`
5. `Bills`
6. `Health`
7. `Entertainment`
8. `Other`

---

## 8. REST API Endpoints Specification

Base URL: `http://localhost:8000/api`

| HTTP Method | Endpoint | Description | Request Body | Success Status | Error Status |
|---|---|---|---|---|---|
| `GET` | `/api/expenses/` | List all expenses | None | `200 OK` (JSON Array) | `500 Internal Server Error` |
| `POST` | `/api/expenses/` | Create a new expense | JSON object with required fields | `201 Created` | `400 Bad Request` |
| `GET` | `/api/expenses/<id>/` | Retrieve one expense | None | `200 OK` (JSON Object) | `404 Not Found` |
| `PUT` | `/api/expenses/<id>/` | Replace an existing expense | JSON object with all fields | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `PATCH` | `/api/expenses/<id>/` | Partially update an expense | JSON object with partial fields | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/expenses/<id>/` | Remove an expense | None | `204 No Content` | `404 Not Found` |

### Error Response Schema:
When a record is not found (`404`):
```json
{
  "detail": "Expense not found."
}
```
When validation fails (`400`):
```json
{
  "title": ["Title cannot be blank."],
  "amount": ["Amount must be greater than 0."],
  "category": ["Category must be one of: Food, Travel, Shopping, Education, Bills, Health, Entertainment, Other."]
}
```

---

## 9. Project Structure

```
Expense_Tracker_CRUD/
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── DeleteModal.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/
│   ├── manage.py
│   │
│   ├── expense_api/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── expenses/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── tests.py
│   │   └── migrations/
│   │       ├── 0001_initial.py
│   │       └── __init__.py
│   │
│   ├── db.sqlite3
│   ├── requirements.txt
│   └── README.md
│
├── .gitignore
└── README.md
```

---

## 10. Step-by-Step Installation & Setup

> **Important**: The backend and frontend must run concurrently in **two separate terminal windows**.

### Prerequisites
- **Python**: Version 3.11 or higher
- **Node.js**: Version 18 or higher (with npm)
- **Git**

---

### Step 1: Backend Setup (Terminal 1)

1. Open PowerShell and navigate to the `backend` folder:
   ```powershell
   cd backend
   ```

2. Create a virtual environment:
   ```powershell
   python -m venv venv
   ```
   *(If `python` is not in your environment PATH, run: `& "C:\Users\nandh\AppData\Local\Programs\Python\Python311\python.exe" -m venv venv`)*

3. Activate the virtual environment:
   ```powershell
   venv\Scripts\Activate.ps1
   ```

   **If PowerShell blocks script execution:**
   Run the following command to allow signed scripts for the current user:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   Then run `venv\Scripts\Activate.ps1` again.

   **Command Prompt (CMD) Alternative:**
   ```cmd
   venv\Scripts\activate.bat
   ```

4. Install backend dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```

5. Apply database migrations:
   ```powershell
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Start the backend development server:
   ```powershell
   python manage.py runserver
   ```
   The backend API will be live at: **`http://localhost:8000`**

---

### Step 2: Frontend Setup (Terminal 2)

1. Open a second PowerShell terminal window and navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```

2. Install Node.js dependencies:
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   The frontend application will be live at: **`http://localhost:5173`**

4. Open your browser and navigate to: `http://localhost:5173`

---

## 11. Automated Backend Testing

The backend includes a comprehensive test suite built with Django REST Framework's `APITestCase` covering all 13 core validation and API scenarios.

To run the automated tests:
```powershell
cd backend
venv\Scripts\python.exe manage.py test expenses -v 2
```

### Test Suite Execution Output:
```
test_01_create_valid_expense (expenses.tests.ExpenseAPITests) ... ok
test_02_create_expense_empty_title (expenses.tests.ExpenseAPITests) ... ok
test_03_create_expense_missing_amount (expenses.tests.ExpenseAPITests) ... ok
test_04_create_expense_zero_amount (expenses.tests.ExpenseAPITests) ... ok
test_05_create_expense_negative_amount (expenses.tests.ExpenseAPITests) ... ok
test_06_create_expense_invalid_category (expenses.tests.ExpenseAPITests) ... ok
test_07_get_all_expenses (expenses.tests.ExpenseAPITests) ... ok
test_08_get_one_valid_expense (expenses.tests.ExpenseAPITests) ... ok
test_09_get_invalid_id (expenses.tests.ExpenseAPITests) ... ok
test_10_put_valid_expense (expenses.tests.ExpenseAPITests) ... ok
test_11_put_invalid_id (expenses.tests.ExpenseAPITests) ... ok
test_12_delete_valid_expense (expenses.tests.ExpenseAPITests) ... ok
test_13_delete_invalid_id (expenses.tests.ExpenseAPITests) ... ok

----------------------------------------------------------------------
Ran 13 tests in 0.064s

OK
```

---

## 12. Postman Testing Guide

You can test all endpoints in Postman by configuring requests to `http://localhost:8000/api`.

### Test Cases:

#### 1. POST valid expense
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/expenses/`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "title": "Grocery Shopping",
    "amount": "450.00",
    "category": "Shopping",
    "date": "2026-09-17",
    "description": "Vegetables and pantry supplies"
  }
  ```
- **Expected Status**: `201 Created`

#### 2. POST empty title
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/expenses/`
- **Body**:
  ```json
  {
    "title": "   ",
    "amount": "150.00",
    "category": "Food",
    "date": "2026-09-17"
  }
  ```
- **Expected Status**: `400 Bad Request`

#### 3. POST missing amount
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/expenses/`
- **Body**:
  ```json
  {
    "title": "Textbook",
    "category": "Education",
    "date": "2026-09-17"
  }
  ```
- **Expected Status**: `400 Bad Request`

#### 4. POST amount = 0
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/expenses/`
- **Body**:
  ```json
  {
    "title": "Free Item",
    "amount": "0.00",
    "category": "Other",
    "date": "2026-09-17"
  }
  ```
- **Expected Status**: `400 Bad Request`

#### 5. POST negative amount
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/expenses/`
- **Body**:
  ```json
  {
    "title": "Discount Refund",
    "amount": "-50.00",
    "category": "Other",
    "date": "2026-09-17"
  }
  ```
- **Expected Status**: `400 Bad Request`

#### 6. POST invalid category
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/expenses/`
- **Body**:
  ```json
  {
    "title": "Lottery Ticket",
    "amount": "100.00",
    "category": "Casino",
    "date": "2026-09-17"
  }
  ```
- **Expected Status**: `400 Bad Request`

#### 7. GET all expenses
- **Method**: `GET`
- **URL**: `http://localhost:8000/api/expenses/`
- **Expected Status**: `200 OK` (Returns array of all expenses)

#### 8. GET one valid expense
- **Method**: `GET`
- **URL**: `http://localhost:8000/api/expenses/1/`
- **Expected Status**: `200 OK`

#### 9. GET invalid ID
- **Method**: `GET`
- **URL**: `http://localhost:8000/api/expenses/999999/`
- **Expected Status**: `404 Not Found`
- **Expected Body**: `{"detail": "Expense not found."}`

#### 10. PUT valid expense
- **Method**: `PUT`
- **URL**: `http://localhost:8000/api/expenses/1/`
- **Body**:
  ```json
  {
    "title": "Dinner with Team",
    "amount": "550.00",
    "category": "Food",
    "date": "2026-09-17",
    "description": "Dinner at local diner"
  }
  ```
- **Expected Status**: `200 OK`

#### 11. PUT invalid ID
- **Method**: `PUT`
- **URL**: `http://localhost:8000/api/expenses/999999/`
- **Body**: Same as above
- **Expected Status**: `404 Not Found`

#### 12. DELETE valid expense
- **Method**: `DELETE`
- **URL**: `http://localhost:8000/api/expenses/1/`
- **Expected Status**: `204 No Content`

#### 13. DELETE invalid ID
- **Method**: `DELETE`
- **URL**: `http://localhost:8000/api/expenses/999999/`
- **Expected Status**: `404 Not Found`

---

## 13. Django Admin Panel

An administrator can inspect and manage expenses via the Django Admin interface:

1. Create a superuser account:
   ```powershell
   python manage.py createsuperuser
   ```
2. Navigate to: `http://localhost:8000/admin/`
3. Log in to view, search, filter, and modify expenses directly.

---

## 14. Git & Version Control

To initialize and commit your repository:

```powershell
git init
git add .
git commit -m "Initial Expense Tracker CRUD application"
```

To push to GitHub:
```powershell
git branch -M main
git remote add origin https://github.com/<your-username>/expense-tracker-crud.git
git push -u origin main
```

---

## 15. Challenges & Solutions Encountered

1. **PowerShell Script Execution Policy & Windows App Execution Aliases**:
   - *Challenge*: On modern Windows systems, running `Activate.ps1` can be prevented by execution policy, and running `python` without PATH configuration can trigger the WindowsApps stub.
   - *Solution*: Documented explicit user-scoped policy adjustments (`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`), provided CMD fallback (`activate.bat`), and used `python.exe -m pip` to avoid application control policy blocks on generated virtual environment binaries.

2. **Decoupled CORS Communication**:
   - *Challenge*: React frontend running on `http://localhost:5173` communicates with Django running on `http://localhost:8000`. Browsers block cross-origin requests by default.
   - *Solution*: Configured `corsheaders` middleware placed at the top of the Django middleware stack with explicitly allowed origins for port 5173.

3. **Consistent Error Schema for Invalid IDs**:
   - *Challenge*: Default DRF raises 404 with `{"detail": "Not found."}` whereas strict client requirements expect `{"detail": "Expense not found."}`.
   - *Solution*: Implemented a custom DRF exception handler in `expenses/views.py` that intercepts `Http404` and `NotFound` exceptions to return consistent `{"detail": "Expense not found."}` messages.

4. **Dynamic Synchronized Dashboard Statistics**:
   - *Challenge*: Ensuring dashboard aggregates (today's expenses, monthly sum, total spending) reflect updates immediately after any add, edit, or delete action without requiring page refreshes.
   - *Solution*: Leveraged centralized React state in `App.jsx` with `useMemo` hooks to compute financial aggregates directly from verified SQLite records on each state transition.

---

## 16. Future Enhancements

- **User Authentication**: Add JWT/token authentication (e.g. `djangorestframework-simplejwt`) so multiple users have private expense ledgers.
- **Exporting Capabilities**: Download spending reports in CSV and PDF formats.
- **Data Visualizations**: Embed interactive Chart.js or Recharts pie and bar graphs showing category breakdowns.
- **Monthly Budget Targets**: Set spending limits per category with progress bars and threshold alert warnings.

---

## 17. Conclusion

The **Expense Tracker CRUD Application** represents a complete, full-stack, enterprise-grade architecture adhering to industry standards. With a responsive React + Vite frontend, robust Django REST Framework backend, SQLite persistence, and dual-layer validation, the application is ready for local deployment, demonstration, and future extensibility.
