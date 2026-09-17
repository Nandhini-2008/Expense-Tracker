# Expense Tracker - Frontend (React + Vite)

This is the client-side single page application (SPA) for the Expense Tracker full-stack application. It features a modern, responsive UI built with React, Vite, and custom CSS design system.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: JavaScript (ESModules)
- **Styling**: Vanilla CSS3 (Custom design system, CSS grid/flexbox, CSS variables, dark theme, glassmorphism)
- **Fonts**: Plus Jakarta Sans & JetBrains Mono

---

## Directory Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation bar with live backend status & transaction count
│   │   ├── Dashboard.jsx     # Financial metrics (Total, Today, Month, Total Count)
│   │   ├── ExpenseForm.jsx   # Add/Edit form with real-time validation & error messages
│   │   ├── ExpenseList.jsx   # Tabular/Card views with color-coded categories & actions
│   │   ├── SearchBar.jsx     # Dynamic search by title and description
│   │   ├── FilterBar.jsx     # Category pill filters and 4-way sorting options
│   │   └── DeleteModal.jsx   # Confirmation modal for secure deletion
│   ├── services/
│   │   └── api.js            # Centralized API service using native Fetch
│   ├── App.jsx               # Main state orchestrator & toast notification system
│   ├── main.jsx              # React DOM root entry
│   └── index.css             # Unified stylesheet and theme variables
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Setup & Running Locally

### 1. Install Node Dependencies
Open a terminal in the `frontend` directory:

```powershell
cd frontend
npm install
```

### 2. Start Vite Development Server
```powershell
npm run dev
```
The application will be accessible at: `http://localhost:5173`.

### 3. Production Build
```powershell
npm run build
```
The optimized production bundle will be generated in `frontend/dist/`.
