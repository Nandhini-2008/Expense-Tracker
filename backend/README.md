# Expense Tracker - Backend (Django & Django REST Framework)

This is the backend service for the Expense Tracker full-stack web application. It provides a robust, RESTful API backed by SQLite and Django ORM with full validation, CORS configuration, and automated test coverage.

## Tech Stack
- **Language**: Python 3.11+
- **Framework**: Django 5.x
- **API Toolkit**: Django REST Framework
- **CORS Support**: django-cors-headers
- **Database**: SQLite (`db.sqlite3`)

---

## Directory Structure

```
backend/
├── manage.py
├── expense_api/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── expenses/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── tests.py
│   └── migrations/
├── db.sqlite3
├── requirements.txt
└── README.md
```

---

## Setup and Installation

### 1. Create Virtual Environment
Open Windows PowerShell in the `backend` directory:

```powershell
cd backend
python -m venv venv
```
*(If `python` is not in your system PATH, use `& "C:\Users\nandh\AppData\Local\Programs\Python\Python311\python.exe" -m venv venv`)*

### 2. Activate Virtual Environment
**PowerShell:**
```powershell
venv\Scripts\Activate.ps1
```
*Note: If PowerShell execution policy blocks the script, run once:*
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
**Command Prompt (CMD) Alternative:**
```cmd
venv\Scripts\activate.bat
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Apply Database Migrations
```powershell
python manage.py makemigrations
python manage.py migrate
```

### 5. Run the Backend Server
```powershell
python manage.py runserver
```
The server will start at: `http://127.0.0.1:8000/` or `http://localhost:8000/`.

---

## REST API Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/expenses/` | List all expenses ordered by date descending | `200 OK` |
| `POST` | `/api/expenses/` | Create a new expense | `201 Created` / `400 Bad Request` |
| `GET` | `/api/expenses/<id>/` | Retrieve details of one expense | `200 OK` / `404 Not Found` |
| `PUT` | `/api/expenses/<id>/` | Replace an existing expense | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `PATCH` | `/api/expenses/<id>/` | Partially update an existing expense | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/expenses/<id>/` | Permanently delete an expense | `204 No Content` / `404 Not Found` |

---

## Running Automated Tests

To execute the test suite:
```powershell
python manage.py test expenses
```
All 13 test scenarios covering validation, creation, retrieval, updates, deletions, and error cases will be executed.
