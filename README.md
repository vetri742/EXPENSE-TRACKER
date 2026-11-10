## 📸 Overview

SpendPulse goes beyond simple CRUD expense trackers. It functions as an intelligent personal finance cockpit featuring executive dashboard metrics, visual spending distributions, interactive cashflow dynamics, and dynamic budget caps with warning alert triggers.

---

## ✨ Key Features

### 1. 🛡️ Multi-Tenant Client-Side Authentication & Isolation
- **Partitioned LocalStorage**: Data is partitioned dynamically per user (`transactions_${email}` and `budgets_${email}`), ensuring zero data leakage between different user accounts.
- **Session Management**: Full Login, Sign-up, and Logout flows persisting authenticated sessions in `localStorage`.
- **1-Click Instant Demo**: Includes a preloaded demo account (`demo@expensetracker.io`) with multi-month cashflow data for quick reviewer testing.
- **Dynamic Avatar Badge**: Generates lightweight initials badges (e.g. "Alex Rivera" ➔ `AR`) avoiding heavy image file storage.

### 2. 📊 Visual Charts & Analytics (Recharts)
- **Category Expense Donut Chart**: Interactive breakdown showing the exact percentage and spending share for each category with custom glassmorphic tooltips.
- **Monthly Cashflow Bar Chart**: Responsive dual-bar comparison evaluating month-by-month Income (credits) vs. Expenses (debits).

### 3. 🎯 Budget Caps & Threshold Warnings
- **Animated Progress Bars**: Visual capacity indicators with dynamic color transitions:
  - 🟢 **Normal (< 80%)**: Safe spending.
  - 🟡 **Warning (80% – 99%)**: Approaching threshold.
  - 🔴 **Over Budget (≥ 100%)**: Visual alert capping at `100% crossed` with an animated warning banner.
- **Inline Cap Editing**: Adjust monthly category spending limits directly on the card with instant `Enter` (save) or `Esc` (cancel).

### 4. 📑 Dedicated Financial Ledger (React Router v7)
- **Multi-Criteria Filtering**: Filter entries by search text, transaction type (All/Expense/Income), category, and month.
- **Native CSV Data Export**: Downloads filtered ledger records as an Excel-compatible `.csv` file using browser Web APIs without third-party dependencies.
- **Complete CRUD Controls**: Add, edit, or delete transactions with deletion safety confirmations.

### 5. 🎨 Design & Aesthetic Excellence
- **Deep Charcoal Theme**: Styled strictly using Tailwind's `bg-slate-900` (`#0f172a`) paired with ambient neon radial glow effects.
- **Glassmorphism**: Translucent cards (`bg-slate-800/60 backdrop-blur-md border border-slate-700/50`).
- **Responsive Layout**: Desktop sticky navigation paired with a mobile bottom navigation bar on smaller screens.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component architecture, custom hooks, and state management |
| **Tailwind CSS v4** | Utility-first responsive styling and glassmorphic UI |
| **React Router DOM v7** | Client-side routing (`/` Dashboard vs. `/transactions` Ledger) |
| **Recharts** | Declarative SVG Donut charts and Cashflow Bar charts |
| **Lucide React** | Consistent iconography across categories, buttons, and navigation |
| **Vite** | Next-generation fast frontend build tool and dev server |
| **LocalStorage API** | Browser-level persistence and multi-user data partitioning |

---

## 📂 Project Structure

```text
src/
├── constants/
│   ├── categories.jsx        # Category mappings, Lucide icons, default caps, currency formatter
│   └── demoData.js           # Multi-month starter transactions & demo user
├── context/
│   ├── AuthContext.jsx       # Registration, login session, user data isolation
│   └── transactioncontext.jsx# User-isolated transactions & budget state management
├── components/
│   ├── Layout.jsx            # Master layout with Navbar, glows, modal, and mobile nav
│   ├── Navbar.jsx            # Sticky brand header, active route tabs, profile menu
│   ├── AuthScreen.jsx        # Glassmorphic Login/Signup modal with 1-click Demo mode
│   ├── SummaryCards.jsx      # Metric cards (Net Balance, Income, Expense, Savings Rate)
│   ├── ChartsSection.jsx     # Recharts Category Donut & Cashflow Bar Chart
│   ├── BudgetTracker.jsx     # Budget caps, inline editing, animated progress bars
│   ├── TransactionForm.jsx   # Expense/Income segmented toggle & category selector
│   └── TransactionList.jsx   # Filterable ledger, search bar, and CSV export
├── pages/
│   ├── DashboardPage.jsx     # Executive overview (Summary cards, Charts, Budget caps)
│   └── TransactionsPage.jsx  # Full ledger history and record management
├── App.jsx                   # Route configuration and React key reconciliation wrapper
├── index.css                 # Tailwind v4 import & custom dark scrollbars
└── main.jsx                  # ReactDOM bootstrap root
```

---

## 🚀 Getting Started

Follow these steps to run SpendPulse locally on your machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `pnpm` / `yarn`



## 🧠 Architectural Highlight: The React `key` Reset Pattern

In multi-user client apps, switching accounts often leads to stale data or memory leaks. SpendPulse solves this at the architectural root in `App.jsx`:

```jsx
<TransactionProvider key={currentUser?.email || "guest"}>
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
</TransactionProvider>
```
