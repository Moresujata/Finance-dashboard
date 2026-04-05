import React from "react";
import { useFinance, formatMoney } from "../context/FinanceContext.jsx";

export default function SpendingBreakdown() {
  const { spendingByCategory } = useFinance();
  const { entries, total } = spendingByCategory;

  if (!entries.length || total === 0) {
    return (
      <div className="empty-state">
        No expenses to chart. Add expense transactions to see category breakdown.
      </div>
    );
  }

  return (
    <>
      {entries.map(([name, amount]) => {
        const pct = Math.round((amount / total) * 100);
        return (
          <div key={name} className="breakdown-row">
            <span className="name" title={name}>
              {name}
            </span>
            <div className="breakdown-bar-bg">
              <div
                className="breakdown-bar-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="pct">{pct}%</span>
          </div>
        );
      })}
      <p
        style={{
          margin: "0.75rem 0 0",
          fontSize: "0.8rem",
          color: "var(--muted)",
        }}
      >
        Total expenses: {formatMoney(total)}
      </p>
    </>
  );
}
