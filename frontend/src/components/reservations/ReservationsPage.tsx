import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { books as fallbackBooks } from "../../data/mock";
import type { Reservation } from "../../types";
import { Badge } from "../common/Badge";
import { EmptyState } from "../common/EmptyState";

export function ReservationsPage() {
  const { user, accessToken } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    book_id: "1",
    pickup_date: "2026-05-14",
    pickup_time: "10:00"
  });

  useEffect(() => {
    if (!accessToken || !user) return;
    const loader = user.role === "librarian" || user.role === "admin" ? api.reservations(accessToken) : api.myReservations(accessToken);
    loader.then(setReservations).catch(() => undefined);
  }, [accessToken, user]);

  async function handleReserve(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return;
    await api.reserveBook(accessToken, { ...form, book_id: Number(form.book_id) });
    const nextReservations = await api.myReservations(accessToken);
    setReservations(nextReservations);
    setMessage("Kitob oldindan band qilindi va QR confirmation yaratildi.");
  }

  async function updateStatus(id: number, action: "approve" | "reject" | "picked_up") {
    if (!accessToken) return;
    if (action === "approve") await api.approveReservation(accessToken, id);
    if (action === "reject") await api.rejectReservation(accessToken, id);
    if (action === "picked_up") await api.markPickedUp(accessToken, id);
    const nextReservations = user?.role === "librarian" || user?.role === "admin"
      ? await api.reservations(accessToken)
      : await api.myReservations(accessToken);
    setReservations(nextReservations);
  }

  if (!user) {
    return <div className="page"><EmptyState title="Reservations uchun login kerak" description="Student, librarian yoki admin akkaunti bilan kirib reservation workflow’dan foydalaning." /></div>;
  }

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">Book reservations</p>
          <h1>Kitobni oldindan band qilish</h1>
          <p className="section-description">Pickup date/time, approval, QR confirmation va loan yaratish oqimi uchun sahifa.</p>
        </div>
      </div>
      {user.role === "student" ? (
        <form className="glass-panel form-stack" onSubmit={handleReserve}>
          <div className="grid-two">
            <label>Kitob
              <select value={form.book_id} onChange={(event) => setForm((current) => ({ ...current, book_id: event.target.value }))}>
                {fallbackBooks.map((book) => (
                  <option key={book.id} value={book.id}>{book.title} ({book.available_copies}/{book.total_copies})</option>
                ))}
              </select>
            </label>
            <label>Olish sanasi<input type="date" value={form.pickup_date} onChange={(event) => setForm((current) => ({ ...current, pickup_date: event.target.value }))} /></label>
            <label>Olish vaqti<input type="time" value={form.pickup_time} onChange={(event) => setForm((current) => ({ ...current, pickup_time: event.target.value }))} /></label>
          </div>
          <button type="submit" className="primary-button">Band qilish</button>
        </form>
      ) : null}
      {message ? <p className="success-text">{message}</p> : null}
      <div className="table-wrap glass-panel">
        <table>
          <thead><tr><th>Kitob</th><th>Pickup</th><th>Status</th><th>QR</th><th>Amallar</th></tr></thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.book_title}</td>
                <td>{reservation.pickup_date} {reservation.pickup_time}</td>
                <td><Badge label={reservation.status} tone={reservation.status === "approved" ? "success" : "warning"} /></td>
                <td>{reservation.qr_code}</td>
                <td>
                  {user.role === "librarian" || user.role === "admin" ? (
                    <div className="table-actions">
                      <button type="button" className="ghost-button" onClick={() => updateStatus(reservation.id, "approve")}>Approve</button>
                      <button type="button" className="ghost-button" onClick={() => updateStatus(reservation.id, "reject")}>Reject</button>
                      <button type="button" className="ghost-button" onClick={() => updateStatus(reservation.id, "picked_up")}>Picked up</button>
                    </div>
                  ) : (
                    <span>QR pickup waiting</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

