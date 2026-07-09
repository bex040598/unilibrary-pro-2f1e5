import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "../../lib/auth";
import { useNavigate } from "react-router-dom";

/* ── Types ─────────────────────────────────────────────── */
type RoomStatus = "available" | "limited" | "almost_full" | "full" | "maintenance";
interface Room {
  id: string; name: string; floor: string; capacity: number;
  occupied: number; status: RoomStatus; type: string; features: string[];
  color: string; imgVariant: number;
}

/* ── Mock rooms ─────────────────────────────────────────── */
const ROOMS: Room[] = [
  { id:"A1",  name:"A1",  floor:"1-qavat", capacity:4,  occupied:1,  status:"available",   type:"Guruh",      features:["Wi-Fi","Monitor"],         color:"#4f46e5", imgVariant:1 },
  { id:"A2",  name:"A2",  floor:"1-qavat", capacity:6,  occupied:4,  status:"limited",     type:"Individual", features:["Wi-Fi","Printer"],          color:"#0891b2", imgVariant:2 },
  { id:"A3",  name:"A3",  floor:"1-qavat", capacity:4,  occupied:3,  status:"limited",     type:"Individual", features:["Wi-Fi"],                    color:"#059669", imgVariant:3 },
  { id:"A4",  name:"A4",  floor:"1-qavat", capacity:4,  occupied:1,  status:"available",   type:"Individual", features:["Wi-Fi","Quvvat"],           color:"#d97706", imgVariant:4 },
  { id:"A5",  name:"A5",  floor:"1-qavat", capacity:8,  occupied:7,  status:"almost_full", type:"Guruh",      features:["Wi-Fi","Proyektor"],        color:"#7c3aed", imgVariant:1 },
  { id:"A6",  name:"A6",  floor:"1-qavat", capacity:8,  occupied:5,  status:"limited",     type:"Guruh",      features:["Wi-Fi","Monitor","Printer"],color:"#0891b2", imgVariant:2 },
  { id:"A7",  name:"A7",  floor:"1-qavat", capacity:6,  occupied:2,  status:"available",   type:"Individual", features:["Wi-Fi"],                    color:"#059669", imgVariant:3 },
  { id:"A8",  name:"A8",  floor:"1-qavat", capacity:4,  occupied:4,  status:"full",        type:"Individual", features:["Wi-Fi","Printer"],          color:"#dc2626", imgVariant:4 },
  { id:"A9",  name:"A9",  floor:"2-qavat", capacity:6,  occupied:2,  status:"available",   type:"Guruh",      features:["Wi-Fi","Monitor"],          color:"#4f46e5", imgVariant:2 },
  { id:"A10", name:"A10", floor:"2-qavat", capacity:10, occupied:9,  status:"almost_full", type:"Konferens",  features:["Wi-Fi","Proyektor","Ekran"],color:"#d97706", imgVariant:1 },
  { id:"A11", name:"A11", floor:"2-qavat", capacity:6,  occupied:2,  status:"available",   type:"Individual", features:["Wi-Fi"],                    color:"#7c3aed", imgVariant:3 },
  { id:"A12", name:"A12", floor:"2-qavat", capacity:6,  occupied:1,  status:"available",   type:"Individual", features:["Wi-Fi","Quvvat"],           color:"#059669", imgVariant:4 },
  { id:"A13", name:"A13", floor:"2-qavat", capacity:8,  occupied:2,  status:"available",   type:"Guruh",      features:["Wi-Fi","Monitor"],          color:"#0891b2", imgVariant:2 },
  { id:"A14", name:"A14", floor:"2-qavat", capacity:8,  occupied:4,  status:"limited",     type:"Guruh",      features:["Wi-Fi","Printer"],          color:"#4f46e5", imgVariant:1 },
  { id:"A15", name:"A15", floor:"2-qavat", capacity:10, occupied:3,  status:"available",   type:"Konferens",  features:["Wi-Fi","Proyektor"],        color:"#059669", imgVariant:3 },
  { id:"A16", name:"A16", floor:"2-qavat", capacity:6,  occupied:0,  status:"maintenance", type:"Individual", features:["Wi-Fi"],                    color:"#94a3b8", imgVariant:4 },
];

