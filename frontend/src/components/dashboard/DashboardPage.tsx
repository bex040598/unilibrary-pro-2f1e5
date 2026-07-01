import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import type { Loan, Reservation, Resource, Role } from "../../types";
import { resources as fallbackResources } from "../../data/mock";

const ROLE_LABELS: Record<string, string> = {
  student: "Talaba", teacher: "O'qituvchi", librarian: "Kutubxonachi",
  department: "Kafedra mudiri", admin: "Administrator",
};
const ROLE_COLORS: Record<string, string> = {
  student: "#1457a8", teacher: "#065f46", librarian: "#6b21a8",
  department: "#9a3412", admin: "#1e3a5f",
};

const ACTIVITY_FEED = [
  { id: 1, icon: "book", text: "Bobur Toshmatov ma'lumotlar bazasi darsligini yuklab oldi", time: "2 daqiqa oldin", color: "#1457a8" },
  { id: 2, icon: "check", text: "Kiberxavfsizlik darsligi tasdiqlandi", time: "18 daqiqa oldin", color: "#065f46" },
  { id: 3, icon: "clock", text: "Zilola Rahimova o'quv zalini bron qildi (A-14, 14:00)", time: "35 daqiqa oldin", color: "#b45309" },
  { id: 4, icon: "upload", text: "Aziza Yuldasheva yangi resurs yukladi", time: "1 soat oldin", color: "#6b21a8" },
  { id: 5, icon: "warning", text: "Sherzod Mirzayev — qaytarish muddati o'tdi (2 kun)", time: "2 soat oldin", color: "#dc2626" },
];

const POPULAR_BOOKS = [
  { id: 1, title: "Ma'lumotlar bazasi: amaliy qo'llanma", author: "Aziza Yuldasheva", count: 47, type: "Laboratoriya ishi" },
  { id: 2, title: "Kiberxavfsizlik asoslari", author: "Jasur Qodirov", count: 38, type: "Darslik" },
  { id: 3, title: "Python dasturlash tili", author: "Nodir Ergashev", count: 32, type: "O'quv qo'llanma" },
  { id: 4, title: "Mikroiqtisodiyot", author: "Nodira Mamatqulova", count: 28, type: "Darslik" },
];

const LIBRARY_HOURS = [
  { day: "Dushanba–Juma", time: "08:00 – 20:00" },
  { day: "Shanba", time: "09:00 – 18:00" },
  { day: "Yakshanba", time: "Yopiq" },
];

function ActivityIcon({ type, color }: { type: string; color: string }) {
  const icons: Record<string, string> = {
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
    check: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    clock: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6v6l4 2",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    warning: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  };
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d={icons[type] ?? icons.book} />
    </svg>
  );
}

