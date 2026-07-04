import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";

const ICONS = {
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  users:   "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  book:    "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  bar:     "M18 20V10M12 20V4M6 20v-6",
  alert:   "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  check:   "M9 11l3 3L22 4",
  clock:   "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  home:    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  arrow:   "M9 18l6-6-6-6",
  lock:    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
};

function Svg({ d, size = 16, color = "currentColor" }: { d: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d={d} />
    </svg>
  );
}

const DAILY_LOGINS = [
  { day: "Du", count: 182 }, { day: "Se", count: 248 }, { day: "Ch", count: 215 },
  { day: "Pa", count: 271 }, { day: "Ju", count: 198 }, { day: "Sh", count: 89 }, { day: "Ya", count: 32 },
];

const SECURITY_LOG = [
  { event: "Muvaffaqiyatli kirish", ip: "192.168.1.105", user: "admin@atmu.uz",       time: "5 daq oldin",  ok: true },
  { event: "Noto'g'ri parol (3x)", ip: "91.203.42.18",  user: "nomaʼlum",            time: "12 daq oldin", ok: false },
  { event: "Muvaffaqiyatli kirish", ip: "10.0.0.24",    user: "norboyev@atmu.uz",     time: "28 daq oldin", ok: true },
  { event: "Noto'g'ri parol",      ip: "91.203.42.18",  user: "nomaʼlum",            time: "31 daq oldin", ok: false },
  { event: "Muvaffaqiyatli kirish", ip: "10.0.0.55",    user: "rashidov@atmu.uz",     time: "45 daq oldin", ok: true },
  { event: "Muvaffaqiyatli kirish", ip: "10.0.0.17",    user: "yuldasheva@atmu.uz",   time: "1 soat oldin", ok: true },
  { event: "Sessiya tugadi",        ip: "10.0.0.9",     user: "qodirov@atmu.uz",      time: "2 soat oldin", ok: true },
];

const SYSTEM_STATUS = [
  { label: "API server (Render.com)", ok: true,  note: "Ishlayapti" },
  { label: "Ma'lumotlar bazasi (PostgreSQL)", ok: true, note: "Ishlayapti" },
  { label: "SMS xizmati (Eskiz.uz)", ok: false, note: "Sozlanmagan — ESKIZ_EMAIL kerak" },
  { label: "AI / RAG (OpenAI)", ok: true,  note: "Ishlayapti" },
  { label: "Fayl saqlash", ok: true,  note: "Ishlayapti" },
  { label: "Netlify CDN", ok: true,  note: "Ishlayapti" },
];

