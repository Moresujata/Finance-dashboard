import React from "react";
import { useFinance, formatMoney } from "../context/FinanceContext.jsx";

export default function SummaryCards() {
  const { totals } = useFinance();

  return (
    <div className="summary-row">
      <div className="summary-card">
        <div className="label">Total balance</div>
        <div className="value">{formatMoney(totals.balance)}</div>
      </div>
      <div className="summary-card income">
        <div className="label">Income</div>
        <div className="value">{formatMoney(totals.income)}</div>
      </div>
      <div className="summary-card expense">
        <div className="label">Expenses</div>
        <div className="value">{formatMoney(totals.expenses)}</div>
      </div>
    </div>
  );
}