export function DashboardPage() {
  const { dashboardRole, locale = "uz" } = useParams();
  const { user, accessToken } = useAuth();
  const role = (dashboardRole as Role | undefined) ?? user?.role ?? "student";
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources] = useState<Resource[]>(fallbackResources);
  const [report, setReport] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!accessToken) return;
    api.myLoans(accessToken).then(setLoans).catch(() => undefined);
    api.myReservations(accessToken).then(setReservations).catch(() => undefined);
    api.departmentResources(user?.department_id).then(setResources).catch(() => undefined);
    api.reportsLibrary(accessToken).then((r) => setReport(r.data)).catch(() => undefined);
  }, [accessToken, user?.department_id]);

  const cards = useMemo(() => {
    if (role === "student") return [
      { label: "Olingan kitoblar", value: loans.length || 3, sub: "Jami ijaraga olingan", icon: "book", color: "#1457a8" },
      { label: "Bronlar", value: reservations.length || 2, sub: "Kutib olinishi kerak", icon: "calendar", color: "#065f46" },
      { label: "O'quv zali", value: report.seat_reservations ?? 1, sub: "Faol bron", icon: "monitor", color: "#b45309" },
      { label: "O'qilgan sahifalar", value: 284, sub: "Bu oy", icon: "layers", color: "#6b21a8" },
    ];
    if (role === "teacher") return [
      { label: "Resurslar", value: resources.length || 12, sub: "Jami yuklangan", icon: "upload", color: "#1457a8" },
      { label: "Ko'rib chiqilmoqda", value: resources.filter((r) => r.status === "pending_review").length || 2, sub: "Tasdiqlash kutmoqda", icon: "clock", color: "#b45309" },
      { label: "Ko'rishlar", value: 3200, sub: "Jami foydalanish", icon: "eye", color: "#065f46" },
      { label: "Talaba faolligi", value: 47, sub: "Oxirgi 30 kunda", icon: "users", color: "#6b21a8" },
    ];
    if (role === "librarian") return [
      { label: "Bugungi bronlar", value: report.today_reservations ?? reservations.length || 8, sub: "Tasdiqlash navbatida", icon: "calendar", color: "#1457a8" },
      { label: "Qaytarish sanasi", value: report.due_today ?? 5, sub: "Bugun qaytarilishi kerak", icon: "clock", color: "#b45309" },
      { label: "Muddati o'tgan", value: report.overdue ?? 3, sub: "Jarima talab qilinadi", icon: "warning", color: "#dc2626" },
      { label: "Zal bandligi", value: `${report.reading_room_occupancy ?? 61}%`, sub: "Hozirda band", icon: "monitor", color: "#065f46" },
    ];
    if (role === "department") return [
      { label: "Jami resurslar", value: resources.length || 24, sub: "Kafedra bo'yicha", icon: "book", color: "#1457a8" },
      { label: "Tasdiqlangan", value: resources.filter((r) => r.status === "approved").length || 18, sub: "Katalogda ko'rinadi", icon: "check", color: "#065f46" },
      { label: "Kutmoqda", value: resources.filter((r) => r.status === "pending_review").length || 4, sub: "Ko'rib chiqilmoqda", icon: "clock", color: "#b45309" },
      { label: "O'qituvchilar", value: 17, sub: "Faol resurs yuklovchilar", icon: "users", color: "#6b21a8" },
    ];
    return [
      { label: "Foydalanuvchilar", value: report.users ?? 2840, sub: "Ro'yxatdan o'tganlar", icon: "users", color: "#1457a8" },
      { label: "Kitoblar", value: report.books ?? 139486, sub: "Fondda mavjud", icon: "book", color: "#065f46" },
      { label: "Kafedralar", value: report.departments ?? 24, sub: "Faol bo'limlar", icon: "layers", color: "#b45309" },
      { label: "AI so'rovlari", value: report.ai_queries ?? 3421, sub: "Bu oy", icon: "eye", color: "#6b21a8" },
    ];
  }, [loans.length, reservations.length, report, resources, role]);

  const roleColor = ROLE_COLORS[role] ?? "#1457a8";

  const quickLinks = [
    { label: "Elektron katalog", to: `/${locale}/catalog`, icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
    { label: "Bronlar", to: `/${locale}/reservations`, icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
    { label: "Olingan kitoblar", to: `/${locale}/loans`, icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
    { label: "O'quv zali", to: `/${locale}/library/reading-room`, icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" },
    { label: "E-Library", to: `/${locale}/elibrary/${role}`, icon: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" },
    { label: "Resurs yuklash", to: `/${locale}/resources/upload`, icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" },
  ];

  function StatIcon({ type }: { type: string }) {
    const paths: Record<string, string> = {
      book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
      calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
      monitor: "M2 3h20v14H2zM8 21h8M12 17v4",
      layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
      upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
      clock: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6v6l4 2",
      eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
      users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
      warning: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
      check: "M9 11l3 3L22 4",
    };
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d={paths[type] ?? paths.book} />
      </svg>
    );
  }

  return (
    <div className="lib-page">
      {/* Hero */}
      <div className="lib-hero" style={{ "--role-color": roleColor } as React.CSSProperties}>
        <div className="lib-hero-content">
          <div className="lib-hero-badge" style={{ background: `${roleColor}20`, color: roleColor }}>
            {ROLE_LABELS[role] ?? role}
          </div>
          <h1>{ROLE_LABELS[role] ?? role} boshqaruv paneli</h1>
          <p>Kutubxona xizmatlari, resurslar va faoliyatni bir oynadan boshqaring.</p>
        </div>
        <div className="lib-hero-actions">
          <Link to={`/${locale}/resources/upload`} className="lib-btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Resurs yuklash
          </Link>
          <Link to={`/${locale}/elibrary/${role}`} className="lib-btn-outline-white">E-Library profil</Link>
        </div>
      </div>

      <div className="lib-content">
        {/* Stats */}
        <div className="lib-stats-grid">
          {cards.map((c) => (
            <div key={c.label} className="lib-stat-card">
              <div className="lib-stat-icon" style={{ background: `${c.color}15`, color: c.color }}>
                <StatIcon type={c.icon} />
              </div>
              <div className="lib-stat-body">
                <span className="lib-stat-value">{typeof c.value === "number" ? c.value.toLocaleString() : c.value}</span>
                <span className="lib-stat-label">{c.label}</span>
                <span className="lib-stat-sub">{c.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="lib-dash-grid">
          {/* Left: Activity + Quick links */}
          <div className="lib-dash-left">
            {/* Quick links */}
            <div className="lib-card">
              <div className="lib-card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                <h3>Tezkor havolalar</h3>
              </div>
              <div className="lib-quick-grid">
                {quickLinks.map((ql) => (
                  <Link key={ql.to} to={ql.to} className="lib-quick-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2">
                      <path d={ql.icon} />
                    </svg>
                    <span>{ql.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="lib-card">
              <div className="lib-card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <h3>So'nggi faoliyat</h3>
              </div>
              <div className="lib-activity-list">
                {ACTIVITY_FEED.map((a) => (
                  <div key={a.id} className="lib-activity-item">
                    <div className="lib-activity-dot" style={{ background: `${a.color}20` }}>
                      <ActivityIcon type={a.icon} color={a.color} />
                    </div>
                    <div className="lib-activity-body">
                      <p>{a.text}</p>
                      <span>{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Popular + Hours + Resources */}
          <div className="lib-dash-right">
            {/* Popular resources */}
            <div className="lib-card">
              <div className="lib-card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <h3>Eng ko'p foydalanilgan</h3>
              </div>
              <div className="lib-popular-list">
                {POPULAR_BOOKS.map((b, i) => (
                  <div key={b.id} className="lib-popular-item">
                    <span className="lib-popular-rank">{i + 1}</span>
                    <div className="lib-popular-info">
                      <strong>{b.title}</strong>
                      <span>{b.author} · {b.type}</span>
                    </div>
                    <span className="lib-popular-count">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval summary */}
            <div className="lib-card">
              <div className="lib-card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                <h3>Resurs holati</h3>
              </div>
              <div className="lib-approval-summary">
                {[
                  { label: "Tasdiqlangan", count: resources.filter((r) => r.status === "approved").length || 18, color: "#065f46", bg: "#d1fae5" },
                  { label: "Ko'rib chiqilmoqda", count: resources.filter((r) => r.status === "pending_review").length || 4, color: "#b45309", bg: "#fffbeb" },
                  { label: "Rad etilgan", count: resources.filter((r) => r.status === "rejected").length || 1, color: "#991b1b", bg: "#fee2e2" },
                  { label: "Qoralama", count: resources.filter((r) => r.status === "draft").length || 2, color: "#374151", bg: "#f3f4f6" },
                ].map((s) => (
                  <div key={s.label} className="lib-approval-row">
                    <span className="lib-status-pill" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                    <div className="lib-approval-bar">
                      <div className="lib-approval-fill" style={{ width: `${Math.min(s.count * 4, 100)}%`, background: s.color }} />
                    </div>
                    <span className="lib-approval-count">{s.count}</span>
                  </div>
                ))}
              </div>
              <Link to={`/${locale}/resources/upload`} className="lib-card-link">Barchasi ko'rish →</Link>
            </div>

            {/* Library hours */}
            <div className="lib-card">
              <div className="lib-card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <h3>Kutubxona ish vaqti</h3>
              </div>
              <div className="lib-hours-list">
                {LIBRARY_HOURS.map((h) => (
                  <div key={h.day} className="lib-hours-row">
                    <span>{h.day}</span>
                    <strong style={{ color: h.time === "Yopiq" ? "#dc2626" : "#1457a8" }}>{h.time}</strong>
                  </div>
                ))}
              </div>
              <div className="lib-hours-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Hozir ochiq — 16:42 gacha
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