export function AdminPage() {
  const { locale = "uz" } = useParams();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) { navigate(`/${locale}/login`); return; }
    if (user.role !== "admin") { navigate(`/${locale}`); return; }
    if (accessToken) {
      api.reportsLibrary(accessToken).then(r => setReport(r.data ?? r)).catch(() => undefined);
    }
  }, [user, accessToken, locale, navigate]);

  const today = new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
  const maxLogin = Math.max(...DAILY_LOGINS.map(d => d.count));

  return (
    <div className="dsh-root">

      {/* Top bar */}
      <div className="dsh-topbar adm-topbar">
        <div className="dsh-topbar-inner">
          <div className="dsh-topbar-left">
            <div className="dsh-breadcrumb">
              <Svg d={ICONS.home} size={14} />
              <span><Link to={`/${locale}/dashboard/admin`} className="adm-bread-link">Boshqaruv paneli</Link></span>
              <span className="dsh-breadcrumb-sep">/</span>
              <span className="dsh-breadcrumb-active">Admin panel</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="adm-shield-icon">
                <Svg d={ICONS.shield} size={20} color="#fff" />
              </div>
              <div>
                <h1 className="dsh-page-title">Administrator paneli</h1>
                <p className="dsh-page-date">{today} — Faqat adminlar ko'radi</p>
              </div>
            </div>
          </div>
          <div className="dsh-topbar-right">
            <Link to={`/${locale}/dashboard/admin`} className="dsh-btn-outline">
              Boshqaruv paneliga
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="dsh-stats-row">
        {[
          { label: "Jami foydalanuvchilar", value: report.users ?? 2_840, sub: "Ro'yxatdan o'tganlar", icon: "users", accent: false },
          { label: "Bugungi kirishlar", value: report.today_logins ?? 248, sub: "Faol sessiyalar", icon: "bar", accent: false },
          { label: "Jami resurslar", value: report.books ?? 139_486, sub: "Katalogda mavjud", icon: "book", accent: false },
          { label: "Xavfsizlik ogohlantirishlari", value: 2, sub: "So'nggi 24 soat", icon: "alert", accent: true },
        ].map(s => (
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

      {/* Tabs */}
      <div className="dsh-tabs-bar">
        {[
          { id: "overview", label: "Umumiy" },
          { id: "users",    label: "Foydalanuvchilar" },
          { id: "logins",   label: "Kunlik kirishlar" },
          { id: "security", label: "Xavfsizlik" },
          { id: "system",   label: "Tizim holati" },
        ].map(t => (
          <button key={t.id} type="button"
            className={`dsh-tab ${activeTab === t.id ? "dsh-tab-active" : ""}`}
            onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="dsh-content">

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="dsh-grid">
            <div className="dsh-panel dsh-panel-wide">
              <div className="dsh-panel-head"><h3>Foydalanuvchilar taqsimoti</h3></div>
              <div className="dsh-user-stat-grid">
                {[
                  { label: "Talabalar",       value: report.students    ?? 1_840, pct: 65 },
                  { label: "O'qituvchilar",   value: report.teachers    ?? 420,   pct: 15 },
                  { label: "Kutubxonachilar", value: report.librarians  ?? 12,    pct: 1  },
                  { label: "Kafedra",         value: report.departments ?? 24,    pct: 1  },
                ].map(s => (
                  <div key={s.label} className="dsh-user-stat">
                    <div className="dsh-user-stat-val">{s.value.toLocaleString()}</div>
                    <div className="dsh-user-stat-label">{s.label}</div>
                    <div className="adm-pct-track">
                      <div className="adm-pct-fill" style={{ width: `${s.pct}%` }} />
                    </div>
                    <div className="adm-pct-label">{s.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dsh-panel">
              <div className="dsh-panel-head"><h3>Tizim holati</h3><span className="dsh-panel-badge dsh-badge-ok">5/6 faol</span></div>
              <div className="dsh-sys-list">
                {SYSTEM_STATUS.map(s => (
                  <div key={s.label} className="dsh-sys-row">
                    <div className={`dsh-sys-dot ${s.ok ? "dsh-sys-dot-ok" : "dsh-sys-dot-warn"}`} />
                    <span style={{ flex: 1 }}>{s.label}</span>
                    <span className="dsh-sys-status" style={{ color: s.ok ? "#065f46" : "#92400e" }}>{s.note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dsh-panel">
              <div className="dsh-panel-head"><h3>So'nggi kirishlar</h3></div>
              <div className="adm-login-list">
                {SECURITY_LOG.slice(0, 5).map((row, i) => (
                  <div key={i} className="adm-login-row">
                    <div className={`dsh-sys-dot ${row.ok ? "dsh-sys-dot-ok" : "dsh-sys-dot-warn"}`} />
                    <div className="adm-login-body">
                      <strong>{row.user}</strong>
                      <span><code className="dsh-code">{row.ip}</code> · {row.time}</span>
                    </div>
                    <span className="dsh-pill" style={row.ok ? { color: "#065f46", background: "#d1fae5" } : { color: "#9b1a2f", background: "#fce8ea" }}>
                      {row.ok ? "OK" : "Bloklandi"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="dsh-panel dsh-panel-full">
            <div className="dsh-panel-head">
              <h3>Foydalanuvchilar ro'yxati</h3>
              <span className="dsh-panel-badge">{(report.users ?? 2840).toLocaleString()} ta</span>
            </div>
            <table className="dsh-table dsh-table-hover">
              <thead>
                <tr><th>#</th><th>F.I.O</th><th>Email</th><th>Rol</th><th>Ro'yxat sanasi</th><th>Holat</th></tr>
              </thead>
              <tbody>
                {[
                  { name: "Norboyev Bexzod",     email: "norboyevbexzod98@gmail.com", role: "admin",     date: "01.01.2025", active: true },
                  { name: "Aziza Yuldasheva",    email: "yuldasheva@atmu.uz",         role: "teacher",   date: "12.02.2025", active: true },
                  { name: "Bobur Toshmatov",     email: "toshmatov@atmu.uz",          role: "student",   date: "15.09.2024", active: true },
                  { name: "Zilola Rahimova",     email: "rahimova@atmu.uz",           role: "student",   date: "15.09.2024", active: true },
                  { name: "Jasur Qodirov",       email: "qodirov@atmu.uz",            role: "librarian", date: "01.09.2024", active: true },
                  { name: "Nodira Mamatqulova",  email: "mamatqulova@atmu.uz",        role: "teacher",   date: "01.09.2024", active: false },
                ].map((u, i) => (
                  <tr key={i}>
                    <td className="dsh-td-muted">{i + 1}</td>
                    <td className="dsh-td-main">{u.name}</td>
                    <td className="dsh-td-muted">{u.email}</td>
                    <td>
                      <span className="dsh-pill" style={{ color: "#002147", background: "#e8edf5" }}>
                        {u.role === "admin" ? "Administrator" : u.role === "teacher" ? "O'qituvchi" : u.role === "student" ? "Talaba" : "Kutubxonachi"}
                      </span>
                    </td>
                    <td className="dsh-td-muted">{u.date}</td>
                    <td>
                      <span className="dsh-pill" style={u.active ? { color: "#065f46", background: "#d1fae5" } : { color: "#6b7280", background: "#f3f4f6" }}>
                        {u.active ? "Faol" : "Nofaol"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Daily logins */}
        {activeTab === "logins" && (
          <div className="dsh-panel dsh-panel-full">
            <div className="dsh-panel-head"><h3>Kunlik kirishlar (so'nggi 7 kun)</h3></div>
            <div className="dsh-bar-chart adm-bar-chart-lg">
              {DAILY_LOGINS.map(d => (
                <div key={d.day} className="dsh-bar-col">
                  <div className="dsh-bar-fill" style={{ height: `${Math.round(d.count / maxLogin * 100)}%` }} />
                  <span className="dsh-bar-val">{d.count}</span>
                  <span className="dsh-bar-day">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="adm-login-summary">
              <div className="adm-sum-card">
                <div className="adm-sum-val">{DAILY_LOGINS.reduce((a, b) => a + b.count, 0).toLocaleString()}</div>
                <div className="adm-sum-label">Haftalik jami</div>
              </div>
              <div className="adm-sum-card">
                <div className="adm-sum-val">{Math.round(DAILY_LOGINS.reduce((a, b) => a + b.count, 0) / 7)}</div>
                <div className="adm-sum-label">Kunlik o'rtacha</div>
              </div>
              <div className="adm-sum-card">
                <div className="adm-sum-val">{maxLogin}</div>
                <div className="adm-sum-label">Eng yuqori (Payshanba)</div>
              </div>
            </div>
          </div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <div className="dsh-panel dsh-panel-full">
            <div className="dsh-panel-head">
              <h3>Xavfsizlik hodisalari jurnali</h3>
              <span className="dsh-panel-badge dsh-badge-ok">Himoyalangan</span>
            </div>
            <table className="dsh-table dsh-table-hover">
              <thead>
                <tr><th>#</th><th>Hodisa</th><th>IP manzil</th><th>Foydalanuvchi</th><th>Vaqt</th><th>Natija</th></tr>
              </thead>
              <tbody>
                {SECURITY_LOG.map((row, i) => (
                  <tr key={i}>
                    <td className="dsh-td-muted">{i + 1}</td>
                    <td className="dsh-td-main">{row.event}</td>
                    <td><code className="dsh-code">{row.ip}</code></td>
                    <td className="dsh-td-muted">{row.user}</td>
                    <td className="dsh-td-muted">{row.time}</td>
                    <td>
                      <span className="dsh-pill" style={row.ok ? { color: "#065f46", background: "#d1fae5" } : { color: "#9b1a2f", background: "#fce8ea" }}>
                        {row.ok ? "Muvaffaqiyatli" : "Bloklandi"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* System */}
        {activeTab === "system" && (
          <div className="dsh-grid">
            <div className="dsh-panel dsh-panel-wide">
              <div className="dsh-panel-head"><h3>Xizmatlar holati</h3></div>
              <table className="dsh-table">
                <thead><tr><th>Xizmat</th><th>Holat</th><th>Izoh</th></tr></thead>
                <tbody>
                  {SYSTEM_STATUS.map(s => (
                    <tr key={s.label}>
                      <td className="dsh-td-main">{s.label}</td>
                      <td>
                        <span className="dsh-pill" style={s.ok ? { color: "#065f46", background: "#d1fae5" } : { color: "#92400e", background: "#fef3c7" }}>
                          {s.ok ? "Ishlayapti" : "Sozlanmagan"}
                        </span>
                      </td>
                      <td className="dsh-td-muted">{s.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="dsh-panel">
              <div className="dsh-panel-head"><h3>SMS xizmatini ulash</h3></div>
              <div className="adm-sms-guide">
                <div className="adm-sms-step">
                  <div className="adm-sms-num">1</div>
                  <div>
                    <strong>Eskiz.uz da hisob oching</strong>
                    <p>notify.eskiz.uz saytiga boring va ro'yxatdan o'ting</p>
                  </div>
                </div>
                <div className="adm-sms-step">
                  <div className="adm-sms-num">2</div>
                  <div>
                    <strong>Render.com ga o'ting</strong>
                    <p>Backend xizmati → Environment → Add variable</p>
                  </div>
                </div>
                <div className="adm-sms-step">
                  <div className="adm-sms-num">3</div>
                  <div>
                    <strong>O'zgaruvchilarni kiriting</strong>
                    <code className="adm-code-block">ESKIZ_EMAIL=sizning@email.uz{"\n"}ESKIZ_PASSWORD=parol</code>
                  </div>
                </div>
                <div className="adm-sms-step">
                  <div className="adm-sms-num">4</div>
                  <div>
                    <strong>Deploy qiling</strong>
                    <p>Render.com backend ni qayta ishga tushiring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
