import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "../../lib/auth";

/* ── Types ─────────────────────────────────────────────── */
type RoomStatus = "available" | "limited" | "almost_full" | "full" | "maintenance";
interface Room {
  id: string; name: string; floor: string; capacity: number;
  occupied: number; status: RoomStatus; type: string; features: string[];
}

/* ── Mock rooms ─────────────────────────────────────────── */
const ROOMS: Room[] = [
  { id:"A1",  name:"A1",  floor:"1-qavat", capacity:4,  occupied:1, status:"available",   type:"Individual", features:["Wi-Fi","Monitor"] },
  { id:"A2",  name:"A2",  floor:"1-qavat", capacity:6,  occupied:4, status:"limited",     type:"Individual", features:["Wi-Fi","Printer"] },
  { id:"A3",  name:"A3",  floor:"1-qavat", capacity:4,  occupied:3, status:"limited",     type:"Individual", features:["Wi-Fi"] },
  { id:"A4",  name:"A4",  floor:"1-qavat", capacity:4,  occupied:1, status:"available",   type:"Individual", features:["Wi-Fi","Quvvat"] },
  { id:"A5",  name:"A5",  floor:"1-qavat", capacity:8,  occupied:7, status:"almost_full", type:"Guruh",      features:["Wi-Fi","Proyektor"] },
  { id:"A6",  name:"A6",  floor:"1-qavat", capacity:8,  occupied:5, status:"limited",     type:"Guruh",      features:["Wi-Fi","Monitor"] },
  { id:"A7",  name:"A7",  floor:"1-qavat", capacity:6,  occupied:2, status:"available",   type:"Individual", features:["Wi-Fi"] },
  { id:"A8",  name:"A8",  floor:"1-qavat", capacity:4,  occupied:4, status:"full",        type:"Individual", features:["Wi-Fi","Printer"] },
  { id:"A9",  name:"A9",  floor:"2-qavat", capacity:6,  occupied:2, status:"available",   type:"Guruh",      features:["Wi-Fi","Monitor"] },
  { id:"A10", name:"A10", floor:"2-qavat", capacity:10, occupied:9, status:"almost_full", type:"Konferens",  features:["Wi-Fi","Proyektor","Ekran"] },
  { id:"A11", name:"A11", floor:"2-qavat", capacity:6,  occupied:2, status:"available",   type:"Individual", features:["Wi-Fi"] },
  { id:"A12", name:"A12", floor:"2-qavat", capacity:6,  occupied:1, status:"available",   type:"Individual", features:["Wi-Fi","Quvvat"] },
  { id:"A13", name:"A13", floor:"2-qavat", capacity:8,  occupied:2, status:"available",   type:"Guruh",      features:["Wi-Fi","Monitor"] },
  { id:"A14", name:"A14", floor:"2-qavat", capacity:8,  occupied:4, status:"limited",     type:"Guruh",      features:["Wi-Fi","Printer"] },
  { id:"A15", name:"A15", floor:"2-qavat", capacity:10, occupied:3, status:"available",   type:"Konferens",  features:["Wi-Fi","Proyektor"] },
  { id:"A16", name:"A16", floor:"2-qavat", capacity:6,  occupied:0, status:"maintenance", type:"Individual", features:["Wi-Fi"] },
];

const STATUS_META: Record<RoomStatus, { label: string; color: string; bg: string; ring: string }> = {
  available:   { label:"Bo'sh",         color:"#16a34a", bg:"#f0fdf4", ring:"#bbf7d0" },
  limited:     { label:"Cheklangan",    color:"#ca8a04", bg:"#fefce8", ring:"#fef08a" },
  almost_full: { label:"Deyarli to'la", color:"#ea580c", bg:"#fff7ed", ring:"#fed7aa" },
  full:        { label:"To'la",         color:"#dc2626", bg:"#fef2f2", ring:"#fecaca" },
  maintenance: { label:"Texnik xizmat", color:"#94a3b8", bg:"#f8fafc", ring:"#e2e8f0" },
};

const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

