import React, { useState, useMemo } from "react";
import { useFinance, formatMoney } from "../context/FinanceContext.jsx";
import TransactionModal from "./TransactionModal.jsx";

function downloadBlob(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function TransactionsSection() {
  const {
    isAdmin,
    categories,
    filteredSorted,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinance();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const rows = useMemo(() => filteredSorted, [filteredSorted]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setModalOpen(true);
  };

  const handleSave = (payload) => {
    if (editing) updateTransaction(editing.id, payload);
    else addTransaction(payload);
  };

  const exportCsv = () => {
    const header = ["id", "date", "amount", "category", "type", "description"];
    const lines = [
      header.join(","),
      ...rows.map((r) =>
        header
          .map((h) => {
            const v = r[h] ?? "";
            return `"${String(v).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];
    downloadBlob(
      new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }),
      "transactions.csv"
    );
  };

  const exportJson = () => {
    downloadBlob(
      new Blob([JSON.stringify(rows, null, 2)], {
        type: "application/json",
      }),
      "transactions.json"
    );
  };

  return (
    <>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search category or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: "200px", flex: "1 1 180px" }}
          aria-label="Search transactions"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          <option value="income">Income only</option>
          <option value="expense">Expense only</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort"
        >
          <option value="date-desc">Date (newest)</option>
          <option value="date-asc">Date (oldest)</option>
          <option value="amount-desc">Amount (high)</option>
          <option value="amount-asc">Amount (low)</option>
        </select>
        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={openAdd}>
            + Add transaction
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={exportCsv}>
          Export CSV
        </button>
        <button type="button" className="btn btn-ghost" onClick={exportJson}>
          Export JSON
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="empty-state">
          No transactions match your filters. Try clearing search or filters.
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Type</th>
                <th>Description</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{formatMoney(t.amount)}</td>
                  <td>{t.category}</td>
                  <td>
                    <span className={`type-pill ${t.type}`}>{t.type}</span>
                  </td>
                  <td>{t.description || "—"}</td>
                  {isAdmin && (
                    <td>
                      <button
                        type="button"
                        className="btn btn-small btn-ghost"
                        onClick={() => openEdit(t)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="btn btn-small btn-ghost"
                        onClick={() => {
                          if (
                            window.confirm("Delete this transaction?")
                          ) {
                            deleteTransaction(t.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}
