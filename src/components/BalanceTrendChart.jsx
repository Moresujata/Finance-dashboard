import React, { useMemo } from "react";
import { useFinance, formatMoney } from "../context/FinanceContext.jsx";

export default function BalanceTrendChart() {
  const { monthlyTrend } = useFinance();

  const maxAbs = useMemo(() => {
    if (!monthlyTrend.length) return 1;
    return Math.max(1, ...monthlyTrend.map((p) => Math.abs(p.balance)));
  }, [monthlyTrend]);

  if (!monthlyTrend.length) {
    return (
      <div className="empty-state">
        No monthly data yet. Add dated transactions to see balance trend.
      </div>
    );
  }

  return (
    <>
      <p
        style={{
          margin: "0 0 0.75rem",
          fontSize: "0.85rem",
          color: "var(--muted)",
        }}
      >
        Cumulative balance after each month (last {monthlyTrend.length}{" "}
        months with data).
      </p>
      <div className="chart-bars">
        {monthlyTrend.map((p) => {
          const h = (Math.abs(p.balance) / maxAbs) * 140;
          return (
            <div key={p.month} className="chart-bar-wrap">
              <div
                className="chart-bar"
                style={{
                  height: `${Math.max(h, 6)}px`,
                  background:
                    p.balance >= 0
                      ? "linear-gradient(180deg, var(--income), #047857)"
                      : "linear-gradient(180deg, var(--expense), #b91c1c)",
                }}
                title={`${p.month}: ${formatMoney(p.balance)}`}
              />
              <span className="chart-label">{p.month.slice(5)}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
