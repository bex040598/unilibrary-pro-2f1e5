import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";

/* ── SVG helpers ─────────────────────────────────────── */

function DonutSegments({ segments, r = 42, cx = 60, cy = 60, stroke = 14 }: {
  segments: { value: number; color: string }[];
  r?: number; cx?: number; cy?: number; stroke?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const rotate = offset * 360 - 90;
        offset += pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotate} ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
    </>
  );
}

function BarChart({ data, h = 100 }: { data: { label: string; value: number; color?: string }[]; h?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 380, barW = Math.floor(W / data.length) - 8;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${h + 36}`} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={0} y1={h - f * h} x2={W} y2={h - f * h}
          stroke="#f1f5f9" strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const bh = Math.max((d.value / max) * h, 3);
        const x = i * (W / data.length) + 4;
        const y = h - bh;
        return (
          <g key={i}>
            <rect x={x} y={0} width={barW} height={h} rx="4" fill="#f8f9fb" />
            <rect x={x} y={y} width={barW} height={bh} rx="4"
              fill={d.color ?? "#002147"} opacity=".9" />
            <text x={x + barW / 2} y={h + 16} textAnchor="middle"
              fontSize="10" fill="#9ca3af" fontWeight="600">{d.label}</text>
            {d.value > 0 && (
              <text x={x + barW / 2} y={y - 5} textAnchor="middle"
                fontSize="10" fill="#374151" fontWeight="700">{d.value}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function RadialGauge({ pct, color, size = 100 }: { pct: number; color: string; size?: number }) {
  const r = 38, cx = 50, cy = 50, circ = Math.PI * r; // half circle
  const fill = (pct / 100) * circ;
  return (
    <svg width={size} height={size / 2 + 16} viewBox={`0 0 100 60`}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${fill} ${circ}`} />
      <text x={50} y={54} textAnchor="middle" fontSize="16" fontWeight="800" fill="#002147">
        {pct}%
      </text>
    </svg>
  );
}

/* ── Data ─────────────────────────────────────────────── */

const DAILY = [
  { label: "Du", value: 182 }, { label: "Se", value: 248 }, { label: "Ch", value: 215 },
  { label: "Pa", value: 271 }, { label: "Ju", value: 198 }, { label: "Sh", value: 89 }, { label: "Ya", value: 32 },
];

const MONTHLY = [
  { label: "Yan", value: 3420 }, { label: "Fev", value: 3810 }, { label: "Mar", value: 4120 },
  { label: "Apr", value: 3990 }, { label: "May", value: 4380 }, { label: "Iyn", value: 4760 },
  { label: "Iyl", value: 5120 }, { label: "Avg", value: 4890 }, { label: "Sen", value: 5340 },
  { label: "Okt", value: 5680 }, { label: "Noy", value: 5210 }, { label: "Dek", value: 4970 },
];

const SECURITY_LOG = [
  { time: "14:23:41", user: "admin@atmu.uz",           ip: "172.16.0.12",  event: "Tizimga kirish",          ok: true },
  { time: "14:18:02", user: "yuldasheva@atmu.uz",       ip: "192.168.1.45", event: "Resurs yuklash",          ok: true },
  { time: "14:12:59", user: "unknown",                  ip: "91.245.33.7",  event: "Noto'g'ri parol (3x)",   ok: false },
  { time: "14:08:15", user: "toshmatov@atmu.uz",        ip: "192.168.1.88", event: "Bron yaratish",           ok: true },
  { time: "13:55:30", user: "unknown",                  ip: "185.220.101.5",event: "Brute-force urinish",     ok: false },
  { time: "13:42:07", user: "qodirov@atmu.uz",          ip: "10.0.0.34",    event: "Ijaraga berish",          ok: true },
  { time: "13:38:20", user: "mamatqulova@atmu.uz",      ip: "192.168.2.11", event: "Tizimga kirish",          ok: true },
  { time: "13:21:00", user: "unknown",                  ip: "103.55.12.88", event: "Ruxsatsiz API so'rovi",   ok: false },
];

const SYSTEMS = [
  { name: "Backend API (Render.com)", status: "ok",  uptime: 99.2, latency: "142ms" },
  { name: "Ma'lumotlar bazasi",       status: "ok",  uptime: 99.8, latency: "18ms"  },
  { name: "Netlify CDN",              status: "ok",  uptime: 99.9, latency: "23ms"  },
  { name: "SMS xizmati (Eskiz)",      status: "warn",uptime: 0,    latency: "—"     },
  { name: "AI tahlil moduli",         status: "ok",  uptime: 98.4, latency: "380ms" },
];

