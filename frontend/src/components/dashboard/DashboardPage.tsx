import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import type { Loan, Reservation, Resource } from "../../types";
import { resources as fallbackResources } from "../../data/mock";

const ROLE_LABELS: Record<string, string> = {
  teacher: "O'qituvchi", librarian: "Kutubxonachi",
  department: "Kafedra mudiri", admin: "Administrator",
};

const POPULAR = [
  { id: 1, title: "Ma'lumotlar bazasi: amaliy qo'llanma", author: "Aziza Yuldasheva", type: "Laboratoriya ishi", views: 47 },
  { id: 2, title: "Kiberxavfsizlik asoslari", author: "Jasur Qodirov", type: "Darslik", views: 38 },
  { id: 3, title: "Python dasturlash tili", author: "Nodir Ergashev", type: "O'quv qo'llanma", views: 32 },
  { id: 4, title: "Mikroiqtisodiyot", author: "Nodira Mamatqulova", type: "Darslik", views: 28 },
  { id: 5, title: "Axborot xavfsizligi", author: "Bekzod Rahimov", type: "Ma'ruza", views: 24 },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "loan", text: "Bobur Toshmatov — Ma'lumotlar bazasi olindi", time: "2 daq oldin", status: "active" },
  { id: 2, type: "approve", text: "Kiberxavfsizlik darsligi tasdiqlandi", time: "18 daq oldin", status: "success" },
  { id: 3, type: "room", text: "Zilola Rahimova o'quv zalini bron qildi (A-14, 14:00)", time: "35 daq oldin", status: "active" },
  { id: 4, type: "upload", text: "Aziza Yuldasheva yangi resurs yukladi", time: "1 soat oldin", status: "active" },
  { id: 5, type: "overdue", text: "Sherzod Mirzayev — qaytarish muddati o'tdi (2 kun)", time: "2 soat oldin", status: "danger" },
  { id: 6, type: "loan", text: "Nilufar Hasanova — Python darsligi olindi", time: "3 soat oldin", status: "active" },
];

const STATUS_META: Record<string, { color: string; bg: string; label: string }> = {
  active:  { color: "#002147", bg: "#e8edf5", label: "Faol" },
  success: { color: "#065f46", bg: "#d1fae5", label: "Tasdiqlandi" },
  danger:  { color: "#9b1a2f", bg: "#fce8ea", label: "Muddati o'tdi" },
  pending: { color: "#92400e", bg: "#fef3c7", label: "Kutmoqda" },
};

