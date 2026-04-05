import React, { useState, useEffect } from "react";

const empty = {
  date: "",
  amount: "",
  category: "",
  type: "expense",
  description: "",
};

export default function TransactionModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        date: initial.date,
        amount: String(initial.amount),
        category: initial.category,
        type: initial.type,
        description: initial.description || "",
      });
    } else {
      const d = new Date();
      setForm({
        ...empty,
        date: d.toISOString().slice(0, 10),
        category: "Food",
      });
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.date || !form.category || Number.isNaN(amount) || amount <= 0) {
      return;
    }
    onSave({
      date: form.date,
      amount,
      category: form.category.trim(),
      type: form.type,
      description: form.description.trim(),
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{initial ? "Edit transaction" : "Add transaction"}</h3>
        <form onSubmit={submit}>
          <div className="form-row">
            <label htmlFor="modal-date">Date</label>
            <input
              id="modal-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="modal-amount">Amount (INR)</label>
            <input
              id="modal-amount"
              type="number"
              min="1"
              step="1"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="modal-category">Category</label>
            <input
              id="modal-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="modal-type">Type</label>
            <select
              id="modal-type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="modal-desc">Description</label>
            <input
              id="modal-desc"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
