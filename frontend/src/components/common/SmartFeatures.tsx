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
   Inspired by Duolingo + Oxford Bodleian
════════════════════════════════════ */
export function ReadingStreakCard() {
  const streak = 7;
  const goal   = 14;
  const DAYS   = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];
  const MILESTONES = [
    { days: 7,  icon: "🔥", label: "Hafta sarhadchi", done: true  },
    { days: 14, icon: "📚", label: "Ikki hafta",       done: false },
    { days: 30, icon: "⭐", label: "Oy chempioni",    done: false },
  ];
  return (
    <Card accent="#f97316">
      <CardHead eyebrow="O'QISH GAMIFICATION" title="Kunlik o'qish streaki" icon="flame" accent="#f97316"/>
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
   Inspired by Spotify + MIT Libraries
════════════════════════════════════ */
export function RecommendationsCard() {
  const RECS = [
    { title: "Algoritm va ma'lumotlar strukturasi", author: "T. Cormen",   match: 97, type: "Majburiy",   color: "#002147", bg:"#e8edf5" },
    { title: "Veb dasturlash asoslari",              author: "B. Flanagan", match: 91, type: "Tavsiya",    color: "#0891b2", bg:"#e0f2fe" },
    { title: "Sun'iy intellekt kirish kursi",        author: "S. Russell",  match: 85, type: "Qo'shimcha", color: "#7c3aed", bg:"#ede9fe" },
    { title: "Ma'lumotlar tahlili va Python",        author: "W. McKinney", match: 78, type: "Qo'shimcha", color: "#7c3aed", bg:"#ede9fe" },
  ];
  return (
    <Card accent="#059669">
      <CardHead eyebrow="AI · KURSLARINGIZGA MOS" title="Tavsiya qilingan kitoblar" icon="target" accent="#059669"/>
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
   Inspired by Zotero + RefWorks
════════════════════════════════════ */
export function CitationCard() {
  const [format, setFormat] = useState<"APA"|"MLA"|"GOST">("APA");
  const [bookIdx, setBookIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const BOOKS = [
    { title: "Ma'lumotlar bazasi: amaliy qo'llanma", author: "Yuldasheva A.", year: 2022, publisher: "ATMU nashriyoti", place: "Nukus"    },
    { title: "Python dasturlash tili",                author: "Ergashev N.",   year: 2023, publisher: "Fan",             place: "Toshkent" },
    { title: "Kiberxavfsizlik asoslari",              author: "Qodirov J.",    year: 2021, publisher: "ATMU",            place: "Nukus"    },
    { title: "Algoritm va ma'lumotlar strukturasi",   author: "Cormen T.",     year: 2020, publisher: "MIT Press",       place: "Boston"   },
  ];
  const b = BOOKS[bookIdx];
  const cites: Record<"APA"|"MLA"|"GOST", string> = {
    APA:  `${b.author} (${b.year}). ${b.title}. ${b.place}: ${b.publisher}.`,
    MLA:  `${b.author}. "${b.title}." ${b.publisher}, ${b.year}.`,
    GOST: `${b.author} ${b.title} / ${b.author}. — ${b.place}: ${b.publisher}, ${b.year}. — 348 b.`,
  };
  const handleCopy = () => {
    navigator.clipboard?.writeText(cites[format]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Card accent="#0891b2">
      <CardHead eyebrow="IQTIBOS GENERATOR · APA / MLA / GOST" title="Adabiyotlar ro'yxati" icon="quote" accent="#0891b2"/>
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
   Inspired by Turnitin clean UI
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
      <CardHead eyebrow="AI · MATN TAHLILI" title="Plagiat pre-check" icon="shield" accent="#7c3aed"/>
      <div className="sf-plag-body">
        <textarea className="sf-textarea"
          placeholder="Kurs ishi matnini shu yerga joylashtiring — AI kutubxona manbalari bilan solishtiradi..."
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
                {safe ? "✓ Maqbul" : "⚠ Yuqori"}
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
   Inspired by Canvas LMS + Coursera
════════════════════════════════════ */
export function CoursePackCard() {
  const PACKS = [
    { name: "Ma'lumotlar bazasi — 3-kurs",   items: 7, students: 42, views: 187, pct: 92, color: "#002147" },
    { name: "Kiberxavfsizlik — Magistratura", items: 5, students: 18, views: 94,  pct: 68, color: "#0891b2" },
    { name: "Python asoslari — 2-kurs",       items: 9, students: 65, views: 312, pct: 45, color: "#059669" },
  ];
  return (
    <Card accent="#d97706">
      <div className="sf-card-head" style={{justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div className="sf-card-icon" style={{background:"#fef3c718",color:"#d97706"}}>
            <I n="pack" s={17} c="#d97706"/>
          </div>
          <div>
            <p className="sf-eyebrow">COURSE PACK · RESURS TO'PLAMI</p>
            <h3 className="sf-title">Kurs materiallari</h3>
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
                <span>{p.items} material</span>
                <span className="sf-pack-sep">·</span>
                <span>{p.students} talaba</span>
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
   Inspired by Singapore NLB + British Library
════════════════════════════════════ */
export function QRShelfCard() {
  const [shelf, setShelf] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const SHELVES = [
    { id:"A-14", books:28, scans:47, topic:"Informatika"   },
    { id:"B-03", books:34, scans:31, topic:"Iqtisodiyot"   },
    { id:"C-07", books:19, scans:22, topic:"Matematika"    },
    { id:"D-11", books:41, scans:63, topic:"Tilshunoslik"  },
  ];
  return (
    <Card accent="#002147">
      <CardHead eyebrow="SMART NAVIGATSIYA · RFID / QR" title="Javon navigatsiya tizimi" icon="qr" accent="#002147"/>
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
   Inspired by ExLibris Primo + Summon
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
        { title:"NoSQL ma'lumotlar bazalari",       author:"Pramod Sadalage", year:2021, type:"Darslik",   dept:"Informatika" },
      ]);
    }, 1200);
  };
  return (
    <Card accent="#4f46e5">
      <CardHead eyebrow="AI QIDIRUV · TABIIY TIL" title="Semantik qidiruv tizimi" icon="search" accent="#4f46e5"/>
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
   Inspired by Vercel Analytics + Linear
════════════════════════════════════ */
export function FeatureStatsCard() {
  const STATS = [
    { icon:"search", label:"AI qidiruv",       uses:1247, growth:34, color:"#4f46e5", spark:[800,950,1050,1180,1247] },
    { icon:"quote",  label:"Iqtibos generator", uses:892,  growth:18, color:"#0891b2", spark:[580,670,750,830,892]   },
    { icon:"shield", label:"Plagiat tekshiruv", uses:437,  growth:61, color:"#7c3aed", spark:[170,240,320,390,437]   },
    { icon:"target", label:"Kitob tavsiyalar",  uses:2184, growth:42, color:"#059669", spark:[1100,1450,1750,1980,2184]},
    { icon:"pack",   label:"Course Pack",       uses:156,  growth:28, color:"#d97706", spark:[75,100,118,138,156]    },
    { icon:"qr",     label:"QR navigatsiya",    uses:341,  growth:89, color:"#dc2626", spark:[90,145,210,275,341]    },
    { icon:"flame",  label:"Streak / Progress", uses:678,  growth:53, color:"#f97316", spark:[280,380,490,590,678]   },
  ];
  const total = STATS.reduce((s,x) => s+x.uses, 0);
  const maxUses = Math.max(...STATS.map(s=>s.uses));
  return (
    <div className="sf-stats-card">
      <div className="sf-stats-head">
        <div>
          <p className="sf-eyebrow" style={{color:"#a5b4fc"}}>SMART XIZMATLAR · REAL-TIME TAHLIL</p>
          <h3 className="sf-title">Funksiyalar foydalanish ko'rsatkichlari</h3>
        </div>
        <div className="sf-stats-total">
          <span className="sf-stats-total-n">{total.toLocaleString()}</span>
          <span className="sf-stats-total-l">Jami session</span>
        </div>
      </div>
      <div className="sf-rainbow">
        {STATS.map((s,i) => (
          <div key={i} title={s.label}
            className="sf-rainbow-seg"
            style={{flex:s.uses, background:s.color}}/>
        ))}
      </div>
      <div className="sf-stats-grid">
        {STATS.map((s,i) => {
          const W=52, H=24;
          const mx = Math.max(...s.spark);
          const pts = s.spark.map((v,j)=>`${j*(W/(s.spark.length-1))},${H-(v/mx)*H}`).join(" ");
          const barW = ((s.uses/maxUses)*100).toFixed(1);
          return (
            <div key={i} className="sf-stat-tile">
              <div className="sf-stat-tile-top">
                <div className="sf-stat-tile-icon" style={{background:s.color+"15",color:s.color}}>
                  <I n={s.icon} s={14} c={s.color}/>
                </div>
                <span className="sf-stat-tile-label">{s.label}</span>
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{flexShrink:0}}>
                  <polyline points={pts} fill="none" stroke={s.color} strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" opacity=".8"/>
                  <circle cx={W} cy={H-(s.spark[s.spark.length-1]/mx)*H} r="2.2" fill={s.color}/>
                </svg>
              </div>
              <div className="sf-stat-tile-mid">
                <span className="sf-stat-tile-n">{s.uses.toLocaleString()}</span>
                <span className="sf-stat-tile-g" style={{color:"#16a34a",background:"#dcfce7"}}>+{s.growth}%</span>
              </div>
              <div className="sf-stat-bar-track">
                <div style={{width:`${barW}%`, height:"100%", background:s.color, borderRadius:2, opacity:.7}}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   PANEL WRAPPER — role-based 2-col grid
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
        </>
      )}
      {role === "teacher" && (
        <div className="sf-grid-2">
          <CoursePackCard />
          <CitationCard />
        </div>
      )}
      {role === "librarian" && (
        <div className="sf-grid-2">
          <QRShelfCard />
          <AISearchCard />
        </div>
      )}
      {role === "admin" && (
        <>
          <FeatureStatsCard />
          <div className="sf-grid-2" style={{marginTop:16}}>
            <AISearchCard />
            <CitationCard />
          </div>
        </>
      )}
    </div>
  );
}