function Svg({ d, size = 16, color = "currentColor" }: { d: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  book:     "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  upload:   "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  clock:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  warning:  "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  check:    "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  layers:   "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  bar:      "M18 20V10M12 20V4M6 20v-6",
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  list:     "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
};

export function DashboardPage() {
  const { dashboardRole, locale = "uz" } = useParams();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const role = dashboardRole ?? user?.role ?? "teacher";

  const [loans, setLoans]             = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources]     = useState<Resource[]>(fallbackResources);
  const [report, setReport]           = useState<Record<string, number>>({});
  const [activeTab, setActiveTab]     = useState("overview");

  useEffect(() => {
    if (role === "student") { navigate(`/${locale}`); return; }
    if (!accessToken) return;
    api.myLoans(accessToken).then(setLoans).catch(() => undefined);
    api.myReservations(accessToken).then(setReservations).catch(() => undefined);
    api.departmentResources(user?.department_id ?? undefined).then(setResources).catch(() => undefined);
    api.reportsLibrary(accessToken).then((r) => setReport(r.data ?? r)).catch(() => undefined);
  }, [accessToken, user?.department_id, role, locale, navigate]);

  const stats = useMemo(() => {
    if (role === "teacher") return [
      { label: "Jami resurslar", value: resources.length || 12, sub: "Yuklangan materiallar", icon: "book", accent: false },
      { label: "Ko'rib chiqilmoqda", value: resources.filter(r => r.status === "pending_review").length || 3, sub: "Tasdiqlash kutmoqda", icon: "clock", accent: false },
      { label: "Tasdiqlangan", value: resources.filter(r => r.status === "approved").length || 8, sub: "Katalogda ko'rinadi", icon: "check", accent: false },
      { label: "Jami ko'rishlar", value: 3_842, sub: "Barcha resurslar bo'yicha", icon: "eye", accent: false },
    ];
    if (role === "librarian") return [
      { label: "Bugungi bronlar", value: (report.today_reservations ?? reservations.length) || 8, sub: "Tasdiqlash navbatida", icon: "calendar", accent: false },
      { label: "Bugun qaytarish", value: report.due_today ?? 5, sub: "Muddati tugaydi", icon: "clock", accent: false },
      { label: "Muddati o'tgan", value: report.overdue ?? 3, sub: "Jarima talab qilinadi", icon: "warning", accent: true },
      { label: "Zal bandligi", value: `${(report.reading_room_occupancy ?? 61)}%`, sub: "Hozirda band", icon: "layers", accent: false },
    ];
    if (role === "department") return [
      { label: "Jami resurslar", value: resources.length || 24, sub: "Kafedra bo'yicha", icon: "book", accent: false },
      { label: "Tasdiqlangan", value: resources.filter(r => r.status === "approved").length || 18, sub: "Katalogda mavjud", icon: "check", accent: false },
      { label: "Kutmoqda", value: resources.filter(r => r.status === "pending_review").length || 4, sub: "Ko'rib chiqilmoqda", icon: "clock", accent: false },
      { label: "Faol o'qituvchilar", value: 17, sub: "Resurs yuklovchilar", icon: "users", accent: false },
    ];
    // admin
    return [
      { label: "Foydalanuvchilar", value: report.users ?? 2_840, sub: "Ro'yxatdan o'tganlar", icon: "users", accent: false },
      { label: "Fondlar", value: report.books ?? 139_486, sub: "Katalogdagi resurslar", icon: "book", accent: false },
      { label: "Bugungi kirishlar", value: report.today_logins ?? 248, sub: "Faol sessiyalar", icon: "bar", accent: false },
      { label: "Muddati o'tgan", value: report.overdue ?? 3, sub: "Jarima talab qilinadi", icon: "warning", accent: true },
    ];
  }, [loans, reservations, report, resources, role]);

  const tabs = useMemo(() => {
    const base = [{ id: "overview", label: "Umumiy ko'rinish" }];
    if (role === "librarian") base.push({ id: "loans", label: "Ijaralar" }, { id: "reservations", label: "Bronlar" });
    if (role === "teacher" || role === "department") base.push({ id: "resources", label: "Resurslar" });
    if (role === "admin") base.push({ id: "users", label: "Foydalanuvchilar" }, { id: "security", label: "Xavfsizlik" });
    return base;
  }, [role]);

  const today = new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="dsh-root">

      {/* ── Top bar ── */}
      <div className="dsh-topbar">
        <div className="dsh-topbar-inner">
          <div className="dsh-topbar-left">
            <div className="dsh-breadcrumb">
              <Svg d={ICONS.home} size={14} />
              <span>Boshqaruv paneli</span>
              <span className="dsh-breadcrumb-sep">/</span>
              <span className="dsh-breadcrumb-active">{ROLE_LABELS[role] ?? role}</span>
            </div>
            <h1 className="dsh-page-title">{ROLE_LABELS[role] ?? role} paneli</h1>
            <p className="dsh-page-date">{today}</p>
          </div>
          <div className="dsh-topbar-right">
            {(role === "teacher" || role === "department") && (
              <Link to={`/${locale}/resources/upload`} className="dsh-btn-primary">
                <Svg d={ICONS.upload} size={14} />
                Resurs yuklash
              </Link>
            )}
            {role === "admin" && (
              <Link to={`/${locale}/admin`} className="dsh-btn-primary">
                <Svg d={ICONS.shield} size={14} />
                Admin panel
              </Link>
            )}
            <Link to={`/${locale}/elibrary/${role}`} className="dsh-btn-outline">
              E-Library profil
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="dsh-stats-row">
        {stats.map(s => (
          <div key={s.label} className={`dsh-stat ${s.accent ? "dsh-stat-accent" : ""}`}>
            <div className="dsh-stat-icon">
              <Svg d={ICONS[s.icon as keyof typeof ICONS] ?? ICONS.book} size={18} />
            </div>
            <div className="dsh-stat-body">
              <div className="dsh-stat-value">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</div>
              <div className="dsh-stat-label">{s.label}</div>
              <div className="dsh-stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="dsh-tabs-bar">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            className={`dsh-tab ${activeTab === t.id ? "dsh-tab-active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="dsh-content">

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className="dsh-grid">

            {/* Activity feed */}
            <div className="dsh-panel dsh-panel-wide">
              <div className="dsh-panel-head">
                <h3>So'nggi faoliyat</h3>
                <span className="dsh-panel-badge">Jonli</span>
              </div>
              <table className="dsh-table">
                <thead>
                  <tr>
                    <th>Voqea</th>
                    <th>Holat</th>
                    <th>Vaqt</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ACTIVITY.map(a => {
                    const meta = STATUS_META[a.status] ?? STATUS_META.active;
                    return (
                      <tr key={a.id}>
                        <td className="dsh-td-main">{a.text}</td>
                        <td>
                          <span className="dsh-pill" style={{ color: meta.color, background: meta.bg }}>
                            {meta.label}
                          </span>
                        </td>
                        <td className="dsh-td-muted">{a.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Popular resources */}
            <div className="dsh-panel">
              <div className="dsh-panel-head">
                <h3>Eng ko'p foydalanilgan</h3>
                <Link to={`/${locale}/catalog`} className="dsh-panel-link">Barchasi →</Link>
              </div>
              <div className="dsh-rank-list">
                {POPULAR.map((b, i) => (
                  <div key={b.id} className="dsh-rank-item">
                    <span className="dsh-rank-num">{i + 1}</span>
                    <div className="dsh-rank-info">
                      <strong>{b.title}</strong>
                      <span>{b.author} · {b.type}</span>
                    </div>
                    <div className="dsh-rank-bar-wrap">
                      <div className="dsh-rank-bar" style={{ width: `${Math.round(b.views / POPULAR[0].views * 100)}%` }} />
                      <span className="dsh-rank-count">{b.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resource status */}
            <div className="dsh-panel">
              <div className="dsh-panel-head">
                <h3>Resurs holati</h3>
                <Link to={`/${locale}/resources/upload`} className="dsh-panel-link">Ko'rish →</Link>
              </div>
              <div className="dsh-status-list">
                {[
                  { label: "Tasdiqlangan", count: resources.filter(r => r.status === "approved").length || 18, color: "#065f46", bg: "#d1fae5", total: 25 },
                  { label: "Ko'rib chiqilmoqda", count: resources.filter(r => r.status === "pending_review").length || 4, color: "#92400e", bg: "#fef3c7", total: 25 },
                  { label: "Rad etilgan", count: resources.filter(r => r.status === "rejected").length || 1, color: "#9b1a2f", bg: "#fce8ea", total: 25 },
                  { label: "Qoralama", count: resources.filter(r => r.status === "draft").length || 2, color: "#374151", bg: "#f3f4f6", total: 25 },
                ].map(s => (
                  <div key={s.label} className="dsh-status-row">
                    <div className="dsh-status-meta">
                      <span className="dsh-pill" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                      <span className="dsh-status-count">{s.count}</span>
                    </div>
                    <div className="dsh-progress-track">
                      <div className="dsh-progress-fill" style={{ width: `${Math.min((s.count / s.total) * 100, 100)}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="dsh-panel">
              <div className="dsh-panel-head">
                <h3>Tezkor amallar</h3>
              </div>
              <div className="dsh-quick-list">
                {[
                  { label: "Elektron katalog", to: `/${locale}/catalog`, icon: ICONS.book },
                  { label: "Bronlar ro'yxati", to: `/${locale}/reservations`, icon: ICONS.calendar },
                  { label: "Ijaralar", to: `/${locale}/loans`, icon: ICONS.list },
                  { label: "O'quv zali", to: `/${locale}/library/reading-room`, icon: ICONS.layers },
                  { label: "E-Library", to: `/${locale}/elibrary/${role}`, icon: ICONS.eye },
                  ...(role !== "librarian" ? [{ label: "Resurs yuklash", to: `/${locale}/resources/upload`, icon: ICONS.upload }] : []),
                  ...(role === "admin" ? [{ label: "Admin panel", to: `/${locale}/admin`, icon: ICONS.shield }] : []),
                ].map(q => (
                  <Link key={q.to} to={q.to} className="dsh-quick-item">
                    <div className="dsh-quick-icon">
                      <Svg d={q.icon} size={16} />
                    </div>
                    <span>{q.label}</span>
                    <Svg d="M9 18l6-6-6-6" size={14} color="#aaa" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Resources tab */}
        {activeTab === "resources" && (
          <div className="dsh-panel dsh-panel-full">
            <div className="dsh-panel-head">
              <h3>Resurslar ro'yxati</h3>
              <Link to={`/${locale}/resources/upload`} className="dsh-btn-primary dsh-btn-sm">
                <Svg d={ICONS.upload} size={13} /> Yangi yuklash
              </Link>
            </div>
            <table className="dsh-table dsh-table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Sarlavha</th>
                  <th>Fan</th>
                  <th>Tur</th>
                  <th>Holat</th>
                </tr>
              </thead>
              <tbody>
                {resources.slice(0, 20).map((r, i) => {
                  const st = r.status === "approved" ? STATUS_META.success
                    : r.status === "pending_review" ? STATUS_META.pending
                    : r.status === "rejected" ? STATUS_META.danger
                    : STATUS_META.active;
                  return (
                    <tr key={r.id}>
                      <td className="dsh-td-muted">{i + 1}</td>
                      <td className="dsh-td-main">{r.title}</td>
                      <td className="dsh-td-muted">{r.subject_name ?? "—"}</td>
                      <td className="dsh-td-muted">{r.material_type ?? "—"}</td>
                      <td><span className="dsh-pill" style={{ color: st.color, background: st.bg }}>{st.label}</span></td>
                    </tr>
                  );
                })}
                {resources.length === 0 && (
                  <tr><td colSpan={5} className="dsh-table-empty">Resurslar topilmadi</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Loans tab */}
        {activeTab === "loans" && (
          <div className="dsh-panel dsh-panel-full">
            <div className="dsh-panel-head">
              <h3>Faol ijaralar</h3>
              <span className="dsh-panel-badge">{loans.length} ta</span>
            </div>
            <table className="dsh-table dsh-table-hover">
              <thead>
                <tr><th>#</th><th>Kitob</th><th>Foydalanuvchi</th><th>Berilgan</th><th>Qaytarish</th><th>Holat</th></tr>
              </thead>
              <tbody>
                {loans.slice(0, 20).map((l, i) => (
                  <tr key={l.id}>
                    <td className="dsh-td-muted">{i + 1}</td>
                    <td className="dsh-td-main">{(l as { book?: { title?: string } }).book?.title ?? `Kitob #${l.book_id}`}</td>
                    <td className="dsh-td-muted">Foydalanuvchi</td>
                    <td className="dsh-td-muted">{new Date(l.issued_at).toLocaleDateString("uz-UZ")}</td>
                    <td className="dsh-td-muted">{new Date(l.due_date).toLocaleDateString("uz-UZ")}</td>
                    <td><span className="dsh-pill" style={l.status === "overdue" ? { color: "#9b1a2f", background: "#fce8ea" } : { color: "#065f46", background: "#d1fae5" }}>{l.status === "overdue" ? "Muddati o'tdi" : "Faol"}</span></td>
                  </tr>
                ))}
                {loans.length === 0 && <tr><td colSpan={6} className="dsh-table-empty">Ijaralar topilmadi</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Reservations tab */}
        {activeTab === "reservations" && (
          <div className="dsh-panel dsh-panel-full">
            <div className="dsh-panel-head">
              <h3>Bronlar</h3>
              <span className="dsh-panel-badge">{reservations.length} ta</span>
            </div>
            <table className="dsh-table dsh-table-hover">
              <thead>
                <tr><th>#</th><th>Kitob</th><th>Olinish sanasi</th><th>Holat</th></tr>
              </thead>
              <tbody>
                {reservations.slice(0, 20).map((r, i) => (
                  <tr key={r.id}>
                    <td className="dsh-td-muted">{i + 1}</td>
                    <td className="dsh-td-main">{(r as { book?: { title?: string } }).book?.title ?? `Kitob #${r.book_id}`}</td>
                    <td className="dsh-td-muted">{r.pickup_date}</td>
                    <td><span className="dsh-pill" style={{ color: "#92400e", background: "#fef3c7" }}>Kutmoqda</span></td>
                  </tr>
                ))}
                {reservations.length === 0 && <tr><td colSpan={4} className="dsh-table-empty">Bronlar topilmadi</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Users tab (admin) */}
        {activeTab === "users" && (
          <div className="dsh-panel dsh-panel-full">
            <div className="dsh-panel-head">
              <h3>Foydalanuvchilar statistikasi</h3>
            </div>
            <div className="dsh-user-stat-grid">
              {[
                { label: "Talabalar", value: report.students ?? 1_840, icon: ICONS.users, color: "#002147" },
                { label: "O'qituvchilar", value: report.teachers ?? 420, icon: ICONS.users, color: "#002147" },
                { label: "Kutubxonachilar", value: report.librarians ?? 12, icon: ICONS.book, color: "#002147" },
                { label: "Kafedralar", value: report.departments ?? 24, icon: ICONS.layers, color: "#002147" },
              ].map(s => (
                <div key={s.label} className="dsh-user-stat">
                  <Svg d={s.icon} size={22} color={s.color} />
                  <div className="dsh-user-stat-val">{s.value.toLocaleString()}</div>
                  <div className="dsh-user-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="dsh-panel-head" style={{ marginTop: 24 }}>
              <h3>Kunlik kirishlar (so'nggi 7 kun)</h3>
            </div>
            <div className="dsh-bar-chart">
              {[
                { day: "Du", logins: 182 },
                { day: "Se", logins: 248 },
                { day: "Ch", logins: 215 },
                { day: "Pa", logins: 271 },
                { day: "Ju", logins: 198 },
                { day: "Sh", logins: 89 },
                { day: "Ya", logins: 32 },
              ].map(d => (
                <div key={d.day} className="dsh-bar-col">
                  <div className="dsh-bar-fill" style={{ height: `${Math.round(d.logins / 271 * 100)}%` }} />
                  <span className="dsh-bar-val">{d.logins}</span>
                  <span className="dsh-bar-day">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security tab (admin) */}
        {activeTab === "security" && (
          <div className="dsh-grid">
            <div className="dsh-panel dsh-panel-wide">
              <div className="dsh-panel-head">
                <h3>Xavfsizlik hodisalari</h3>
                <span className="dsh-panel-badge dsh-badge-ok">Xavfsiz</span>
              </div>
              <table className="dsh-table">
                <thead>
                  <tr><th>Hodisa</th><th>IP manzil</th><th>Foydalanuvchi</th><th>Vaqt</th><th>Holat</th></tr>
                </thead>
                <tbody>
                  {[
                    { event: "Muvaffaqiyatli kirish", ip: "192.168.1.105", user: "admin@atmu.uz", time: "5 daq oldin", ok: true },
                    { event: "Noto'g'ri parol", ip: "91.203.42.18", user: "nomaʼlum", time: "12 daq oldin", ok: false },
                    { event: "Muvaffaqiyatli kirish", ip: "10.0.0.24", user: "norboyev@atmu.uz", time: "28 daq oldin", ok: true },
                    { event: "Noto'g'ri parol", ip: "91.203.42.18", user: "nomaʼlum", time: "31 daq oldin", ok: false },
                    { event: "Muvaffaqiyatli kirish", ip: "10.0.0.55", user: "rashidov@atmu.uz", time: "45 daq oldin", ok: true },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="dsh-td-main">{row.event}</td>
                      <td><code className="dsh-code">{row.ip}</code></td>
                      <td className="dsh-td-muted">{row.user}</td>
                      <td className="dsh-td-muted">{row.time}</td>
                      <td>
                        <span className="dsh-pill" style={row.ok ? { color: "#065f46", background: "#d1fae5" } : { color: "#9b1a2f", background: "#fce8ea" }}>
                          {row.ok ? "OK" : "Bloklandi"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="dsh-panel">
              <div className="dsh-panel-head"><h3>Tizim holati</h3></div>
              <div className="dsh-sys-list">
                {[
                  { label: "API server", ok: true },
                  { label: "Maʼlumotlar bazasi", ok: true },
                  { label: "SMS xizmati", ok: false },
                  { label: "AI (RAG)", ok: true },
                  { label: "Fayl saqlash", ok: true },
                ].map(s => (
                  <div key={s.label} className="dsh-sys-row">
                    <div className={`dsh-sys-dot ${s.ok ? "dsh-sys-dot-ok" : "dsh-sys-dot-warn"}`} />
                    <span>{s.label}</span>
                    <span className="dsh-sys-status" style={{ color: s.ok ? "#065f46" : "#92400e" }}>
                      {s.ok ? "Ishlayapti" : "Sozlanmagan"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