/* ── Room Illustration ──────────────────────────────────── */
const ROOM_PATTERNS = [
  // Individual study pods
  (c: string) => (
    <svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="120" fill={c+"12"}/>
      <rect x="0" y="88" width="200" height="32" fill={c+"0a"}/>
      {/* Desks in grid */}
      {[[18,28],[68,28],[118,28],[168,28],[18,60],[68,60],[118,60],[168,60]].map(([x,y],i)=>(
        <g key={i}>
          <rect x={x-14} y={y-8} width="28" height="18" rx="3" fill="#fff" stroke={c+"40"} strokeWidth="1"/>
          <rect x={x-10} y={y-6} width="16" height="10" rx="2" fill={c+"25"}/>
          <rect x={x-6} y={y+12} width="12" height="7" rx="2" fill={c+"30"}/>
        </g>
      ))}
      {/* Window */}
      <rect x="76" y="4" width="48" height="16" rx="2" fill={c+"30"} stroke={c+"50"} strokeWidth="1"/>
      <line x1="100" y1="4" x2="100" y2="20" stroke={c+"60"} strokeWidth="1"/>
    </svg>
  ),
  // Group room with round table
  (c: string) => (
    <svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="120" fill={c+"10"}/>
      {/* Ambient glow */}
      <ellipse cx="100" cy="65" rx="55" ry="35" fill={c+"18"}/>
      {/* Main table */}
      <ellipse cx="100" cy="68" rx="44" ry="26" fill={c+"35"} stroke={c+"60"} strokeWidth="1.5"/>
      <ellipse cx="100" cy="64" rx="44" ry="26" fill={c+"50"}/>
      <ellipse cx="100" cy="63" rx="38" ry="20" fill={c+"20"}/>
      {/* Chairs */}
      {[[100,32],[136,46],[144,76],[112,96],[88,96],[56,76],[56,46],[64,32]].map(([cx,cy],i)=>(
        <ellipse key={i} cx={cx} cy={cy} rx="10" ry="7" fill="#fff" stroke={c+"40"} strokeWidth="1" opacity=".9"/>
      ))}
      {/* Projector screen */}
      <rect x="72" y="6" width="56" height="16" rx="2" fill="#1e293b" opacity=".6"/>
      <rect x="75" y="9" width="50" height="10" rx="1" fill={c+"40"}/>
    </svg>
  ),
  // Conference / lecture style
  (c: string) => (
    <svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="120" fill={c+"0e"}/>
      {/* Stage / screen */}
      <rect x="10" y="8" width="180" height="28" rx="3" fill={c+"30"} stroke={c+"50"} strokeWidth="1.5"/>
      <rect x="14" y="12" width="172" height="20" rx="2" fill={c+"18"}/>
      <text x="100" y="25" textAnchor="middle" fontSize="8" fill={c+"cc"} fontWeight="700" fontFamily="Inter,sans-serif">EKRAN</text>
      {/* Tiered rows of seats */}
      {[0,1,2].map(row=>(
        <g key={row}>
          {[0,1,2,3,4,5].map(col=>(
            <g key={col}>
              <rect x={18+col*28} y={44+row*22} width="20" height="13" rx="2" fill="#fff" stroke={c+"30"} strokeWidth="1" opacity=".85"/>
              <rect x={21+col*28} y={46+row*22} width="14" height="8" rx="1" fill={c+"20"}/>
            </g>
          ))}
        </g>
      ))}
    </svg>
  ),
  // Quiet reading alcoves
  (c: string) => (
    <svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="120" fill={c+"10"}/>
      {/* Bookshelf wall */}
      <rect x="0" y="0" width="200" height="38" fill={c+"20"}/>
      {[0,1,2,3,4,5,6].map(s=>(
        <g key={s}>
          <rect x={4+s*28} y="4" width="24" height="30" rx="2" fill={c+"35"}/>
          {[0,1,2,3].map(b=>(
            <rect key={b} x={6+s*28} y={6+b*7} width={10+Math.sin(s*b)*6} height="5" rx="1" fill={c+"80"}/>
          ))}
        </g>
      ))}
      {/* Reading pods */}
      {[[30,70],[100,70],[170,70]].map(([x,y],i)=>(
        <g key={i}>
          <rect x={x-28} y={y-20} width="56" height="38" rx="6" fill="#fff" stroke={c+"30"} strokeWidth="1.5"/>
          <rect x={x-22} y={y-14} width="44" height="22" rx="3" fill={c+"18"}/>
          {/* Lamp */}
          <line x1={x} y1={y-34} x2={x} y2={y-22} stroke={c+"60"} strokeWidth="1.5"/>
          <ellipse cx={x} cy={y-36} rx="8" ry="4" fill={c+"50"}/>
        </g>
      ))}
    </svg>
  ),
];

