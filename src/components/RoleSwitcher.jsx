import React from "react";
import { useFinance } from "../context/FinanceContext.jsx";

export default function RoleSwitcher() {
  const { role, setRole, isAdmin } = useFinance();

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span style={{ fontSize: "12px", color: "var(--muted)" }}>Role</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{
          padding: "3px 3px 3px 3px",
          borderRadius: 8,
          border: "1px solid  navy",
          background: "var(--surface)",
          color: "var(--text)",
        }}
        aria-label="User role"
      >
        <option value="viewer">Viewer (read-only)</option>
        <option value="admin">Admin (add / edit)</option>
      </select>
      <span className={isAdmin ? "badge badge-admin" : "badge"}>
        {isAdmin ? "Admin mode" : "Viewer mode"}
      </span>
    </label>
  );
}
