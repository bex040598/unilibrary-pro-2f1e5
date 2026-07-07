import { useState } from "react";

/* ════════════════════════════════════════════════
   ICON — minimal SVG set
════════════════════════════════════════════════ */
const P: Record<string, string> = {
  flame:  "M12 2c0 6-7 8-7 14a7 7 0 0 0 14 0c0-4-2-6-3-8-1 2-2 3-2 5a3 3 0 0 1-6 0c0-4 4-6 4-11z",
  book:   "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  check:  "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  quote:  "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  pack:   "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  qr:     "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  bar:    "M18 20V10M12 20V4M6 20v-6",
  star:   "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  copy:   "M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2M10 4h4M10 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1",
  arrow:  "M5 12h14M12 5l7 7-7 7",
  plus:   "M12 5v14M5 12h14",
  print:  "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
  mic:    "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  send:   "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  refresh:"M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
};
function I({ n, s = 16, c = "currentColor" }: { n: string; s?: number; c?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={P[n] ?? P.book}/>
    </svg>
  );
}

/* ── Shared card shell ── */
function Card({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="sf-card" style={{"--sf-accent": accent} as React.CSSProperties}>
      {children}
    </div>
  );
}
function CardHead({ eyebrow, title, icon, accent }: { eyebrow: string; title: string; icon: string; accent: string }) {
  return (
    <div className="sf-card-head">
      <div className="sf-card-icon" style={{background: accent + "18", color: accent}}>
        <I n={icon} s={17} c={accent}/>
      </div>
      <div>
        <p className="sf-eyebrow">{eyebrow}</p>
        <h3 className="sf-title">{title}</h3>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   1. READING STREAK — student
════════════════════════════════════ */
export function ReadingStreakCard() {
  const streak = 7;
  const goal   = 14;
  const DAYS   = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];
  const MILESTONES = [
    { days: 7,  icon: "🔥", label: "Hafta yugurdagi", done: true  },
    { days: 14, icon: "📚", label: "Ikki hafta",      done: false },
    { days: 30, icon: "⭐", label: "Oy chempioni",    done: false },
  ];
  return (
    <Card accent="#f97316">
      <CardHead eyebrow="KUNLIK STREAK" title="O'qish seriyasi" icon="flame" accent="#f97316"/>
      <div className="sf-streak-big">
        <span className="sf-streak-n">{streak}</span>
        <div className="sf-streak-side">
          <span className="sf-streak-unit">kun</span>
          <span className="sf-streak-sub">Maqsad: {goal} kun</span>
        </div>
      </div>
      <div className="sf-progress-bar-wrap">
        <div className="sf-progress-bar" style={{width:`${(streak/goal)*100}%`, background:"#f97316"}}/>
      </div>
      <div className="sf-streak-week">
        {DAYS.map((d, i) => (
          <div key={i} className="sf-day">
            <div className={`sf-day-ring${i < streak ? " sf-day-ring-on" : ""}`} style={i<streak?{borderColor:"#f97316",background:"#fff7ed"}:{}}>
              {i < streak && <I n="flame" s={11} c="#f97316"/>}
            </div>
            <span className="sf-day-lbl">{d}</span>
          </div>
        ))}
      </div>
      <div className="sf-milestones">
        {MILESTONES.map((m, i) => (
          <div key={i} className={`sf-milestone${m.done ? " sf-milestone-done" : ""}`}>
            <span className="sf-milestone-icon">{m.icon}</span>
            <div className="sf-milestone-info">
              <span className="sf-milestone-label">{m.label}</span>
              <span className="sf-milestone-days">{m.days} kun</span>
            </div>
            {m.done && <I n="check" s={13} c="#15803d"/>}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   2. BOOK RECOMMENDATIONS — student
════════════════════════════════════ */
export function RecommendationsCard() {
  const RECS = [
    { title: "Algoritm va ma'lumotlar tuzilmasi", author: "T. Cormen",   match: 97, type: "Majburiy",   color: "#002147", bg:"#e8edf5" },
    { title: "Veb dasturlash asoslari",            author: "B. Flanagan", match: 91, type: "Tavsiya",    color: "#0891b2", bg:"#e0f2fe" },
    { title: "Sun'iy intellektga kirish",          author: "S. Russell",  match: 85, type: "Qo'shimcha", color: "#7c3aed", bg:"#ede9fe" },
    { title: "Python bilan ma'lumotlar tahlili",   author: "W. McKinney", match: 78, type: "Qo'shimcha", color: "#7c3aed", bg:"#ede9fe" },
  ];
  return (
    <Card accent="#059669">
      <CardHead eyebrow="KURSGA MOS TAVSIYALAR" title="Tavsiya etilgan kitoblar" icon="target" accent="#059669"/>
      <div className="sf-rec-list">
        {RECS.map((r, i) => (
          <div key={i} className="sf-rec-row">
            <div className="sf-rec-rank">{i+1}</div>
            <div className="sf-rec-cover" style={{background: r.bg, color: r.color}}>
              {r.title[0]}
            </div>
            <div className="sf-rec-info">
              <span className="sf-rec-title">{r.title}</span>
              <span className="sf-rec-author">{r.author}</span>
            </div>
            <div className="sf-rec-right">
              <div className="sf-rec-score" style={{color: r.color}}>
                <span className="sf-rec-pct">{r.match}%</span>
              </div>
              <span className="sf-rec-type" style={{background: r.bg, color: r.color}}>{r.type}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   3. CITATION GENERATOR — student + teacher
════════════════════════════════════ */
export function CitationCard() {
  const [format, setFormat] = useState<"APA"|"MLA"|"GOST">("APA");
  const [bookIdx, setBookIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const BOOKS = [
    { title: "Ma'lumotlar bazasi: amaliy qo'llanma", author: "Yuldasheva A.", year: 2022, publisher: "ATMU nashriyoti", place: "Nukus"    },
    { title: "Python dasturlash tili",                author: "Ergashev N.",   year: 2023, publisher: "Fan",             place: "Toshkent" },
    { title: "Kiberxavfsizlik asoslari",              author: "Qodirov J.",    year: 2021, publisher: "ATMU",            place: "Nukus"    },
    { title: "Algoritm va ma'lumotlar tuzilmasi",     author: "Cormen T.",     year: 2020, publisher: "MIT Press",       place: "Boston"   },
  ];
  const b = BOOKS[bookIdx];
  const cites: Record<"APA"|"MLA"|"GOST", string> = {
    APA:  `${b.author} (${b.year}). ${b.title}. ${b.place}: ${b.publisher}.`,
    MLA:  `${b.author}. "${b.title}." ${b.publisher}, ${b.year}.`,
    GOST: `${b.author} ${b.title} / ${b.author}. -- ${b.place}: ${b.publisher}, ${b.year}. -- 348 b.`,
  };
  const handleCopy = () => {
    navigator.clipboard?.writeText(cites[format]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Card accent="#0891b2">
      <CardHead eyebrow="IQTIBOS FORMATLASH" title="Adabiyotlar ro'yxati" icon="quote" accent="#0891b2"/>
      <div className="sf-cite-body">
        <select className="sf-input" value={bookIdx} onChange={e => setBookIdx(+e.target.value)}>
          {BOOKS.map((bk, i) => <option key={i} value={i}>{bk.title}</option>)}
        </select>
        <div className="sf-format-row">
          {(["APA","MLA","GOST"] as const).map(f => (
            <button key={f} type="button"
              className={`sf-fmt-btn${format===f?" sf-fmt-on":""}`}
              style={format===f?{background:"#0891b2",borderColor:"#0891b2"}:{}}
              onClick={() => setFormat(f)}>{f}</button>
          ))}
        </div>
        <div className="sf-cite-out">
          <p className="sf-cite-text">{cites[format]}</p>
        </div>
        <button type="button" className="sf-action-btn" style={{background:"#0891b2"}} onClick={handleCopy}>
          <I n="copy" s={14} c="#fff"/>
          {copied ? "Nusxalandi!" : "Nusxalash"}
        </button>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   4. PLAGIARISM PRE-CHECK — student
════════════════════════════════════ */
export function PlagiarismCard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{pct:number; verdict:string; sources:{src:string;pct:number}[]} | null>(null);
  const [checking, setChecking] = useState(false);
  const handleCheck = () => {
    if (!text.trim()) return;
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setResult({
        pct: 12,
        verdict: "Maqbul",
        sources: [
          { src: "Yuldasheva A. — Ma'lumotlar bazasi (2022)", pct: 7 },
          { src: "Ergashev N. — Python (2023)",               pct: 3 },
          { src: "Internet manbalar",                          pct: 2 },
        ],
      });
    }, 1800);
  };
  const pct = result?.pct ?? 0;
  const safe = pct < 20;
  return (
    <Card accent="#7c3aed">
      <CardHead eyebrow="MATN TAHLILI" title="Plagiat tekshiruvi" icon="shield" accent="#7c3aed"/>
      <div className="sf-plag-body">
        <textarea className="sf-textarea"
          placeholder="Kurs ishi matnini shu yerga joylashtiring. Tizim kutubxona manbalari bilan solishtiradi..."
          value={text} onChange={e => setText(e.target.value)} rows={3}/>
        <button type="button" className="sf-action-btn" style={{background:"#7c3aed"}}
          onClick={handleCheck} disabled={checking || !text.trim()}>
          {checking
            ? <><span className="sf-spinner"/>Tekshirilmoqda...</>
            : <><I n="search" s={14} c="#fff"/>Tekshirish</>}
        </button>
        {result && (
          <div className="sf-plag-result">
            <div className="sf-plag-gauge">
              <svg viewBox="0 0 100 60" width="120" height="72">
                <path d="M10 55 A45 45 0 0 1 90 55" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round"/>
                <path d="M10 55 A45 45 0 0 1 90 55" fill="none"
                  stroke={safe?"#16a34a":"#dc2626"} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(pct/100)*141.3} 141.3`}/>
                <text x="50" y="52" textAnchor="middle" fontSize="18" fontWeight="800" fill={safe?"#16a34a":"#dc2626"}>{pct}%</text>
              </svg>
              <div className="sf-plag-verdict" style={{color: safe?"#16a34a":"#dc2626"}}>
                {safe ? "Maqbul" : "Yuqori"}
              </div>
            </div>
            <div className="sf-plag-sources">
              {result.sources.map((s, i) => (
                <div key={i} className="sf-plag-src">
                  <span className="sf-plag-src-name">{s.src}</span>
                  <div className="sf-plag-src-bar">
                    <div style={{width:`${s.pct*8}%`, background:"#f59e0b", height:"100%", borderRadius:2}}/>
                  </div>
                  <span className="sf-plag-src-pct">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   5. COURSE PACK MANAGER — teacher
════════════════════════════════════ */
export function CoursePackCard() {
  const PACKS = [
    { name: "Ma'lumotlar bazasi — 3-kurs",    items: 7, students: 42, views: 187, pct: 92, color: "#002147" },
    { name: "Kiberxavfsizlik — Magistratura",  items: 5, students: 18, views: 94,  pct: 68, color: "#0891b2" },
    { name: "Python asoslari — 2-kurs",        items: 9, students: 65, views: 312, pct: 45, color: "#059669" },
  ];
  return (
    <Card accent="#d97706">
      <div className="sf-card-head" style={{justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div className="sf-card-icon" style={{background:"#fef3c718",color:"#d97706"}}>
            <I n="pack" s={17} c="#d97706"/>
          </div>
          <div>
            <p className="sf-eyebrow">KURS MATERIALLARI</p>
            <h3 className="sf-title">Resurs to'plamlari</h3>
          </div>
        </div>
        <button type="button" className="sf-action-btn sf-action-sm" style={{background:"#002147"}}>
          <I n="plus" s={13} c="#fff"/> Yangi
        </button>
      </div>
      <div className="sf-pack-list">
        {PACKS.map((p, i) => (
          <div key={i} className="sf-pack-item">
            <div className="sf-pack-bar-col">
              <div className="sf-pack-color-bar" style={{background:p.color, height:`${p.pct}%`}}/>
            </div>
            <div className="sf-pack-body">
              <div className="sf-pack-top">
                <span className="sf-pack-name">{p.name}</span>
                <span className="sf-pack-views">{p.views.toLocaleString()} ko'rish</span>
              </div>
              <div className="sf-pack-meta">
                <span>{p.items} ta material</span>
                <span className="sf-pack-sep">·</span>
                <span>{p.students} ta talaba</span>
                <span className="sf-pack-sep">·</span>
                <span style={{color:p.color, fontWeight:700}}>{p.pct}% faollik</span>
              </div>
            </div>
            <button type="button" className="sf-pack-arrow"><I n="arrow" s={14} c="#94a3b8"/></button>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   6. QR SHELF NAVIGATOR — librarian
════════════════════════════════════ */
export function QRShelfCard() {
  const [shelf, setShelf] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const SHELVES = [
    { id:"A-14", books:28, scans:47, topic:"Informatika"  },
    { id:"B-03", books:34, scans:31, topic:"Iqtisodiyot"  },
    { id:"C-07", books:19, scans:22, topic:"Matematika"   },
    { id:"D-11", books:41, scans:63, topic:"Tilshunoslik" },
  ];
  return (
    <Card accent="#002147">
      <CardHead eyebrow="JAVON NAVIGATSIYASI" title="QR-kod boshqaruvi" icon="qr" accent="#002147"/>
      <div className="sf-qr-body">
        <div className="sf-qr-input-row">
          <input className="sf-input sf-qr-inp"
            placeholder="Javon raqami: A-14"
            value={shelf} onChange={e => { setShelf(e.target.value); setGenerated(null); }}
            onKeyDown={e => e.key==="Enter" && shelf.trim() && setGenerated(shelf.trim())}/>
          <button type="button" className="sf-action-btn sf-action-sm" style={{background:"#002147"}}
            onClick={() => shelf.trim() && setGenerated(shelf.trim())}>
            <I n="qr" s={14} c="#fff"/> Yaratish
          </button>
        </div>
        {generated && (
          <div className="sf-qr-result">
            <svg width={88} height={88} viewBox="0 0 88 88" className="sf-qr-svg">
              {[0,1,2,3,4,5,6,7,8].flatMap(r => [0,1,2,3,4,5,6,7,8].map(c => {
                const on = ((r*8+c+(r*c+r+c))%4 !== 0);
                return on ? <rect key={`${r}-${c}`} x={c*10+1} y={r*10+1} width={8} height={8} rx={1.5} fill="#002147"/> : null;
              }))}
              <rect x={1} y={1} width={28} height={28} rx={3} fill="none" stroke="#002147" strokeWidth={2.5}/>
              <rect x={7} y={7} width={16} height={16} rx={2} fill="#002147"/>
              <rect x={59} y={1} width={28} height={28} rx={3} fill="none" stroke="#002147" strokeWidth={2.5}/>
              <rect x={65} y={7} width={16} height={16} rx={2} fill="#002147"/>
              <rect x={1} y={59} width={28} height={28} rx={3} fill="none" stroke="#002147" strokeWidth={2.5}/>
              <rect x={7} y={65} width={16} height={16} rx={2} fill="#002147"/>
            </svg>
            <div className="sf-qr-info">
              <div className="sf-qr-shelf-tag">{generated}</div>
              <p className="sf-qr-desc">Telefon kamerasi bilan skanerlang — javondagi kitoblar, ularning holati va bron qilish imkoniyati darhol ko'rinadi.</p>
              <button type="button" className="sf-ghost-btn"><I n="print" s={13} c="#002147"/> Chop etish</button>
            </div>
          </div>
        )}
        <div className="sf-shelf-table">
          <div className="sf-shelf-table-head">
            <span>Javon</span><span>Mavzu</span><span>Kitob</span><span>Skan</span>
          </div>
          {SHELVES.map((s, i) => (
            <div key={i} className="sf-shelf-row" onClick={() => { setShelf(s.id); setGenerated(null); }}>
              <span className="sf-shelf-id">{s.id}</span>
              <span className="sf-shelf-topic">{s.topic}</span>
              <span className="sf-shelf-books">{s.books}</span>
              <span className="sf-shelf-scans" style={{color:"#002147", fontWeight:700}}>{s.scans}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   7. AI NATURAL SEARCH — librarian + admin
════════════════════════════════════ */
export function AISearchCard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{title:string;author:string;year:number;type:string;dept:string}[]>([]);
  const [searching, setSearching] = useState(false);
  const SUGGESTIONS = ["dissertatsiya 2023", "fizika darsligi", "kiberxavfsizlik magistr"];
  const handleSearch = (q = query) => {
    if (!q.trim()) return;
    setQuery(q);
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setResults([
        { title:"Ma'lumotlar bazasini loyihalash", author:"C. J. Date",      year:2019, type:"Darslik",   dept:"Informatika" },
        { title:"SQL: to'liq qo'llanma",           author:"Ben Forta",       year:2020, type:"Qo'llanma", dept:"Informatika" },
        { title:"NoSQL ma'lumotlar bazalari",       author:"P. Sadalage",     year:2021, type:"Darslik",   dept:"Informatika" },
      ]);
    }, 1200);
  };
  return (
    <Card accent="#4f46e5">
      <CardHead eyebrow="QIDIRUV TIZIMI" title="Semantik qidiruv" icon="search" accent="#4f46e5"/>
      <div className="sf-ai-body">
        <div className="sf-ai-row">
          <input className="sf-input sf-ai-inp"
            placeholder="Masalan: 2020-yildan keyin ma'lumotlar bazasi bo'yicha darsliklar..."
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key==="Enter" && handleSearch()}/>
          <button type="button" className="sf-action-btn sf-action-sm" style={{background:"#4f46e5"}}
            onClick={() => handleSearch()} disabled={searching}>
            {searching ? <span className="sf-spinner"/> : <I n="search" s={14} c="#fff"/>}
            {searching ? "Izlanmoqda" : "Izlash"}
          </button>
        </div>
        {!results.length && (
          <div className="sf-ai-suggestions">
            <span className="sf-eyebrow" style={{marginBottom:6}}>Tezkor qidiruv</span>
            <div className="sf-suggestion-row">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} type="button" className="sf-suggestion-chip" onClick={() => handleSearch(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {results.length > 0 && (
          <div className="sf-ai-results">
            {results.map((r, i) => (
              <div key={i} className="sf-ai-row-result">
                <div className="sf-ai-result-num">{i+1}</div>
                <div className="sf-ai-result-info">
                  <span className="sf-rec-title">{r.title}</span>
                  <span className="sf-rec-author">{r.author} · {r.year} · {r.dept}</span>
                </div>
                <span className="sf-type-chip">{r.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   8. FEATURE STATS — admin
════════════════════════════════════ */
export function FeatureStatsCard() {
  const STATS = [
    { icon:"target", label:"Kitob tavsiyalar",   uses:2184, growth:42, color:"#34d399", spark:[1100,1450,1750,1980,2184] },
    { icon:"search", label:"AI qidiruv",         uses:1247, growth:34, color:"#818cf8", spark:[800,950,1050,1180,1247]   },
    { icon:"quote",  label:"Iqtibos formatlash", uses:892,  growth:18, color:"#38bdf8", spark:[580,670,750,830,892]      },
    { icon:"flame",  label:"O'qish seriyasi",    uses:678,  growth:53, color:"#fb923c", spark:[280,380,490,590,678]      },
    { icon:"shield", label:"Plagiat tekshiruvi", uses:437,  growth:61, color:"#c084fc", spark:[170,240,320,390,437]      },
    { icon:"qr",     label:"QR navigatsiya",     uses:341,  growth:89, color:"#f87171", spark:[90,145,210,275,341]       },
    { icon:"pack",   label:"Kurs materiallari",  uses:156,  growth:28, color:"#fbbf24", spark:[75,100,118,138,156]       },
  ];
  const total = STATS.reduce((s,x) => s+x.uses, 0);
  const maxUses = STATS[0].uses;
  const topGrower = [...STATS].sort((a,b)=>b.growth-a.growth)[0];

  function Spark({ vals, color }: { vals: number[]; color: string }) {
    const W=44, H=20, mx=Math.max(...vals), mn=Math.min(...vals), range=mx-mn||1;
    const pts = vals.map((v,i)=>`${i*(W/(vals.length-1))},${H-((v-mn)/range)*H}`).join(" ");
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{flexShrink:0,overflow:"visible"}}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" opacity=".9"/>
        <circle cx={W} cy={H-((vals[vals.length-1]-mn)/range)*H} r="2.5" fill={color}/>
      </svg>
    );
  }

  return (
    <div className="fsc-root">
      <div className="fsc-header">
        <div className="fsc-header-left">
          <span className="fsc-live-dot"/>
          <span className="fsc-eyebrow">FAOLIYAT TAHLILI</span>
        </div>
        <div className="fsc-header-right">
          <span className="fsc-total-n">{total.toLocaleString()}</span>
          <span className="fsc-total-l">jami sessiya</span>
        </div>
      </div>
      <div className="fsc-river">
        {STATS.map((s,i) => (
          <div key={i} className="fsc-river-seg" title={`${s.label}: ${s.uses}`}
            style={{flex:s.uses, background:s.color, opacity:.85}}/>
        ))}
      </div>
      <div className="fsc-board">
        <div className="fsc-board-header">
          <span className="fsc-col-rank">#</span>
          <span className="fsc-col-name">Funksiya</span>
          <span className="fsc-col-bar">Foydalanish</span>
          <span className="fsc-col-spark">Trend</span>
          <span className="fsc-col-n">Sessiya</span>
          <span className="fsc-col-g">O'sish</span>
        </div>
        {STATS.map((s,i) => {
          const pct = (s.uses / maxUses) * 100;
          return (
            <div key={i} className="fsc-row" style={{"--fsc-color": s.color} as React.CSSProperties}>
              <span className="fsc-col-rank">
                {i === 0
                  ? <span className="fsc-crown">①</span>
                  : <span className="fsc-rank-n">{i+1}</span>
                }
              </span>
              <span className="fsc-col-name">
                <span className="fsc-icon-dot" style={{background: s.color + "22", color: s.color}}>
                  <I n={s.icon} s={12} c={s.color}/>
                </span>
                <span className="fsc-name-text">{s.label}</span>
              </span>
              <span className="fsc-col-bar">
                <span className="fsc-bar-track">
                  <span className="fsc-bar-fill" style={{width:`${pct}%`, background: s.color}}/>
                </span>
              </span>
              <span className="fsc-col-spark">
                <Spark vals={s.spark} color={s.color}/>
              </span>
              <span className="fsc-col-n">{s.uses.toLocaleString()}</span>
              <span className="fsc-col-g" style={{color: s.growth > 50 ? "#4ade80" : s.growth > 30 ? "#a3e635" : "#facc15"}}>
                +{s.growth}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="fsc-footer">
        <span className="fsc-trophy">↑</span>
        <span className="fsc-footer-text">
          Eng tez o'suvchi: <strong style={{color: topGrower.color}}>{topGrower.label}</strong>
          <span className="fsc-footer-pct"> +{topGrower.growth}% bu hafta</span>
        </span>
        <span className="fsc-footer-period">So'nggi 30 kun</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   YANGI 8 TA AI FUNKSIYA
════════════════════════════════════════════════════ */

/* 1. AI YORDAMCHI — Student + Teacher */
export function AICompanionCard() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const CHIPS = ["Bu kitobni qisqacha tushuntir", "O'xshash kitoblar tavsiya qil", "Asosiy g'oyalar nima?"];

  function ask(q: string) {
    if (!q.trim()) return;
    setLoading(true); setAnswer(null);
    setTimeout(() => {
      setAnswer(`"${q}" so'rovi bo'yicha kutubxona bazasida 14 ta tegishli manba topildi. Eng mos: Karimov A. "Axborot tizimlari nazariyasi" (2021) — so'rovingizga 94% mos keladi. Shuningdek 3 ta elektron resurs va 2 ta dissertatsiya mavjud.`);
      setLoading(false);
    }, 1400);
  }

  return (
    <Card accent="#6366f1">
      <CardHead eyebrow="SHAXSIY YORDAMCHI" title="AI o'qish hamrohi" icon="send" accent="#6366f1"/>
      <div className="sf-ai-body">
        <div className="sf-ai-row">
          <input className="sf-input sf-ai-inp" placeholder="Kitob yoki savol yozing..."
            value={query} onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") ask(query); }}/>
          <button type="button" className="sf-action-btn sf-action-sm" style={{background:"#6366f1"}}
            onClick={()=>ask(query)} disabled={loading}>
            {loading ? <span className="sf-spinner"/> : <I n="send" s={13} c="#fff"/>}
          </button>
        </div>
        <div className="sf-suggestion-row">
          {CHIPS.map((c,i)=>(
            <button key={i} type="button" className="sf-suggestion-chip"
              onClick={()=>{ setQuery(c); ask(c); }}>
              {c}
            </button>
          ))}
        </div>
        {answer && (
          <div className="sf-ai-answer">
            <div className="sf-ai-answer-dot"/>
            <p className="sf-ai-answer-text">{answer}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* 2. O'QISH JADVALI — Student */
export function ReadingPlannerCard() {
  const DAYS = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];
  const [done, setDone] = useState([true,true,true,false,false,false,false]);
  const PLAN_INIT = [
    {day:"Dushanba",    task:"1-3 bob",  book:"Python dasturlash",   done:true},
    {day:"Seshanba",    task:"4-6 bob",  book:"Python dasturlash",   done:true},
    {day:"Chorshanba",  task:"7-9 bob",  book:"Python dasturlash",   done:true},
    {day:"Payshanba",   task:"1-2 bob",  book:"Ma'lumotlar bazasi",  done:false},
    {day:"Juma",        task:"3-4 bob",  book:"Ma'lumotlar bazasi",  done:false},
  ];
  const [plan, setPlan] = useState(PLAN_INIT);
  const pct = Math.round((done.filter(Boolean).length/7)*100);

  function toggleDay(i: number) {
    setDone(prev => { const n=[...prev]; n[i]=!n[i]; return n; });
  }
  function toggleTask(i: number) {
    setPlan(prev => prev.map((p,idx) => idx===i ? {...p, done:!p.done} : p));
  }

  return (
    <Card accent="#0891b2">
      <CardHead eyebrow="SHAXSIY JADVAL" title="O'qish rejasi" icon="book" accent="#0891b2"/>
      <div className="sfp-week">
        {DAYS.map((d,i)=>(
          <div key={i} className="sfp-day-col">
            <button type="button"
              className={`sfp-ring ${done[i]?"sfp-ring-done":i===3?"sfp-ring-today":""}`}
              onClick={()=>toggleDay(i)}
              style={{cursor:"pointer",border:"none",padding:0}}>
              {done[i] ? <I n="check" s={11} c="#fff"/> : <span className="sfp-day-n">{i+1}</span>}
            </button>
            <span className="sfp-day-lbl">{d}</span>
          </div>
        ))}
      </div>
      <div className="sfp-progress-row">
        <span className="sfp-pct-label">Haftalik: {pct}%</span>
        <div className="sf-progress-bar-wrap" style={{flex:1}}>
          <div className="sf-progress-bar" style={{width:`${pct}%`, background:"#0891b2"}}/>
        </div>
      </div>
      <div className="sfp-plan-list">
        {plan.map((p,i)=>(
          <div key={i} className={`sfp-plan-row ${p.done?"sfp-plan-done":i===3?"sfp-plan-today":""}`}
            onClick={()=>toggleTask(i)} style={{cursor:"pointer"}}>
            <div className="sfp-plan-check">
              {p.done ? <I n="check" s={11} c="#0891b2"/> : <span/>}
            </div>
            <div className="sfp-plan-body">
              <span className="sfp-plan-task">{p.task}</span>
              <span className="sfp-plan-book">{p.book}</span>
            </div>
            {i===3 && !p.done && <span className="sfp-today-badge">Bugun</span>}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* 3. TADQIQOT BO'SHLIG'I TAHLILI — Student + Teacher */
export function ResearchGapCard() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<null|{gaps:{label:string;level:number;color:string;tag:string}[]}>(null);
  const [loading, setLoading] = useState(false);

  function analyze() {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult({gaps:[
        {label:`${topic} va sun'iy intellekt`,       level:12, color:"#dc2626", tag:"Kam tadqiq"},
        {label:`${topic}: zamonaviy yondashuvlar`,   level:38, color:"#d97706", tag:"O'rta"},
        {label:`${topic} nazariy asoslari`,          level:74, color:"#059669", tag:"O'rganilgan"},
        {label:`${topic} amaliy tatbiq`,             level:21, color:"#dc2626", tag:"Kam tadqiq"},
        {label:`${topic} va qo'shni fanlar`,         level:9,  color:"#7c3aed", tag:"Bo'shliq"},
      ]});
      setLoading(false);
    }, 1600);
  }

  return (
    <Card accent="#7c3aed">
      <CardHead eyebrow="TADQIQOT TAHLILI" title="Bo'shliq izlovchi" icon="layers" accent="#7c3aed"/>
      <div className="sfr-body">
        <div className="sf-ai-row">
          <input className="sf-input sfr-inp" placeholder="Tadqiqot mavzuingizni yozing..."
            value={topic} onChange={e=>setTopic(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") analyze(); }}/>
          <button type="button" className="sf-action-btn sf-action-sm" style={{background:"#7c3aed"}}
            onClick={analyze} disabled={loading}>
            {loading ? <span className="sf-spinner"/> : "Tahlil"}
          </button>
        </div>
        {result && (
          <div className="sfr-results">
            <p className="sfr-hint">Katalogdagi tadqiqot qamrovi ({topic}):</p>
            {result.gaps.map((g,i)=>(
              <div key={i} className="sfr-row">
                <div className="sfr-label-wrap">
                  <span className="sfr-label">{g.label}</span>
                  <span className="sfr-tag" style={{color:g.color, background:g.color+"15"}}>{g.tag}</span>
                </div>
                <div className="sfr-bar-wrap">
                  <div className="sfr-bar-fill-track">
                    <div className="sfr-bar-fill" style={{width:`${g.level}%`, background:g.color}}/>
                  </div>
                  <span className="sfr-pct">{g.level}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

/* 4. OVOZLI QIDIRUV — Student + Librarian */
export function VoiceSearchCard() {
  const [active, setActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const RECENT = [
    "2020-yildan keyin iqtisodiyot bo'yicha kitoblar",
    "Karimov muallifli dissertatsiyalar",
    "Dasturlash bo'yicha o'zbek tili manbalari",
  ];

  function startListen() {
    setActive(true); setTranscript(""); setResults([]);
    setTimeout(()=>{
      const q = "Axborot xavfsizligi bo'yicha inglizcha manbalar";
      setTranscript(q);
      setResults([
        "Information Security Essentials — 2022",
        "Cybersecurity Fundamentals — Anderson",
        "Network Security — Stallings 2021",
      ]);
      setActive(false);
    }, 2200);
  }

  function reset() { setTranscript(""); setResults([]); }

  return (
    <Card accent="#d97706">
      <CardHead eyebrow="OVOZLI QIDIRUV" title="Mikrofon bilan qidirish" icon="mic" accent="#d97706"/>
      <div className="sfv-body">
        <div className="sfv-mic-wrap">
          <button type="button" className={`sfv-mic-btn ${active?"sfv-mic-active":""}`}
            onClick={startListen} disabled={active}>
            <I n="mic" s={26} c="currentColor"/>
          </button>
          {active && <div className="sfv-ripple"/>}
          <p className="sfv-mic-hint">{active ? "Gapiring..." : "Mikrofonga bosing"}</p>
        </div>
        {transcript && (
          <div className="sfv-transcript">
            <span className="sfv-q-icon">"</span>
            <span className="sfv-q-text">{transcript}</span>
          </div>
        )}
        {results.length > 0 && (
          <div className="sfv-results">
            {results.map((r,i)=>(
              <div key={i} className="sfv-result-row">
                <span className="sfv-result-n">{i+1}</span>
                <span className="sfv-result-title">{r}</span>
              </div>
            ))}
            <button type="button" className="sf-ghost-btn" style={{marginTop:4}} onClick={reset}>
              <I n="refresh" s={12} c="#94a3b8"/> Qayta qidirish
            </button>
          </div>
        )}
        {!transcript && (
          <div className="sfv-recent">
            <p className="sfv-recent-label">Oxirgi qidiruvlar</p>
            {RECENT.map((r,i)=>(
              <button key={i} type="button" className="sfv-recent-row"
                onClick={()=>{ setTranscript(r); setResults(["Natija 1 — 2022","Natija 2 — 2021","Natija 3 — 2020"]); }}>
                <I n="search" s={12} c="#94a3b8"/>
                <span>{r}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

/* 5. MATN TARJIMASI — Student */
export function LiveTranslatorCard() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState<{out:string;terms:{en:string;uz:string}[]}|null>(null);
  const [loading, setLoading] = useState(false);
  const EXAMPLE = "Machine learning algorithms require large datasets for training. The backpropagation method adjusts neural network weights iteratively.";

  function translate(src?: string) {
    const src2 = src ?? text;
    if (!src2.trim()) return;
    setText(src2); setLoading(true);
    setTimeout(()=>{
      setTranslated({
        out:"Mashinali o'rganish algoritmlari o'qitish uchun katta ma'lumotlar to'plamlarini talab qiladi. Orqaga tarqalish usuli neyron tarmoq og'irliklarini qayta-qayta sozlaydi.",
        terms:[
          {en:"Machine learning",   uz:"Mashinali o'rganish"},
          {en:"backpropagation",    uz:"orqaga tarqalish"},
          {en:"neural network",     uz:"neyron tarmoq"},
          {en:"datasets",           uz:"ma'lumotlar to'plami"},
        ]
      });
      setLoading(false);
    },1200);
  }

  return (
    <Card accent="#0284c7">
      <CardHead eyebrow="TARJIMA VA ATAMALAR" title="Matn tarjimasi" icon="layers" accent="#0284c7"/>
      <div className="sft-body">
        <textarea className="sf-textarea" rows={3}
          placeholder="Inglizcha matn kiriting..."
          value={text} onChange={e=>setText(e.target.value)}/>
        <div style={{display:"flex",gap:8}}>
          <button type="button" className="sf-action-btn" style={{background:"#0284c7",fontSize:12}}
            onClick={()=>translate()} disabled={loading}>
            {loading ? <span className="sf-spinner"/> : "Tarjima qilish"}
          </button>
          <button type="button" className="sf-ghost-btn" onClick={()=>translate(EXAMPLE)}>
            Namuna
          </button>
        </div>
        {translated && (
          <>
            <div className="sft-out-box">
              <p className="sft-out-text">{translated.out}</p>
            </div>
            <div className="sft-terms">
              <p className="sft-terms-label">Texnik atamalar:</p>
              <div className="sft-terms-grid">
                {translated.terms.map((t,i)=>(
                  <div key={i} className="sft-term-row">
                    <span className="sft-term-en">{t.en}</span>
                    <span className="sft-term-arr">&#x2192;</span>
                    <span className="sft-term-uz">{t.uz}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

/* 6. KOLLEKSIYA TAHLILI — Librarian + Admin */
export function CollectionAnalyticsCard() {
  const SUBJECTS = [
    {name:"Dasturlash",  demand:87, stock:42, color:"#6366f1"},
    {name:"Iqtisodiyot", demand:74, stock:68, color:"#0891b2"},
    {name:"Matematika",  demand:61, stock:58, color:"#059669"},
    {name:"Huquq",       demand:55, stock:23, color:"#dc2626"},
    {name:"Psixologiya", demand:48, stock:41, color:"#d97706"},
    {name:"Tarix",       demand:32, stock:55, color:"#7c3aed"},
  ];
  const [sent, setSent] = useState(false);

  return (
    <Card accent="#059669">
      <CardHead eyebrow="FOND TAHLILI" title="Kolleksiya tahlilchisi" icon="bar" accent="#059669"/>
      <div className="sfca-body">
        <div className="sfca-legend">
          <span className="sfca-leg-item"><span className="sfca-leg-dot" style={{background:"#334155"}}/> Talab</span>
          <span className="sfca-leg-item"><span className="sfca-leg-dot" style={{background:"#cbd5e1"}}/> Mavjud fond</span>
          <span className="sfca-leg-item"><span className="sfca-leg-dot" style={{background:"#fca5a5"}}/> Tanqis</span>
        </div>
        {SUBJECTS.map((s,i)=>{
          const gap = s.demand > s.stock;
          return (
            <div key={i} className="sfca-row">
              <span className="sfca-subject">{s.name}</span>
              <div className="sfca-bars">
                <div className="sfca-bar-bg">
                  <div className="sfca-bar-demand" style={{width:`${s.demand}%`, background: gap?"#fca5a5":"#c7d2fe"}}/>
                </div>
                <div className="sfca-bar-bg">
                  <div className="sfca-bar-stock" style={{width:`${s.stock}%`, background:s.color, opacity:.7}}/>
                </div>
              </div>
              <span className={`sfca-gap-badge ${gap?"sfca-gap-bad":"sfca-gap-ok"}`}>
                {gap ? `-${s.demand-s.stock}` : "OK"}
              </span>
            </div>
          );
        })}
        <button type="button" className="sfca-footer-note" style={{cursor:"pointer",textAlign:"left",border:"none"}}
          onClick={()=>setSent(true)}>
          <I n="shield" s={12} c={sent?"#065f46":"#dc2626"}/>
          {sent
            ? "Xarid tavsiyasi yuborildi — omborga"
            : "2 ta sohada tanqislik aniqlandi — tavsiya yuborish"}
        </button>
      </div>
    </Card>
  );
}

/* 7. QAYTARISH BASHORATI — Librarian + Admin */
export function ReturnPredictionCard() {
  const LOANS_INIT = [
    {name:"S. Mirzayev",  book:"Algoritm asoslari",  days:-2, risk:98, color:"#dc2626", sms:false},
    {name:"N. Hasanova",  book:"Veb dasturlash",      days:1,  risk:84, color:"#ea580c", sms:false},
    {name:"B. Toshmatov", book:"Ma'lumotlar bazasi",  days:3,  risk:61, color:"#d97706", sms:false},
    {name:"Z. Rahimova",  book:"Ingliz tili",         days:5,  risk:32, color:"#ca8a04", sms:false},
    {name:"A. Yusupov",   book:"Matematika I",        days:8,  risk:12, color:"#65a30d", sms:false},
  ];
  const [loans, setLoans] = useState(LOANS_INIT);

  function sendSms(i: number) {
    setLoans(prev => prev.map((l,idx) => idx===i ? {...l, sms:true} : l));
  }

  return (
    <Card accent="#dc2626">
      <CardHead eyebrow="QAYTARISH BASHORATI" title="Kechikish xavfi" icon="shield" accent="#dc2626"/>
      <div className="sfrp-body">
        <div className="sfrp-header-row">
          <span>O'quvchi</span>
          <span>Kitob</span>
          <span>Kun</span>
          <span>Xavf</span>
        </div>
        {loans.map((l,i)=>(
          <div key={i} className="sfrp-row">
            <span className="sfrp-col-name">
              <span className="sfrp-avatar" style={{background:l.color+"22",color:l.color}}>
                {l.name.split(" ").map(x=>x[0]).join("")}
              </span>
              {l.name}
            </span>
            <span className="sfrp-col-book">{l.book}</span>
            <span className="sfrp-col-days" style={{color:l.days<0?"#dc2626":l.days<=3?"#d97706":"#65a30d",fontWeight:700}}>
              {l.days<0 ? `${Math.abs(l.days)} kun o'tdi` : `${l.days} kun`}
            </span>
            <span className="sfrp-col-risk">
              <span className="sfrp-risk-bar">
                <span style={{width:`${l.risk}%`,height:"100%",background:l.color,display:"block",borderRadius:3,opacity:.8}}/>
              </span>
              {l.days < 4 ? (
                <button type="button"
                  style={{fontSize:9,padding:"2px 6px",borderRadius:4,border:"none",cursor:"pointer",
                    background:l.sms?"#d1fae5":"#fee2e2",color:l.sms?"#065f46":"#9b1a2f",fontWeight:700,whiteSpace:"nowrap"}}
                  onClick={()=>sendSms(i)}>
                  {l.sms ? "Yuborildi" : "SMS"}
                </button>
              ) : (
                <span style={{color:l.color,fontWeight:700,fontSize:11}}>{l.risk}%</span>
              )}
            </span>
          </div>
        ))}
        <div className="sfrp-footer">
          <span className="sfrp-alert-dot"/>
          <span>{loans.filter(l=>l.sms).length > 0
            ? `${loans.filter(l=>l.sms).length} ta SMS yuborildi`
            : "2 ta muddati o'tgan — SMS tugmasini bosing"}</span>
        </div>
      </div>
    </Card>
  );
}

/* 8. TEMATIK KASHFIYOTCHI — Student + Teacher */
export function SerendipityCard() {
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState<{title:string;author:string;year:number;match:number;why:string;color:string}|null>(null);
  const [prefs, setPrefs] = useState({sci:3, hist:2, tech:4});
  const BOOKS = [
    {title:"Turing sinovlari",          author:"A. Hodges",   year:2019, match:94, why:"Siz ko'p o'qigan texnologiya kitoblariga mos", color:"#6366f1"},
    {title:"Ulug' Ipak yo'li",          author:"P. Frankopan",year:2020, match:88, why:"Tarix va madaniyat qiziqishingiz asosida",     color:"#d97706"},
    {title:"Fikrning geometriyasi",     author:"S. Carroll",  year:2021, match:91, why:"Fan va matematika o'qishlaringizga mos",        color:"#0891b2"},
    {title:"Insoniyat qisqacha tarixi", author:"Y. Harari",   year:2018, match:86, why:"Ko'p yoqtirgan janrlaringiz asosida",           color:"#059669"},
  ];

  function discover() {
    setLoading(true); setBook(null);
    setTimeout(()=>{ setBook(BOOKS[Math.floor(Math.random()*BOOKS.length)]); setLoading(false); },1300);
  }

  return (
    <Card accent="#9333ea">
      <CardHead eyebrow="TASODIFIY KASHFIYOT" title="Kitob topuvchi" icon="star" accent="#9333ea"/>
      <div className="sfse-body">
        <div className="sfse-sliders">
          {([["sci","Fan va ilm",prefs.sci],["hist","Tarix",prefs.hist],["tech","Texnologiya",prefs.tech]] as [string,string,number][]).map(([k,label,val])=>(
            <div key={k} className="sfse-slider-row">
              <span className="sfse-slider-label">{label}</span>
              <input type="range" min={1} max={5} value={val} className="sfse-range"
                onChange={e=>setPrefs(p=>({...p,[k]:Number(e.target.value)}))}/>
              <span className="sfse-slider-val">{"●".repeat(val)+"○".repeat(5-val)}</span>
            </div>
          ))}
        </div>
        <button type="button" className="sf-action-btn"
          style={{background:"#9333ea",alignSelf:"stretch",justifyContent:"center"}}
          onClick={discover}>
          {loading ? <span className="sf-spinner"/> : <><I n="star" s={13} c="#fff"/> Kitob kashf qil</>}
        </button>
        {book && (
          <div className="sfse-book" style={{borderColor:book.color+"44"}}>
            <div className="sfse-book-cover" style={{background:book.color+"22",color:book.color}}>
              {book.title.split(" ").map(w=>w[0]).join("").slice(0,3)}
            </div>
            <div className="sfse-book-info">
              <span className="sfse-book-title">{book.title}</span>
              <span className="sfse-book-author">{book.author} · {book.year}</span>
              <span className="sfse-book-why">{book.why}</span>
              <span className="sfse-match" style={{color:book.color}}>{book.match}% mos</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   PANEL WRAPPER — rol bo'yicha 2-ustunli tarmoq
════════════════════════════════════ */
export function SmartFeaturesPanel({ role }: { role: string }) {
  return (
    <div className="sf-panel">
      {role === "student" && (
        <>
          <div className="sf-grid-2">
            <ReadingStreakCard />
            <RecommendationsCard />
          </div>
          <div className="sf-grid-2">
            <CitationCard />
            <PlagiarismCard />
          </div>
          <div className="sf-grid-2">
            <AICompanionCard />
            <ReadingPlannerCard />
          </div>
          <div className="sf-grid-2">
            <ResearchGapCard />
            <VoiceSearchCard />
          </div>
          <div className="sf-grid-2">
            <LiveTranslatorCard />
            <SerendipityCard />
          </div>
        </>
      )}
      {role === "teacher" && (
        <>
          <div className="sf-grid-2">
            <CoursePackCard />
            <CitationCard />
          </div>
          <div className="sf-grid-2">
            <AICompanionCard />
            <ResearchGapCard />
          </div>
          <SerendipityCard />
        </>
      )}
      {role === "librarian" && (
        <>
          <div className="sf-grid-2">
            <QRShelfCard />
            <AISearchCard />
          </div>
          <div className="sf-grid-2">
            <VoiceSearchCard />
            <CollectionAnalyticsCard />
          </div>
          <ReturnPredictionCard />
        </>
      )}
      {role === "admin" && (
        <>
          <FeatureStatsCard />
          <div className="sf-grid-2" style={{marginTop:16}}>
            <AISearchCard />
            <CitationCard />
          </div>
          <div className="sf-grid-2">
            <CollectionAnalyticsCard />
            <ReturnPredictionCard />
          </div>
        </>
      )}
    </div>
  );
}