const STATUS_META: Record<RoomStatus, { label: string; dot: string; bg: string }> = {
  available:   { label: "Bo'sh",          dot: "#22c55e", bg: "#f0fdf4" },
  limited:     { label: "Cheklangan",     dot: "#eab308", bg: "#fefce8" },
  almost_full: { label: "Deyarli to'la",  dot: "#f97316", bg: "#fff7ed" },
  full:        { label: "To'la",          dot: "#ef4444", bg: "#fef2f2" },
  maintenance: { label: "Texnik xizmat",  dot: "#94a3b8", bg: "#f8fafc" },
};

const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

const NAV_ITEMS = [
  { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m-6 0h16", label: "Bosh sahifa", href: "/uz" },
  { icon: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",                                                                                                                    label: "Qidiruv",    href: "/uz/catalog" },
  { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "Katalog",    href: "/uz/catalog" },
  { icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4",           label: "O'quv zali", href: "/uz/reading-room", active: true },
  { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",                                                                  label: "Bronlar",    href: "/uz/profile" },
  { icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 0 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0", label: "Profil", href: "/uz/profile" },
  { icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",  label: "Yordam",     href: "#" },
];

/* ── SVG Room Thumbnails ────────────────────────────────── */
function RoomThumb({ variant, color }: { variant: number; color: string }) {
  const lt = color + "22"; // light tint
  const md = color + "55";
  if (variant === 1) return (
    <svg width="100%" height="100%" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
      <rect width="160" height="90" fill={lt}/>
      {/* floor */}
      <rect x="0" y="72" width="160" height="18" fill={color+"18"}/>
      {/* back wall bookshelves */}
      {[0,32,64,96,128].map(x => (
        <g key={x}>
          <rect x={x+2} y="8" width="28" height="42" rx="2" fill={md}/>
          {[0,1,2,3,4,5].map(row => (
            <rect key={row} x={x+4} y={12+row*7} width={Math.random()*14+10} height="4" rx="1" fill={color} opacity=".7"/>
          ))}
        </g>
      ))}
      {/* table */}
      <rect x="20" y="55" width="120" height="14" rx="3" fill={color} opacity=".6"/>
      <rect x="28" y="69" width="6" height="8" rx="1" fill={color} opacity=".4"/>
      <rect x="126" y="69" width="6" height="8" rx="1" fill={color} opacity=".4"/>
      {/* chairs */}
      {[30,55,80,105].map(cx => (
        <rect key={cx} x={cx} y="50" width="14" height="10" rx="2" fill="#fff" opacity=".7"/>
      ))}
      {/* laptop */}
      <rect x="68" y="50" width="24" height="14" rx="2" fill="#1e293b" opacity=".5"/>
      <rect x="70" y="52" width="20" height="10" rx="1" fill={color} opacity=".3"/>
    </svg>
  );
  if (variant === 2) return (
    <svg width="100%" height="100%" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
      <rect width="160" height="90" fill={lt}/>
      <rect x="0" y="74" width="160" height="16" fill={color+"14"}/>
      {/* window */}
      <rect x="4" y="10" width="36" height="52" rx="3" fill={color+"30"}/>
      <line x1="22" y1="10" x2="22" y2="62" stroke={color} strokeWidth="1.5" opacity=".4"/>
      <line x1="4" y1="36" x2="40" y2="36" stroke={color} strokeWidth="1.5" opacity=".4"/>
      {/* side shelves */}
      {[0,1,2,3].map(i => <rect key={i} x="120" y={10+i*14} width="36" height="10" rx="1" fill={md}/>)}
      {/* round table */}
      <ellipse cx="85" cy="65" rx="45" ry="12" fill={color} opacity=".55"/>
      <ellipse cx="85" cy="58" rx="45" ry="12" fill={color} opacity=".7"/>
      {/* seats around table */}
      {[40,65,90,115,130].map((cx,i) => (
        <ellipse key={i} cx={cx} cy={i%2===0?48:72} rx="9" ry="6" fill="#fff" opacity=".65"/>
      ))}
    </svg>
  );
  if (variant === 3) return (
    <svg width="100%" height="100%" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
      <rect width="160" height="90" fill={lt}/>
      {/* ceiling light */}
      <ellipse cx="80" cy="4" rx="30" ry="6" fill={color} opacity=".3"/>
      <line x1="80" y1="4" x2="80" y2="18" stroke={color} strokeWidth="1.5" opacity=".4"/>
      <ellipse cx="80" cy="18" rx="14" ry="4" fill={color} opacity=".6"/>
      {/* individual desks in rows */}
      {[0,1,2].map(row => [0,1,2,3].map(col => (
        <g key={`${row}-${col}`}>
          <rect x={10+col*38} y={28+row*20} width="28" height="14" rx="2" fill={color} opacity=".5"/>
          <rect x={14+col*38} y={22+row*20} width="20" height="8" rx="1" fill="#fff" opacity=".5"/>
        </g>
      )))}
      {/* floor line */}
      <rect x="0" y="76" width="160" height="14" fill={color+"18"}/>
    </svg>
  );
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
      <rect width="160" height="90" fill={lt}/>
      {/* conference style */}
      <ellipse cx="80" cy="50" rx="60" ry="22" fill={color} opacity=".4"/>
      <ellipse cx="80" cy="45" rx="60" ry="22" fill={color} opacity=".6"/>
      {/* projector screen */}
      <rect x="20" y="8" width="120" height="30" rx="3" fill={color+"44"} stroke={color} strokeWidth="1.5" opacity=".6"/>
      <rect x="24" y="12" width="112" height="22" rx="2" fill={color+"22"}/>
      {/* seats */}
      {[20,45,70,95,120].map((cx,i) => (
        <g key={i}>
          <ellipse cx={cx} cy={35} rx="9" ry="5" fill="#fff" opacity=".6"/>
          <ellipse cx={cx} cy={60} rx="9" ry="5" fill="#fff" opacity=".6"/>
        </g>
      ))}
      {/* floor */}
      <rect x="0" y="76" width="160" height="14" fill={color+"18"}/>
    </svg>
  );
}

/* ── Usage Sparkline ────────────────────────────────────── */
function UsageChart() {
  const data = [15,22,45,62,78,85,80,72,65,58,40,25];
  const W=200, H=60;
  const max = Math.max(...data);
  const pts = data.map((v, i) => `${(i/(data.length-1))*W},${H-((v/max)*(H-8))+4}`).join(" ");
  return (
    <div className="sr-usage-chart">
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sr-chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity=".3"/>
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#sr-chart-grad)"/>
        <polyline points={pts} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx={(8/(data.length-1))*W} cy={H-((data[8]/max)*(H-8))+4} r="3" fill="#4f46e5"/>
      </svg>
      <div className="sr-chart-labels">
        <span>08:00</span><span>14:00</span><span>20:00</span>
      </div>
      <div className="sr-chart-peak">
        <span className="sr-chart-peak-pct">68%</span>
        <span className="sr-chart-peak-label">o'rtacha</span>
      </div>
    </div>
  );
}

/* ── Occupancy Ring ─────────────────────────────────────── */
function OccupancyRing({ pct }: { pct: number }) {
  const r = 26, c = 32, circ = 2*Math.PI*r;
  const dash = (pct/100)*circ;
  const color = pct > 80 ? "#ef4444" : pct > 60 ? "#f97316" : "#22c55e";
  return (
    <svg width={c*2} height={c*2} viewBox={`0 0 ${c*2} ${c*2}`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#e2e8f0" strokeWidth="5"/>
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ*0.25} strokeLinecap="round"/>
      <text x={c} y={c+1} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="800" fill={color}>{pct}%</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export function ReadingRoomPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filterFloor,    setFilterFloor]    = useState("Barchasi");
  const [filterCap,      setFilterCap]      = useState("Barchasi");
  const [filterType,     setFilterType]     = useState("Barchasi");
  const [filterStatus,   setFilterStatus]   = useState<RoomStatus | "all">("all");
  const [selectedRoom,   setSelectedRoom]   = useState<Room | null>(null);
  const [bookingStep,    setBookingStep]    = useState<1|2|3>(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), start: "10:00", end: "12:00" });
  const [showFloorMap,   setShowFloorMap]   = useState(false);

  const totalSeats   = ROOMS.reduce((s,r) => s+r.capacity, 0);
  const totalOccupied= ROOMS.reduce((s,r) => s+r.occupied, 0);
  const liveOccupancy= Math.round((totalOccupied/totalSeats)*100);

  const filtered = useMemo(() => ROOMS.filter(r => {
    if (filterFloor !== "Barchasi" && r.floor !== filterFloor) return false;
    if (filterCap   !== "Barchasi") {
      const n = parseInt(filterCap); if (r.capacity < n) return false;
    }
    if (filterType   !== "Barchasi" && r.type !== filterType) return false;
    if (filterStatus !== "all"       && r.status !== filterStatus) return false;
    return true;
  }), [filterFloor, filterCap, filterType, filterStatus]);

  function openRoom(room: Room) {
    if (room.status === "maintenance" || room.status === "full") return;
    setSelectedRoom(room);
    setBookingStep(1);
    setBookingSuccess(false);
  }
  function closeModal() { setSelectedRoom(null); }

  function handleBook(e: FormEvent) {
    e.preventDefault();
    setBookingStep(2);
    setTimeout(() => { setBookingSuccess(true); setBookingStep(3); }, 800);
  }

  return (
    <div className="sr-shell">
      {/* ── Left Nav ── */}
      <nav className="sr-nav">
        <div className="sr-nav-logo">
          <div className="sr-nav-logo-mark">A</div>
          <div>
            <div className="sr-nav-logo-name">ATMU</div>
            <div className="sr-nav-logo-sub">LIBRARIES</div>
          </div>
        </div>
        <ul className="sr-nav-list">
          {NAV_ITEMS.map(item => (
            <li key={item.label}>
              <a href={item.href}
                className={`sr-nav-item${item.active ? " active" : ""}`}
                onClick={e => { e.preventDefault(); if(!item.active) navigate(item.href); }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon}/>
                </svg>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="sr-nav-user">
          <div className="sr-nav-avatar">{user?.full_name?.[0] ?? "U"}</div>
          <div>
            <div className="sr-nav-uname">{user?.full_name ?? "Foydalanuvchi"}</div>
            <div className="sr-nav-urole">{user?.email ?? ""}</div>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <div className="sr-main">
        {/* Header */}
        <div className="sr-page-header">
          <div>
            <h1 className="sr-page-title">O'quv zallari</h1>
            <p className="sr-page-sub">ATMU Bosh bino · Asosiy qavat</p>
          </div>
          <div className="sr-header-right">
            <div className="sr-live-occ">
              <OccupancyRing pct={liveOccupancy} />
              <div>
                <div className="sr-occ-label">Live Bandlik</div>
                <div className="sr-occ-sub">{totalOccupied}/{totalSeats} o'rin</div>
              </div>
            </div>
            <button className="sr-floor-btn" onClick={() => setShowFloorMap(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              Qavatlar rejasi
            </button>
          </div>
        </div>

        {/* Status legend + filter chips */}
        <div className="sr-legend-bar">
          <button className={`sr-leg-chip${filterStatus==="all"?" active":""}`} onClick={() => setFilterStatus("all")}>
            Barcha zallar
          </button>
          {(Object.entries(STATUS_META) as [RoomStatus, typeof STATUS_META[RoomStatus]][]).map(([k,v]) => (
            <button key={k} className={`sr-leg-chip${filterStatus===k?" active":""}`} onClick={() => setFilterStatus(filterStatus===k?"all":k)}>
              <span className="sr-dot" style={{ background: v.dot }}/>
              {v.label}
            </button>
          ))}
        </div>

        {/* Room grid */}
        <div className="sr-room-grid">
          {filtered.length === 0 && (
            <div className="sr-empty">Filtrga mos zal topilmadi</div>
          )}
          {filtered.map(room => {
            const meta = STATUS_META[room.status];
            const freeSeats = room.capacity - room.occupied;
            const pct = Math.round((room.occupied / room.capacity) * 100);
            const clickable = room.status !== "maintenance" && room.status !== "full";
            return (
              <div key={room.id}
                className={`sr-room-card${!clickable ? " disabled" : ""}${selectedRoom?.id === room.id ? " selected" : ""}`}
                onClick={() => clickable && openRoom(room)}
                role="button" tabIndex={clickable ? 0 : -1}
                onKeyDown={e => e.key==="Enter" && clickable && openRoom(room)}>
                {/* Thumbnail */}
                <div className="sr-thumb">
                  <RoomThumb variant={room.imgVariant} color={room.color} />
                  <div className="sr-thumb-badge">{room.name}</div>
                  <div className="sr-thumb-status-dot" style={{ background: meta.dot }}/>
                  {!clickable && <div className="sr-thumb-overlay">{meta.label}</div>}
                </div>
                {/* Info */}
                <div className="sr-room-info">
                  <div className="sr-room-status" style={{ color: meta.dot }}>
                    <span className="sr-dot" style={{ background: meta.dot }}/> {meta.label}
                  </div>
                  <div className="sr-room-seats">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" opacity=".5">
                      <path d="M4 16.5v-9A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5H16v2h-8v-2H5.5A1.5 1.5 0 0 1 4 16.5z"/>
                    </svg>
                    {freeSeats}/{room.capacity} bo'sh o'rin
                  </div>
                  <div className="sr-room-bar-wrap">
                    <div className="sr-room-bar">
                      <div className="sr-room-bar-fill" style={{ width:`${pct}%`, background: meta.dot }}/>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Filters Panel ── */}
      <aside className="sr-filters-panel">
        <div className="sr-filters-title">Filtrlar</div>

        <div className="sr-filter-group">
          <label className="sr-filter-label">Qavat</label>
          <select className="sr-filter-select" value={filterFloor} onChange={e => setFilterFloor(e.target.value)}>
            <option>Barchasi</option>
            <option>1-qavat</option>
            <option>2-qavat</option>
          </select>
        </div>
        <div className="sr-filter-group">
          <label className="sr-filter-label">Sig'im</label>
          <select className="sr-filter-select" value={filterCap} onChange={e => setFilterCap(e.target.value)}>
            <option>Barchasi</option>
            <option value="4">4+ o'rin</option>
            <option value="6">6+ o'rin</option>
            <option value="8">8+ o'rin</option>
          </select>
        </div>
        <div className="sr-filter-group">
          <label className="sr-filter-label">Zal turi</label>
          <select className="sr-filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option>Barchasi</option>
            <option>Individual</option>
            <option>Guruh</option>
            <option>Konferens</option>
          </select>
        </div>

        <div className="sr-divider"/>

        <div className="sr-filters-title" style={{ marginBottom:8 }}>Bugungi foydalanish</div>
        <UsageChart/>

        <div className="sr-divider"/>

        {/* Stats */}
        <div className="sr-stats-grid">
          {[
            { n: ROOMS.filter(r=>r.status==="available").length,   label:"Bo'sh",         color:"#22c55e" },
            { n: ROOMS.filter(r=>r.status==="limited").length,      label:"Cheklangan",    color:"#eab308" },
            { n: ROOMS.filter(r=>r.status==="almost_full").length,  label:"Deyarli to'la", color:"#f97316" },
            { n: ROOMS.filter(r=>r.status==="full").length,         label:"To'la",         color:"#ef4444" },
          ].map((s,i) => (
            <div key={i} className="sr-stat-pill">
              <span className="sr-dot" style={{ background:s.color }}/>
              <span className="sr-stat-n" style={{ color:s.color }}>{s.n}</span>
              <span className="sr-stat-l">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="sr-divider"/>

        <button className="sr-reserve-btn" onClick={() => {
          const first = ROOMS.find(r => r.status==="available");
          if(first) openRoom(first);
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Zal bron qilish
        </button>

        <div className="sr-help-box">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
          <span>Yordam kerakmi? <a href="#">Bog'laning</a></span>
        </div>
      </aside>

      {/* ── Booking Modal ── */}
      {selectedRoom && (
        <>
          <div className="sr-modal-backdrop" onClick={closeModal}/>
          <div className="sr-modal">
            <button className="sr-modal-close" onClick={closeModal}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* Room preview header */}
            <div className="sr-modal-thumb">
              <RoomThumb variant={selectedRoom.imgVariant} color={selectedRoom.color}/>
              <div className="sr-modal-thumb-overlay">
                <span className="sr-modal-room-code">{selectedRoom.name}</span>
                <span className="sr-modal-room-floor">{selectedRoom.floor}</span>
              </div>
            </div>

            {/* Room details */}
            <div className="sr-modal-body">
              <div className="sr-modal-meta">
                <div className="sr-modal-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16.5v-9A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5H16v2h-8v-2H5.5A1.5 1.5 0 0 1 4 16.5z"/></svg>
                  {selectedRoom.capacity - selectedRoom.occupied}/{selectedRoom.capacity} bo'sh
                </div>
                <div className="sr-modal-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/></svg>
                  {selectedRoom.type}
                </div>
                {selectedRoom.features.map(f => (
                  <div key={f} className="sr-modal-meta-item">{f}</div>
                ))}
              </div>

              {!bookingSuccess ? (
                <form onSubmit={handleBook}>
                  <div className="sr-modal-section-title">Vaqtni tanlang</div>
                  <div className="sr-modal-form-grid">
                    <div className="sr-modal-field">
                      <label>Sana</label>
                      <input type="date" value={form.date} min={new Date().toISOString().slice(0,10)}
                        onChange={e => setForm(f => ({...f, date: e.target.value}))}/>
                    </div>
                    <div className="sr-modal-field">
                      <label>Boshlanish</label>
                      <select value={form.start} onChange={e => setForm(f => ({...f, start: e.target.value}))}>
                        {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="sr-modal-field">
                      <label>Tugash</label>
                      <select value={form.end} onChange={e => setForm(f => ({...f, end: e.target.value}))}>
                        {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="sr-modal-summary">
                    {([ ["Zal", selectedRoom.name], ["Qavat", selectedRoom.floor], ["Sana", form.date], ["Vaqt", `${form.start} – ${form.end}`], ...(user ? [["Foydalanuvchi", user.full_name]] : []) ] as [string,string][]).map(([k,v]) => (
                      <div key={k} className="sr-sum-row"><span>{k}</span><strong>{v}</strong></div>
                    ))}
                  </div>

                  <div className="sr-modal-actions">
                    <button type="button" className="sr-btn-ghost" onClick={closeModal}>Bekor qilish</button>
                    <button type="submit" className="sr-btn-primary" disabled={bookingStep===2}>
                      {bookingStep===2 ? "Saqlanmoqda…" : "Bronni tasdiqlash"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="sr-success">
                  <div className="sr-success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3>Bron muvaffaqiyatli!</h3>
                  <p>{selectedRoom.name} zali · {form.date} · {form.start}–{form.end}</p>
                  <div className="sr-qr">
                    <svg width="72" height="72" viewBox="0 0 88 88">
                      <rect width="88" height="88" fill="#fff" rx="4"/>
                      <rect x={8} y={8} width={24} height={24} rx={2} fill="#002147"/>
                      <rect x={12} y={12} width={16} height={16} rx={1} fill="#fff"/>
                      <rect x={15} y={15} width={10} height={10} fill="#002147"/>
                      <rect x={56} y={8} width={24} height={24} rx={2} fill="#002147"/>
                      <rect x={60} y={12} width={16} height={16} rx={1} fill="#fff"/>
                      <rect x={63} y={15} width={10} height={10} fill="#002147"/>
                      <rect x={8} y={56} width={24} height={24} rx={2} fill="#002147"/>
                      <rect x={12} y={60} width={16} height={16} rx={1} fill="#fff"/>
                      <rect x={15} y={63} width={10} height={10} fill="#002147"/>
                      {[40,50,62,72,40,52,62].map((x,i)=><rect key={i} x={x} y={42+i*6} width={6} height={4} rx={1} fill="#002147"/>)}
                    </svg>
                    <p>Kirish uchun QR-kodni skanerlang</p>
                    <small>Bron ID: #{Date.now().toString().slice(-6)}</small>
                  </div>
                  <div className="sr-modal-actions">
                    <button className="sr-btn-ghost" onClick={closeModal}>Yopish</button>
                    <button className="sr-btn-primary" onClick={() => { setBookingSuccess(false); setBookingStep(1); setSelectedRoom(null); }}>Yangi bron</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Floor Map Modal ── */}
      {showFloorMap && (
        <>
          <div className="sr-modal-backdrop" onClick={() => setShowFloorMap(false)}/>
          <div className="sr-modal sr-floormap-modal">
            <button className="sr-modal-close" onClick={() => setShowFloorMap(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="sr-modal-body">
              <h3 style={{ marginBottom:16, fontWeight:700, fontSize:16 }}>Qavatlar rejasi — 1-qavat</h3>
              <svg width="100%" viewBox="0 0 400 240" style={{ borderRadius:8, border:"1px solid #e2e8f0" }}>
                <rect width="400" height="240" fill="#f8fafc"/>
                {/* Building outline */}
                <rect x="20" y="20" width="360" height="200" rx="6" fill="none" stroke="#334155" strokeWidth="2"/>
                {/* Corridor */}
                <rect x="20" y="110" width="360" height="20" fill="#e2e8f0"/>
                <text x="200" y="124" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600">KORIDOR</text>
                {/* Rooms top row */}
                {["A1","A2","A3","A4","A5","A6","A7","A8"].map((id,i) => {
                  const room = ROOMS.find(r=>r.id===id);
                  const meta = room ? STATUS_META[room.status] : STATUS_META.available;
                  return (
                    <g key={id} onClick={() => { setShowFloorMap(false); room && openRoom(room); }} style={{ cursor:"pointer" }}>
                      <rect x={24+i*43} y={24} width="39" height="84" rx="3" fill={meta.bg} stroke={meta.dot} strokeWidth="1.5"/>
                      <text x={44+i*43} y={68} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">{id}</text>
                      <circle cx={44+i*43} cy={82} r="4" fill={meta.dot}/>
                    </g>
                  );
                })}
                {/* Rooms bottom row */}
                {["A9","A10","A11","A12","A13","A14","A15","A16"].map((id,i) => {
                  const room = ROOMS.find(r=>r.id===id);
                  const meta = room ? STATUS_META[room.status] : STATUS_META.available;
                  return (
                    <g key={id} onClick={() => { setShowFloorMap(false); room && openRoom(room); }} style={{ cursor:"pointer" }}>
                      <rect x={24+i*43} y={134} width="39" height="84" rx="3" fill={meta.bg} stroke={meta.dot} strokeWidth="1.5"/>
                      <text x={44+i*43} y={178} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">{id}</text>
                      <circle cx={44+i*43} cy={192} r="4" fill={meta.dot}/>
                    </g>
                  );
                })}
              </svg>
              <div className="sr-legend-bar" style={{ marginTop:12, paddingLeft:0, flexWrap:"wrap" }}>
                {(Object.entries(STATUS_META) as [RoomStatus, typeof STATUS_META[RoomStatus]][]).map(([,v]) => (
                  <span key={v.label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11 }}>
                    <span className="sr-dot" style={{ background:v.dot }}/>{v.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
