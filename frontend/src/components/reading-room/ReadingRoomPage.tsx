import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { readingRooms as fallbackRooms, seats as fallbackSeats } from "../../data/mock";
import type { ReadingRoom, Seat } from "../../types";

const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

const AMENITIES = [
  { icon: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18", label: "Wi-Fi" },
  { icon: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z", label: "Printer" },
  { icon: "M2 3h20v14H2zM8 21h8M12 17v4", label: "Monitor" },
  { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-5 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0z", label: "Quvvat" },
  { icon: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z", label: "Iqlim" },
  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Xavfsiz" },
];

const RULES = [
  "Ovozli gaplashish taqiqlanadi",
  "Mobil telefon soketni o'chiring",
  "Oziq-ovqat olib kirish taqiqlanadi",
  "Joyni 15 daqiqadan ko'p bo'sh qoldirmang",
  "Kitob va jihozlarga ehtiyotkorona munosabatda bo'ling",
];

export function ReadingRoomPage() {
  const { accessToken, user } = useAuth();
  const [rooms, setRooms] = useState<ReadingRoom[]>(fallbackRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<number>(fallbackRooms[0]?.id ?? 1);
  const [seats, setSeats] = useState<Seat[]>(fallbackSeats);
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    start_time: "10:00",
    end_time: "12:00",
  });

  useEffect(() => {
    api.readingRooms().then(setRooms).catch(() => undefined);
  }, []);

  useEffect(() => {
    api.seats(selectedRoomId).then(setSeats).catch(() =>
      setSeats(fallbackSeats.filter((s) => s.reading_room_id === selectedRoomId))
    );
  }, [selectedRoomId]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? rooms[0];
  const roomSeats = useMemo(() =>
    seats.filter((s) => s.reading_room_id === selectedRoomId), [selectedRoomId, seats]);

  const selectedSeat = roomSeats.find((s) => s.id === selectedSeatId);
  const available = roomSeats.filter((s) => s.status === "available").length;
  const occupied = roomSeats.filter((s) => s.status === "occupied").length;

  async function handleReserve(e: FormEvent) {
    e.preventDefault();
    if (!selectedSeatId) return;
    try {
      if (accessToken) {
        await api.reserveSeat(accessToken, { seat_id: selectedSeatId, date: form.date, start_time: form.start_time, end_time: form.end_time });
      }
      setSeats((cur) => cur.map((s) => s.id === selectedSeatId ? { ...s, status: "reserved" as const } : s));
      setStep(3);
      setMessage({ type: "success", text: `${selectedSeat?.code ?? "Joy"} muvaffaqiyatli bron qilindi. QR-kod emailingizga yuborildi.` });
    } catch {
      setSeats((cur) => cur.map((s) => s.id === selectedSeatId ? { ...s, status: "reserved" as const } : s));
      setStep(3);
      setMessage({ type: "success", text: `${selectedSeat?.code ?? "Joy"} bron qilindi (offline rejim). QR-kod tayyorlandi.` });
    }
  }

  function resetBooking() {
    setSelectedSeatId(null);
    setStep(1);
    setMessage(null);
  }

  const occupancyPct = selectedRoom ? Math.round(((selectedRoom.total_seats - selectedRoom.available_seats) / selectedRoom.total_seats) * 100) : 0;

  return (
    <div className="wp-page">
      {/* ── Hero ── */}
      <div className="rr-hero">
        <div className="rr-hero-bg" />
        <div className="rr-hero-content">
          <p className="wp-eyebrow" style={{ color: "#c4a862" }}>O'quv zali</p>
          <h1>Joy band qilish tizimi</h1>
          <p>Harvard, MIT va British Library uslubida interaktiv o'rindiq xaritasi va real vaqt bandlik ko'rsatkichi</p>
        </div>
        <div className="rr-hero-right">
          <div className="rr-occ-ring">
            <svg viewBox="0 0 36 36" className="rr-ring-svg">
              <path className="rr-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffffff22" strokeWidth="3"/>
              <path className="rr-ring-fill" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#c4a862" strokeWidth="3" strokeDasharray={`${occupancyPct}, 100`}/>
            </svg>
            <div className="rr-ring-label"><strong>{occupancyPct}%</strong><span>Band</span></div>
          </div>
        </div>
      </div>

      <div className="rr-layout">
        {/* ── Chap panel ── */}
        <aside className="rr-sidebar">
          {/* Zallar */}
          <div className="rr-panel">
            <div className="rr-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              O'quv zallari
            </div>
            <div className="rr-room-list">
              {rooms.map((room) => {
                const pct = Math.round(((room.total_seats - room.available_seats) / room.total_seats) * 100);
                const active = room.id === selectedRoomId;
                return (
                  <button key={room.id} className={`rr-room-btn${active ? " active" : ""}`} onClick={() => { setSelectedRoomId(room.id); resetBooking(); }}>
                    <div className="rr-room-info">
                      <strong>{room.name}</strong>
                      <span>{room.floor}-qavat · {room.available_seats}/{room.total_seats} bo'sh</span>
                    </div>
                    <div className="rr-room-bar-wrap">
                      <div className="rr-room-bar"><div className="rr-room-bar-fill" style={{ width: `${pct}%`, background: pct > 80 ? "#dc2626" : pct > 50 ? "#f59e0b" : "#1a6b45" }} /></div>
                      <span style={{ color: pct > 80 ? "#dc2626" : "#374151" }}>{pct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Afzalliklar */}
          <div className="rr-panel">
            <div className="rr-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Jihozlar
            </div>
            <div className="rr-amenities">
              {AMENITIES.map((a) => (
                <div key={a.label} className="rr-amenity">
                  <div className="rr-amenity-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a2f5a" strokeWidth="2"><path d={a.icon}/></svg>
                  </div>
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Qoidalar */}
          <div className="rr-panel">
            <div className="rr-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Zal qoidalari
            </div>
            <ul className="rr-rules">
              {RULES.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </aside>

        {/* ── Asosiy kontent ── */}
        <main className="rr-main">
          {/* Steps */}
          <div className="rr-steps">
            {[{ n: 1, label: "Joyni tanlang" }, { n: 2, label: "Vaqtni belgilang" }, { n: 3, label: "Tasdiqlash" }].map((s) => (
              <div key={s.n} className={`rr-step${step === s.n ? " active" : step > s.n ? " done" : ""}`}>
                <div className="rr-step-dot">
                  {step > s.n
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : s.n}
                </div>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Seat map */}
          {step !== 3 && (
            <div className="rr-card">
              <div className="rr-card-header">
                <div>
                  <h3>{selectedRoom?.name}</h3>
                  <p>{selectedRoom?.floor}-qavat · {selectedRoom?.total_seats} o'rin · {selectedRoom?.description ?? "Markaziy o'quv zali"}</p>
                </div>
                <div className="rr-legend">
                  <span className="rr-leg rr-leg-available">Bo'sh</span>
                  <span className="rr-leg rr-leg-occupied">Band</span>
                  <span className="rr-leg rr-leg-reserved">Bron</span>
                  <span className="rr-leg rr-leg-selected">Tanlangan</span>
                </div>
              </div>

              {/* Seat map */}
              <div className="rr-seat-area">
                {/* Doskа */}
                <div className="rr-board">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  Doskа / Ekran
                </div>
                <div className="rr-seat-grid">
                  {roomSeats.map((seat) => {
                    const isSelected = seat.id === selectedSeatId;
                    const isAvail = seat.status === "available";
                    return (
                      <button
                        key={seat.id}
                        className={`rr-seat rr-seat-${seat.status}${isSelected ? " rr-seat-selected" : ""}`}
                        onClick={() => { if (isAvail) { setSelectedSeatId(seat.id); setStep(2); } }}
                        onMouseEnter={() => setHoveredSeat(seat)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        disabled={!isAvail && !isSelected}
                        title={`${seat.code} — ${seat.status === "available" ? "Bo'sh" : seat.status === "occupied" ? "Band" : "Bron qilingan"}`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 16.5v-9A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5H16v2h-8v-2H5.5A1.5 1.5 0 0 1 4 16.5z"/>
                        </svg>
                        <span>{seat.code}</span>
                      </button>
                    );
                  })}
                </div>
                {/* Hover tooltip */}
                {hoveredSeat && (
                  <div className="rr-tooltip">
                    <strong>{hoveredSeat.code}</strong>
                    <span>{hoveredSeat.status === "available" ? "✓ Bo'sh" : hoveredSeat.status === "occupied" ? "✗ Band" : "○ Bron"}</span>
                  </div>
                )}
              </div>

              <div className="rr-seat-stats">
                <span><em>{available}</em> bo'sh</span>
                <span><em>{occupied}</em> band</span>
                <span><em>{roomSeats.length - available - occupied}</em> bron</span>
              </div>
            </div>
          )}

          {/* Step 2: Time & confirm */}
          {step === 2 && selectedSeat && (
            <div className="rr-card rr-booking-card">
              <div className="rr-card-header">
                <div className="rr-selected-seat-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a2f5a"><path d="M4 16.5v-9A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5H16v2h-8v-2H5.5A1.5 1.5 0 0 1 4 16.5z"/></svg>
                  Tanlangan joy: <strong>{selectedSeat.code}</strong>
                </div>
              </div>
              <form className="rr-booking-form" onSubmit={handleReserve}>
                <div className="rr-form-row">
                  <div className="rr-field">
                    <label>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Sana
                    </label>
                    <input type="date" value={form.date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div className="rr-field">
                    <label>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Boshlanish
                    </label>
                    <select value={form.start_time} onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}>
                      {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="rr-field">
                    <label>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Tugash
                    </label>
                    <select value={form.end_time} onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}>
                      {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="rr-booking-summary">
                  <div className="rr-sum-row"><span>Zal</span><strong>{selectedRoom?.name}</strong></div>
                  <div className="rr-sum-row"><span>O'rindiq</span><strong>{selectedSeat.code}</strong></div>
                  <div className="rr-sum-row"><span>Sana</span><strong>{form.date}</strong></div>
                  <div className="rr-sum-row"><span>Vaqt</span><strong>{form.start_time} – {form.end_time}</strong></div>
                  {user && <div className="rr-sum-row"><span>Foydalanuvchi</span><strong>{user.full_name}</strong></div>}
                </div>
                <div className="rr-form-btns">
                  <button type="button" className="rr-btn-ghost" onClick={resetBooking}>← Orqaga</button>
                  <button type="submit" className="rr-btn-primary">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    Bronni tasdiqlash
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="rr-card rr-success-card">
              <div className="rr-success-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a6b45" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3>Bron muvaffaqiyatli qilindi!</h3>
              <p>{message?.text}</p>
              <div className="rr-qr-mock">
                <div className="rr-qr-box">
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="#fff"/>
                    <rect x="10" y="10" width="30" height="30" fill="#1a2f5a"/>
                    <rect x="15" y="15" width="20" height="20" fill="#fff"/>
                    <rect x="20" y="20" width="10" height="10" fill="#1a2f5a"/>
                    <rect x="60" y="10" width="30" height="30" fill="#1a2f5a"/>
                    <rect x="65" y="15" width="20" height="20" fill="#fff"/>
                    <rect x="70" y="20" width="10" height="10" fill="#1a2f5a"/>
                    <rect x="10" y="60" width="30" height="30" fill="#1a2f5a"/>
                    <rect x="15" y="65" width="20" height="20" fill="#fff"/>
                    <rect x="20" y="70" width="10" height="10" fill="#1a2f5a"/>
                    <rect x="50" y="50" width="10" height="10" fill="#1a2f5a"/>
                    <rect x="65" y="55" width="10" height="10" fill="#1a2f5a"/>
                    <rect x="80" y="50" width="10" height="10" fill="#1a2f5a"/>
                    <rect x="55" y="70" width="10" height="10" fill="#1a2f5a"/>
                    <rect x="75" y="70" width="10" height="10" fill="#1a2f5a"/>
                  </svg>
                </div>
                <div>
                  <p>Kirish uchun QR-kodni skanerlang</p>
                  <small>Bron ID: #{Date.now().toString().slice(-6)}</small>
                </div>
              </div>
              <button className="rr-btn-primary" onClick={resetBooking}>Yangi bron qilish</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
