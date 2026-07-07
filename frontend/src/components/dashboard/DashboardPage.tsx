import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import type { Loan, Reservation, Resource } from "../../types";
import { resources as fallbackResources } from "../../data/mock";

/* ── SVG Charts ─────────────────────────────────────────── */

function DonutChart({ segments, size = 120 }: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 42, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const rotate = offset * 360 - 90;
        offset += pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={0}
            transform={`rotate(${rotate} ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="800" fill="#002147">
        {total.toLocaleString()}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="600">
        JAMI
      </text>
    </svg>
  );
}

function BarChart({ data, height = 120 }: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 360, barW = Math.floor(w / data.length) - 6;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height + 28}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const bh = Math.max((d.value / max) * height, 3);
        const x = i * (w / data.length) + 3;
        const y = height - bh;
        return (
          <g key={i}>
            <rect x={x} y={0} width={barW} height={height} rx="4" fill="#f1f5f9" />
            <rect x={x} y={y} width={barW} height={bh} rx="4"
              fill={d.color ?? "#002147"} opacity=".85" />
            <text x={x + barW / 2} y={height + 14} textAnchor="middle"
              fontSize="9" fill="#9ca3af" fontWeight="600">
              {d.label}
            </text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle"
              fontSize="9" fill="#002147" fontWeight="700">
              {d.value > 0 ? d.value : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Smooth bezier path helper ── */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1], cur = pts[i];
    const cpx = (prev.x + cur.x) / 2;
    d += ` C ${cpx} ${prev.y} ${cpx} ${cur.y} ${cur.x} ${cur.y}`;
  }
  return d;
}

/* ── Kunlik dinamika card ── */
function DailyDynamicsCard({ data }: { data: { label: string; value: number }[] }) {
  const W = 540, H = 160;
  const pad = { top: 20, right: 12, bottom: 32, left: 44 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;
  const max = Math.max(...data.map(d => d.value), 1);
  const avg = Math.round(data.reduce((s, d) => s + d.value, 0) / data.length);
  const last = data[data.length - 1].value;
  const prev = data[data.length - 2].value;
  const trendUp = last >= prev;
  const trendPct = prev > 0 ? Math.abs(Math.round(((last - prev) / prev) * 100)) : 0;

  const pts = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * iw,
    y: pad.top + ih - (d.value / max) * ih,
    ...d,
  }));

  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length-1].x} ${pad.top+ih} L ${pts[0].x} ${pad.top+ih} Z`;
  const ticks = [0, Math.round(max * 0.5), max];

  /* avg line y */
  const avgY = pad.top + ih - (avg / max) * ih;

  return (
    <div className="px-dyn-card">
      {/* Header */}
      <div className="px-dyn-head">
        <div>
          <p className="px-dyn-eyebrow">FAOLLIK TAHLILI</p>
          <h3 className="px-dyn-title">Kunlik dinamika</h3>
        </div>
        <div className="px-dyn-badges">
          <span className={`px-dyn-trend ${trendUp ? "up" : "dn"}`}>
            {trendUp ? "▲" : "▼"} {trendPct}%
          </span>
          <span className="px-dyn-period">So'nggi {data.length} kun</span>
        </div>
      </div>

      {/* Big number */}
      <div className="px-dyn-peak">
        <span className="px-dyn-peak-n">{Math.max(...data.map(d=>d.value)).toLocaleString()}</span>
        <span className="px-dyn-peak-l">eng yuqori kun</span>
      </div>

      {/* Chart */}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="px-dyn-svg">
        <defs>
          <linearGradient id="dyn-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.22"/>
            <stop offset="70%"  stopColor="#6366f1" stopOpacity="0.04"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
          </linearGradient>
          <filter id="dyn-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Y grid + labels */}
        {ticks.map((t, i) => {
          const y = pad.top + ih - (t / max) * ih;
          return (
            <g key={i}>
              <line x1={pad.left} y1={y} x2={pad.left+iw} y2={y}
                stroke={i === 0 ? "#cbd5e1" : "#f1f5f9"} strokeWidth={i===0?1:1}/>
              <text x={pad.left-8} y={y+4} textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">
                {t >= 1000 ? `${(t/1000).toFixed(0)}k` : t}
              </text>
            </g>
          );
        })}

        {/* Avg dashed line */}
        <line x1={pad.left} y1={avgY} x2={pad.left+iw} y2={avgY}
          stroke="#a5b4fc" strokeWidth="1" strokeDasharray="5 4" opacity="0.7"/>
        <text x={pad.left+iw+4} y={avgY+4} fontSize="8" fill="#818cf8" fontWeight="700">avg</text>

        {/* Area */}
        <path d={area} fill="url(#dyn-grad)"/>

        {/* Line */}
        <path d={line} fill="none" stroke="#6366f1" strokeWidth="2.4"
          strokeLinecap="round" filter="url(#dyn-glow)"/>

        {/* Points */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#6366f1" strokeWidth="2.2"/>
            <circle cx={p.x} cy={p.y} r="2" fill="#6366f1"/>
            {/* value label — only on first and last, and peaks */}
            {(i === 0 || i === pts.length-1 || p.value === max) && (
              <text x={p.x} y={p.y - 11} textAnchor="middle"
                fontSize="9" fill="#4338ca" fontWeight="800">
                {p.value.toLocaleString()}
              </text>
            )}
            {/* date label */}
            <text x={p.x} y={pad.top+ih+16} textAnchor="middle"
              fontSize="9" fill="#94a3b8" fontWeight="500">
              {p.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Footer stats */}
      <div className="px-dyn-footer">
        <div className="px-dyn-fstat">
          <span className="px-dyn-fval">{avg.toLocaleString()}</span>
          <span className="px-dyn-flbl">Kunlik o'rtacha</span>
        </div>
        <div className="px-dyn-sep"/>
        <div className="px-dyn-fstat">
          <span className="px-dyn-fval">{data.reduce((s,d)=>s+d.value,0).toLocaleString()}</span>
          <span className="px-dyn-flbl">Jami {data.length} kunda</span>
        </div>
        <div className="px-dyn-sep"/>
        <div className="px-dyn-fstat">
          <span className="px-dyn-fval">{last.toLocaleString()}</span>
          <span className="px-dyn-flbl">Bugun</span>
        </div>
      </div>
    </div>
  );
}

/* ── Jins taqsimoti card ── */
function GenderCard({ male, female, role }: { male: number; female: number; role: string }) {
  const total = male + female || 1;
  const mPct = (male / total) * 100;
  const fPct = (female / total) * 100;

  /* Teacher-specific data */
  const isTeacher = role === "teacher";
  const label = isTeacher ? "O'qituvchilar jins tarkibi" : "Foydalanuvchilar jins tarkibi";
  const eyebrow = isTeacher ? "PEDAGOGIK TARKIB" : "DEMOGRAFIK TAHLIL";

  /* SVG donut */
  const R = 48, CX = 60, CY = 60, SW = 14;
  const circ = 2 * Math.PI * R;
  const fArc = (fPct / 100) * circ;
  const mArc = (mPct / 100) * circ;

  return (
    <div className="px-gc-root">
      {/* Header */}
      <div className="px-gc-head">
        <p className="px-gc-eyebrow">{eyebrow}</p>
        <h3 className="px-gc-title">{label}</h3>
      </div>

      <div className="px-gc-body">
        {/* Donut */}
        <div className="px-gc-donut-wrap">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <filter id="gc-shadow">
                <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.15"/>
              </filter>
            </defs>
            {/* Track */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={SW}/>
            {/* Female arc */}
            <circle cx={CX} cy={CY} r={R} fill="none"
              stroke="#ec4899" strokeWidth={SW}
              strokeDasharray={`${fArc} ${circ - fArc}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform={`rotate(-90 ${CX} ${CY})`}
              filter="url(#gc-shadow)"
            />
            {/* Male arc */}
            <circle cx={CX} cy={CY} r={R} fill="none"
              stroke="#6366f1" strokeWidth={SW}
              strokeDasharray={`${mArc} ${circ - mArc}`}
              strokeDashoffset={-(fArc + 3)}
              strokeLinecap="round"
              transform={`rotate(-90 ${CX} ${CY})`}
            />
            {/* Center */}
            <text x={CX} y={CY - 7} textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">
              {total.toLocaleString()}
            </text>
            <text x={CX} y={CY + 8} textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="700" letterSpacing="0.5">
              JAMI
            </text>
          </svg>
        </div>

        {/* Stats */}
        <div className="px-gc-stats">
          {/* Female */}
          <div className="px-gc-row">
            <div className="px-gc-dot" style={{background:"#ec4899"}}/>
            <div className="px-gc-info">
              <div className="px-gc-info-top">
                <span className="px-gc-name">Ayol</span>
                <span className="px-gc-num" style={{color:"#db2777"}}>{female.toLocaleString()}</span>
              </div>
              <div className="px-gc-bar-track">
                <div className="px-gc-bar-fill" style={{width:`${fPct.toFixed(1)}%`, background:"#ec4899"}}/>
              </div>
              <span className="px-gc-pct">{fPct.toFixed(1)}%</span>
            </div>
          </div>

          {/* Male */}
          <div className="px-gc-row">
            <div className="px-gc-dot" style={{background:"#6366f1"}}/>
            <div className="px-gc-info">
              <div className="px-gc-info-top">
                <span className="px-gc-name">Erkak</span>
                <span className="px-gc-num" style={{color:"#4338ca"}}>{male.toLocaleString()}</span>
              </div>
              <div className="px-gc-bar-track">
                <div className="px-gc-bar-fill" style={{width:`${mPct.toFixed(1)}%`, background:"#6366f1"}}/>
              </div>
              <span className="px-gc-pct">{mPct.toFixed(1)}%</span>
            </div>
          </div>

          {/* Ratio chip */}
          <div className="px-gc-ratio">
            <span style={{color:"#db2777"}}>♀ {fPct.toFixed(0)}%</span>
            <div className="px-gc-ratio-bar">
              <div style={{width:`${fPct}%`, background:"linear-gradient(90deg,#ec4899,#f472b6)"}}/>
              <div style={{width:`${mPct}%`, background:"linear-gradient(90deg,#818cf8,#6366f1)"}}/>
            </div>
            <span style={{color:"#4338ca"}}>♂ {mPct.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ values, color = "#002147" }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  const w = 64, h = 24, step = w / (values.length - 1);
  const pts = values.map((v, i) => `${i * step},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Constants ────────────────────────────────────────── */

const WEEKLY = [
  { label: "Du", value: 182 }, { label: "Se", value: 248 }, { label: "Ch", value: 215 },
  { label: "Pa", value: 271 }, { label: "Ju", value: 198 }, { label: "Sh", value: 89 },
  { label: "Ya", value: 32 },
];

const DAILY_DYNAMICS = [
  { label: "01.07", value: 4244 },
  { label: "02.07", value: 2064 },
  { label: "03.07", value: 1423 },
  { label: "04.07", value: 1143 },
  { label: "05.07", value: 881  },
  { label: "06.07", value: 1233 },
];

const GENDER = { male: 2800, female: 8188 };

const POPULAR = [
  { title: "Ma'lumotlar bazasi: amaliy qo'llanma", author: "Aziza Yuldasheva", type: "Lab ishi", views: 47, trend: [20, 28, 35, 47] },
  { title: "Kiberxavfsizlik asoslari", author: "Jasur Qodirov", type: "Darslik", views: 38, trend: [30, 33, 36, 38] },
  { title: "Python dasturlash tili", author: "Nodir Ergashev", type: "Qo'llanma", views: 32, trend: [15, 20, 28, 32] },
  { title: "Mikroiqtisodiyot", author: "Nodira Mamatqulova", type: "Darslik", views: 28, trend: [22, 24, 26, 28] },
  { title: "Axborot xavfsizligi", author: "Bekzod Rahimov", type: "Ma'ruza", views: 24, trend: [10, 16, 20, 24] },
];

const ACTIVITY = [
  { type: "loan",    text: "Bobur Toshmatov — Ma'lumotlar bazasi olindi",          time: "2 daq",   ok: true },
  { type: "check",   text: "Kiberxavfsizlik darsligi tasdiqlandi",                  time: "18 daq",  ok: true },
  { type: "room",    text: "Zilola Rahimova o'quv zalini bron qildi (A-14, 14:00)", time: "35 daq",  ok: true },
  { type: "upload",  text: "Aziza Yuldasheva yangi resurs yukladi",                 time: "1 soat",  ok: true },
  { type: "warning", text: "Sherzod Mirzayev — qaytarish muddati o'tdi (2 kun)",   time: "2 soat",  ok: false },
  { type: "loan",    text: "Nilufar Hasanova — Python darsligi olindi",             time: "3 soat",  ok: true },
];

const ICON_PATHS: Record<string, string> = {
  book:     "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  upload:   "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  clock:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  warning:  "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  check:    "M9 11l3 3L22 4",
  layers:   "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  bar:      "M18 20V10M12 20V4M6 20v-6",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  arrow:    "M5 12h14M12 5l7 7-7 7",
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  list:     "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  loan:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  room:     "M2 3h20v14H2zM8 21h8M12 17v4",
};

function Icon({ id, size = 16, color = "currentColor" }: { id: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON_PATHS[id] ?? ICON_PATHS.book} />
    </svg>
  );
}

/* ── Reading Streak Card (student) ── */
function ReadingStreakCard() {
  const streak = 7;
  const DAYS = ["D","S","Ch","P","J","Sh","Y"];
  const BADGES = [
    { icon: "🔥", label: "7 kun streak", earned: true },
    { icon: "📚", label: "5 kitob",       earned: false },
    { icon: "⭐", label: "Top o'quvchi", earned: false },
    { icon: "🏆", label: "Sem chempioni", earned: false },
  ];
  return (
    <div className="px-feat-card">
      <div className="px-feat-head">
        <p className="px-feat-eyebrow">O'QISH GAMIFICATION</p>
        <h3 className="px-feat-title">O'qish progressi</h3>
      </div>
      <div className="px-streak-body">
        <div className="px-streak-flame">
          <span className="px-streak-num">{streak}</span>
          <span className="px-streak-lbl">kun streak 🔥</span>
        </div>
        <div className="px-streak-stats">
          <div className="px-streak-stat"><span className="px-streak-sv">4</span><span className="px-streak-sl">Semestr kitoblari</span></div>
          <div className="px-streak-stat"><span className="px-streak-sv">124</span><span className="px-streak-sl">O'qilgan sahifalar</span></div>
          <div className="px-streak-stat"><span className="px-streak-sv">1</span><span className="px-streak-sl">Muddati yaqin</span></div>
        </div>
        <div className="px-streak-week">
          {DAYS.map((d, i) => (
            <div key={i} className="px-streak-day">
              <div className={`px-streak-dot${i < streak ? " px-streak-dot-on" : ""}`} />
              <span className="px-streak-dlbl">{d}</span>
            </div>
          ))}
        </div>
        <div className="px-badge-row">
          {BADGES.map((b, i) => (
            <div key={i} className={`px-badge-chip ${b.earned ? "px-badge-earned" : "px-badge-locked"}`}>
              <span>{b.icon}</span>
              <span className="px-badge-lbl">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Citation Generator (student + teacher) ── */
function CitationCard() {
  const [format, setFormat] = useState<"APA"|"MLA"|"GOST">("APA");
  const [bookIdx, setBookIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const BOOKS = [
    { title: "Ma'lumotlar bazasi: amaliy qo'llanma", author: "Yuldasheva A.", year: 2022, publisher: "ATMU nashriyoti", place: "Nukus" },
    { title: "Python dasturlash tili",                author: "Ergashev N.",   year: 2023, publisher: "Fan",             place: "Toshkent" },
    { title: "Kiberxavfsizlik asoslari",              author: "Qodirov J.",    year: 2021, publisher: "ATMU",            place: "Nukus" },
  ];
  const b = BOOKS[bookIdx];
  const cites: Record<"APA"|"MLA"|"GOST", string> = {
    APA:  `${b.author} (${b.year}). ${b.title}. ${b.place}: ${b.publisher}.`,
    MLA:  `${b.author} "${b.title}." ${b.publisher}, ${b.year}.`,
    GOST: `${b.author} ${b.title} / ${b.author}. — ${b.place}: ${b.publisher}, ${b.year}.`,
  };
  const handleCopy = () => {
    navigator.clipboard?.writeText(cites[format]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="px-feat-card">
      <div className="px-feat-head">
        <p className="px-feat-eyebrow">IQTIBOS GENERATOR</p>
        <h3 className="px-feat-title">Avtomatik adabiyotlar ro'yxati</h3>
      </div>
      <div className="px-cite-body">
        <div className="px-cite-row">
          <label className="px-cite-lbl">Kitob tanlang</label>
          <select className="px-cite-sel" value={bookIdx} onChange={e => setBookIdx(+e.target.value)}>
            {BOOKS.map((bk, i) => <option key={i} value={i}>{bk.title}</option>)}
          </select>
        </div>
        <div className="px-cite-formats">
          {(["APA","MLA","GOST"] as const).map(f => (
            <button key={f} type="button"
              className={`px-cite-fmt${format === f ? " px-cite-fmt-on" : ""}`}
              onClick={() => setFormat(f)}>{f}</button>
          ))}
        </div>
        <div className="px-cite-output">
          <p className="px-cite-text">{cites[format]}</p>
        </div>
        <button type="button" className="px-cite-copy" onClick={handleCopy}>
          {copied ? "✓ Nusxalandi!" : "📋 Nusxalash"}
        </button>
      </div>
    </div>
  );
}

/* ── Plagiarism Pre-check (student) ── */
function PlagiarismCard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ pct: number; sources: { src: string; pct: number }[] } | null>(null);
  const [checking, setChecking] = useState(false);
  const handleCheck = () => {
    if (!text.trim()) return;
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setResult({ pct: 12, sources: [
        { src: "Yuldasheva A. — Ma'lumotlar bazasi (2022)", pct: 7 },
        { src: "Ergashev N. — Python (2023)",               pct: 3 },
        { src: "Internet manbalar",                          pct: 2 },
      ]});
    }, 1800);
  };
  return (
    <div className="px-feat-card">
      <div className="px-feat-head">
        <p className="px-feat-eyebrow">AI TEKSHIRUV</p>
        <h3 className="px-feat-title">Plagiat pre-check</h3>
      </div>
      <div className="px-plag-body">
        <textarea className="px-plag-area" rows={4}
          placeholder="Kurs ishi matnini shu yerga joylashtiring..."
          value={text} onChange={e => setText(e.target.value)} />
        <button type="button" className="px-plag-btn"
          onClick={handleCheck} disabled={checking || !text.trim()}>
          {checking ? "Tekshirilmoqda..." : "Tekshirish"}
        </button>
        {result && (
          <div className="px-plag-result">
            <div className="px-plag-score" style={{color: result.pct < 20 ? "#065f46" : "#9b1a2f"}}>
              <span className="px-plag-pct">{result.pct}%</span>
              <span className="px-plag-verdict">{result.pct < 20 ? "✓ Maqbul" : "⚠ Yuqori"}</span>
            </div>
            <div className="px-plag-sources">
              {result.sources.map((s, i) => (
                <div key={i} className="px-plag-src-row">
                  <span className="px-plag-src-name">{s.src}</span>
                  <div className="px-plag-src-bar">
                    <div style={{width:`${Math.min(s.pct*5,100)}%`, background:"#f59e0b", height:"100%", borderRadius:3}}/>
                  </div>
                  <span className="px-plag-src-pct">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Book Recommendations (student) ── */
function RecommendationsCard() {
  const RECS = [
    { title: "Algoritm va ma'lumotlar strukturasi", author: "T. Cormen",   match: 97, type: "Majburiy",   color: "#002147" },
    { title: "Veb dasturlash asoslari",              author: "B. Flanagan", match: 91, type: "Tavsiya",    color: "#0e7490" },
    { title: "Sun'iy intellekt kirish kursi",        author: "S. Russell",  match: 85, type: "Qo'shimcha", color: "#7c3aed" },
  ];
  return (
    <div className="px-feat-card">
      <div className="px-feat-head">
        <p className="px-feat-eyebrow">AI TAVSIYA</p>
        <h3 className="px-feat-title">Kurslaringizga mos kitoblar</h3>
      </div>
      <div className="px-rec-list">
        {RECS.map((r, i) => (
          <div key={i} className="px-rec-item">
            <div className="px-rec-badge" style={{background: r.color + "18", color: r.color}}>{r.type}</div>
            <div className="px-rec-info">
              <span className="px-rec-title">{r.title}</span>
              <span className="px-rec-author">{r.author}</span>
            </div>
            <div className="px-rec-match">
              <span className="px-rec-pct">{r.match}%</span>
              <span className="px-rec-lbl">mos</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Course Pack Manager (teacher) ── */
function CoursePackCard() {
  const PACKS = [
    { name: "Ma'lumotlar bazasi — 3-kurs",   items: 7, students: 42, views: 187, color: "#002147" },
    { name: "Kiberxavfsizlik — Magistratura", items: 5, students: 18, views: 94,  color: "#0e7490" },
    { name: "Python asoslari — 2-kurs",       items: 9, students: 65, views: 312, color: "#065f46" },
  ];
  return (
    <div className="px-feat-card">
      <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between"}}>
        <div className="px-feat-head">
          <p className="px-feat-eyebrow">COURSE PACK</p>
          <h3 className="px-feat-title">Resurs to'plamlari</h3>
        </div>
        <button type="button" className="px-feat-btn">+ Yangi to'plam</button>
      </div>
      <div className="px-pack-list">
        {PACKS.map((p, i) => (
          <div key={i} className="px-pack-item" style={{borderLeftColor: p.color}}>
            <div className="px-pack-info">
              <span className="px-pack-name">{p.name}</span>
              <span className="px-pack-meta">{p.items} material · {p.students} talaba</span>
            </div>
            <div className="px-pack-stats">
              <span className="px-pack-views">{p.views} ko'rish</span>
              <span className="px-pack-arr">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── QR Shelf Navigator (librarian) ── */
function QRShelfCard() {
  const [shelf, setShelf] = useState("A-14");
  const [generated, setGenerated] = useState(false);
  return (
    <div className="px-feat-card">
      <div className="px-feat-head">
        <p className="px-feat-eyebrow">SMART NAVIGATSIYA</p>
        <h3 className="px-feat-title">QR javon navigatsiyasi</h3>
      </div>
      <div className="px-qr-body">
        <div className="px-qr-row">
          <label className="px-cite-lbl">Javon raqami</label>
          <input className="px-qr-input" value={shelf}
            onChange={e => { setShelf(e.target.value); setGenerated(false); }}
            placeholder="masalan: A-14" />
        </div>
        <button type="button" className="px-plag-btn" style={{background:"#002147"}} onClick={() => setGenerated(true)}>
          QR yaratish
        </button>
        {generated && (
          <div className="px-qr-result">
            <svg width={80} height={80} viewBox="0 0 80 80" className="px-qr-svg">
              {[0,1,2,3,4,5,6,7].flatMap(r => [0,1,2,3,4,5,6,7].map(c => {
                const on = ((r * 7 + c + r * c) % 3 !== 2);
                return on ? <rect key={`${r}-${c}`} x={c*10} y={r*10} width={9} height={9} rx={1} fill="#002147"/> : null;
              }))}
              <rect x={0} y={0} width={30} height={30} rx={3} fill="none" stroke="#002147" strokeWidth={3}/>
              <rect x={6} y={6} width={18} height={18} rx={2} fill="#002147"/>
              <rect x={50} y={0} width={30} height={30} rx={3} fill="none" stroke="#002147" strokeWidth={3}/>
              <rect x={56} y={6} width={18} height={18} rx={2} fill="#002147"/>
              <rect x={0} y={50} width={30} height={30} rx={3} fill="none" stroke="#002147" strokeWidth={3}/>
              <rect x={6} y={56} width={18} height={18} rx={2} fill="#002147"/>
            </svg>
            <div className="px-qr-info">
              <span className="px-qr-shelf">{shelf}</span>
              <span className="px-qr-desc">Skanerlasangiz shu javondagi kitoblar, holati va rezerv qilish ko'rinadi.</span>
              <button type="button" className="px-qr-print">🖨 Chop etish</button>
            </div>
          </div>
        )}
        <div className="px-qr-shelves">
          <span className="px-feat-eyebrow" style={{marginBottom:6, display:"block"}}>Faol QR kodlar</span>
          {[{shelf:"A-14",books:28,scans:47},{shelf:"B-03",books:34,scans:31},{shelf:"C-07",books:19,scans:22}].map((s,i) => (
            <div key={i} className="px-qr-shelf-row">
              <span className="px-qr-shelf-id">{s.shelf}</span>
              <span className="px-qr-shelf-meta">{s.books} kitob</span>
              <span className="px-qr-shelf-scans">{s.scans} skan</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── AI Natural-language Search (librarian + admin) ── */
function AISearchCard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{title:string; author:string; year:number; type:string}[]>([]);
  const [searching, setSearching] = useState(false);
  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setResults([
        { title: "Ma'lumotlar bazasini loyihalash", author: "C. J. Date",      year: 2019, type: "Darslik"    },
        { title: "SQL: to'liq qo'llanma",           author: "Ben Forta",       year: 2020, type: "Qo'llanma"  },
        { title: "NoSQL ma'lumotlar bazalari",       author: "Pramod Sadalage", year: 2021, type: "Darslik"    },
      ]);
    }, 1200);
  };
  return (
    <div className="px-feat-card">
      <div className="px-feat-head">
        <p className="px-feat-eyebrow">AI QIDIRUV</p>
        <h3 className="px-feat-title">Tabiiy til bilan qidiruv</h3>
      </div>
      <div className="px-ai-body">
        <div className="px-ai-input-row">
          <input className="px-qr-input"
            placeholder="masalan: 2020-yildan keyin ma'lumotlar bazasi bo'yicha darsliklar..."
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()} />
          <button type="button" className="px-plag-btn" style={{background:"#002147"}}
            onClick={handleSearch} disabled={searching}>
            {searching ? "..." : "Izlash"}
          </button>
        </div>
        {results.length > 0 && (
          <div className="px-ai-results">
            {results.map((r, i) => (
              <div key={i} className="px-ai-result-row">
                <div className="px-ai-result-info">
                  <span className="px-rec-title">{r.title}</span>
                  <span className="px-rec-author">{r.author} · {r.year}</span>
                </div>
                <span className="px-rec-badge" style={{background:"#e8edf5", color:"#002147"}}>{r.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Feature Usage Stats (admin) ── */
function FeatureStatsCard() {
  const STATS = [
    { icon: "🤖", label: "AI qidiruv",       uses: 1247, growth: "+34%" },
    { icon: "📎", label: "Iqtibos generator", uses: 892,  growth: "+18%" },
    { icon: "🔍", label: "Plagiat tekshiruv", uses: 437,  growth: "+61%" },
    { icon: "🎯", label: "Kitob tavsiyalar",  uses: 2184, growth: "+42%" },
    { icon: "📦", label: "Course Pack",       uses: 156,  growth: "+28%" },
    { icon: "📱", label: "QR navigatsiya",    uses: 341,  growth: "+89%" },
    { icon: "📈", label: "Streak/Progress",   uses: 678,  growth: "+53%" },
  ];
  return (
    <div className="px-feat-card px-feat-card-full">
      <div className="px-feat-head">
        <p className="px-feat-eyebrow">YANGI FUNKSIYALAR STATISTIKASI</p>
        <h3 className="px-feat-title">Smart xizmatlar foydalanish tahlili</h3>
      </div>
      <div className="px-fstats-grid">
        {STATS.map((s, i) => (
          <div key={i} className="px-fstat-item">
            <span className="px-fstat-icon">{s.icon}</span>
            <span className="px-fstat-label">{s.label}</span>
            <span className="px-fstat-uses">{s.uses.toLocaleString()}</span>
            <span className="px-fstat-growth">{s.growth}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────── */

export function DashboardPage() {
  const { dashboardRole, locale = "uz" } = useParams();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const role = dashboardRole ?? user?.role ?? "teacher";

  const [loans, setLoans]             = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources]     = useState<Resource[]>(fallbackResources);
  const [report, setReport]           = useState<Record<string, number>>({});
  const [tab, setTab]                 = useState("overview");

  useEffect(() => {
    if (!accessToken) return;
    api.myLoans(accessToken).then(setLoans).catch(() => undefined);
    api.myReservations(accessToken).then(setReservations).catch(() => undefined);
    api.departmentResources(user?.department_id ?? undefined).then(setResources).catch(() => undefined);
    api.reportsLibrary(accessToken).then(r => setReport(r.data ?? r)).catch(() => undefined);
  }, [accessToken, user?.department_id, role, locale, navigate]);

  const approved  = resources.filter(r => r.status === "approved").length  || 18;
  const pending   = resources.filter(r => r.status === "pending_review").length || 4;
  const rejected  = resources.filter(r => r.status === "rejected").length  || 1;
  const drafts    = resources.filter(r => r.status === "draft").length     || 2;

  const kpis = useMemo(() => {
    if (role === "student") return [
      { label: "O'qilgan kitoblar", value: 4,  icon: "book",    spark: [1,2,3,4],     up: true  },
      { label: "Aktiv bronlar",     value: 2,  icon: "calendar",spark: [1,2,1,2],     up: true  },
      { label: "Streak (kun)",      value: 7,  icon: "clock",   spark: [3,5,6,6,7],  up: true  },
      { label: "Muddati yaqin",     value: 1,  icon: "warning", spark: [3,2,2,1,1],  up: true  },
    ];
    if (role === "teacher") return [
      { label: "Jami resurslar",   value: resources.length || 12, icon: "book",    spark: [6,8,9,11,12],    up: true  },
      { label: "Ko'rib chiqilmoqda", value: pending,              icon: "clock",   spark: [2,3,4,3,4],      up: false },
      { label: "Tasdiqlangan",     value: approved,               icon: "check",   spark: [10,12,14,16,18], up: true  },
      { label: "Jami ko'rishlar",  value: 3842,                   icon: "eye",     spark: [3000,3200,3500,3700,3842], up: true },
    ];
    if (role === "librarian") return [
      { label: "Bugungi bronlar",  value: (report.today_reservations ?? reservations.length) || 8, icon: "calendar", spark: [5,7,6,9,8], up: true  },
      { label: "Qaytarish",        value: report.due_today ?? 5,    icon: "clock",   spark: [3,5,4,6,5], up: false },
      { label: "Muddati o'tgan",   value: report.overdue ?? 3,      icon: "warning", spark: [5,4,4,3,3], up: true  },
      { label: "Zal bandligi",     value: `${(report.reading_room_occupancy ?? 61)}%`, icon: "room", spark: [50,55,58,62,61], up: true },
    ];
    if (role === "department") return [
      { label: "Jami resurslar",   value: resources.length || 24, icon: "book",  spark: [18,20,22,23,24], up: true  },
      { label: "Tasdiqlangan",     value: approved,               icon: "check", spark: [12,14,15,17,18], up: true  },
      { label: "Kutmoqda",         value: pending,                icon: "clock", spark: [3,4,5,4,4],      up: false },
      { label: "O'qituvchilar",    value: 17,                     icon: "users", spark: [14,15,16,16,17], up: true  },
    ];
    return [
      { label: "Foydalanuvchilar", value: report.users ?? 2840,        icon: "users", spark: [2600,2700,2750,2800,2840], up: true },
      { label: "Resurslar",        value: report.books ?? 139486,       icon: "book",  spark: [130000,133000,136000,138000,139486], up: true },
      { label: "Bugungi kirishlar",value: report.today_logins ?? 248,   icon: "bar",   spark: [180,220,195,260,248], up: true },
      { label: "Muddati o'tgan",   value: report.overdue ?? 3,          icon: "warning",spark:[5,4,4,3,3], up: true },
    ];
  }, [resources, report, reservations, role, approved, pending]);

  const tabs = useMemo(() => {
    const t = [{ id: "overview", label: "Umumiy" }];
    if (role === "teacher" || role === "department") t.push({ id: "resources", label: "Resurslar" });
    if (role === "librarian") t.push({ id: "resources", label: "Resurslar" }, { id: "loans", label: "Ijaralar" }, { id: "reservations", label: "Bronlar" });
    if (role === "admin") t.push({ id: "analytics", label: "Tahlil" }, { id: "users", label: "Foydalanuvchilar" });
    if (role === "student") t.push({ id: "mybooks", label: "Kitoblarim" });
    return t;
  }, [role]);

  const ROLE_META: Record<string, { label: string; color: string; desc: string }> = {
    student:   { label: "Talaba",        color: "#002147", desc: "Smart kutubxona xizmatlari va o'qish tahlili" },
    teacher:   { label: "O'qituvchi",    color: "#002147", desc: "Resurslar, ko'rishlar va talaba faolligi" },
    librarian: { label: "Kutubxonachi",  color: "#002147", desc: "Bronlar, ijaralar va zal boshqaruvi" },
    department:{ label: "Kafedra",       color: "#002147", desc: "Kafedra resurslari va o'qituvchilar" },
    admin:     { label: "Administrator", color: "#002147", desc: "Tizim nazorati, foydalanuvchilar va xavfsizlik" },
  };
  const meta = ROLE_META[role] ?? ROLE_META.admin;

  return (
    <div className="px-root">

      {/* ── Identity header ── */}
      <div className="px-header">
        <div className="px-header-inner">
          <div className="px-header-left">
            <div className="px-role-pill">{meta.label}</div>
            <h1 className="px-title">Boshqaruv paneli</h1>
            <p className="px-subtitle">{meta.desc}</p>
          </div>
          <div className="px-header-actions">
            {(role === "teacher" || role === "department" || role === "librarian") && (
              <Link to={`/${locale}/resources/upload`} className="px-btn-primary">
                <Icon id="upload" size={13} /> Resurs yuklash
              </Link>
            )}
            {role === "admin" && (
              <Link to={`/${locale}/admin`} className="px-btn-accent">
                <Icon id="shield" size={13} /> Admin panel
              </Link>
            )}
            <Link to={`/${locale}/elibrary/${role}`} className="px-btn-ghost">
              E-Library profil →
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="px-kpi-strip">
        {kpis.map((k, i) => (
          <div key={i} className={`px-kpi ${!k.up && i === 2 ? "px-kpi-warn" : ""}`}>
            <div className="px-kpi-top">
              <div className="px-kpi-icon"><Icon id={k.icon} size={15} /></div>
              <Sparkline values={k.spark as number[]} color={!k.up && i === 2 ? "#9b1a2f" : "#002147"} />
            </div>
            <div className="px-kpi-val">
              {typeof k.value === "number" ? k.value.toLocaleString() : k.value}
            </div>
            <div className="px-kpi-label">{k.label}</div>
            <div className={`px-kpi-trend ${k.up ? "px-trend-up" : "px-trend-dn"}`}>
              {k.up ? "▲" : "▼"} {k.up ? "+6%" : "-2%"} so'nggi 30 kun
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="px-tabs">
        <div className="px-tabs-inner">
          {tabs.map(t => (
            <button key={t.id} type="button"
              className={`px-tab ${tab === t.id ? "px-tab-on" : ""}`}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div className="px-body">

          {/* ── Student smart features ── */}
          {role === "student" && (
            <>
              <div className="px-row">
                <ReadingStreakCard />
                <RecommendationsCard />
              </div>
              <div className="px-row">
                <CitationCard />
                <PlagiarismCard />
              </div>
            </>
          )}

          {/* Row 1: Wide activity + Donut */}
          <div className="px-row">

            {/* Activity timeline */}
            <div className="px-card px-card-grow">
              <div className="px-card-head">
                <h3>So'nggi faoliyat</h3>
                <span className="px-live-dot" />
              </div>
              <div className="px-timeline">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="px-tl-item">
                    <div className={`px-tl-dot ${a.ok ? "" : "px-tl-dot-warn"}`}>
                      <Icon id={a.type === "warning" ? "warning" : a.type === "check" ? "check" : a.type === "upload" ? "upload" : a.type === "room" ? "room" : "loan"} size={10} color={a.ok ? "#002147" : "#9b1a2f"} />
                    </div>
                    <div className="px-tl-line" />
                    <div className="px-tl-body">
                      <p className="px-tl-text">{a.text}</p>
                      <span className="px-tl-time">{a.time} oldin</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut: resource status */}
            <div className="px-card px-card-narrow">
              <div className="px-card-head"><h3>Resurs holati</h3></div>
              <div className="px-donut-wrap">
                <DonutChart segments={[
                  { value: approved, color: "#002147", label: "Tasdiqlangan" },
                  { value: pending,  color: "#f59e0b", label: "Kutmoqda" },
                  { value: rejected, color: "#9b1a2f", label: "Rad etilgan" },
                  { value: drafts,   color: "#d1d5db", label: "Qoralama" },
                ]} size={140} />
              </div>
              <div className="px-legend">
                {[
                  { label: "Tasdiqlangan", value: approved, color: "#002147" },
                  { label: "Kutmoqda",     value: pending,  color: "#f59e0b" },
                  { label: "Rad etilgan",  value: rejected, color: "#9b1a2f" },
                  { label: "Qoralama",     value: drafts,   color: "#d1d5db" },
                ].map(l => (
                  <div key={l.label} className="px-legend-row">
                    <span className="px-legend-dot" style={{ background: l.color }} />
                    <span className="px-legend-label">{l.label}</span>
                    <span className="px-legend-val">{l.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Librarian: IFLA roles panel */}
          {role === "librarian" && (
            <div className="px-row">
              <div className="px-card px-card-full">
                <div className="px-card-head">
                  <h3>Kutubxonachi vazifalari <span className="px-ifla-badge">IFLA standartlari</span></h3>
                  <Link to={`/${locale}/resources/upload`} className="px-btn-primary px-btn-sm">
                    <Icon id="upload" size={12} /> Resurs yuklash
                  </Link>
                </div>
                <div className="px-lib-roles">
                  {[
                    {
                      icon: "layers",
                      color: "#002147",
                      title: "To'plam shakllantirish",
                      sub: "Collection Development",
                      desc: "Kutubxona fondini boyitish: kitoblar, elektron resurslar, ilmiy maqolalar va o'quv materiallari qo'shish va kataloglash.",
                      actions: [{ label: "Resurs yuklash", to: `/${locale}/resources/upload` }, { label: "Katalog", to: `/${locale}/catalog` }],
                    },
                    {
                      icon: "check",
                      color: "#0e7490",
                      title: "Resurslarni ko'rib chiqish",
                      sub: "Content Review",
                      desc: "O'qituvchilar yuklagan materiallarni sifat va standartlarga mosligini tekshirib tasdiqlash yoki rad etish.",
                      actions: [{ label: "Review queue", to: `/${locale}/dashboard/librarian` }],
                    },
                    {
                      icon: "loan",
                      color: "#065f46",
                      title: "Ijara xizmati",
                      sub: "Circulation Services",
                      desc: "Kitob berish, qaytarish, uzaytirish va muddati o'tgan hollarni boshqarish — RFID yoki QR orqali.",
                      actions: [{ label: "Ijaralar", to: `/${locale}/loans` }],
                    },
                    {
                      icon: "calendar",
                      color: "#7c1d3f",
                      title: "Bron va zal xizmati",
                      sub: "Reader Services",
                      desc: "Kitob bronlarini tasdiqlash, o'quv zali o'rinlarini nazorat qilish va foydalanuvchi so'rovlariga javob berish.",
                      actions: [{ label: "Bronlar", to: `/${locale}/reservations` }, { label: "O'quv zali", to: `/${locale}/library/reading-room` }],
                    },
                    {
                      icon: "shield",
                      color: "#5b21b6",
                      title: "Raqamli xizmatlar",
                      sub: "Digital Services",
                      desc: "E-Library portal, AI yordamchi so'rovlarini nazorat qilish va raqamli resurslardan foydalanishni ta'minlash.",
                      actions: [{ label: "E-Library", to: `/${locale}/elibrary/librarian` }],
                    },
                    {
                      icon: "bar",
                      color: "#92400e",
                      title: "Hisobot va tahlil",
                      sub: "Reporting & Analytics",
                      desc: "Kutubxona statistikasi, foydalanish ko'rsatkichlari va IFLA standartlariga mos yillik hisobotlar tayyorlash.",
                      actions: [],
                    },
                  ].map(r => (
                    <div key={r.title} className="px-lib-role-card">
                      <div className="px-lib-role-icon" style={{ background: r.color + "18", color: r.color }}>
                        <Icon id={r.icon} size={18} color={r.color} />
                      </div>
                      <div className="px-lib-role-body">
                        <div className="px-lib-role-head">
                          <span className="px-lib-role-title">{r.title}</span>
                          <span className="px-lib-role-sub">{r.sub}</span>
                        </div>
                        <p className="px-lib-role-desc">{r.desc}</p>
                        {r.actions.length > 0 && (
                          <div className="px-lib-role-actions">
                            {r.actions.map(a => (
                              <Link key={a.to} to={a.to} className="px-lib-role-link">
                                {a.label} →
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Admin | Teacher | Librarian: Analytics charts */}
          {(role === "admin" || role === "teacher" || role === "librarian") && (
            <div className="px-row px-row-charts">
              <DailyDynamicsCard data={DAILY_DYNAMICS} />
              <GenderCard
                male={role === "teacher" ? 6 : GENDER.male}
                female={role === "teacher" ? 11 : GENDER.female}
                role={role}
              />
            </div>
          )}

          {/* Teacher: Course Pack + Citation */}
          {role === "teacher" && (
            <div className="px-row">
              <CoursePackCard />
              <CitationCard />
            </div>
          )}

          {/* Librarian: QR Shelf + AI Search */}
          {role === "librarian" && (
            <div className="px-row">
              <QRShelfCard />
              <AISearchCard />
            </div>
          )}

          {/* Admin: Feature stats + AI Search */}
          {role === "admin" && (
            <>
              <div className="px-row">
                <FeatureStatsCard />
              </div>
              <div className="px-row">
                <AISearchCard />
                <CitationCard />
              </div>
            </>
          )}

          {/* Row 2: Popular + Quick actions */}
          <div className="px-row">

            {/* Popular resources ranking */}
            <div className="px-card px-card-grow">
              <div className="px-card-head">
                <h3>Eng ko'p foydalanilgan resurslar</h3>
                <Link to={`/${locale}/catalog`} className="px-link">Katalog →</Link>
              </div>
              <table className="px-table">
                <thead>
                  <tr>
                    <th style={{ width: 28 }}>#</th>
                    <th>Resurs</th>
                    <th style={{ width: 64 }}>Trend</th>
                    <th style={{ width: 48, textAlign: "right" }}>Ko'rish</th>
                  </tr>
                </thead>
                <tbody>
                  {POPULAR.map((b, i) => (
                    <tr key={i}>
                      <td>
                        <span className="px-rank-num">{i + 1}</span>
                      </td>
                      <td>
                        <div className="px-res-title">{b.title}</div>
                        <div className="px-res-meta">{b.author} · {b.type}</div>
                      </td>
                      <td><Sparkline values={b.trend} /></td>
                      <td style={{ textAlign: "right" }}>
                        <strong style={{ color: "#002147" }}>{b.views}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick actions */}
            <div className="px-card px-card-narrow">
              <div className="px-card-head"><h3>Tezkor amallar</h3></div>
              <div className="px-actions">
                {[
                  { label: "Elektron katalog",  to: `/${locale}/catalog`,               icon: "book" },
                  { label: "Bronlar",            to: `/${locale}/reservations`,           icon: "calendar" },
                  { label: "Ijaralar",           to: `/${locale}/loans`,                 icon: "list" },
                  { label: "O'quv zali",         to: `/${locale}/library/reading-room`,  icon: "room" },
                  { label: "E-Library",          to: `/${locale}/elibrary/${role}`,      icon: "layers" },
                  { label: "Resurs yuklash", to: `/${locale}/resources/upload`, icon: "upload" },
                  ...(role === "admin" ? [{ label: "Admin panel", to: `/${locale}/admin`, icon: "shield" }] : []),
                ].map(q => (
                  <Link key={q.to} to={q.to} className="px-action-row">
                    <div className="px-action-icon"><Icon id={q.icon} size={15} /></div>
                    <span>{q.label}</span>
                    <Icon id="arrow" size={13} color="#c4c9d4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── Analytics tab (admin) ── */}
      {tab === "analytics" && (
        <div className="px-body">
          <div className="px-row">
            <div className="px-card px-card-grow">
              <div className="px-card-head"><h3>Haftalik faollik — kirish statistikasi</h3></div>
              <div className="px-chart-wrap">
                <BarChart data={WEEKLY} height={140} />
              </div>
              <div className="px-chart-meta">
                <span>Jami: <strong>{WEEKLY.reduce((a, b) => a + b.value, 0).toLocaleString()}</strong></span>
                <span>O'rtacha: <strong>{Math.round(WEEKLY.reduce((a, b) => a + b.value, 0) / 7)}/kun</strong></span>
                <span>Eng yuqori: <strong>{Math.max(...WEEKLY.map(d => d.value))} (Payshanba)</strong></span>
              </div>
            </div>
            <div className="px-card px-card-narrow">
              <div className="px-card-head"><h3>Foydalanuvchilar taqsimoti</h3></div>
              <div className="px-donut-wrap">
                <DonutChart segments={[
                  { value: report.students    ?? 1840, color: "#002147", label: "Talaba" },
                  { value: report.teachers    ?? 420,  color: "#3b82f6", label: "O'qituvchi" },
                  { value: report.librarians  ?? 12,   color: "#f59e0b", label: "Kutubxonachi" },
                  { value: report.departments ?? 24,   color: "#10b981", label: "Kafedra" },
                ]} size={140} />
              </div>
              <div className="px-legend">
                {[
                  { label: "Talabalar",       value: report.students    ?? 1840, color: "#002147" },
                  { label: "O'qituvchilar",   value: report.teachers    ?? 420,  color: "#3b82f6" },
                  { label: "Kutubxonachilar", value: report.librarians  ?? 12,   color: "#f59e0b" },
                  { label: "Kafedra",         value: report.departments ?? 24,   color: "#10b981" },
                ].map(l => (
                  <div key={l.label} className="px-legend-row">
                    <span className="px-legend-dot" style={{ background: l.color }} />
                    <span className="px-legend-label">{l.label}</span>
                    <span className="px-legend-val">{l.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Resources tab ── */}
      {tab === "resources" && (
        <div className="px-body">
          <div className="px-card px-card-full">
            <div className="px-card-head">
              <h3>Resurslar ro'yxati</h3>
              <Link to={`/${locale}/resources/upload`} className="px-btn-primary px-btn-sm">
                <Icon id="upload" size={12} /> Yangi yuklash
              </Link>
            </div>
            <table className="px-table px-table-hover">
              <thead><tr><th>#</th><th>Sarlavha</th><th>Fan</th><th>Tur</th><th>Holat</th></tr></thead>
              <tbody>
                {resources.slice(0, 20).map((r, i) => {
                  const pill = r.status === "approved" ? { c: "#065f46", bg: "#d1fae5", t: "Tasdiqlangan" }
                    : r.status === "pending_review"    ? { c: "#92400e", bg: "#fef3c7", t: "Kutmoqda" }
                    : r.status === "rejected"          ? { c: "#9b1a2f", bg: "#fce8ea", t: "Rad etilgan" }
                    : { c: "#374151", bg: "#f3f4f6", t: "Qoralama" };
                  return (
                    <tr key={r.id}>
                      <td className="px-td-muted">{i + 1}</td>
                      <td className="px-td-main">{r.title}</td>
                      <td className="px-td-muted">{r.subject_name ?? "—"}</td>
                      <td className="px-td-muted">{r.material_type ?? "—"}</td>
                      <td><span className="px-pill" style={{ color: pill.c, background: pill.bg }}>{pill.t}</span></td>
                    </tr>
                  );
                })}
                {resources.length === 0 && <tr><td colSpan={5} className="px-empty">Resurslar yo'q</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Loans tab ── */}
      {tab === "loans" && (
        <div className="px-body">
          <div className="px-card px-card-full">
            <div className="px-card-head"><h3>Faol ijaralar</h3><span className="px-badge">{loans.length} ta</span></div>
            <table className="px-table px-table-hover">
              <thead><tr><th>#</th><th>Kitob</th><th>Berilgan</th><th>Qaytarish</th><th>Holat</th></tr></thead>
              <tbody>
                {loans.map((l, i) => (
                  <tr key={l.id}>
                    <td className="px-td-muted">{i + 1}</td>
                    <td className="px-td-main">{l.book_title ?? `Kitob #${l.id}`}</td>
                    <td className="px-td-muted">{new Date(l.issued_at).toLocaleDateString("uz-UZ")}</td>
                    <td className="px-td-muted">{new Date(l.due_at).toLocaleDateString("uz-UZ")}</td>
                    <td><span className="px-pill" style={l.status === "overdue" ? { color: "#9b1a2f", background: "#fce8ea" } : { color: "#065f46", background: "#d1fae5" }}>{l.status === "overdue" ? "Muddati o'tdi" : "Faol"}</span></td>
                  </tr>
                ))}
                {loans.length === 0 && <tr><td colSpan={5} className="px-empty">Ijaralar topilmadi</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Reservations tab ── */}
      {tab === "reservations" && (
        <div className="px-body">
          <div className="px-card px-card-full">
            <div className="px-card-head"><h3>Bronlar</h3><span className="px-badge">{reservations.length} ta</span></div>
            <table className="px-table px-table-hover">
              <thead><tr><th>#</th><th>Kitob</th><th>Olinish sanasi</th><th>Holat</th></tr></thead>
              <tbody>
                {reservations.map((r, i) => (
                  <tr key={r.id}>
                    <td className="px-td-muted">{i + 1}</td>
                    <td className="px-td-main">{(r as { book?: { title?: string } }).book?.title ?? `Kitob #${r.book_id}`}</td>
                    <td className="px-td-muted">{r.pickup_date}</td>
                    <td><span className="px-pill" style={{ color: "#92400e", background: "#fef3c7" }}>Kutmoqda</span></td>
                  </tr>
                ))}
                {reservations.length === 0 && <tr><td colSpan={4} className="px-empty">Bronlar topilmadi</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── My Books tab (student) ── */}
      {tab === "mybooks" && (
        <div className="px-body">
          <div className="px-row">
            <div className="px-card px-card-grow">
              <div className="px-card-head"><h3>Mening ijaralarim</h3><span className="px-badge">{loans.length || 3} ta</span></div>
              <table className="px-table px-table-hover">
                <thead><tr><th>#</th><th>Kitob</th><th>Berilgan</th><th>Qaytarish</th><th>Holat</th></tr></thead>
                <tbody>
                  {loans.length > 0 ? loans.map((l, i) => (
                    <tr key={l.id}>
                      <td className="px-td-muted">{i+1}</td>
                      <td className="px-td-main">{l.book_title ?? `Kitob #${l.id}`}</td>
                      <td className="px-td-muted">{new Date(l.issued_at).toLocaleDateString("uz-UZ")}</td>
                      <td className="px-td-muted">{new Date(l.due_at).toLocaleDateString("uz-UZ")}</td>
                      <td><span className="px-pill" style={l.status === "overdue" ? {color:"#9b1a2f",background:"#fce8ea"} : {color:"#065f46",background:"#d1fae5"}}>{l.status === "overdue" ? "Muddati o'tdi" : "Faol"}</span></td>
                    </tr>
                  )) : [
                    { id:1, title:"Python dasturlash tili", issued:"10.06.2026", due:"10.07.2026", ok:true },
                    { id:2, title:"Algoritm va ma'lumotlar strukturasi", issued:"01.07.2026", due:"01.08.2026", ok:true },
                    { id:3, title:"Kiberxavfsizlik asoslari", issued:"20.05.2026", due:"20.06.2026", ok:false },
                  ].map((l, i) => (
                    <tr key={i}>
                      <td className="px-td-muted">{i+1}</td>
                      <td className="px-td-main">{l.title}</td>
                      <td className="px-td-muted">{l.issued}</td>
                      <td className="px-td-muted">{l.due}</td>
                      <td><span className="px-pill" style={l.ok ? {color:"#065f46",background:"#d1fae5"} : {color:"#9b1a2f",background:"#fce8ea"}}>{l.ok ? "Faol" : "Muddati o'tdi"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-card px-card-narrow">
              <div className="px-card-head"><h3>Bronlarim</h3></div>
              {(reservations.length > 0 ? reservations : [
                { id:1, title:"Veb dasturlash asoslari", pickup:"15.07.2026", status:"Kutmoqda" },
                { id:2, title:"Ma'lumotlar bazasi",       pickup:"20.07.2026", status:"Kutmoqda" },
              ]).map((r: { id?: number; title?: string; book_id?: number; pickup_date?: string; pickup?: string; status?: string }, i) => (
                <div key={i} style={{padding:"10px 0", borderBottom:"1px solid #f1f5f9", display:"flex", flexDirection:"column", gap:3}}>
                  <span style={{fontSize:13, fontWeight:600, color:"#0f172a"}}>
                    {(r as { title?: string }).title ?? `Kitob #${r.book_id}`}
                  </span>
                  <span style={{fontSize:11, color:"#94a3b8"}}>{r.pickup_date ?? (r as { pickup?: string }).pickup}</span>
                  <span className="px-pill" style={{color:"#92400e", background:"#fef3c7", alignSelf:"flex-start"}}>Kutmoqda</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Users tab (admin) ── */}
      {tab === "users" && (
        <div className="px-body">
          <div className="px-card px-card-full">
            <div className="px-card-head"><h3>Foydalanuvchilar</h3></div>
            <table className="px-table px-table-hover">
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
                    <td className="px-td-muted">{i + 1}</td>
                    <td className="px-td-main">{u.name}</td>
                    <td className="px-td-muted">{u.email}</td>
                    <td><span className="px-pill" style={{ color: "#002147", background: "#e8edf5" }}>
                      {u.role === "admin" ? "Administrator" : u.role === "teacher" ? "O'qituvchi" : u.role === "student" ? "Talaba" : "Kutubxonachi"}
                    </span></td>
                    <td className="px-td-muted">{u.date}</td>
                    <td><span className="px-pill" style={u.active ? { color: "#065f46", background: "#d1fae5" } : { color: "#6b7280", background: "#f3f4f6" }}>
                      {u.active ? "Faol" : "Nofaol"}
                    </span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
