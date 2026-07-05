import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { books as fallbackBooks } from "../../data/mock";
import type { Reservation } from "../../types";

/* ── Status pill ── */
function StatusPill({ s }: { s: string }) {
  const cls: Record<string, string> = {
    pending: "rv-pill pending", approved: "rv-pill approved",
    rejected: "rv-pill rejected", picked_up: "rv-pill picked",
  };
  const lbl: Record<string, string> = {
    pending: "Kutilmoqda", approved: "Tasdiqlangan",
    rejected: "Rad etilgan", picked_up: "Olib ketildi",
  };
  return <span className={cls[s] ?? "rv-pill pending"}>{lbl[s] ?? s}</span>;
}

/* ── QR chip ── */
function QRChip({ code }: { code: string }) {
  if (!code) return <span className="rv-qr-empty">—</span>;
  return (
    <span className="rv-qr-chip" title={code}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h7v7H3V3zm2 2v3h3V5H5zM3 14h7v7H3v-7zm2 2v3h3v-3H5zM14 3h7v7h-7V3zm2 2v3h3V5h-3zM14 14h3v3h-3v-3zm4 0h3v3h-3v-3zm-4 4h3v3h-3v-3zm4 0h3v3h-3v-3z"/>
      </svg>
      QR
    </span>
  );
}