/* ── Occupancy Arc ──────────────────────────────────────── */
function OccArc({ pct, size = 72 }: { pct: number; size?: number }) {
  const r = size * 0.38, c = size / 2, circ = 2 * Math.PI * r;
  const color = pct > 80 ? "#ef4444" : pct > 55 ? "#f97316" : "#22c55e";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#e2e8f0" strokeWidth={size*0.07}/>
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={size*0.07}
        strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"/>
    </svg>
  );
}

/* ── Sparkline ──────────────────────────────────────────── */
function Spark() {
  const pts = [12,18,32,54,74,85,82,76,68,59,44,28];
  const W=200,H=48,max=Math.max(...pts);
  const path = pts.map((v,i)=>`${i===0?"M":"L"}${(i/(pts.length-1))*W},${H-((v/max)*(H-6))+3}`).join(" ");
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="rr-sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity=".25"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${path} L${W},${H} L0,${H} Z`} fill="url(#rr-sg)"/>
      <path d={path} fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Floor Map SVG ──────────────────────────────────────── */
function FloorMapSVG({ onPick }: { onPick: (id:string)=>void }) {
  const floor1 = ROOMS.filter(r=>r.floor==="1-qavat");
  const floor2 = ROOMS.filter(r=>r.floor==="2-qavat");
  return (
    <svg width="100%" viewBox="0 0 480 280" style={{ borderRadius:12, border:"1px solid #e2e8f0", background:"#f8fafc" }}>
      {/* Building shell */}
      <rect x="10" y="10" width="460" height="260" rx="8" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6 3"/>
      {/* Floor labels */}
      <text x="18" y="28" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily="Inter,sans-serif">1-QAVAT</text>
      <text x="18" y="160" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily="Inter,sans-serif">2-QAVAT</text>
      {/* Corridor lines */}
      <rect x="10" y="130" width="460" height="16" fill="#e2e8f0" opacity=".6"/>
      <text x="240" y="141" textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="Inter,sans-serif">KORIDOR</text>
      {/* Floor 1 rooms */}
      {floor1.map((room,i)=>{
        const meta = STATUS_META[room.status];
        const x = 18 + i*56, y = 34;
        return (
          <g key={room.id} onClick={()=>{ if(room.status!=="maintenance"&&room.status!=="full") onPick(room.id); }} style={{cursor:room.status==="maintenance"||room.status==="full"?"default":"pointer"}}>
            <rect x={x} y={y} width="48" height="88" rx="5" fill={meta.bg} stroke={meta.color} strokeWidth="1.5"/>
            <circle cx={x+38} cy={y+10} r="5" fill={meta.color}/>
            <text x={x+24} y={y+52} textAnchor="middle" fontSize="12" fontWeight="800" fill="#1e293b" fontFamily="Inter,sans-serif">{room.id}</text>
            <text x={x+24} y={y+66} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="Inter,sans-serif">{room.capacity}ta o'rin</text>
          </g>
        );
      })}
      {/* Floor 2 rooms */}
      {floor2.map((room,i)=>{
        const meta = STATUS_META[room.status];
        const x = 18 + i*56, y = 166;
        return (
          <g key={room.id} onClick={()=>{ if(room.status!=="maintenance"&&room.status!=="full") onPick(room.id); }} style={{cursor:room.status==="maintenance"||room.status==="full"?"default":"pointer"}}>
            <rect x={x} y={y} width="48" height="88" rx="5" fill={meta.bg} stroke={meta.color} strokeWidth="1.5"/>
            <circle cx={x+38} cy={y+10} r="5" fill={meta.color}/>
            <text x={x+24} y={y+52} textAnchor="middle" fontSize="12" fontWeight="800" fill="#1e293b" fontFamily="Inter,sans-serif">{room.id}</text>
            <text x={x+24} y={y+66} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="Inter,sans-serif">{room.capacity}ta o'rin</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════ */
export function ReadingRoomPage() {
  const { user } = useAuth();

  const [filterFloor,  setFilterFloor]  = useState("Barchasi");
  const [filterCap,    setFilterCap]    = useState("Barchasi");
  const [filterType,   setFilterType]   = useState("Barchasi");
  const [filterStatus, setFilterStatus] = useState<RoomStatus|"all">("all");
  const [selected,     setSelected]     = useState<Room|null>(null);
  const [step,         setStep]         = useState<1|2|3>(1);
  const [success,      setSuccess]      = useState(false);
  const [floorMap,     setFloorMap]     = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), start:"10:00", end:"12:00" });

  const totalSeats    = ROOMS.reduce((s,r)=>s+r.capacity, 0);
  const totalOccupied = ROOMS.reduce((s,r)=>s+r.occupied, 0);
  const livePct       = Math.round((totalOccupied/totalSeats)*100);

  const filtered = useMemo(()=>ROOMS.filter(r=>{
    if(filterFloor!=="Barchasi" && r.floor!==filterFloor) return false;
    if(filterCap!=="Barchasi" && r.capacity < parseInt(filterCap)) return false;
    if(filterType!=="Barchasi" && r.type!==filterType) return false;
    if(filterStatus!=="all" && r.status!==filterStatus) return false;
    return true;
  }),[filterFloor,filterCap,filterType,filterStatus]);

  function openRoom(room: Room) {
    if(room.status==="maintenance"||room.status==="full") return;
    setSelected(room); setStep(1); setSuccess(false);
  }
  function openById(id: string) {
    const room = ROOMS.find(r=>r.id===id);
    if(room) openRoom(room);
    setFloorMap(false);
  }

  function handleBook(e: FormEvent) {
    e.preventDefault();
    setStep(2);
    setTimeout(()=>{ setSuccess(true); setStep(3); }, 900);
  }

  const patternIndex = (room: Room) => {
    if(room.type==="Konferens") return 2;
    if(room.type==="Guruh") return 1;
    const n = parseInt(room.id.replace("A",""));
    return n%2===0 ? 3 : 0;
  };

  const roomColor = (room: Room) => {
    const colors = ["#6366f1","#0891b2","#059669","#d97706","#7c3aed","#0284c7","#16a34a","#dc2626"];
    return colors[(parseInt(room.id.replace("A",""))-1) % colors.length];
  };

  const freeCount  = ROOMS.filter(r=>r.status==="available").length;
  const lmtCount   = ROOMS.filter(r=>r.status==="limited").length;
  const afCount    = ROOMS.filter(r=>r.status==="almost_full").length;
  const fullCount  = ROOMS.filter(r=>r.status==="full").length;

  return (
    <div className="rr2-page">
      {/* ── TOP HEADER BAND ─────────────────────────── */}
      <div className="rr2-header">
        <div className="rr2-header-left">
          <div className="rr2-breadcrumb">
            <span>ATMU</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>O'quv zallari</span>
          </div>
          <h1 className="rr2-title">O'quv zallari</h1>
          <p className="rr2-subtitle">Asosiy bino · Hozir ochiq · 08:00–20:00</p>
        </div>

        <div className="rr2-header-stats">
          <div className="rr2-stat-card accent">
            <div style={{position:"relative",width:72,height:72,flexShrink:0}}>
              <OccArc pct={livePct}/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:0}}>
                <span style={{fontSize:15,fontWeight:900,color:"#0f172a",lineHeight:1}}>{livePct}%</span>
                <span style={{fontSize:8,color:"#64748b",fontWeight:600,letterSpacing:.5}}>BAND</span>
              </div>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:"#0f172a"}}>Jonli bandlik</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{totalOccupied} / {totalSeats} o'rin</div>
              <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                {([["#22c55e",freeCount,"bo'sh"],["#eab308",lmtCount,"cheklangan"],["#f97316",afCount,"deyarli to'la"],["#ef4444",fullCount,"to'la"]] as [string,number,string][]).map(([c,n,l])=>(
                  <span key={l} style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"#475569"}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:c,display:"inline-block"}}/>
                    <b style={{color:"#0f172a"}}>{n}</b> {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button className="rr2-map-btn" onClick={()=>setFloorMap(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            Qavatlar rejasi
          </button>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────── */}
      <div className="rr2-body">
        {/* LEFT — room grid */}
        <div className="rr2-grid-col">
          {/* Filter chips */}
          <div className="rr2-chips">
            {(["all","available","limited","almost_full","full","maintenance"] as const).map(s=>{
              const meta = s==="all" ? null : STATUS_META[s];
              return (
                <button key={s} className={`rr2-chip${filterStatus===s?" on":""}`}
                  onClick={()=>setFilterStatus(s)}>
                  {meta && <span style={{width:7,height:7,borderRadius:"50%",background:meta.color,display:"inline-block"}}/>}
                  {s==="all"?"Barchasi":meta!.label}
                  {s==="available" && <span className="rr2-chip-count">{freeCount}</span>}
                  {s==="limited"   && <span className="rr2-chip-count">{lmtCount}</span>}
                  {s==="almost_full"&&<span className="rr2-chip-count">{afCount}</span>}
                  {s==="full"      && <span className="rr2-chip-count">{fullCount}</span>}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div className="rr2-grid">
            {filtered.length===0 && <div className="rr2-empty">Filtrga mos zal topilmadi</div>}
            {filtered.map(room=>{
              const meta = STATUS_META[room.status];
              const free = room.capacity - room.occupied;
              const pct  = Math.round((room.occupied/room.capacity)*100);
              const ok   = room.status!=="maintenance" && room.status!=="full";
              const col  = roomColor(room);
              const Pattern = ROOM_PATTERNS[patternIndex(room)];
              return (
                <div key={room.id} className={`rr2-card${!ok?" rr2-card--disabled":""}${selected?.id===room.id?" rr2-card--active":""}`}
                  onClick={()=>ok&&openRoom(room)} tabIndex={ok?0:-1}
                  onKeyDown={e=>e.key==="Enter"&&ok&&openRoom(room)}>

                  {/* Illustration */}
                  <div className="rr2-card-art" style={{background:col+"14"}}>
                    {Pattern(col)}
                    {/* Status pill overlay */}
                    <div className="rr2-art-status" style={{background:meta.bg,color:meta.color,border:`1px solid ${meta.ring}`}}>
                      <span style={{width:6,height:6,borderRadius:"50%",background:meta.color,display:"inline-block",flexShrink:0}}/>
                      {meta.label}
                    </div>
                    {/* Room code */}
                    <div className="rr2-art-code" style={{background:col}}>{room.name}</div>
                    {!ok && <div className="rr2-art-dim"/>}
                  </div>

                  {/* Info */}
                  <div className="rr2-card-info">
                    <div className="rr2-card-row">
                      <span className="rr2-card-type">{room.type}</span>
                      <span className="rr2-card-floor">{room.floor}</span>
                    </div>
                    <div className="rr2-card-seats">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" opacity=".4"><path d="M20 7H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM4 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H4z"/></svg>
                      <b style={{color:"#0f172a"}}>{free}</b>/{room.capacity} bo'sh
                    </div>
                    <div className="rr2-bar">
                      <div className="rr2-bar-fill" style={{width:`${pct}%`,background:meta.color}}/>
                    </div>
                    <div className="rr2-feats">
                      {room.features.slice(0,3).map(f=><span key={f} className="rr2-feat">{f}</span>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — filters + stats */}
        <aside className="rr2-side">
          <div className="rr2-side-section">
            <p className="rr2-side-label">Filtrlar</p>
            <div className="rr2-side-filters">
              <div className="rr2-field">
                <label>Qavat</label>
                <select value={filterFloor} onChange={e=>setFilterFloor(e.target.value)}>
                  <option>Barchasi</option><option>1-qavat</option><option>2-qavat</option>
                </select>
              </div>
              <div className="rr2-field">
                <label>Sig'im</label>
                <select value={filterCap} onChange={e=>setFilterCap(e.target.value)}>
                  <option>Barchasi</option>
                  <option value="4">4+ o'rin</option>
                  <option value="6">6+ o'rin</option>
                  <option value="8">8+ o'rin</option>
                  <option value="10">10+ o'rin</option>
                </select>
              </div>
              <div className="rr2-field">
                <label>Zal turi</label>
                <select value={filterType} onChange={e=>setFilterType(e.target.value)}>
                  <option>Barchasi</option><option>Individual</option><option>Guruh</option><option>Konferens</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rr2-side-divider"/>

          <div className="rr2-side-section">
            <p className="rr2-side-label">Bugungi foydalanish</p>
            <Spark/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              <span style={{fontSize:9.5,color:"#94a3b8"}}>08:00</span>
              <span style={{fontSize:9.5,color:"#94a3b8"}}>14:00</span>
              <span style={{fontSize:9.5,color:"#94a3b8"}}>20:00</span>
            </div>
            <div style={{marginTop:10,display:"flex",alignItems:"baseline",gap:4}}>
              <span style={{fontSize:26,fontWeight:900,color:"#6366f1"}}>68%</span>
              <span style={{fontSize:11,color:"#94a3b8"}}>kun davomida o'rtacha</span>
            </div>
          </div>

          <div className="rr2-side-divider"/>

          <div className="rr2-side-section">
            <p className="rr2-side-label">Holat</p>
            <div className="rr2-status-list">
              {(Object.entries(STATUS_META) as [RoomStatus,typeof STATUS_META[RoomStatus]][]).map(([k,v])=>{
                const count = ROOMS.filter(r=>r.status===k).length;
                return (
                  <div key={k} className="rr2-status-row" onClick={()=>setFilterStatus(filterStatus===k?"all":k)}
                    style={{cursor:"pointer",opacity:filterStatus!=="all"&&filterStatus!==k?.5:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:10,height:10,borderRadius:3,background:v.color,display:"block",flexShrink:0}}/>
                      <span style={{fontSize:12,color:"#334155",fontWeight:500}}>{v.label}</span>
                    </div>
                    <span style={{fontSize:13,fontWeight:800,color:v.color}}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rr2-side-divider"/>

          <button className="rr2-cta" onClick={()=>{
            const first = filtered.find(r=>r.status==="available");
            if(first) openRoom(first);
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Zal bron qilish
          </button>
          <p className="rr2-help">
            Savol bormi? <a href="#">Bog'laning</a>
          </p>
        </aside>
      </div>

      {/* ── BOOKING MODAL ──────────────────────────── */}
      {selected && (
        <>
          <div className="rr2-backdrop" onClick={()=>setSelected(null)}/>
          <div className="rr2-modal">
            <button className="rr2-modal-x" onClick={()=>setSelected(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* Art header */}
            <div className="rr2-modal-art" style={{background:roomColor(selected)+"18"}}>
              {ROOM_PATTERNS[patternIndex(selected)](roomColor(selected))}
              <div className="rr2-modal-art-info">
                <span className="rr2-modal-code" style={{background:roomColor(selected)}}>{selected.name}</span>
                <div>
                  <div style={{fontWeight:800,fontSize:18,color:"#fff",textShadow:"0 1px 8px #0006"}}>{selected.type} xonasi</div>
                  <div style={{fontSize:12,color:"#ffffffcc",marginTop:2}}>{selected.floor} · {selected.capacity} o'rin</div>
                </div>
              </div>
            </div>

            <div className="rr2-modal-body">
              {/* Feature chips */}
              <div className="rr2-modal-feats">
                {selected.features.map(f=><span key={f} className="rr2-feat">{f}</span>)}
                <span className="rr2-feat">{selected.capacity-selected.occupied}/{selected.capacity} bo'sh</span>
              </div>

              {!success ? (
                <form onSubmit={handleBook}>
                  <p className="rr2-modal-section">Vaqtni tanlang</p>
                  <div className="rr2-form-grid">
                    <div className="rr2-field">
                      <label>Sana</label>
                      <input type="date" value={form.date} min={new Date().toISOString().slice(0,10)}
                        onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
                    </div>
                    <div className="rr2-field">
                      <label>Boshlanish</label>
                      <select value={form.start} onChange={e=>setForm(f=>({...f,start:e.target.value}))}>
                        {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="rr2-field">
                      <label>Tugash</label>
                      <select value={form.end} onChange={e=>setForm(f=>({...f,end:e.target.value}))}>
                        {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="rr2-summary">
                    {([["Zal",selected.name],["Qavat",selected.floor],["Sana",form.date],["Vaqt",`${form.start}–${form.end}`],...(user?[["Foydalanuvchi",user.full_name]]:[])] as [string,string][]).map(([k,v])=>(
                      <div key={k} className="rr2-summary-row"><span>{k}</span><b>{v}</b></div>
                    ))}
                  </div>

                  <div className="rr2-modal-actions">
                    <button type="button" className="rr2-ghost" onClick={()=>setSelected(null)}>Bekor</button>
                    <button type="submit" className="rr2-submit" disabled={step===2}>
                      {step===2 ? "Saqlanmoqda…" : "Bronni tasdiqlash"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rr2-success">
                  <div className="rr2-success-ring">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3>Bron tasdiqlandi!</h3>
                  <p>{selected.name} · {form.date} · {form.start}–{form.end}</p>
                  <div className="rr2-qr">
                    <svg width="80" height="80" viewBox="0 0 88 88">
                      <rect width="88" height="88" fill="#fff" rx="6"/>
                      <rect x="8" y="8" width="24" height="24" rx="3" fill="#1e293b"/>
                      <rect x="12" y="12" width="16" height="16" rx="1" fill="#fff"/>
                      <rect x="15" y="15" width="10" height="10" fill="#1e293b"/>
                      <rect x="56" y="8" width="24" height="24" rx="3" fill="#1e293b"/>
                      <rect x="60" y="12" width="16" height="16" rx="1" fill="#fff"/>
                      <rect x="63" y="15" width="10" height="10" fill="#1e293b"/>
                      <rect x="8" y="56" width="24" height="24" rx="3" fill="#1e293b"/>
                      <rect x="12" y="60" width="16" height="16" rx="1" fill="#fff"/>
                      <rect x="15" y="63" width="10" height="10" fill="#1e293b"/>
                      {[40,52,64,76,40,54,66,76].map((x,i)=><rect key={i} x={x} y={38+i*5} width={i%3===0?10:6} height={4} rx={1} fill="#1e293b"/>)}
                    </svg>
                    <p>Kirish uchun skanerlang</p>
                    <code>#{Date.now().toString().slice(-7)}</code>
                  </div>
                  <div className="rr2-modal-actions">
                    <button className="rr2-ghost" onClick={()=>setSelected(null)}>Yopish</button>
                    <button className="rr2-submit" onClick={()=>{setSuccess(false);setStep(1);}}>Yangi bron</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── FLOOR MAP MODAL ─────────────────────────── */}
      {floorMap && (
        <>
          <div className="rr2-backdrop" onClick={()=>setFloorMap(false)}/>
          <div className="rr2-modal" style={{maxWidth:540}}>
            <button className="rr2-modal-x" onClick={()=>setFloorMap(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="rr2-modal-body">
              <h3 style={{fontWeight:800,fontSize:16,marginBottom:14,color:"#0f172a"}}>Qavatlar rejasi</h3>
              <FloorMapSVG onPick={openById}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:12}}>
                {(Object.entries(STATUS_META) as [RoomStatus,typeof STATUS_META[RoomStatus]][]).map(([,v])=>(
                  <span key={v.label} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#64748b"}}>
                    <span style={{width:8,height:8,borderRadius:2,background:v.color,display:"block"}}/>{v.label}
                  </span>
                ))}
              </div>
              <p style={{fontSize:11,color:"#94a3b8",marginTop:8}}>Xona raqamiga bosib to'g'ridan-to'g'ri bron qilishingiz mumkin</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
