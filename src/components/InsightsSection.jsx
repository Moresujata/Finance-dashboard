import React from "react";
import { useFinance } from "../context/FinanceContext.jsx";

export default function InsightsSection() {
  const { insights } = useFinance();

  return (
    <ul className="insights-list">
      {insights.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}
