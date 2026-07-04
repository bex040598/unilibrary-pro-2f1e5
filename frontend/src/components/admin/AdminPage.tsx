import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";

/* ══════════════════════════════════════════════════════════
   SVG CHART COMPONENTS — custom, kreativ
══════════════════════════════════════════════════════════ */

/** Waffle chart — donut o'rniga 10x10 kvadrat grid */
function WaffleChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  const cells: string[] = [];
  segments.forEach(s => {
    const count = Math.round((s.value / total) * 100);
    for (let i = 0; i < count && cells.length < 100; i++) cells.push(s.color);
  });
  while (cells.length < 100) cells.push("#f1f5f9");

  return (
    <svg width="120" height="120" viewBox="0 0 110 110">
      {cells.map((c, i) => {
        const col = i % 10, row = Math.floor(i / 10);
        return <rect key={i} x={col * 11} y={row * 11} width="9" height="9" rx="1.5" fill={c} />;
      })}
    </svg>
  );
}

/** Premium Area chart — bezier, Y-o'q, value labels, animatsiya */
function AreaChart({ data, color = "#002147", h = 80, showLabels = false }: {
  data: { label: string; value: number }[];
  color?: string; h?: number; showLabels?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const PAD_L = 44, PAD_R = 12, PAD_T = 24, PAD_B = showLabels ? 28 : 8;
  const W = 460, fullH = h + PAD_T + PAD_B;
  const chartW = W - PAD_L - PAD_R;
  const chartH = h;

  const max = Math.max(...data.map(d => d.value), 1);
  const yRound = Math.ceil(max / 50) * 50;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  const px = (i: number) => PAD_L + (i / (data.length - 1)) * chartW;
  const py = (v: number) => PAD_T + chartH - (v / yRound) * chartH;

  // Smooth bezier path (Catmull-Rom-like control points)
  const pts = data.map((d, i) => ({ x: px(i), y: py(d.value) }));
  let bezierD = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * 0.45;
    const cp1y = pts[i - 1].y;
    const cp2x = pts[i].x - (pts[i].x - pts[i - 1].x) * 0.45;
    const cp2y = pts[i].y;
    bezierD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i].x} ${pts[i].y}`;
  }
  const areaD = `${bezierD} L ${pts[pts.length - 1].x} ${PAD_T + chartH} L ${pts[0].x} ${PAD_T + chartH} Z`;
  const gradId = `grad_${color.replace("#", "")}_${h}`;
  const clipId = `clip_${color.replace("#", "")}_${h}`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${fullH}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
          <stop offset="55%"  stopColor={color} stopOpacity="0.06" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x={PAD_L} y={PAD_T} width={chartW} height={chartH + 2} />
        </clipPath>
      </defs>

      {/* Y-axis gridlines + labels */}
      {yTicks.map((f, i) => {
        const yy = PAD_T + chartH - f * chartH;
        return (
          <g key={i}>
            <line x1={PAD_L} y1={yy} x2={PAD_L + chartW} y2={yy}
              stroke={f === 0 ? "#e5e7eb" : "#f1f5f9"} strokeWidth={f === 0 ? 1.5 : 1}
              strokeDasharray={f === 0 ? "0" : "3 5"} />
            <text x={PAD_L - 6} y={yy + 4} textAnchor="end"
              fontSize="9" fill="#c4c9d4" fontWeight="600">
              {Math.round(f * yRound)}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaD} fill={`url(#${gradId})`} clipPath={`url(#${clipId})`} />

      {/* Vertical drop lines on hover */}
      {hovered !== null && (
        <line x1={pts[hovered].x} y1={PAD_T} x2={pts[hovered].x} y2={PAD_T + chartH}
          stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      )}

      {/* Bezier line */}
      <path d={bezierD} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#${clipId})`} />

      {/* Data points */}
      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
          style={{ cursor: "default" }}>
          {/* Hover target */}
          <rect x={p.x - 16} y={PAD_T} width={32} height={chartH + PAD_B} fill="transparent" />

          {/* Value label — always visible on peaks, hover on others */}
          {(hovered === i || data[i].value === max) && (
            <g>
              <rect x={p.x - 18} y={p.y - 22} width={36} height={16} rx="4"
                fill={color} opacity="0.92" />
              <text x={p.x} y={p.y - 11} textAnchor="middle"
                fontSize="9.5" fill="#fff" fontWeight="700">
                {data[i].value}
              </text>
              {/* Arrow */}
              <polygon points={`${p.x - 4},${p.y - 7} ${p.x + 4},${p.y - 7} ${p.x},${p.y - 3}`}
                fill={color} opacity="0.92" />
            </g>
          )}

          {/* Outer glow ring */}
          {hovered === i && (
            <circle cx={p.x} cy={p.y} r="9" fill={color} opacity="0.12" />
          )}
          {/* Dot */}
          <circle cx={p.x} cy={p.y} r={hovered === i ? 5 : 3.5}
            fill="#fff" stroke={color} strokeWidth="2.5" />
        </g>
      ))}

      {/* X-axis labels */}
      {showLabels && data.map((d, i) => (
        <text key={i} x={pts[i].x} y={fullH - 4} textAnchor="middle"
          fontSize="10" fill={hovered === i ? color : "#9ca3af"}
          fontWeight={hovered === i ? "700" : "600"}>
          {d.label}
        </text>
      ))}
    </svg>
  );
}

