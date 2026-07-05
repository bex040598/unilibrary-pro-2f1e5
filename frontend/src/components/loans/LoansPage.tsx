import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import type { Loan } from "../../types";

/* ── Status badge ── */
function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    active: "ln-pill active", overdue: "ln-pill overdue",
    returned: "ln-pill returned", renewed: "ln-pill renewed",
  };
  const labels: Record<string, string> = {
    active: "Aktiv", overdue: "Muddati o'tgan",
    returned: "Qaytarilgan", renewed: "Uzaytirilgan",
  };
  return <span className={map[s] ?? "ln-pill active"}>{labels[s] ?? s}</span>;
}

/* ── Day badge ── */
function DaysBadge({ n }: { n: number }) {
  if (n < 0) return <span className="ln-days overdue">{Math.abs(n)}k o'tgan</span>;
  if (n <= 3) return <span className="ln-days warn">{n} kun</span>;
  return <span className="ln-days ok">{n} kun</span>;
}

export function LoansPage() {
  const { user, accessToken } = useAuth();
  const [loans, setLoans]       = useState<Loan[]>([]);
  const [dueToday, setDueToday] = useState<Loan[]>([]);
  const [overdue, setOverdue]   = useState<Loan[]>([]);
  const [form, setForm]         = useState({ reservation_id: "1", due_days: "10" });
  const [msg, setMsg]           = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading]   = useState(false);

  const isStaff = user?.role === "librarian" || user?.role === "admin";

  useEffect(() => {
    if (!accessToken) return;
    api.myLoans(accessToken).then(setLoans).catch(() => {});
    api.dueToday(accessToken).then(setDueToday).catch(() => {});
    api.overdue(accessToken).then(setOverdue).catch(() => {});
  }, [accessToken]);

  async function handleIssue(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    try {
      await api.issueLoan(accessToken, {
        reservation_id: Number(form.reservation_id),
        due_days: Number(form.due_days),
      });
      setLoans(await api.myLoans(accessToken));
      flash("Kitob muvaffaqiyatli berildi", true);
    } catch {
      flash("Xatolik yuz berdi", false);
    } finally { setLoading(false); }
  }

  async function requestRenewal(id: number) {
    if (!accessToken) return;
    await api.renewLoan(accessToken, id);
    setLoans(await api.myLoans(accessToken));
    flash("Uzaytirish so'rovi yuborildi", true);
  }

  async function handleReturn(id: number) {
    if (!accessToken) return;
    await api.returnLoan(accessToken, id);
    setLoans(await api.myLoans(accessToken));
    flash("Kitob qaytarildi", true);
  }

  function flash(text: string, ok: boolean) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  }

  /* ── Not logged in ── */
  if (!user) return (
    <div className="ln-noauth">
      <div className="ln-noauth-inner">
        <div className="ln-noauth-icon">📚</div>
        <h2>Kirish talab etiladi</h2>
        <p>Loan tizimidan foydalanish uchun tizimga kiring.</p>
      </div>
    </div>
  );

  const renewals = loans.filter(l => l.renewal_count > 0).length;

  return (
    <div className="ln-root">

      {/* ── HERO ── */}
      <div className="ln-hero">
        <svg className="ln-hero-bg" viewBox="0 0 1200 240" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="ln-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ln-grid)"/>
          <circle cx="1050" cy="-20" r="280" fill="rgba(196,168,98,0.07)"/>
          <circle cx="80"   cy="260" r="160" fill="rgba(196,168,98,0.04)"/>
        </svg>

        <div className="ln-hero-inner">
          <div className="ln-hero-text">
            <p className="ln-eyebrow">LOAN SYSTEM · ATMU Kutubxona</p>
            <h1 className="ln-hero-h">Kitob olish<br/><em>va qaytarish</em></h1>
            <p className="ln-hero-sub">
              Berilgan sana, muddat, jarimalar va uzaytirish so'rovlari — barchasi bir joyda.
            </p>
          </div>

          {/* Stats panel */}
          <div className="ln-hero-panel">
            <div className="ln-hp-row">
              <div className="ln-hp-stat">
                <span className="ln-hp-n">{loans.length}</span>
                <span className="ln-hp-l">Aktiv</span>
              </div>
              <div className="ln-hp-div"/>
              <div className="ln-hp-stat">
                <span className="ln-hp-n warn">{dueToday.length}</span>
                <span className="ln-hp-l">Bugun muddat</span>
              </div>
              <div className="ln-hp-div"/>
              <div className="ln-hp-stat">
                <span className="ln-hp-n danger">{overdue.length}</span>
                <span className="ln-hp-l">O'tgan</span>
              </div>
              <div className="ln-hp-div"/>
              <div className="ln-hp-stat">
                <span className="ln-hp-n">{renewals}</span>
                <span className="ln-hp-l">Renewal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="ln-body">

        {/* Flash */}
        {msg && (
          <div className={`ln-flash ${msg.ok ? "ok" : "err"}`}>
            {msg.ok ? "✓" : "✗"} {msg.text}
          </div>
        )}

        {/* Staff: Loan issue form */}
        {isStaff && (
          <div className="ln-section">
            <h2 className="ln-section-title">Kitob berish</h2>
            <form className="ln-issue-form" onSubmit={handleIssue}>
              <div className="ln-form-grid">
                <div className="ln-field">
                  <label className="ln-label">Reservation ID</label>
                  <input
                    className="ln-input"
                    type="number"
                    min="1"
                    value={form.reservation_id}
                    onChange={e => setForm(f => ({ ...f, reservation_id: e.target.value }))}
                  />
                </div>
                <div className="ln-field">
                  <label className="ln-label">Muddat (kun)</label>
                  <input
                    className="ln-input"
                    type="number"
                    min="1"
                    max="60"
                    value={form.due_days}
                    onChange={e => setForm(f => ({ ...f, due_days: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className="ln-submit" disabled={loading}>
                {loading ? "Yuklanmoqda…" : "Kitobni ber"}
              </button>
            </form>
          </div>
        )}

        {/* Loans table */}
        <div className="ln-section">
          <div className="ln-section-head">
            <h2 className="ln-section-title">
              {isStaff ? "Barcha loanlar" : "Mening kitoblarim"}
            </h2>
            <span className="ln-count">{loans.length} ta</span>
          </div>

          {loans.length === 0 ? (
            <div className="ln-empty">
              <div className="ln-empty-icon">📖</div>
              <p>Hozircha aktiv kitob yo'q</p>
              <span>Kutubxonadan kitob olganingizda bu yerda ko'rinadi</span>
            </div>
          ) : (
            <div className="ln-table-wrap">
              <table className="ln-table">
                <thead>
                  <tr>
                    <th>Kitob</th>
                    <th>Berilgan</th>
                    <th>Muddat</th>
                    <th>Holat</th>
                    <th>Qolgan</th>
                    <th>Jarima</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map(l => (
                    <tr key={l.id} className={l.remaining_days < 0 ? "ln-row-overdue" : ""}>
                      <td className="ln-td-title">{l.book_title}</td>
                      <td className="ln-td-date">{new Date(l.issued_at).toLocaleDateString("uz-UZ")}</td>
                      <td className="ln-td-date">{new Date(l.due_at).toLocaleDateString("uz-UZ")}</td>
                      <td><StatusPill s={l.status}/></td>
                      <td><DaysBadge n={l.remaining_days}/></td>
                      <td className={l.fine_amount > 0 ? "ln-fine" : "ln-fine-zero"}>
                        {l.fine_amount > 0 ? `${l.fine_amount.toLocaleString()} so'm` : "—"}
                      </td>
                      <td>
                        <div className="ln-actions">
                          <button className="ln-act-btn" onClick={() => requestRenewal(l.id)}>
                            Uzaytirish
                          </button>
                          {isStaff && (
                            <button className="ln-act-btn danger" onClick={() => handleReturn(l.id)}>
                              Qaytarildi
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Overdue highlight (staff) */}
        {isStaff && overdue.length > 0 && (
          <div className="ln-section">
            <div className="ln-section-head">
              <h2 className="ln-section-title ln-overdue-title">Muddati o'tgan</h2>
              <span className="ln-count danger">{overdue.length} ta</span>
            </div>
            <div className="ln-overdue-list">
              {overdue.map(l => (
                <div key={l.id} className="ln-overdue-card">
                  <div className="ln-oc-left">
                    <p className="ln-oc-book">{l.book_title}</p>
                    <p className="ln-oc-meta">Muddat: {new Date(l.due_at).toLocaleDateString("uz-UZ")}</p>
                  </div>
                  <div className="ln-oc-right">
                    <span className="ln-days overdue">{Math.abs(l.remaining_days)}k kechikkan</span>
                    {l.fine_amount > 0 && (
                      <span className="ln-fine">{l.fine_amount.toLocaleString()} so'm</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
