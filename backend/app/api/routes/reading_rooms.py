from datetime import UTC, date, datetime, time

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.models import ReadingRoom, Seat, SeatReservation, User
from app.schemas.common import SeatReservationCreateRequest
from app.services.audit import write_audit_log
from app.services.serializers import serialize_reading_room, serialize_seat

router = APIRouter()


@router.get("/reading-rooms")
def list_reading_rooms(db: Session = Depends(get_db)) -> list[dict]:
    rooms = db.scalars(select(ReadingRoom).order_by(ReadingRoom.id)).all()
    return [serialize_reading_room(room, db.scalars(select(Seat).where(Seat.reading_room_id == room.id)).all()) for room in rooms]


@router.get("/reading-rooms/{room_id}/seats")
def room_seats(room_id: int, db: Session = Depends(get_db)) -> list[dict]:
    seats = db.scalars(select(Seat).where(Seat.reading_room_id == room_id).order_by(Seat.id)).all()
    return [serialize_seat(seat) for seat in seats]


@router.post("/seat-reservations")
def reserve_seat(payload: SeatReservationCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    seat = db.get(Seat, payload.seat_id)
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")
    if seat.status != "available":
        raise HTTPException(status_code=400, detail="Seat is not available")
    reservation = SeatReservation(
        seat_id=payload.seat_id,
        user_id=current_user.id,
        date=date.fromisoformat(payload.date),
        start_time=time.fromisoformat(payload.start_time),
        end_time=time.fromisoformat(payload.end_time),
        status="reserved",
        qr_code=f"SEAT-{payload.seat_id}-{current_user.id}-{int(datetime.now().timestamp())}",
    )
    seat.status = "reserved"
    db.add(reservation)
    db.commit()
    write_audit_log(db, "reading_room.reserve", f"Seat {seat.id}", current_user.id)
    return {"data": {"id": reservation.id, "seat_id": reservation.seat_id, "status": reservation.status, "qr_code": reservation.qr_code}}


@router.get("/seat-reservations/my")
def my_seat_reservations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    items = db.scalars(select(SeatReservation).where(SeatReservation.user_id == current_user.id).order_by(SeatReservation.id.desc())).all()
    return {"data": [
        {
            "id": item.id,
            "seat_id": item.seat_id,
            "date": item.date.isoformat(),
            "start_time": item.start_time.strftime("%H:%M"),
            "end_time": item.end_time.strftime("%H:%M"),
            "status": item.status,
            "qr_code": item.qr_code,
        }
        for item in items
    ]}


def move_seat_reservation(seat_reservation_id: int, next_status: str, current_user: User, db: Session) -> dict:
    reservation = db.get(SeatReservation, seat_reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Seat reservation not found")
    if reservation.user_id != current_user.id and current_user.primary_role not in {"admin", "librarian"}:
        raise HTTPException(status_code=403, detail="Not allowed")
    reservation.status = next_status
    seat = db.get(Seat, reservation.seat_id)
    if next_status == "checked_in":
        reservation.checked_in_at = datetime.now(UTC)
        if seat:
            seat.status = "occupied"
    elif next_status == "checked_out":
        reservation.checked_out_at = datetime.now(UTC)
        if seat:
            seat.status = "available"
    elif next_status == "cancelled":
        if seat:
            seat.status = "available"
    db.commit()
    write_audit_log(db, f"reading_room.{next_status}", f"Seat reservation {reservation.id}", current_user.id)
    return {"data": {"id": reservation.id, "status": reservation.status}}


@router.patch("/seat-reservations/{seat_reservation_id}/check-in")
def check_in_seat(seat_reservation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    return move_seat_reservation(seat_reservation_id, "checked_in", current_user, db)


@router.patch("/seat-reservations/{seat_reservation_id}/check-out")
def check_out_seat(seat_reservation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    return move_seat_reservation(seat_reservation_id, "checked_out", current_user, db)


@router.patch("/seat-reservations/{seat_reservation_id}/cancel")
def cancel_seat_reservation(seat_reservation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    return move_seat_reservation(seat_reservation_id, "cancelled", current_user, db)

