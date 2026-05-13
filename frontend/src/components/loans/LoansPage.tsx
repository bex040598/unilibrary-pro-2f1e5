import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import type { Loan } from "../../types";
import { Badge } from "../common/Badge";
import { EmptyState } from "../common/EmptyState";

export function LoansPage() {
  const { user, accessToken } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [dueToday, setDueToday] = useState<Loan[]>([]);
  const [overdue, setOverdue] = useState<Loan[]>([]);
  const [issueForm, setIssueForm] = useState({ reservation_id: "1", due_days: "10" });

  useEffect(() => {
    if (!accessToken) return;
    api.myLoans(accessToken).then(setLoans).catch(() => undefined);
    api.dueToday(accessToken).then(setDueToday).catch(() => undefined);
    api.overdue(accessToken).then(setOverdue).catch(() => undefined);
  }, [accessToken]);

  async function requestRenewal(id: number) {
    if (!accessToken) return;
    await api.renewLoan(accessToken, id);
    const nextLoans = await api.myLoans(accessToken);
    setLoans(nextLoans);
  }

  async function handleIssue(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return;
    await api.issueLoan(accessToken, { reservation_id: Number(issueForm.reservation_id), due_days: Number(issueForm.due_days) });
    setLoans(await api.myLoans(accessToken));
  }

  async function handleReturn(id: number) {
    if (!accessToken) return;
    await api.returnLoan(accessToken, id);
    setLoans(await api.myLoans(accessToken));
  }

  if (!user) {
    return <div className="page"><EmptyState title="Loans uchun login kerak" description="Loan due date, overdue va renewal request sahifasi auth bilan ishlaydi." /></div>;
  }

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">Loan system</p>
          <h1>Kitob olish, qaytarish va muddatni uzaytirish</h1>
          <p className="section-description">Issued date, due date, overdue, fine va renewal request oqimlari.</p>
        </div>
      </div>
      <div className="stats-grid compact">
        <article className="stat-card stat-blue"><p>Active loans</p><strong>{loans.length}</strong></article>
        <article className="stat-card stat-gold"><p>Due today</p><strong>{dueToday.length}</strong></article>
        <article className="stat-card stat-teal"><p>Overdue</p><strong>{overdue.length}</strong></article>
        <article className="stat-card stat-emerald"><p>Renewal requests</p><strong>{loans.filter((loan) => loan.renewal_count > 0).length}</strong></article>
      </div>

      {(user.role === "librarian" || user.role === "admin") ? (
        <form className="glass-panel form-stack" onSubmit={handleIssue}>
          <div className="grid-two">
            <label>Reservation ID<input value={issueForm.reservation_id} onChange={(event) => setIssueForm((current) => ({ ...current, reservation_id: event.target.value }))} /></label>
            <label>Due days<input value={issueForm.due_days} onChange={(event) => setIssueForm((current) => ({ ...current, due_days: event.target.value }))} /></label>
          </div>
          <button type="submit" className="primary-button">Loan issue</button>
        </form>
      ) : null}

      <div className="table-wrap glass-panel">
        <table>
          <thead><tr><th>Kitob</th><th>Issued</th><th>Due</th><th>Status</th><th>Qolgan kunlar</th><th>Fine</th><th>Amallar</th></tr></thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.book_title}</td>
                <td>{new Date(loan.issued_at).toLocaleDateString()}</td>
                <td>{new Date(loan.due_at).toLocaleDateString()}</td>
                <td><Badge label={loan.status} tone={loan.status === "overdue" ? "danger" : "success"} /></td>
                <td>{loan.remaining_days}</td>
                <td>{loan.fine_amount}</td>
                <td>
                  <div className="table-actions">
                    <button type="button" className="ghost-button" onClick={() => requestRenewal(loan.id)}>Renewal request</button>
                    {(user.role === "librarian" || user.role === "admin") ? <button type="button" className="ghost-button" onClick={() => handleReturn(loan.id)}>Return</button> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

