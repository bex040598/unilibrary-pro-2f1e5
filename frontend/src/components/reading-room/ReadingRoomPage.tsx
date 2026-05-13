import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { readingRooms as fallbackRooms, seats as fallbackSeats } from "../../data/mock";
import type { ReadingRoom, Seat } from "../../types";
import { EmptyState } from "../common/EmptyState";

export function ReadingRoomPage() {
  const { accessToken } = useAuth();
  const [rooms, setRooms] = useState<ReadingRoom[]>(fallbackRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<number>(fallbackRooms[0].id);
  const [seats, setSeats] = useState<Seat[]>(fallbackSeats);
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: "2026-05-14",
    start_time: "10:00",
    end_time: "12:00"
  });

  useEffect(() => {
    api.readingRooms().then(setRooms).catch(() => undefined);
  }, []);

  useEffect(() => {
    api.seats(selectedRoomId).then(setSeats).catch(() => setSeats(fallbackSeats.filter((seat) => seat.reading_room_id === selectedRoomId)));
  }, [selectedRoomId]);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? rooms[0];
  const roomSeats = useMemo(() => seats.filter((seat) => seat.reading_room_id === selectedRoomId), [selectedRoomId, seats]);

  async function handleReserve(event: FormEvent) {
    event.preventDefault();
    if (!accessToken || !selectedSeatId) return;
    await api.reserveSeat(accessToken, {
      seat_id: selectedSeatId,
      date: form.date,
      start_time: form.start_time,
      end_time: form.end_time
    });
    setMessage(`Seat ${selectedSeatId} bron qilindi. QR check-in tayyor.`);
  }

  if (!selectedRoom) {
    return <div className="page"><EmptyState title="Reading room topilmadi" description="Seed reading room ma'lumotlari backend bilan sinxronlashadi." /></div>;
  }

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">Reading room</p>
          <h1>Interaktiv o'quv zali joy band qilish</h1>
          <p className="section-description">Seat map, QR check-in, Face ID optional check-in va occupancy statistics.</p>
        </div>
      </div>
      <div className="split-grid">
        <div className="glass-panel">
          <h3>Zallar ro'yxati</h3>
          <div className="room-list">
            {rooms.map((room) => (
              <button key={room.id} type="button" className={`room-card ${room.id === selectedRoomId ? "selected" : ""}`} onClick={() => setSelectedRoomId(room.id)}>
                <strong>{room.name}</strong>
                <span>{room.floor}</span>
                <span>{room.available_seats}/{room.total_seats} available</span>
              </button>
            ))}
          </div>
          <div className="occupancy-card">
            <p>Occupancy</p>
            <strong>{selectedRoom.occupancy_rate}%</strong>
          </div>
        </div>
        <div className="glass-panel">
          <h3>Premium seat grid</h3>
          <div className="seat-grid">
            {roomSeats.map((seat) => (
              <button
                key={seat.id}
                type="button"
                className={`seat-button ${seat.status} ${selectedSeatId === seat.id ? "selected" : ""}`}
                onClick={() => seat.status === "available" ? setSelectedSeatId(seat.id) : undefined}
              >
                {seat.code}
              </button>
            ))}
          </div>
          <form className="form-stack" onSubmit={handleReserve}>
            <div className="grid-two">
              <label>Sana<input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} /></label>
              <label>Start<input type="time" value={form.start_time} onChange={(event) => setForm((current) => ({ ...current, start_time: event.target.value }))} /></label>
              <label>End<input type="time" value={form.end_time} onChange={(event) => setForm((current) => ({ ...current, end_time: event.target.value }))} /></label>
            </div>
            <button type="submit" className="primary-button" disabled={!selectedSeatId}>Seat reservation</button>
          </form>
          {message ? <p className="success-text">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}