export function ReservationsPage() {
  const { user, accessToken } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [flash, setFlash]   = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    book_id: "1",
    pickup_date: new Date().toISOString().slice(0, 10),
    pickup_time: "10:00",
  });

  const isStaff = user?.role === "librarian" || user?.role === "admin";

  useEffect(() => {
    if (!accessToken || !user) return;
    const loader = isStaff ? api.reservations(accessToken) : api.myReservations(accessToken);
    loader.then(setReservations).catch(() => {});
  }, [accessToken, user, isStaff]);

  async function handleReserve(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    try {
      await api.reserveBook(accessToken, { ...form, book_id: Number(form.book_id) });
      setReservations(await api.myReservations(accessToken));
      notify("Kitob muvaffaqiyatli band qilindi. QR kod yaratildi.", true);
    } catch {
      notify("Xatolik yuz berdi. Qayta urinib ko'ring.", false);
    } finally { setLoading(false); }
  }

  async function updateStatus(id: number, action: "approve" | "reject" | "picked_up") {
    if (!accessToken) return;
    if (action === "approve")    await api.approveReservation(accessToken, id);
    if (action === "reject")     await api.rejectReservation(accessToken, id);
    if (action === "picked_up")  await api.markPickedUp(accessToken, id);
    const next = isStaff ? await api.reservations(accessToken) : await api.myReservations(accessToken);
    setReservations(next);
    notify(action === "approve" ? "Tasdiqlandi" : action === "reject" ? "Rad etildi" : "Olib ketildi qayd etildi", true);
  }

  function notify(text: string, ok: boolean) {
    setFlash({ text, ok });
    setTimeout(() => setFlash(null), 3500);
  }

  /* Stats */
  const pending  = reservations.filter(r => r.status === "pending").length;
  const approved = reservations.filter(r => r.status === "approved").length;
  const pickedUp = reservations.filter(r => r.status === "picked_up").length;

  if (!user) return (
    <div className="rv-noauth">
      <div className="rv-noauth-inner">
        <div className="rv-noauth-icon">🔖</div>
        <h2>Kirish talab etiladi</h2>
        <p>Bron tizimidan foydalanish uchun tizimga kiring.</p>
      </div>
    </div>
  );

  return (
    <div className="rv-root">

      {/* ── HERO ── */}
      <div className="rv-hero">
        <svg className="rv-hero-bg" viewBox="0 0 1200 240" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="rv-dots" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="18" cy="18" r="1.4" fill="rgba(255,255,255,0.05)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rv-dots)"/>
          <ellipse cx="1100" cy="0"   rx="320" ry="180" fill="rgba(196,168,98,0.07)"/>
          <ellipse cx="60"   cy="240" rx="200" ry="120" fill="rgba(196,168,98,0.04)"/>
          <line x1="0" y1="200" x2="1200" y2="160" stroke="rgba(196,168,98,0.1)" strokeWidth="1"/>
        </svg>

        <div className="rv-hero-inner">
          <div className="rv-hero-text">
            <p className="rv-eyebrow">BOOK RESERVATIONS · ATMU Kutubxona</p>
            <h1 className="rv-hero-h">Kitobni oldindan<br/><em>band qilish</em></h1>
            <p className="rv-hero-sub">
              Pickup vaqti, QR tasdiqlash va kutubxonachi tomonidan approval oqimi.
            </p>
          </div>

          <div className="rv-hero-panel">
            <div className="rv-hp-row">
              <div className="rv-hp-stat">
                <span className="rv-hp-n">{reservations.length}</span>
                <span className="rv-hp-l">Jami</span>
              </div>
              <div className="rv-hp-div"/>
              <div className="rv-hp-stat">
                <span className="rv-hp-n warn">{pending}</span>
                <span className="rv-hp-l">Kutilmoqda</span>
              </div>
              <div className="rv-hp-div"/>
              <div className="rv-hp-stat">
                <span className="rv-hp-n ok">{approved}</span>
                <span className="rv-hp-l">Tasdiqlangan</span>
              </div>
              <div className="rv-hp-div"/>
              <div className="rv-hp-stat">
                <span className="rv-hp-n">{pickedUp}</span>
                <span className="rv-hp-l">Olingan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="rv-body">

        {flash && (
          <div className={`rv-flash ${flash.ok ? "ok" : "err"}`}>
            {flash.ok ? "✓" : "✗"} {flash.text}
          </div>
        )}

        {/* Student: reserve form */}
        {user.role === "student" && (
          <div className="rv-section">
            <h2 className="rv-section-title">Yangi bron</h2>
            <form className="rv-form" onSubmit={handleReserve}>
              <div className="rv-form-grid">
                <div className="rv-field wide">
                  <label className="rv-label">Kitob tanlang</label>
                  <select
                    className="rv-select"
                    value={form.book_id}
                    onChange={e => setForm(f => ({ ...f, book_id: e.target.value }))}
                  >
                    {fallbackBooks.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.title} — {b.available_copies}/{b.total_copies} mavjud
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rv-field">
                  <label className="rv-label">Olish sanasi</label>
                  <input
                    className="rv-input"
                    type="date"
                    value={form.pickup_date}
                    onChange={e => setForm(f => ({ ...f, pickup_date: e.target.value }))}
                  />
                </div>
                <div className="rv-field">
                  <label className="rv-label">Olish vaqti</label>
                  <input
                    className="rv-input"
                    type="time"
                    value={form.pickup_time}
                    onChange={e => setForm(f => ({ ...f, pickup_time: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className="rv-submit" disabled={loading}>
                {loading ? "Yuklanmoqda…" : "Band qilish"}
              </button>
            </form>
          </div>
        )}

        {/* Reservations list */}
        <div className="rv-section">
          <div className="rv-section-head">
            <h2 className="rv-section-title">
              {isStaff ? "Barcha bronlar" : "Mening bronlarim"}
            </h2>
            <span className="rv-count">{reservations.length} ta</span>
          </div>

          {reservations.length === 0 ? (
            <div className="rv-empty">
              <div className="rv-empty-icon">🔖</div>
              <p>Hozircha bron yo'q</p>
              <span>Yangi kitob band qilganingizda bu yerda ko'rinadi</span>
            </div>
          ) : (
            <div className="rv-cards">
              {reservations.map(r => (
                <div key={r.id} className={`rv-card rv-card-${r.status}`}>
                  {/* Status stripe */}
                  <div className="rv-card-stripe"/>

                  <div className="rv-card-body">
                    <div className="rv-card-top">
                      <div>
                        <p className="rv-card-title">{r.book_title}</p>
                        <p className="rv-card-pickup">
                          {r.pickup_date} · {r.pickup_time}
                        </p>
                      </div>
                      <StatusPill s={r.status}/>
                    </div>

                    <div className="rv-card-footer">
                      <QRChip code={r.qr_code}/>
                      {isStaff && r.status === "pending" && (
                        <div className="rv-staff-actions">
                          <button className="rv-act approve" onClick={() => updateStatus(r.id, "approve")}>
                            Tasdiqlash
                          </button>
                          <button className="rv-act reject" onClick={() => updateStatus(r.id, "reject")}>
                            Rad etish
                          </button>
                        </div>
                      )}
                      {isStaff && r.status === "approved" && (
                        <button className="rv-act pickup" onClick={() => updateStatus(r.id, "picked_up")}>
                          Olib ketildi ✓
                        </button>
                      )}
                      {!isStaff && r.status === "approved" && (
                        <span className="rv-pickup-hint">
                          Kutubxonaga keling — QR kodni ko'rsating
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
