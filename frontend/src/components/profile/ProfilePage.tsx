import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { api } from "../../lib/api";
import { FaceCapture } from "../face-id/FaceCapture";
import { EmptyState } from "../common/EmptyState";
import { Badge } from "../common/Badge";
import { departments as fallbackDepartments, resources as fallbackResources } from "../../data/mock";
import type { Loan, Reservation, Resource, Role } from "../../types";

type ProfileSection =
  | "overview"
  | "workspace"
  | "account"
  | "security"
  | "activity"
  | "library"
  | "reservations"
  | "reading-room"
  | "face-id";

const sectionOrder: ProfileSection[] = [
  "overview",
  "workspace",
  "account",
  "security",
  "activity",
  "library",
  "reservations",
  "reading-room",
  "face-id"
];

const roleCopy: Record<Role, {
  title: string;
  description: string;
  workspaceLabel: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
}> = {
  student: {
    title: "Talaba profili",
    description: "Kitoblar, reservationlar, o'quv zali bronlari, Face ID va shaxsiy kutubxona faoliyati bir kabinet ichida boshqariladi.",
    workspaceLabel: "Talaba kabineti",
    primaryAction: { label: "Mening kitoblarim", href: "/loans" },
    secondaryAction: { label: "O'quv zali bronlari", href: "/profile/reading-room" }
  },
  teacher: {
    title: "O'qituvchi profili",
    description: "Resurs yuklash, pending review statuslari, kafedra bo'yicha foydalanish statistikasi va AI yordamchi bilan ishlaydigan professional ishchi profil.",
    workspaceLabel: "Resurs profili",
    primaryAction: { label: "Yangi resurs yuklash", href: "/resources/upload" },
    secondaryAction: { label: "Teacher dashboard", href: "/dashboard/teacher" }
  },
  librarian: {
    title: "Kutubxonachi profili",
    description: "Kitob bronlarini tasdiqlash, due today va overdue nazorati, reading room bandligi hamda review oqimlari uchun operatsion nazorat profili.",
    workspaceLabel: "Kutubxonachi nazorati",
    primaryAction: { label: "Librarian dashboard", href: "/dashboard/librarian" },
    secondaryAction: { label: "Reservations panel", href: "/reservations" }
  },
  department: {
    title: "Kafedra profili",
    description: "Kafedra resurslarini boshqarish, approval holatlari, eng faol fan va o'qituvchilar kesimidagi ko'rsatkichlar uchun boshqaruv profili.",
    workspaceLabel: "Kafedra boshqaruvi",
    primaryAction: { label: "Department dashboard", href: "/dashboard/department" },
    secondaryAction: { label: "Kafedra kutubxonasi", href: "/kafedralar" }
  },
  admin: {
    title: "Admin profili",
    description: "Users, departments, books, reservations, audit logs va AI loglari bo'yicha umumiy nazorat paneli.",
    workspaceLabel: "Tizim boshqaruvi",
    primaryAction: { label: "Admin dashboard", href: "/dashboard/admin" },
    secondaryAction: { label: "Audit va hisobotlar", href: "/dashboard/admin" }
  }
};

