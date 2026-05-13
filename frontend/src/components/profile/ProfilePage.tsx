import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { api } from "../../lib/api";
import { FaceCapture } from "../face-id/FaceCapture";
import { EmptyState } from "../common/EmptyState";
import { Badge } from "../common/Badge";

const profileSections = [
  "edit",
  "security",
  "activity",
  "library",
  "reservations",
  "reading-room",
  "notifications",
  "face-id"
] as const;

export function ProfilePage() {
  const { locale = "uz", section } = useParams();
  const { user, accessToken, refreshProfile } = useAuth();
  const activeSection = section ?? "edit";
  const [summary, setSummary] = useState({ reservations: 0, loans: 0, overdue: 0, seat_bookings: 0 });
  const [activities, setActivities] = useState<Array<{ id: number; action: string; created_at: string }>>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    api.librarySummary(accessToken).then((response) => setSummary(response.data)).catch(() => undefined);
    api.activity(accessToken).then((response) => setActivities(response.data)).catch(() => undefined);
  }, [accessToken]);

  async function handleSaveProfile() {
    if (!accessToken) return;
    const nextUser = await api.updateMe(accessToken, { phone: user?.phone, avatar_url: user?.avatar_url });
    setMessage(`${nextUser.full_name} profili yangilandi.`);
    await refreshProfile();
  }

  async function handlePasswordChange() {
    if (!accessToken) return;
    await api.changePassword(accessToken, { current_password: "Student123!", new_password: "Student123!" });
    setMessage("Parol muvaffaqiyatli yangilandi.");
  }

  if (!user) {
    return (
      <div className="page">
        <EmptyState title="Profil uchun login kerak" description="Register yoki login orqali shaxsiy kabinet, loans, reservations va Face ID boshqaruviga kiring." />
      </div>
    );
  }

  return (
    <div className="page profile-layout">
      <aside className="side-panel">
        <div className="profile-identity">
          <div className="profile-avatar">{user.full_name.slice(0, 1)}</div>
          <h2>{user.full_name}</h2>
          <p>{user.email}</p>
          <Badge label={user.role} tone="info" />
        </div>
        <nav className="profile-nav">
          <Link to={`/${locale}/profile`}>Umumiy</Link>
          {profileSections.map((item) => (
            <Link key={item} to={`/${locale}/profile/${item}`}>{item}</Link>
          ))}
        </nav>
      </aside>
      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">Profile</p>
            <h1>Shaxsiy kabinet</h1>
            <p className="section-description">Library summary, security, activity, reservations va Face ID boshqaruvi.</p>
          </div>
        </div>
        <div className="stats-grid compact">
          <article className="stat-card stat-blue"><p>Loans</p><strong>{summary.loans}</strong></article>
          <article className="stat-card stat-gold"><p>Reservations</p><strong>{summary.reservations}</strong></article>
          <article className="stat-card stat-teal"><p>Seat bookings</p><strong>{summary.seat_bookings}</strong></article>
          <article className="stat-card stat-emerald"><p>Overdue</p><strong>{summary.overdue}</strong></article>
        </div>
        {message ? <p className="success-text">{message}</p> : null}

        {(activeSection === "edit" || !section) ? (
          <div className="glass-panel">
            <h3>Profil ma'lumotlari</h3>
            <div className="grid-two">
              <label>
                F.I.Sh
                <input value={user.full_name} readOnly />
              </label>
              <label>
                Email
                <input value={user.email} readOnly />
              </label>
              <label>
                Telefon
                <input value={user.phone ?? ""} readOnly />
              </label>
              <label>
                Role
                <input value={user.role} readOnly />
              </label>
            </div>
            <button type="button" className="primary-button" onClick={handleSaveProfile}>Profilni sinxronlash</button>
          </div>
        ) : null}

        {activeSection === "security" ? (
          <div className="glass-panel">
            <h3>Xavfsizlik</h3>
            <p>JWT session, refresh token, parol va Face ID fallback boshqaruvi.</p>
            <button type="button" className="primary-button" onClick={handlePasswordChange}>Parolni yangilash</button>
          </div>
        ) : null}

        {activeSection === "activity" ? (
          <div className="glass-panel">
            <h3>Faollik jurnali</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Action</th><th>Vaqt</th></tr></thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.id}</td>
                      <td>{activity.action}</td>
                      <td>{new Date(activity.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {activeSection === "library" ? (
          <div className="glass-panel">
            <h3>Library summary</h3>
            <ul className="feature-list">
              <li>{summary.loans} ta active loan</li>
              <li>{summary.reservations} ta active reservation</li>
              <li>{summary.overdue} ta overdue warning</li>
              <li>{summary.seat_bookings} ta upcoming seat booking</li>
            </ul>
          </div>
        ) : null}

        {activeSection === "face-id" ? <FaceCapture /> : null}
        {activeSection === "notifications" ? <EmptyState title="Notifications preview" description="Backend notification endpointlari uchun tayyor UI blok." /> : null}
        {activeSection === "reservations" ? <EmptyState title="Reservations" description="Book reservation holatlari `Band qilingan kitoblar` sahifasida ham ishlaydi." /> : null}
        {activeSection === "reading-room" ? <EmptyState title="Reading room bookings" description="Seat reservation timeline va check-in oqimi reading room sahifasida ishlaydi." /> : null}
      </section>
    </div>
  );
}