/** Lollipop chart — bar o'rniga */
function LollipopChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 360, rowH = 36;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${data.length * rowH}`}>
      {data.map((d, i) => {
        const barW = (d.value / max) * (W - 110);
        const y = i * rowH + rowH / 2;
        const color = d.color ?? "#002147";
        return (
          <g key={i}>
            <text x="0" y={y + 4} fontSize="11" fill="#6b7280" fontWeight="500">{d.label}</text>
            <line x1={90} y1={y} x2={90 + barW} y2={y}
              stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
            <line x1={90} y1={y} x2={90 + barW} y2={y}
              stroke={color} strokeWidth="2" strokeLinecap="round" />
            <circle cx={90 + barW} cy={y} r="5" fill={color} />
            <text x={90 + barW + 10} y={y + 4} fontSize="11" fill={color} fontWeight="700">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Heatmap — 7 kun × 24 soat faollik */
function HeatmapGrid() {
  const days = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const rng = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  const val = (d: number, h: number) => {
    const base = rng(d * 100 + h);
    const peak = (h >= 8 && h <= 18 && d < 5) ? 0.7 : 0.15;
    return Math.min(1, base * 0.4 + peak);
  };
  const color = (v: number) => {
    if (v < 0.2) return "#f0f2f6";
    if (v < 0.4) return "#bfdbfe";
    if (v < 0.6) return "#3b82f6";
    if (v < 0.8) return "#1d4ed8";
    return "#002147";
  };

  return (
    <div className="adx-heatmap-wrap">
      <div className="adx-heatmap-hours">
        {[0, 6, 12, 18, 23].map(h => (
          <span key={h} style={{ left: `${(h / 23) * 100}%` }}>{h}:00</span>
        ))}
      </div>
      <div className="adx-heatmap-grid">
        {days.map((day, d) => (
          <div key={day} className="adx-heatmap-row">
            <span className="adx-heatmap-day">{day}</span>
            <div className="adx-heatmap-cells">
              {hours.map(h => (
                <div key={h} className="adx-heatmap-cell"
                  style={{ background: color(val(d, h)) }}
                  title={`${day} ${h}:00 — ${Math.round(val(d, h) * 80)} ta kirish`} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="adx-heatmap-legend">
        <span>Kam</span>
        {["#f0f2f6", "#bfdbfe", "#3b82f6", "#1d4ed8", "#002147"].map(c => (
          <span key={c} className="adx-heatmap-leg-cell" style={{ background: c }} />
        ))}
        <span>Ko'p</span>
      </div>
    </div>
  );
}

/** Ring gauge — radial progress */
function RingGauge({ pct, color, label, size = 80 }: { pct: number; color: string; label: string; size?: number }) {
  const r = 30, circ = 2 * Math.PI * r;
  const fill = (pct / 100) * circ;
  return (
    <div className="adx-ring-item">
      <svg width={size} height={size} viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
        <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${fill} ${circ - fill}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round" />
        <text x="35" y="39" textAnchor="middle" fontSize="14" fontWeight="800" fill="#111827">{pct}%</text>
      </svg>
      <p className="adx-ring-label">{label}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════ */

const WEEKLY = [
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
  { time: "14:23:41", user: "admin@atmu.uz",       ip: "172.16.0.12",   event: "Tizimga kirish",        ok: true  },
  { time: "14:18:02", user: "yuldasheva@atmu.uz",   ip: "192.168.1.45",  event: "Resurs yuklash",        ok: true  },
  { time: "14:12:59", user: "unknown",              ip: "91.245.33.7",   event: "Noto'g'ri parol (3x)", ok: false },
  { time: "14:08:15", user: "toshmatov@atmu.uz",    ip: "192.168.1.88",  event: "Bron yaratish",         ok: true  },
  { time: "13:55:30", user: "unknown",              ip: "185.220.101.5", event: "Brute-force urinish",   ok: false },
  { time: "13:42:07", user: "qodirov@atmu.uz",      ip: "10.0.0.34",     event: "Ijaraga berish",        ok: true  },
  { time: "13:38:20", user: "mamatqulova@atmu.uz",  ip: "192.168.2.11",  event: "Tizimga kirish",        ok: true  },
  { time: "13:21:00", user: "unknown",              ip: "103.55.12.88",  event: "Ruxsatsiz API so'rovi", ok: false },
];

const TRACKED_USERS = [
  { name: "Norboyev Bexzod",    email: "norboyevbexzod98@gmail.com", ip: "172.16.0.12",   device: "desktop", browser: "Chrome 126", os: "Windows 11",    location: "Toshkent",   online: true,  last: "Hozir",       registered: "01.01.2025", role: "admin"     },
  { name: "Aziza Yuldasheva",   email: "yuldasheva@atmu.uz",         ip: "192.168.1.45",  device: "desktop", browser: "Firefox 127",os: "macOS 14",      location: "Toshkent",   online: true,  last: "2 daq oldin", registered: "12.02.2025", role: "teacher"   },
  { name: "Bobur Toshmatov",    email: "toshmatov@atmu.uz",          ip: "192.168.1.88",  device: "mobile",  browser: "Safari 17",  os: "iOS 17",        location: "Toshkent",   online: true,  last: "8 daq oldin", registered: "15.09.2024", role: "student"   },
  { name: "Zilola Rahimova",    email: "rahimova@atmu.uz",           ip: "10.0.0.44",     device: "mobile",  browser: "Chrome 126", os: "Android 14",    location: "Samarqand",  online: true,  last: "15 daq oldin",registered: "15.09.2024", role: "student"   },
  { name: "Jasur Qodirov",      email: "qodirov@atmu.uz",            ip: "10.0.0.34",     device: "desktop", browser: "Edge 126",   os: "Windows 10",    location: "Toshkent",   online: false, last: "1 soat oldin",registered: "01.09.2024", role: "librarian" },
  { name: "Nodira Mamatqulova", email: "mamatqulova@atmu.uz",        ip: "192.168.2.11",  device: "tablet",  browser: "Safari 17",  os: "iPadOS 17",     location: "Buxoro",     online: false, last: "3 soat oldin",registered: "01.09.2024", role: "teacher"   },
  { name: "Sherzod Mirzayev",   email: "mirzayev@atmu.uz",           ip: "172.16.1.24",   device: "desktop", browser: "Chrome 125", os: "Ubuntu 22.04",  location: "Toshkent",   online: false, last: "5 soat oldin",registered: "20.10.2024", role: "student"   },
  { name: "Mohira Qosimova",    email: "qosimova@atmu.uz",           ip: "10.0.1.55",     device: "mobile",  browser: "Chrome 126", os: "Android 13",    location: "Namangan",   online: false, last: "1 kun oldin", registered: "03.11.2024", role: "student"   },
];

const SYSTEMS = [
  { name: "Backend API (Render.com)", status: "ok",   uptime: 99.2, latency: "142ms" },
  { name: "Ma'lumotlar bazasi",       status: "ok",   uptime: 99.8, latency: "18ms"  },
  { name: "Netlify / Render CDN",     status: "ok",   uptime: 99.9, latency: "23ms"  },
  { name: "SMS xizmati (Eskiz)",      status: "warn", uptime: 0,    latency: "—"     },
  { name: "AI tahlil moduli",         status: "ok",   uptime: 98.4, latency: "380ms" },
];

/* ══════════════════════════════════════════════════════════
   ICON
══════════════════════════════════════════════════════════ */

const ICON: Record<string, string> = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  users:  "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  book:   "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  bar:    "M18 20V10M12 20V4M6 20v-6",
  alert:  "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  globe:  "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  home:   "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  eye:    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  phone:  "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.6 5 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  laptop: "M2 3h20v13H2zM8 21h8M12 17v4",
  tablet: "M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01",
  lock:   "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  map:    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
};
function I({ id, size = 15, c = "currentColor" }: { id: string; size?: number; c?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON[id] ?? ICON.book} />
    </svg>
  );
}

const DEVICE_ICONS: Record<string, string> = { mobile: "phone", tablet: "tablet", desktop: "laptop" };
const ROLE_COLORS: Record<string, string> = {
  admin: "#9b1a2f", teacher: "#3b82f6", student: "#002147", librarian: "#10b981", department: "#f59e0b"
};
const ROLE_LABELS: Record<string, string> = {
  admin: "Admin", teacher: "O'qituvchi", student: "Talaba", librarian: "Kutubxonachi"
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */

export function AdminPage() {
  const { locale = "uz" } = useParams();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [report, setReport] = useState<Record<string, number>>({});
  const [chartMode, setChartMode] = useState<"weekly" | "monthly">("weekly");
  const [trackFilter, setTrackFilter] = useState<"all" | "online" | "mobile" | "desktop">("all");
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (user && user.role !== "admin") { navigate(`/${locale}`); return; }
    if (!accessToken) return;
    api.reportsLibrary(accessToken).then(r => setReport(r.data ?? r)).catch(() => undefined);
  }, [user, accessToken, locale, navigate]);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => {
      if (clockRef.current) clockRef.current.textContent = new Date().toLocaleTimeString("uz-UZ");
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const userDist = [
    { label: "Talabalar",        value: report.students    ?? 1840, color: "#002147" },
    { label: "O'qituvchilar",    value: report.teachers    ?? 420,  color: "#3b82f6" },
    { label: "Kutubxonachilar",  value: report.librarians  ?? 12,   color: "#10b981" },
    { label: "Kafedra xodimlari",value: report.departments ?? 24,   color: "#f59e0b" },
    { label: "Administratorlar", value: report.admins      ?? 3,    color: "#9b1a2f" },
  ];
  const totalUsers = userDist.reduce((a, b) => a + b.value, 0);

  const filteredUsers = TRACKED_USERS.filter(u => {
    if (trackFilter === "online")  return u.online;
    if (trackFilter === "mobile")  return u.device === "mobile" || u.device === "tablet";
    if (trackFilter === "desktop") return u.device === "desktop";
    return true;
  });

  const tabs = [
    { id: "overview",  label: "Bosh ko'rinish",    icon: "home"   },
    { id: "tracking",  label: "Foydalanuvchi kuzatuv", icon: "eye" },
    { id: "analytics", label: "Tahlil va grafik",  icon: "bar"    },
    { id: "security",  label: "Xavfsizlik",        icon: "shield" },
    { id: "systems",   label: "Tizim holati",      icon: "globe"  },
  ];

  const onlineCount  = TRACKED_USERS.filter(u => u.online).length;
  const mobileCount  = TRACKED_USERS.filter(u => u.device === "mobile" || u.device === "tablet").length;
  const desktopCount = TRACKED_USERS.filter(u => u.device === "desktop").length;

  return (
    <div className="adx-root">

      {/* ── Header ── */}
      <div className="adx-header">
        <div className="adx-header-inner">
          <div>
            <div className="adx-badge-row">
              <span className="adx-badge-admin">Administrator</span>
              <span className="adx-badge-live"><span className="adx-live-pulse" />Jonli monitoring</span>
            </div>
            <h1 className="adx-title">Admin Boshqaruv Paneli</h1>
            <p className="adx-sub">ATMU Smart UniLibrary · Tizim nazorati, kuzatuv va statistika</p>
          </div>
          <div className="adx-header-right">
            <div className="adx-header-clock">
              <span className="adx-clock-label">Tizim vaqti</span>
              <span className="adx-clock-val" ref={clockRef}>{new Date().toLocaleTimeString("uz-UZ")}</span>
            </div>
            <div className="adx-header-nav">
              <Link to={`/${locale}/dashboard/admin`} className="adx-nav-btn">Boshqaruv paneli →</Link>
              <Link to={`/${locale}`} className="adx-nav-btn adx-nav-ghost">Bosh sahifa</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="adx-layout">

        {/* ── Sidebar ── */}
        <nav className="adx-sidebar">
          {tabs.map(t => (
            <button key={t.id} type="button"
              className={`adx-stab ${tab === t.id ? "adx-stab-on" : ""}`}
              onClick={() => setTab(t.id)}>
              <I id={t.icon} size={15} c={tab === t.id ? "#002147" : "#9ca3af"} />
              <span>{t.label}</span>
              {t.id === "tracking" && onlineCount > 0 && (
                <span className="adx-stab-badge">{onlineCount}</span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Content ── */}
        <main className="adx-content">

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div className="adx-section">

              {/* KPI strip */}
              <div className="adx-kpi-grid">
                {[
                  { label: "Jami foydalanuvchilar", val: (report.users ?? 2299).toLocaleString(),     icon: "users", c: "#002147" },
                  { label: "Onlayn hozir",           val: String(onlineCount),                         icon: "eye",   c: "#10b981" },
                  { label: "Bugungi kirishlar",      val: (report.today_logins ?? 248).toLocaleString(),icon:"bar",   c: "#3b82f6" },
                  { label: "Xavfsizlik hodisalari",  val: "3",                                          icon: "alert", c: "#9b1a2f" },
                ].map((k, i) => (
                  <div key={i} className="adx-kpi" style={{ borderTopColor: k.c }}>
                    <div className="adx-kpi-row">
                      <div className="adx-kpi-icon" style={{ color: k.c }}><I id={k.icon} size={18} /></div>
                      <div className="adx-kpi-val" style={{ color: k.c }}>{k.val}</div>
                    </div>
                    <div className="adx-kpi-label">{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Waffle + ring gauges */}
              <div className="adx-two-col">
                <div className="adx-card">
                  <div className="adx-card-head">
                    <h3>Foydalanuvchilar taqsimoti</h3>
                    <span className="adx-badge-count">Waffle diagram</span>
                  </div>
                  <div className="adx-waffle-layout">
                    <WaffleChart segments={userDist} />
                    <div className="adx-legend">
                      {userDist.map(u => (
                        <div key={u.label} className="adx-legend-row">
                          <span className="adx-legend-dot" style={{ background: u.color }} />
                          <span className="adx-legend-label">{u.label}</span>
                          <div className="adx-legend-bar-wrap">
                            <div className="adx-legend-bar-fill"
                              style={{ width: `${(u.value / totalUsers) * 100}%`, background: u.color }} />
                          </div>
                          <span className="adx-legend-val">{u.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="adx-card">
                  <div className="adx-card-head"><h3>Resurs va zal bandligi</h3></div>
                  <div className="adx-rings-row">
                    <RingGauge pct={report.reading_room_occupancy ?? 61} color="#002147" label="O'quv zali" />
                    <RingGauge pct={34} color="#3b82f6" label="Server" />
                    <RingGauge pct={57} color="#10b981" label="Xotira" />
                  </div>
                  <div className="adx-device-mini">
                    <div className="adx-dev-row">
                      <I id="laptop" size={14} c="#002147" /><span>Desktop</span>
                      <strong>{desktopCount}</strong>
                    </div>
                    <div className="adx-dev-row">
                      <I id="phone" size={14} c="#3b82f6" /><span>Mobil</span>
                      <strong>{mobileCount}</strong>
                    </div>
                    <div className="adx-dev-row">
                      <span className="adx-online-dot" /><span>Onlayn</span>
                      <strong style={{ color: "#10b981" }}>{onlineCount}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Area chart — haftalik */}
              <div className="adx-card">
                <div className="adx-card-head">
                  <h3>Haftalik faollik (Area diagram)</h3>
                  <button className="adx-link-btn" onClick={() => setTab("analytics")}>
                    To'liq tahlil →
                  </button>
                </div>
                <AreaChart data={WEEKLY} showLabels color="#002147" h={100} />
                <div className="adx-chart-footer">
                  <span>Jami: <strong>{WEEKLY.reduce((a,b)=>a+b.value,0).toLocaleString()}</strong></span>
                  <span>O'rtacha: <strong>{Math.round(WEEKLY.reduce((a,b)=>a+b.value,0)/7)}/kun</strong></span>
                  <span>Eng yuqori: <strong>Payshanba — 271</strong></span>
                </div>
              </div>

            </div>
          )}

          {/* ══ TRACKING ══ */}
          {tab === "tracking" && (
            <div className="adx-section">

              {/* Summary cards */}
              <div className="adx-track-summary">
                <div className="adx-track-sum-card">
                  <span className="adx-online-dot" />
                  <div><strong>{onlineCount}</strong><p>Onlayn hozir</p></div>
                </div>
                <div className="adx-track-sum-card">
                  <I id="laptop" size={18} c="#002147" />
                  <div><strong>{desktopCount}</strong><p>Desktop</p></div>
                </div>
                <div className="adx-track-sum-card">
                  <I id="phone" size={18} c="#3b82f6" />
                  <div><strong>{mobileCount}</strong><p>Mobil / Tablet</p></div>
                </div>
                <div className="adx-track-sum-card">
                  <I id="map" size={18} c="#10b981" />
                  <div><strong>4</strong><p>Shahar</p></div>
                </div>
              </div>

              <div className="adx-card">
                <div className="adx-card-head">
                  <h3>Foydalanuvchi kuzatuvi — IP va qurilma ma'lumotlari</h3>
                  <div className="adx-track-filters">
                    {[
                      { key: "all",     label: "Barchasi" },
                      { key: "online",  label: "Onlayn" },
                      { key: "mobile",  label: "Mobil" },
                      { key: "desktop", label: "Desktop" },
                    ].map(f => (
                      <button key={f.key} type="button"
                        className={`adx-filter-btn ${trackFilter === f.key ? "adx-filter-on" : ""}`}
                        onClick={() => setTrackFilter(f.key as typeof trackFilter)}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="adx-track-grid">
                  {filteredUsers.map((u, i) => (
                    <div key={i} className={`adx-track-card ${u.online ? "adx-track-online" : ""}`}>
                      <div className="adx-track-card-top">
                        <div className="adx-track-avatar" style={{ background: ROLE_COLORS[u.role] ?? "#002147" }}>
                          {u.name.split(" ").map(p => p[0]).join("").slice(0, 2)}
                        </div>
                        <div className="adx-track-info">
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                        <div className={`adx-track-status ${u.online ? "adx-status-on" : "adx-status-off"}`}>
                          {u.online ? "Onlayn" : "Oflayn"}
                        </div>
                      </div>

                      <div className="adx-track-meta">
                        <div className="adx-track-meta-row">
                          <I id={DEVICE_ICONS[u.device] ?? "laptop"} size={13} c="#6b7280" />
                          <span>{u.device === "mobile" ? "Mobil" : u.device === "tablet" ? "Tablet" : "Desktop"}</span>
                          <span className="adx-track-sep">·</span>
                          <span>{u.os}</span>
                        </div>
                        <div className="adx-track-meta-row">
                          <I id="globe" size={13} c="#6b7280" />
                          <span className="adx-track-ip">{u.ip}</span>
                          <span className="adx-track-sep">·</span>
                          <span>{u.browser}</span>
                        </div>
                        <div className="adx-track-meta-row">
                          <I id="map" size={13} c="#6b7280" />
                          <span>{u.location}</span>
                          <span className="adx-track-sep">·</span>
                          <span style={{ color: ROLE_COLORS[u.role] ?? "#002147", fontWeight: 600 }}>
                            {ROLE_LABELS[u.role] ?? u.role}
                          </span>
                        </div>
                      </div>

                      <div className="adx-track-card-footer">
                        <span className="adx-track-time">{u.last}</span>
                        <span className="adx-track-reg">Ro'yxat: {u.registered}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ══ ANALYTICS ══ */}
          {tab === "analytics" && (
            <div className="adx-section">

              {/* Heatmap */}
              <div className="adx-card">
                <div className="adx-card-head">
                  <h3>Haftalik soatlik faollik (Heatmap)</h3>
                  <span className="adx-badge-count">7 kun × 24 soat</span>
                </div>
                <HeatmapGrid />
              </div>

              {/* Area chart — weekly/monthly */}
              <div className="adx-card">
                <div className="adx-card-head">
                  <h3>Foydalanuvchi kirishlari</h3>
                  <div className="adx-toggle-row">
                    <button className={`adx-toggle-btn ${chartMode === "weekly" ? "adx-toggle-on" : ""}`}
                      onClick={() => setChartMode("weekly")}>Haftalik</button>
                    <button className={`adx-toggle-btn ${chartMode === "monthly" ? "adx-toggle-on" : ""}`}
                      onClick={() => setChartMode("monthly")}>Oylik</button>
                  </div>
                </div>
                <AreaChart data={chartMode === "weekly" ? WEEKLY : MONTHLY} showLabels h={130} color="#002147" />
                <div className="adx-chart-footer">
                  {chartMode === "weekly" ? (
                    <>
                      <span>Jami: <strong>{WEEKLY.reduce((a,b)=>a+b.value,0).toLocaleString()}</strong></span>
                      <span>O'rtacha: <strong>{Math.round(WEEKLY.reduce((a,b)=>a+b.value,0)/7)}/kun</strong></span>
                    </>
                  ) : (
                    <>
                      <span>Jami: <strong>{MONTHLY.reduce((a,b)=>a+b.value,0).toLocaleString()}</strong></span>
                      <span>O'rtacha: <strong>{Math.round(MONTHLY.reduce((a,b)=>a+b.value,0)/12).toLocaleString()}/oy</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Lollipop — resource types */}
              <div className="adx-card">
                <div className="adx-card-head">
                  <h3>Resurs turlari (Lollipop diagram)</h3>
                </div>
                <LollipopChart data={[
                  { label: "Darslik",    value: 412, color: "#002147" },
                  { label: "Ma'ruza",    value: 289, color: "#3b82f6" },
                  { label: "Lab ishi",   value: 174, color: "#10b981" },
                  { label: "Qo'llanma", value: 98,  color: "#f59e0b" },
                  { label: "Maqola",    value: 63,  color: "#9b1a2f" },
                  { label: "Video",     value: 41,  color: "#8b5cf6" },
                  { label: "Boshqa",    value: 27,  color: "#6b7280" },
                ]} />
              </div>

            </div>
          )}

          {/* ══ SECURITY ══ */}
          {tab === "security" && (
            <div className="adx-section">
              <div className="adx-two-col">
                <div className="adx-card">
                  <div className="adx-card-head"><h3>Bugungi hodisalar</h3></div>
                  <div className="adx-sec-kpis">
                    <div className="adx-sec-kpi" style={{ background: "#d1fae5" }}>
                      <div className="adx-sec-kpi-val" style={{ color: "#065f46" }}>242</div>
                      <div className="adx-sec-kpi-label" style={{ color: "#065f46" }}>Muvaffaqiyatli</div>
                    </div>
                    <div className="adx-sec-kpi" style={{ background: "#fce8ea" }}>
                      <div className="adx-sec-kpi-val" style={{ color: "#9b1a2f" }}>3</div>
                      <div className="adx-sec-kpi-label" style={{ color: "#9b1a2f" }}>Rad etilgan</div>
                    </div>
                    <div className="adx-sec-kpi" style={{ background: "#fef3c7" }}>
                      <div className="adx-sec-kpi-val" style={{ color: "#92400e" }}>2</div>
                      <div className="adx-sec-kpi-label" style={{ color: "#92400e" }}>Shubhali IP</div>
                    </div>
                  </div>
                </div>
                <div className="adx-card">
                  <div className="adx-card-head"><h3>Kirish urinishlari</h3></div>
                  <AreaChart data={Array.from({length:24},(_,i)=>({ label:`${i}`, value: Math.round(30+Math.sin(i/3)*20+Math.random()*15) }))} color="#9b1a2f" h={80} />
                </div>
              </div>

              <div className="adx-card">
                <div className="adx-card-head">
                  <h3>Xavfsizlik jurnali</h3>
                  <span className="adx-badge-count">{SECURITY_LOG.length} ta yozuv</span>
                </div>
                <table className="adx-table">
                  <thead><tr><th>Vaqt</th><th>Foydalanuvchi</th><th>IP manzil</th><th>Hodisa</th><th>Holat</th></tr></thead>
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

          {/* ══ SYSTEMS ══ */}
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
                      }>{s.status === "ok" ? "Faol" : s.status === "warn" ? "Diqqat" : "Xato"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="adx-card adx-card-info">
                <div className="adx-card-head">
                  <h3>SMS xizmatini yoqish (Eskiz.uz)</h3>
                  <span className="adx-badge-warn">Sozlanmagan</span>
                </div>
                <div className="adx-steps">
                  {[
                    { n: 1, title: "Eskiz.uz akkaunt ochish", desc: "eskiz.uz saytida ro'yxatdan o'ting va API kalitlarini oling." },
                    { n: 2, title: "Render.com muhit o'zgaruvchilari", desc: "Dashboard → Environment → Add: ESKIZ_EMAIL va ESKIZ_PASSWORD." },
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