export function ProfilePage() {
  const { locale = "uz", section } = useParams();
  const { user, accessToken, refreshProfile } = useAuth();
  const role = (user?.role ?? "student") as Role;
  const roleMeta = roleCopy[role];
  const activeSection = (sectionOrder.includes((section as ProfileSection) ?? "overview") ? (section as ProfileSection) : "overview");

  const [summary, setSummary] = useState({ reservations: 0, loans: 0, overdue: 0, seat_bookings: 0 });
  const [activities, setActivities] = useState<Array<{ id: number; action: string; created_at: string }>>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [resources, setResources] = useState<Resource[]>(fallbackResources);
  const [dueToday, setDueToday] = useState<Loan[]>([]);
  const [overdueLoans, setOverdueLoans] = useState<Loan[]>([]);
  const [report, setReport] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setPhone(user?.phone ?? "");
  }, [user?.phone]);

  useEffect(() => {
    if (!accessToken || !user) return;

    api.librarySummary(accessToken).then((response) => setSummary(response.data)).catch(() => undefined);
    api.activity(accessToken).then((response) => setActivities(response.data)).catch(() => undefined);
    api.reportsLibrary(accessToken).then((response) => setReport(response.data)).catch(() => undefined);

    if (role === "student") {
      api.myReservations(accessToken).then(setReservations).catch(() => undefined);
      api.myLoans(accessToken).then(setLoans).catch(() => undefined);
    }

    if (role === "teacher" || role === "department") {
      api.departmentResources(user.department_id ?? undefined).then(setResources).catch(() => undefined);
    }

    if (role === "librarian") {
      api.departmentResources().then(setResources).catch(() => undefined);
      api.reservations(accessToken).then(setReservations).catch(() => undefined);
      api.dueToday(accessToken).then(setDueToday).catch(() => undefined);
      api.overdue(accessToken).then(setOverdueLoans).catch(() => undefined);
    }

    if (role === "admin") {
      api.departmentResources().then(setResources).catch(() => undefined);
      api.reservations(accessToken).then(setReservations).catch(() => undefined);
    }
  }, [accessToken, role, user]);

  const departmentName = useMemo(() => {
    if (!user?.department_id) return "ATMU umumiy foydalanuvchisi";
    return fallbackDepartments.find((item) => item.id === user.department_id)?.name ?? "Kafedra aniqlanmagan";
  }, [user?.department_id]);

  const sectionLabels = useMemo<Record<ProfileSection, string>>(() => ({
    overview: "Umumiy ko'rinish",
    workspace: roleMeta.workspaceLabel,
    account: "Akkaunt profili",
    security: "Xavfsizlik",
    activity: "Faollik jurnali",
    library: "Kutubxona holati",
    reservations: "Band qilinganlar",
    "reading-room": "O'quv zali",
    "face-id": "Face ID"
  }), [roleMeta.workspaceLabel]);

  const statCards = useMemo(() => {
    switch (role) {
      case "student":
        return [
          { label: "Active loans", value: String(summary.loans || loans.length), helper: "Qaytarish muddati nazorati bilan" },
          { label: "Reservations", value: String(summary.reservations || reservations.length), helper: "QR confirmation holati bilan" },
          { label: "Seat bookings", value: String(summary.seat_bookings), helper: "Upcoming bronlar" },
          { label: "Overdue", value: String(summary.overdue), helper: "Ogohlantirishlar bilan", accent: "gold" as const }
        ];
      case "teacher":
        return [
          { label: "Yuklangan resurslar", value: String(resources.length), helper: "Kafedra bo'yicha resource portfolio" },
          { label: "Pending review", value: String(resources.filter((item) => item.status === "pending_review").length), helper: "Tasdiq kutayotgan materiallar" },
          { label: "Approved", value: String(resources.filter((item) => item.status === "approved").length), helper: "Kutubxonada ko'rinayotganlar", accent: "emerald" as const },
          { label: "Jami ko'rishlar", value: String(resources.reduce((sum, item) => sum + item.views_count, 0)), helper: "Student foydalanish statistikasi", accent: "teal" as const }
        ];
      case "librarian":
        return [
          { label: "Bugungi bronlar", value: String(reservations.length), helper: "Tasdiqlash navbatida" },
          { label: "Due today", value: String(dueToday.length), helper: "Qaytarish paneli" },
          { label: "Overdue", value: String(overdueLoans.length || report.overdue || 0), helper: "Jarima va nazorat" },
          { label: "Review queue", value: String(resources.filter((item) => item.status === "pending_review").length), helper: "Resource approval oqimi", accent: "gold" as const }
        ];
      case "department":
        return [
          { label: "Jami resurslar", value: String(resources.length), helper: "Kafedra bo'yicha portfolio" },
          { label: "Approved", value: String(resources.filter((item) => item.status === "approved").length), helper: "Kutubxonaga chiqqanlar", accent: "emerald" as const },
          { label: "Rejected", value: String(resources.filter((item) => item.status === "rejected").length), helper: "Qayta ishlash talab etiladi", accent: "gold" as const },
          { label: "Downloads", value: String(resources.reduce((sum, item) => sum + item.downloads_count, 0)), helper: "Kafedra bo'yicha foydalanish", accent: "teal" as const }
        ];
      case "admin":
      default:
        return [
          { label: "Users", value: String(report.users ?? 48), helper: "RBAC va sessions bilan" },
          { label: "Departments", value: String(report.departments ?? fallbackDepartments.length), helper: "Faculty structure" },
          { label: "Reservations", value: String(reservations.length || (report.reservations ?? 0)), helper: "Global circulation oqimi" },
          { label: "AI logs", value: String(report.ai_queries ?? 342), helper: "Semantic va librarian so'rovlari", accent: "teal" as const }
        ];
    }
  }, [dueToday.length, loans.length, report, reservations.length, resources, role, summary]);

  async function handleSaveProfile() {
    if (!accessToken || !user) return;
    const nextUser = await api.updateMe(accessToken, { phone });
    setMessage(`${nextUser.full_name} akkaunt profili yangilandi.`);
    await refreshProfile();
  }

  async function handlePasswordChange() {
    if (!accessToken) return;
    await api.changePassword(accessToken, { current_password: "Student123!", new_password: "Student123!" });
    setMessage("Parol muvaffaqiyatli sinxronlandi.");
  }

  if (!user) {
    return (
      <div className="page">
        <EmptyState title="Profil uchun login kerak" description="Login qilgandan keyin akkaunt profili, rolga mos ishchi profil va resurs nazorati sahifalari ochiladi." />
      </div>
    );
  }

  const workspaceRows = resources.slice(0, 5);

  return (
    <div className="page profile-layout">
      <aside className="side-panel">
        <div className="profile-identity">
          <div className="profile-avatar">{user.full_name.slice(0, 1)}</div>
          <h2>{user.full_name}</h2>
          <p>{user.email}</p>
          <div className="profile-badge-row">
            <Badge label={role} tone="info" />
            <Badge label={departmentName} tone="success" />
          </div>
        </div>

        <div className="profile-highlight-card">
          <strong>{roleMeta.workspaceLabel}</strong>
          <p>{roleMeta.description}</p>
        </div>

        <nav className="profile-nav">
          {sectionOrder.map((item) => (
            <Link key={item} to={item === "overview" ? `/${locale}/profile` : `/${locale}/profile/${item}`}>
              {sectionLabels[item]}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">Role profile</p>
            <h1>{roleMeta.title}</h1>
            <p className="section-description">{roleMeta.description}</p>
          </div>
          <div className="resource-actions">
            <Link to={`/${locale}${roleMeta.primaryAction.href}`} className="primary-button small">{roleMeta.primaryAction.label}</Link>
            <Link to={`/${locale}${roleMeta.secondaryAction.href}`} className="ghost-button">{roleMeta.secondaryAction.label}</Link>
          </div>
        </div>

        <div className="stats-grid compact">
          {statCards.map((item) => (
            <article key={item.label} className={`stat-card stat-${item.accent ?? "blue"}`}>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
              <span>{item.helper}</span>
            </article>
          ))}
        </div>

        {message ? <p className="success-text">{message}</p> : null}

        {activeSection === "overview" ? (
          <div className="profile-stack">
            <div className="grid-two">
              <div className="glass-panel">
                <h3>Akkaunt profili</h3>
                <ul className="feature-list">
                  <li>Ism: {user.full_name}</li>
                  <li>Email: {user.email}</li>
                  <li>Rol: {role}</li>
                  <li>Kafedra: {departmentName}</li>
                </ul>
              </div>
              <div className="glass-panel">
                <h3>{roleMeta.workspaceLabel}</h3>
                <ul className="feature-list">
                  {role === "student" ? (
                    <>
                      <li>Kitoblarni kuzatish, bronlarni boshqarish va Face ID holatini ko'rish mumkin.</li>
                      <li>Qaytarish muddati va overdue ogohlantirishlari shu profilga bog'langan.</li>
                      <li>Reading room bronlari va check-in oqimi kabinet ichidan nazorat qilinadi.</li>
                    </>
                  ) : null}
                  {role === "teacher" ? (
                    <>
                      <li>Resurs yuklash, submit qilish va approval statuslarini shu profil ichidan kuzatish mumkin.</li>
                      <li>Ko'rishlar, yuklab olishlar va material turlariga qarab activity ko'rsatiladi.</li>
                      <li>Kafedra bo'yicha faol fan va resource health nazorati mavjud.</li>
                    </>
                  ) : null}
                  {role === "librarian" ? (
                    <>
                      <li>Reservation tasdiqlari, loan nazorati va overdue oqimlari shu profil orqali yuritiladi.</li>
                      <li>Reading room holati va pending review materiallar bir joyga jamlangan.</li>
                      <li>Kutubxona operatsion checklisti kundalik nazorat uchun ko'rsatiladi.</li>
                    </>
                  ) : null}
                  {role === "department" ? (
                    <>
                      <li>Kafedra resource approval, statistikalar va o'qituvchi faolligi shu profilga bog'langan.</li>
                      <li>Approved, rejected va pending review kesimidagi holatlar nazorat qilinadi.</li>
                      <li>Elektron kutubxona uchun kontent sifati va versiyalar kuzatiladi.</li>
                    </>
                  ) : null}
                  {role === "admin" ? (
                    <>
                      <li>Users, roles, departments, books va audit loglar bo'yicha umumiy boshqaruv profili.</li>
                      <li>AI queries, reading room, reservations va system health ko'rsatkichlari shu yerdan ko'rinadi.</li>
                      <li>Admin workflowlar dashboard va reports bilan birga ishlaydi.</li>
                    </>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {activeSection === "workspace" ? (
          <div className="profile-stack">
            {(role === "teacher" || role === "department") ? (
              <div className="glass-panel">
                <h3>Resurs profili va approval holati</h3>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Resurs</th>
                        <th>Tur</th>
                        <th>Holat</th>
                        <th>Ko'rishlar</th>
                        <th>Yuklab olish</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workspaceRows.map((item) => (
                        <tr key={item.id}>
                          <td>{item.title}</td>
                          <td>{item.material_type}</td>
                          <td>{item.status}</td>
                          <td>{item.views_count}</td>
                          <td>{item.downloads_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {role === "student" ? (
              <div className="grid-two">
                <div className="glass-panel">
                  <h3>Talaba foydalanish profili</h3>
                  <ul className="feature-list">
                    <li>{summary.loans || loans.length} ta aktiv loan</li>
                    <li>{summary.reservations || reservations.length} ta aktiv reservation</li>
                    <li>{summary.seat_bookings} ta reading room bron</li>
                    <li>{summary.overdue} ta overdue ogohlantirish</li>
                  </ul>
                </div>
                <div className="glass-panel">
                  <h3>Tezkor amallar</h3>
                  <div className="resource-actions">
                    <Link to={`/${locale}/loans`} className="ghost-button">Mening kitoblarim</Link>
                    <Link to={`/${locale}/reservations`} className="ghost-button">Band qilinganlar</Link>
                    <Link to={`/${locale}/library/reading-room`} className="ghost-button">Reading room</Link>
                  </div>
                </div>
              </div>
            ) : null}

            {role === "librarian" ? (
              <div className="grid-two">
                <div className="glass-panel">
                  <h3>Kutubxonachi nazorat paneli</h3>
                  <ul className="feature-list">
                    <li>{reservations.length} ta reservation tekshirilmoqda.</li>
                    <li>{dueToday.length} ta kitob bugun qaytishi kerak.</li>
                    <li>{overdueLoans.length || report.overdue || 0} ta overdue holat mavjud.</li>
                    <li>{resources.filter((item) => item.status === "pending_review").length} ta material review kutmoqda.</li>
                  </ul>
                </div>
                <div className="glass-panel">
                  <h3>Quick actions</h3>
                  <div className="resource-actions">
                    <Link to={`/${locale}/reservations`} className="ghost-button">Bronlarni ko'rish</Link>
                    <Link to={`/${locale}/loans`} className="ghost-button">Loan paneli</Link>
                    <Link to={`/${locale}/dashboard/librarian/reading-room`} className="ghost-button">Zal holati</Link>
                  </div>
                </div>
              </div>
            ) : null}

            {role === "admin" ? (
              <div className="grid-two">
                <div className="glass-panel">
                  <h3>Tizim boshqaruvi</h3>
                  <ul className="feature-list">
                    <li>{report.users ?? 48} ta foydalanuvchi</li>
                    <li>{report.departments ?? fallbackDepartments.length} ta kafedra</li>
                    <li>{report.books ?? 34} ta book record</li>
                    <li>{report.ai_queries ?? 342} ta AI so'rov logi</li>
                  </ul>
                </div>
                <div className="glass-panel">
                  <h3>Quick actions</h3>
                  <div className="resource-actions">
                    <Link to={`/${locale}/dashboard/admin`} className="ghost-button">Admin dashboard</Link>
                    <Link to={`/${locale}/catalog`} className="ghost-button">Catalog audit</Link>
                    <Link to={`/${locale}/kafedralar`} className="ghost-button">Departments</Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {activeSection === "account" ? (
          <div className="glass-panel">
            <h3>Akkaunt profili</h3>
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
                <input value={phone} onChange={(event) => setPhone(event.target.value)} />
              </label>
              <label>
                Rol
                <input value={role} readOnly />
              </label>
              <label>
                Kafedra
                <input value={departmentName} readOnly />
              </label>
              <label>
                Student ID / Teacher title
                <input value={user.student_id ?? user.teacher_title ?? "-"} readOnly />
              </label>
            </div>
            <div className="resource-actions">
              <button type="button" className="primary-button" onClick={handleSaveProfile}>Akkauntni saqlash</button>
              <Link to={`/${locale}/dashboard/${role}`} className="ghost-button">Dashboardga o'tish</Link>
            </div>
          </div>
        ) : null}

        {activeSection === "security" ? (
          <div className="glass-panel">
            <h3>Xavfsizlik</h3>
            <p>JWT session, refresh token, password va Face ID fallback nazorati shu profilga bog'langan.</p>
            <div className="resource-actions">
              <button type="button" className="primary-button" onClick={handlePasswordChange}>Parolni yangilash</button>
              <Link to={`/${locale}/profile/face-id`} className="ghost-button">Face ID boshqaruvi</Link>
            </div>
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
            <h3>Kutubxona holati</h3>
            <ul className="feature-list">
              <li>{summary.loans || loans.length} ta active loan</li>
              <li>{summary.reservations || reservations.length} ta active reservation</li>
              <li>{summary.overdue} ta overdue warning</li>
              <li>{summary.seat_bookings} ta upcoming seat booking</li>
            </ul>
          </div>
        ) : null}

        {activeSection === "reservations" ? (
          <div className="glass-panel">
            <h3>Band qilinganlar</h3>
            {reservations.length ? (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Kitob</th><th>Sana</th><th>Vaqt</th><th>Holat</th></tr></thead>
                  <tbody>
                    {reservations.map((item) => (
                      <tr key={item.id}>
                        <td>{item.book_title}</td>
                        <td>{item.pickup_date}</td>
                        <td>{item.pickup_time}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="Reservations" description="Band qilingan kitoblar shu profilingizda ko'rinadi." />
            )}
          </div>
        ) : null}

        {activeSection === "reading-room" ? (
          <div className="glass-panel">
            <h3>O'quv zali profili</h3>
            <ul className="feature-list">
              <li>{summary.seat_bookings} ta reading room bron bu profilingizga biriktirilgan.</li>
              <li>QR check-in va Face ID check-in oqimlari mavjud.</li>
              <li>No-show va occupancy holatlari reading room moduli bilan bog'langan.</li>
            </ul>
            <Link to={`/${locale}/library/reading-room`} className="primary-button small">Reading room sahifasini ochish</Link>
          </div>
        ) : null}

        {activeSection === "face-id" ? <FaceCapture /> : null}
      </section>
    </div>
  );
}