const ICON: Record<string, string> = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  users:  "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  book:   "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  bar:    "M18 20V10M12 20V4M6 20v-6",
  alert:  "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  check:  "M9 11l3 3L22 4",
  clock:  "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  home:   "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  server: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1 5H3l1-5",
  lock:   "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  globe:  "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
};

function I({ id, size = 15, c = "currentColor" }: { id: string; size?: number; c?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON[id] ?? ICON.book} />
    </svg>
  );
}

/* ── Component ────────────────────────────────────────── */

export function AdminPage() {
  const { locale = "uz" } = useParams();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [report, setReport] = useState<Record<string, number>>({});
  const [chartMode, setChartMode] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    if (user && user.role !== "admin") { navigate(`/${locale}`); return; }
    if (!accessToken) return;
    api.reportsLibrary(accessToken).then(r => setReport(r.data ?? r)).catch(() => undefined);
  }, [user, accessToken, locale, navigate]);

  const userDist = [
    { label: "Talabalar",       value: report.students    ?? 1840, color: "#002147" },
    { label: "O'qituvchilar",   value: report.teachers    ?? 420,  color: "#3b82f6" },
    { label: "Kutubxonachilar", value: report.librarians  ?? 12,   color: "#f59e0b" },
    { label: "Kafedra xodimlari",value:report.departments ?? 24,   color: "#10b981" },
    { label: "Administratorlar",value: report.admins       ?? 3,   color: "#9b1a2f" },
  ];
  const totalUsers = userDist.reduce((a, b) => a + b.value, 0);

  const tabs = [
    { id: "overview",  label: "Umumiy ko'rinish", icon: "home"   },
    { id: "users",     label: "Foydalanuvchilar", icon: "users"  },
    { id: "analytics", label: "Tahlil",           icon: "bar"    },
    { id: "security",  label: "Xavfsizlik",       icon: "shield" },
    { id: "systems",   label: "Tizim holati",     icon: "globe"  },
  ];

  return (
    <div className="adx-root">

      {/* ── Admin header ── */}
      <div className="adx-header">
        <div className="adx-header-inner">
          <div>
            <div className="adx-badge-row">
              <span className="adx-badge-admin">Administrator</span>
              <span className="adx-badge-live"><span className="adx-live-pulse"/>Jonli monitoring</span>
            </div>
            <h1 className="adx-title">Admin Boshqaruv Paneli</h1>
            <p className="adx-sub">ATMU Smart UniLibrary · Tizim nazorati va statistika</p>
          </div>
          <div className="adx-header-nav">
            <Link to={`/${locale}/dashboard/admin`} className="adx-nav-btn">
              Boshqaruv paneli →
            </Link>
            <Link to={`/${locale}`} className="adx-nav-btn adx-nav-ghost">
              Bosh sahifa
            </Link>
          </div>
        </div>
      </div>

      {/* ── Tabs sidebar layout ── */}
      <div className="adx-layout">

        {/* Sidebar tabs */}
        <nav className="adx-sidebar">
          {tabs.map(t => (
            <button key={t.id} type="button"
              className={`adx-stab ${tab === t.id ? "adx-stab-on" : ""}`}
              onClick={() => setTab(t.id)}>
              <I id={t.icon} size={16} c={tab === t.id ? "#002147" : "#9ca3af"} />
              <span>{t.label}</span>
            </button>
          ))}
          <div className="adx-sidebar-divider" />
          <div className="adx-sidebar-info">
            <p>Tizim vaqti</p>
            <strong>{new Date().toLocaleTimeString("uz-UZ")}</strong>
          </div>
        </nav>

        {/* Content */}
        <main className="adx-content">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="adx-section">

              {/* KPI cards */}
              <div className="adx-kpi-grid">
                {[
                  { label: "Jami foydalanuvchilar", val: (report.users ?? 2299).toLocaleString(), icon: "users", accent: "#002147" },
                  { label: "Jami resurslar",         val: (report.books ?? 139486).toLocaleString(), icon: "book", accent: "#3b82f6" },
                  { label: "Bugungi kirishlar",      val: (report.today_logins ?? 248).toLocaleString(), icon: "bar", accent: "#10b981" },
                  { label: "Xavfsizlik hodisalari",  val: "3",                                    icon: "alert", accent: "#9b1a2f" },
                ].map((k, i) => (
                  <div key={i} className="adx-kpi" style={{ borderTopColor: k.accent }}>
                    <div className="adx-kpi-row">
                      <div className="adx-kpi-icon" style={{ color: k.accent }}><I id={k.icon} size={18} /></div>
                      <div className="adx-kpi-val">{k.val}</div>
                    </div>
                    <div className="adx-kpi-label">{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Two columns: donut + quick stats */}
              <div className="adx-two-col">

                {/* User distribution donut */}
                <div className="adx-card">
                  <div className="adx-card-head"><h3>Foydalanuvchilar taqsimoti</h3></div>
                  <div className="adx-donut-layout">
                    <svg width="140" height="140" viewBox="0 0 120 120">
                      <DonutSegments segments={userDist} />
                      <text x="60" y="56" textAnchor="middle" fontSize="20" fontWeight="800" fill="#002147">
                        {totalUsers.toLocaleString()}
                      </text>
                      <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="600">
                        JAMI
                      </text>
                    </svg>
                    <div className="adx-legend">
                      {userDist.map(u => (
                        <div key={u.label} className="adx-legend-row">
                          <span className="adx-legend-dot" style={{ background: u.color }} />
                          <span className="adx-legend-label">{u.label}</span>
                          <span className="adx-legend-pct">{((u.value / totalUsers) * 100).toFixed(1)}%</span>
                          <span className="adx-legend-val">{u.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* System health gauges */}
                <div className="adx-card">
                  <div className="adx-card-head"><h3>Resurs bandligi</h3></div>
                  <div className="adx-gauges">
                    {[
                      { label: "O'quv zali",   pct: report.reading_room_occupancy ?? 61, color: "#002147" },
                      { label: "Server yuklama", pct: 34, color: "#3b82f6" },
                      { label: "Xotira",         pct: 57, color: "#10b981" },
                    ].map(g => (
                      <div key={g.label} className="adx-gauge-item">
                        <RadialGauge pct={g.pct} color={g.color} size={90} />
                        <p className="adx-gauge-label">{g.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Weekly bar chart preview */}
              <div className="adx-card">
                <div className="adx-card-head">
                  <h3>Haftalik faollik</h3>
                  <button className="adx-link-btn" onClick={() => setTab("analytics")}>
                    To'liq tahlil →
                  </button>
                </div>
                <BarChart data={DAILY} h={100} />
              </div>

            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div className="adx-section">
              <div className="adx-card">
                <div className="adx-card-head">
                  <h3>Foydalanuvchi rollari taqsimoti</h3>
                </div>
                <div className="adx-role-bars">
                  {userDist.map(u => (
                    <div key={u.label} className="adx-role-row">
                      <div className="adx-role-meta">
                        <span className="adx-role-dot" style={{ background: u.color }} />
                        <span className="adx-role-name">{u.label}</span>
                        <span className="adx-role-count">{u.value.toLocaleString()}</span>
                      </div>
                      <div className="adx-role-track">
                        <div className="adx-role-fill"
                          style={{ width: `${(u.value / totalUsers) * 100}%`, background: u.color }} />
                      </div>
                      <span className="adx-role-pct">{((u.value / totalUsers) * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="adx-card">
                <div className="adx-card-head"><h3>So'nggi ro'yxatdan o'tganlar</h3></div>
                <table className="adx-table">
                  <thead><tr><th>#</th><th>F.I.O</th><th>Email</th><th>Rol</th><th>Sana</th><th>Holat</th></tr></thead>
                  <tbody>
                    {[
                      { name: "Norboyev Bexzod",    email: "norboyevbexzod98@gmail.com", role: "admin",     date: "01.01.2025", active: true },
                      { name: "Aziza Yuldasheva",   email: "yuldasheva@atmu.uz",         role: "teacher",   date: "12.02.2025", active: true },
                      { name: "Bobur Toshmatov",    email: "toshmatov@atmu.uz",          role: "student",   date: "15.09.2024", active: true },
                      { name: "Zilola Rahimova",    email: "rahimova@atmu.uz",           role: "student",   date: "15.09.2024", active: true },
                      { name: "Jasur Qodirov",      email: "qodirov@atmu.uz",            role: "librarian", date: "01.09.2024", active: true },
                      { name: "Nodira Mamatqulova", email: "mamatqulova@atmu.uz",        role: "teacher",   date: "01.09.2024", active: false },
                    ].map((u, i) => (
                      <tr key={i}>
                        <td className="adx-td-muted">{i + 1}</td>
                        <td className="adx-td-main">{u.name}</td>
                        <td className="adx-td-muted">{u.email}</td>
                        <td><span className="adx-pill" style={{ background: "#e8edf5", color: "#002147" }}>
                          {u.role === "admin" ? "Administrator" : u.role === "teacher" ? "O'qituvchi" : u.role === "student" ? "Talaba" : "Kutubxonachi"}
                        </span></td>
                        <td className="adx-td-muted">{u.date}</td>
                        <td><span className="adx-pill" style={u.active ? { background: "#d1fae5", color: "#065f46" } : { background: "#f3f4f6", color: "#6b7280" }}>
                          {u.active ? "Faol" : "Nofaol"}
                        </span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && (
            <div className="adx-section">
              <div className="adx-card">
                <div className="adx-card-head">
                  <h3>Foydalanuvchi faolligi</h3>
                  <div className="adx-toggle-row">
                    <button className={`adx-toggle-btn ${chartMode === "weekly" ? "adx-toggle-on" : ""}`}
                      onClick={() => setChartMode("weekly")}>Haftalik</button>
                    <button className={`adx-toggle-btn ${chartMode === "monthly" ? "adx-toggle-on" : ""}`}
                      onClick={() => setChartMode("monthly")}>Oylik</button>
                  </div>
                </div>
                <BarChart data={chartMode === "weekly" ? DAILY : MONTHLY} h={140} />
                <div className="adx-chart-footer">
                  {chartMode === "weekly" ? (
                    <>
                      <span>Jami: <strong>{DAILY.reduce((a,b)=>a+b.value,0).toLocaleString()}</strong></span>
                      <span>O'rtacha: <strong>{Math.round(DAILY.reduce((a,b)=>a+b.value,0)/7)}/kun</strong></span>
                      <span>Eng yuqori: <strong>{Math.max(...DAILY.map(d=>d.value))} (Payshanba)</strong></span>
                    </>
                  ) : (
                    <>
                      <span>Jami: <strong>{MONTHLY.reduce((a,b)=>a+b.value,0).toLocaleString()}</strong></span>
                      <span>O'rtacha: <strong>{Math.round(MONTHLY.reduce((a,b)=>a+b.value,0)/12).toLocaleString()}/oy</strong></span>
                      <span>Eng yuqori: <strong>{Math.max(...MONTHLY.map(d=>d.value)).toLocaleString()} (Oktyabr)</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Scatter-style resource type breakdown */}
              <div className="adx-card">
                <div className="adx-card-head"><h3>Resurs turlari bo'yicha taqsimot</h3></div>
                <BarChart data={[
                  { label: "Darslik",   value: 412,  color: "#002147" },
                  { label: "Ma'ruza",   value: 289,  color: "#3b82f6" },
                  { label: "Lab ishi",  value: 174,  color: "#10b981" },
                  { label: "Qo'llanma", value: 98,   color: "#f59e0b" },
                  { label: "Maqola",    value: 63,   color: "#9b1a2f" },
                  { label: "Video",     value: 41,   color: "#8b5cf6" },
                  { label: "Boshqa",    value: 27,   color: "#6b7280" },
                ]} h={120} />
              </div>
            </div>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <div className="adx-section">
              <div className="adx-two-col">
                <div className="adx-card">
                  <div className="adx-card-head"><h3>Bugungi hodisalar</h3></div>
                  <div className="adx-sec-kpis">
                    {[
                      { label: "Muvaffaqiyatli kirishlar", val: "242", c: "#065f46", bg: "#d1fae5" },
                      { label: "Rad etilgan urinishlar",   val: "3",   c: "#9b1a2f", bg: "#fce8ea" },
                      { label: "Shubhali IP-lar",          val: "2",   c: "#92400e", bg: "#fef3c7" },
                    ].map(s => (
                      <div key={s.label} className="adx-sec-kpi" style={{ background: s.bg }}>
                        <div className="adx-sec-kpi-val" style={{ color: s.c }}>{s.val}</div>
                        <div className="adx-sec-kpi-label" style={{ color: s.c }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="adx-card">
                  <div className="adx-card-head"><h3>Kirish urinishlari (grafik)</h3></div>
                  <svg width="100%" viewBox="0 0 200 80">
                    {/* Simple line chart for today's access attempts */}
                    {(() => {
                      const pts = [12,18,15,28,22,35,30,42,38,48,40,52,45,58,50,62,55,68,60,72,65,75,70,71];
                      const max = 75;
                      const w = 200, h = 70;
                      const path = pts.map((v, i) =>
                        `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${h - (v / max) * h}`
                      ).join(" ");
                      return (
                        <>
                          <path d={path} fill="none" stroke="#002147" strokeWidth="2" strokeLinejoin="round" />
                          <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="#002147" opacity=".06" />
                        </>
                      );
                    })()}
                    <text x="0" y="78" fontSize="8" fill="#9ca3af">00:00</text>
                    <text x="160" y="78" fontSize="8" fill="#9ca3af">Hozir</text>
                  </svg>
                </div>
              </div>

              <div className="adx-card">
                <div className="adx-card-head">
                  <h3>Xavfsizlik jurnali</h3>
                  <span className="adx-badge-count">{SECURITY_LOG.length} ta yozuv</span>
                </div>
                <table className="adx-table">
                  <thead>
                    <tr>
                      <th>Vaqt</th><th>Foydalanuvchi</th><th>IP manzil</th><th>Hodisa</th><th>Holat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECURITY_LOG.map((e, i) => (
                      <tr key={i}>
                        <td className="adx-td-mono">{e.time}</td>
                        <td className="adx-td-main">{e.user}</td>
                        <td className="adx-td-mono adx-td-muted">{e.ip}</td>
                        <td>{e.event}</td>
                        <td>
                          <span className="adx-pill" style={e.ok
                            ? { background: "#d1fae5", color: "#065f46" }
                            : { background: "#fce8ea", color: "#9b1a2f" }}>
                            {e.ok ? "✓ OK" : "✗ Bloklandi"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SYSTEMS */}
          {tab === "systems" && (
            <div className="adx-section">
              <div className="adx-card">
                <div className="adx-card-head"><h3>Tizim holati</h3><span className="adx-badge-count">Real vaqt</span></div>
                <div className="adx-sys-list">
                  {SYSTEMS.map((s, i) => (
                    <div key={i} className="adx-sys-row">
                      <div className="adx-sys-dot" style={{
                        background: s.status === "ok" ? "#10b981" : s.status === "warn" ? "#f59e0b" : "#9b1a2f"
                      }} />
                      <div className="adx-sys-name">{s.name}</div>
                      <div className="adx-sys-uptime">
                        {s.uptime > 0 ? (
                          <>
                            <div className="adx-uptime-track">
                              <div className="adx-uptime-fill" style={{ width: `${s.uptime}%`, background: s.status === "ok" ? "#10b981" : "#f59e0b" }} />
                            </div>
                            <span>{s.uptime}%</span>
                          </>
                        ) : <span style={{ color: "#9ca3af" }}>Sozlanmagan</span>}
                      </div>
                      <div className="adx-sys-latency">{s.latency}</div>
                      <span className="adx-pill" style={
                        s.status === "ok"   ? { background: "#d1fae5", color: "#065f46" } :
                        s.status === "warn" ? { background: "#fef3c7", color: "#92400e" } :
                                              { background: "#fce8ea", color: "#9b1a2f" }
                      }>
                        {s.status === "ok" ? "Faol" : s.status === "warn" ? "Diqqat" : "Xato"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SMS setup guide */}
              <div className="adx-card adx-card-info">
                <div className="adx-card-head">
                  <h3>SMS xizmatini yoqish (Eskiz.uz)</h3>
                  <span className="adx-badge-warn">Sozlanmagan</span>
                </div>
                <div className="adx-steps">
                  {[
                    { n: 1, title: "Eskiz.uz akkaunt ochish", desc: "eskiz.uz saytida ro'yxatdan o'ting va API kalitlarini oling." },
                    { n: 2, title: "Render.com muhit o'zgaruvchilari", desc: "Dashboard → Environment → Add ESKIZ_EMAIL va ESKIZ_PASSWORD qiymatlarini kiriting." },
                    { n: 3, title: "Backendni qayta ishga tushirish", desc: "Manual Deploy tugmasini bosib xizmatni yangilang." },
                    { n: 4, title: "Sinovdan o'tkazish", desc: "Yangi foydalanuvchi ro'yxatdan o'tkazib SMS kelishini tekshiring." },
                  ].map(s => (
                    <div key={s.n} className="adx-step">
                      <div className="adx-step-num">{s.n}</div>
                      <div>
                        <div className="adx-step-title">{s.title}</div>
                        <div className="adx-step-desc">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
