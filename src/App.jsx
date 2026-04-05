import React from "react";
import SummaryCards from "./components/SummaryCards.jsx";
import BalanceTrendChart from "./components/BalanceTrendChart.jsx";
import SpendingBreakdown from "./components/SpendingBreakdown.jsx";
import TransactionsSection from "./components/TransactionsSection.jsx";
import InsightsSection from "./components/InsightsSection.jsx";
import RoleSwitcher from "./components/RoleSwitcher.jsx";
import { useFinance } from "./context/FinanceContext.jsx";

function Header() {
  const { darkMode, setDarkMode, transactions } = useFinance();

  return (
    <header className="app-header">
      <div>
        <h1>Finance Dashboard</h1>
        <p
          style={{
            margin: "0.25rem 0 0",
            fontSize: "0.85rem",
            color: "purple",
          }}
        >
          React (JavaScript) · Mock data · {transactions.length} transactions
        </p>
      </div>
      <div className="header-actions">
        <RoleSwitcher />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setDarkMode((d) => !d)}
          aria-pressed={darkMode}
        >
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main className="main-grid">
        <section className="card span-full">
          <h2>Overview</h2>
          <SummaryCards />
        </section>

        <section className="card">
          <h2>Balance trend (time)</h2>
          <BalanceTrendChart />
        </section>

        <section className="card">
          <h2>Spending by category</h2>
          <SpendingBreakdown />
        </section>

        <section className="card span-full">
          <h2>Transactions</h2>
          <TransactionsSection />
        </section>

        <section className="card span-full">
          <h2>Insights</h2>
          <InsightsSection />
        </section>
      </main>
    </>
  );
}
