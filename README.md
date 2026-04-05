# Finance Dashboard — React + JavaScript (no TypeScript)

This project uses **Vite + React** with **`.jsx` and `.js` files only**. There is **no TypeScript** (`tsconfig.json`, `.ts`, `.tsx`).

## Stack

- React 18
- Vite 5
- Plain JavaScript + JSX
- CSS in `src/index.css`
- State: React Context (`src/context/FinanceContext.jsx`)

## Run (VS Code terminal)

```bash
cd finance-dashboard
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Project layout

```
finance-dashboard/
  package.json
  vite.config.js
  index.html
  README.md
  src/
    main.jsx
    App.jsx
    index.css
    context/FinanceContext.jsx
    data/mockData.js
    components/
      SummaryCards.jsx
      BalanceTrendChart.jsx
      SpendingBreakdown.jsx
      TransactionsSection.jsx
      TransactionModal.jsx
      InsightsSection.jsx
      RoleSwitcher.jsx
```

## Assignment features

- Dashboard overview (balance, income, expenses)
- Time-based balance trend chart
- Category spending breakdown
- Transactions with search, filter, sort
- Viewer vs Admin (simulated role dropdown)
- Insights section
- Optional: dark mode, localStorage persistence, CSV/JSON export

## Note

If `npm install` fails with **EBUSY** under OneDrive, copy the folder to e.g. `C:\finance-dashboard` and run commands there.


## 👩‍💻 Author
Sujata More
