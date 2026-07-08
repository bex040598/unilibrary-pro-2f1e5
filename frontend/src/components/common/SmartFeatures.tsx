import { useState, useRef, useEffect } from "react";

/* ── SVG icon helper ── */
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
  bell:   "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  x:      "M18 6L6 18M6 6l12 12",
  stop:   "M9 9h6v6H9zM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  globe:  "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
};

function I({ n, s = 16, c = "currentColor" }: { n: string; s?: number; c?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={P[n] ?? P.book} />
    </svg>
  );
}

/* ── Shared card shell ── */
function Card({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="sf-card" style={{ "--sf-accent": accent } as React.CSSProperties}>
      {children}
    </div>
  );
}
function CardHead({ eyebrow, title, icon, accent }: { eyebrow: string; title: string; icon: string; accent: string }) {
  return (
    <div className="sf-card-head">
      <div className="sf-card-icon" style={{ background: accent + "18", color: accent }}>
        <I n={icon} s={17} c={accent} />
      </div>
      <div>
        <p className="sf-eyebrow">{eyebrow}</p>
        <h3 className="sf-title">{title}</h3>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   1. READING STREAK
════════════════════════════════════ */
export function ReadingStreakCard() {
  const streak = 7; const goal = 14;
  const DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
  const MILESTONES = [
    { days: 7,  icon: "🔥", label: "Hafta yugurdagi", done: true  },
    { days: 14, icon: "📚", label: "Ikki hafta",      done: false },
    { days: 30, icon: "⭐", label: "Oy chempioni",    done: false },
  ];
  return (
    <Card accent="#f97316">
      <CardHead eyebrow="KUNLIK STREAK" title="O'qish seriyasi" icon="flame" accent="#f97316" />
      <div className="sf-streak-big">
        <span className="sf-streak-n">{streak}</span>
        <div className="sf-streak-side">
          <span className="sf-streak-unit">kun</span>
          <span className="sf-streak-sub">Maqsad: {goal} kun</span>
        </div>
      </div>
      <div className="sf-progress-bar-wrap">
        <div className="sf-progress-bar" style={{ width: `${(streak / goal) * 100}%`, background: "#f97316" }} />
      </div>
      <div className="sf-streak-week">
        {DAYS.map((d, i) => (
          <div key={i} className="sf-day">
            <div className={`sf-day-ring${i < streak ? " sf-day-ring-on" : ""}`} style={i < streak ? { borderColor: "#f97316", background: "#fff7ed" } : {}}>
              {i < streak && <I n="flame" s={11} c="#f97316" />}
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
            {m.done && <I n="check" s={13} c="#15803d" />}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   2. BOOK RECOMMENDATIONS
════════════════════════════════════ */
export function RecommendationsCard() {
  const RECS = [
    { title: "Algoritm va ma'lumotlar tuzilmasi", author: "T. Cormen",   match: 97, type: "Majburiy",   color: "#002147", bg: "#e8edf5" },
    { title: "Veb dasturlash asoslari",            author: "B. Flanagan", match: 91, type: "Tavsiya",    color: "#0891b2", bg: "#e0f2fe" },
    { title: "Sun'iy intellektga kirish",          author: "S. Russell",  match: 85, type: "Qo'shimcha", color: "#7c3aed", bg: "#ede9fe" },
    { title: "Python bilan ma'lumotlar tahlili",   author: "W. McKinney", match: 78, type: "Qo'shimcha", color: "#7c3aed", bg: "#ede9fe" },
  ];
  return (
    <Card accent="#059669">
      <CardHead eyebrow="KURSGA MOS TAVSIYALAR" title="Tavsiya etilgan kitoblar" icon="target" accent="#059669" />
      <div className="sf-rec-list">
        {RECS.map((r, i) => (
          <div key={i} className="sf-rec-row">
            <div className="sf-rec-rank">{i + 1}</div>
            <div className="sf-rec-cover" style={{ background: r.bg, color: r.color }}>{r.title[0]}</div>
            <div className="sf-rec-info">
              <span className="sf-rec-title">{r.title}</span>
              <span className="sf-rec-author">{r.author}</span>
            </div>
            <div className="sf-rec-right">
              <span className="sf-rec-pct" style={{ color: r.color }}>{r.match}%</span>
              <span className="sf-rec-type" style={{ background: r.bg, color: r.color }}>{r.type}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   3. CITATION GENERATOR
════════════════════════════════════ */
export function CitationCard() {
  const [format, setFormat] = useState<"APA" | "MLA" | "GOST">("APA");
  const [bookIdx, setBookIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const BOOKS = [
    { title: "Ma'lumotlar bazasi: amaliy qo'llanma", author: "Yuldasheva A.", year: 2022, publisher: "ATMU nashriyoti", place: "Nukus" },
    { title: "Python dasturlash tili",                author: "Ergashev N.",   year: 2023, publisher: "Fan",             place: "Toshkent" },
    { title: "Kiberxavfsizlik asoslari",              author: "Qodirov J.",    year: 2021, publisher: "ATMU",            place: "Nukus" },
    { title: "Algoritm va ma'lumotlar tuzilmasi",     author: "Cormen T.",     year: 2020, publisher: "MIT Press",       place: "Boston" },
  ];
  const b = BOOKS[bookIdx];
  const cites: Record<"APA" | "MLA" | "GOST", string> = {
    APA:  `${b.author} (${b.year}). ${b.title}. ${b.place}: ${b.publisher}.`,
    MLA:  `${b.author}. "${b.title}." ${b.publisher}, ${b.year}.`,
    GOST: `${b.author} ${b.title} / ${b.author}. -- ${b.place}: ${b.publisher}, ${b.year}. -- 348 b.`,
  };
  const handleCopy = () => {
    navigator.clipboard?.writeText(cites[format]);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Card accent="#0891b2">
      <CardHead eyebrow="IQTIBOS FORMATLASH" title="Adabiyotlar ro'yxati" icon="quote" accent="#0891b2" />
      <div className="sf-cite-body">
        <select className="sf-input" value={bookIdx} onChange={e => setBookIdx(+e.target.value)}>
          {BOOKS.map((bk, i) => <option key={i} value={i}>{bk.title}</option>)}
        </select>
        <div className="sf-format-row">
          {(["APA", "MLA", "GOST"] as const).map(f => (
            <button key={f} type="button"
              className={`sf-fmt-btn${format === f ? " sf-fmt-on" : ""}`}
              style={format === f ? { background: "#0891b2", borderColor: "#0891b2" } : {}}
              onClick={() => setFormat(f)}>{f}</button>
          ))}
        </div>
        <div className="sf-cite-out"><p className="sf-cite-text">{cites[format]}</p></div>
        <button type="button" className="sf-action-btn" style={{ background: "#0891b2" }} onClick={handleCopy}>
          <I n="copy" s={14} c="#fff" />
          {copied ? "Nusxalandi!" : "Nusxalash"}
        </button>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   4. PLAGIARISM CHECK
════════════════════════════════════ */
export function PlagiarismCard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ pct: number; sources: { src: string; pct: number }[] } | null>(null);
  const [checking, setChecking] = useState(false);
  const handleCheck = () => {
    if (!text.trim()) return;
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setResult({
        pct: 12,
        sources: [
          { src: "Yuldasheva A. — Ma'lumotlar bazasi (2022)", pct: 7 },
          { src: "Ergashev N. — Python (2023)",               pct: 3 },
          { src: "Internet manbalar",                          pct: 2 },
        ],
      });
    }, 1800);
  };
  const pct = result?.pct ?? 0; const safe = pct < 20;
  return (
    <Card accent="#7c3aed">
      <CardHead eyebrow="MATN TAHLILI" title="Plagiat tekshiruvi" icon="shield" accent="#7c3aed" />
      <div className="sf-plag-body">
        <textarea className="sf-textarea"
          placeholder="Kurs ishi matnini joylashtiring — kutubxona manbalari bilan solishtiramiz..."
          value={text} onChange={e => setText(e.target.value)} rows={3} />
        <button type="button" className="sf-action-btn" style={{ background: "#7c3aed" }}
          onClick={handleCheck} disabled={checking || !text.trim()}>
          {checking ? <><span className="sf-spinner" />Tekshirilmoqda...</> : <><I n="search" s={14} c="#fff" />Tekshirish</>}
        </button>
        {result && (
          <div className="sf-plag-result">
            <div className="sf-plag-gauge">
              <svg viewBox="0 0 100 60" width="120" height="72">
                <path d="M10 55 A45 45 0 0 1 90 55" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                <path d="M10 55 A45 45 0 0 1 90 55" fill="none"
                  stroke={safe ? "#16a34a" : "#dc2626"} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 141.3} 141.3`} />
                <text x="50" y="52" textAnchor="middle" fontSize="18" fontWeight="800" fill={safe ? "#16a34a" : "#dc2626"}>{pct}%</text>
              </svg>
              <div className="sf-plag-verdict" style={{ color: safe ? "#16a34a" : "#dc2626" }}>
                {safe ? "Maqbul" : "Yuqori"}
              </div>
            </div>
            <div className="sf-plag-sources">
              {result.sources.map((s, i) => (
                <div key={i} className="sf-plag-src">
                  <span className="sf-plag-src-name">{s.src}</span>
                  <div className="sf-plag-src-bar">
                    <div style={{ width: `${s.pct * 8}%`, background: "#f59e0b", height: "100%", borderRadius: 2 }} />
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
   5. COURSE PACK MANAGER
════════════════════════════════════ */
export function CoursePackCard() {
  const PACKS = [
    { name: "Ma'lumotlar bazasi — 3-kurs",   items: 7, students: 42, views: 187, pct: 92, color: "#002147" },
    { name: "Kiberxavfsizlik — Magistratura", items: 5, students: 18, views: 94,  pct: 68, color: "#0891b2" },
    { name: "Python asoslari — 2-kurs",       items: 9, students: 65, views: 312, pct: 45, color: "#059669" },
  ];
  return (
    <Card accent="#d97706">
      <div className="sf-card-head" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="sf-card-icon" style={{ background: "#fef3c718", color: "#d97706" }}>
            <I n="pack" s={17} c="#d97706" />
          </div>
          <div>
            <p className="sf-eyebrow">KURS MATERIALLARI</p>
            <h3 className="sf-title">Resurs to'plamlari</h3>
          </div>
        </div>
        <button type="button" className="sf-action-btn sf-action-sm" style={{ background: "#002147" }}>
          <I n="plus" s={13} c="#fff" /> Yangi
        </button>
      </div>
      <div className="sf-pack-list">
        {PACKS.map((p, i) => (
          <div key={i} className="sf-pack-item">
            <div className="sf-pack-bar-col">
              <div className="sf-pack-color-bar" style={{ background: p.color, height: `${p.pct}%` }} />
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
                <span style={{ color: p.color, fontWeight: 700 }}>{p.pct}% faollik</span>
              </div>
            </div>
            <button type="button" className="sf-pack-arrow"><I n="arrow" s={14} c="#94a3b8" /></button>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   6. QR SHELF NAVIGATOR
════════════════════════════════════ */
export function QRShelfCard() {
  const [shelf, setShelf] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const SHELVES = [
    { id: "A-14", books: 28, scans: 47, topic: "Informatika" },
    { id: "B-03", books: 34, scans: 31, topic: "Iqtisodiyot" },
    { id: "C-07", books: 19, scans: 22, topic: "Matematika" },
    { id: "D-11", books: 41, scans: 63, topic: "Tilshunoslik" },
  ];
  return (
    <Card accent="#002147">
      <CardHead eyebrow="JAVON NAVIGATSIYASI" title="QR-kod boshqaruvi" icon="qr" accent="#002147" />
      <div className="sf-qr-body">
        <div className="sf-qr-input-row">
          <input className="sf-input sf-qr-inp" placeholder="Javon raqami: A-14"
            value={shelf} onChange={e => { setShelf(e.target.value); setGenerated(null); }}
            onKeyDown={e => e.key === "Enter" && shelf.trim() && setGenerated(shelf.trim())} />
          <button type="button" className="sf-action-btn sf-action-sm" style={{ background: "#002147" }}
            onClick={() => shelf.trim() && setGenerated(shelf.trim())}>
            <I n="qr" s={14} c="#fff" /> Yaratish
          </button>
        </div>
        {generated && (
          <div className="sf-qr-result">
            <svg width={88} height={88} viewBox="0 0 88 88">
              {[0,1,2,3,4,5,6,7,8].flatMap(r => [0,1,2,3,4,5,6,7,8].map(c => {
                const on = ((r * 8 + c + (r * c + r + c)) % 4 !== 0);
                return on ? <rect key={`${r}-${c}`} x={c * 10 + 1} y={r * 10 + 1} width={8} height={8} rx={1.5} fill="#002147" /> : null;
              }))}
              <rect x={1} y={1} width={28} height={28} rx={3} fill="none" stroke="#002147" strokeWidth={2.5} />
              <rect x={7} y={7} width={16} height={16} rx={2} fill="#002147" />
              <rect x={59} y={1} width={28} height={28} rx={3} fill="none" stroke="#002147" strokeWidth={2.5} />
              <rect x={65} y={7} width={16} height={16} rx={2} fill="#002147" />
              <rect x={1} y={59} width={28} height={28} rx={3} fill="none" stroke="#002147" strokeWidth={2.5} />
              <rect x={7} y={65} width={16} height={16} rx={2} fill="#002147" />
            </svg>
            <div className="sf-qr-info">
              <div className="sf-qr-shelf-tag">{generated}</div>
              <p className="sf-qr-desc">Telefon kamerasi bilan skanerlang — javondagi barcha kitoblar va ularning holati ko'rinadi.</p>
              <button type="button" className="sf-ghost-btn"><I n="print" s={13} c="#002147" /> Chop etish</button>
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
              <span className="sf-shelf-scans" style={{ color: "#002147", fontWeight: 700 }}>{s.scans}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   7. AI SEARCH
════════════════════════════════════ */
export function AISearchCard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ title: string; author: string; year: number; type: string; dept: string; available: boolean }[]>([]);
  const [searching, setSearching] = useState(false);
  const SUGGESTIONS = ["dissertatsiya 2023", "fizika darsligi", "kiberxavfsizlik magistr"];
  const handleSearch = (q = query) => {
    if (!q.trim()) return;
    setQuery(q); setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setResults([
        { title: "Ma'lumotlar bazasini loyihalash", author: "C. J. Date",      year: 2019, type: "Darslik",   dept: "Informatika", available: true },
        { title: "SQL: to'liq qo'llanma",           author: "Ben Forta",       year: 2020, type: "Qo'llanma", dept: "Informatika", available: false },
        { title: "NoSQL ma'lumotlar bazalari",       author: "P. Sadalage",     year: 2021, type: "Darslik",   dept: "Informatika", available: true },
      ]);
    }, 1200);
  };
  return (
    <Card accent="#4f46e5">
      <CardHead eyebrow="QIDIRUV TIZIMI" title="Semantik qidiruv" icon="search" accent="#4f46e5" />
      <div className="sf-ai-body">
        <div className="sf-ai-row">
          <input className="sf-input sf-ai-inp"
            placeholder="Masalan: 2020-yildan keyin ma'lumotlar bazasi bo'yicha darsliklar..."
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()} />
          <button type="button" className="sf-action-btn sf-action-sm" style={{ background: "#4f46e5" }}
            onClick={() => handleSearch()} disabled={searching}>
            {searching ? <span className="sf-spinner" /> : <I n="search" s={14} c="#fff" />}
            {searching ? "Izlanmoqda" : "Izlash"}
          </button>
        </div>
        {!results.length && (
          <div className="sf-ai-suggestions">
            <span className="sf-eyebrow" style={{ marginBottom: 6 }}>Tezkor qidiruv</span>
            <div className="sf-suggestion-row">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} type="button" className="sf-suggestion-chip" onClick={() => handleSearch(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {results.length > 0 && (
          <div className="sf-ai-results">
            {results.map((r, i) => (
              <div key={i} className="sf-ai-row-result">
                <div className="sf-ai-result-num">{i + 1}</div>
                <div className="sf-ai-result-info">
                  <span className="sf-rec-title">{r.title}</span>
                  <span className="sf-rec-author">{r.author} · {r.year} · {r.dept}</span>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, flexShrink: 0,
                  background: r.available ? "#d1fae5" : "#fee2e2",
                  color: r.available ? "#065f46" : "#9b1a2f"
                }}>
                  {r.available ? "Mavjud" : "Berilgan"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

/* ════════════════════════════════════
   8. FEATURE STATS (admin)
════════════════════════════════════ */
export function FeatureStatsCard() {
  const STATS = [
    { icon: "target", label: "Kitob tavsiyalar",   uses: 2184, growth: 42, color: "#34d399", spark: [1100, 1450, 1750, 1980, 2184] },
    { icon: "search", label: "AI qidiruv",         uses: 1247, growth: 34, color: "#818cf8", spark: [800, 950, 1050, 1180, 1247] },
    { icon: "quote",  label: "Iqtibos formatlash", uses: 892,  growth: 18, color: "#38bdf8", spark: [580, 670, 750, 830, 892] },
    { icon: "flame",  label: "O'qish seriyasi",    uses: 678,  growth: 53, color: "#fb923c", spark: [280, 380, 490, 590, 678] },
    { icon: "shield", label: "Plagiat tekshiruvi", uses: 437,  growth: 61, color: "#c084fc", spark: [170, 240, 320, 390, 437] },
    { icon: "qr",     label: "QR navigatsiya",     uses: 341,  growth: 89, color: "#f87171", spark: [90, 145, 210, 275, 341] },
    { icon: "pack",   label: "Kurs materiallari",  uses: 156,  growth: 28, color: "#fbbf24", spark: [75, 100, 118, 138, 156] },
  ];
  const total = STATS.reduce((s, x) => s + x.uses, 0);
  const maxUses = STATS[0].uses;
  const topGrower = [...STATS].sort((a, b) => b.growth - a.growth)[0];

  function Spark({ vals, color }: { vals: number[]; color: string }) {
    const W = 44, H = 20, mx = Math.max(...vals), mn = Math.min(...vals), range = mx - mn || 1;
    const pts = vals.map((v, i) => `${i * (W / (vals.length - 1))},${H - ((v - mn) / range) * H}`).join(" ");
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0, overflow: "visible" }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
        <circle cx={W} cy={H - ((vals[vals.length - 1] - mn) / range) * H} r="2.5" fill={color} />
      </svg>
    );
  }

  return (
    <div className="fsc-root">
      <div className="fsc-header">
        <div className="fsc-header-left">
          <span className="fsc-live-dot" />
          <span className="fsc-eyebrow">FAOLIYAT TAHLILI</span>
        </div>
        <div className="fsc-header-right">
          <span className="fsc-total-n">{total.toLocaleString()}</span>
          <span className="fsc-total-l">jami sessiya</span>
        </div>
      </div>
      <div className="fsc-river">
        {STATS.map((s, i) => (
          <div key={i} className="fsc-river-seg" title={`${s.label}: ${s.uses}`}
            style={{ flex: s.uses, background: s.color, opacity: .85 }} />
        ))}
      </div>
      <div className="fsc-board">
        <div className="fsc-board-header">
          <span>#</span><span>Funksiya</span><span>Foydalanish</span>
          <span>Trend</span><span>Sessiya</span><span>O'sish</span>
        </div>
        {STATS.map((s, i) => (
          <div key={i} className="fsc-row" style={{ "--fsc-color": s.color } as React.CSSProperties}>
            <span className="fsc-col-rank">
              {i === 0 ? <span className="fsc-crown">①</span> : <span className="fsc-rank-n">{i + 1}</span>}
            </span>
            <span className="fsc-col-name">
              <span className="fsc-icon-dot" style={{ background: s.color + "22", color: s.color }}>
                <I n={s.icon} s={12} c={s.color} />
              </span>
              <span className="fsc-name-text">{s.label}</span>
            </span>
            <span className="fsc-col-bar">
              <span className="fsc-bar-track">
                <span className="fsc-bar-fill" style={{ width: `${(s.uses / maxUses) * 100}%`, background: s.color }} />
              </span>
            </span>
            <span className="fsc-col-spark"><Spark vals={s.spark} color={s.color} /></span>
            <span className="fsc-col-n">{s.uses.toLocaleString()}</span>
            <span className="fsc-col-g" style={{ color: s.growth > 50 ? "#4ade80" : s.growth > 30 ? "#a3e635" : "#facc15" }}>
              +{s.growth}%
            </span>
          </div>
        ))}
      </div>
      <div className="fsc-footer">
        <span className="fsc-trophy">↑</span>
        <span className="fsc-footer-text">
          Eng tez o'suvchi: <strong style={{ color: topGrower.color }}>{topGrower.label}</strong>
          <span className="fsc-footer-pct"> +{topGrower.growth}% bu hafta</span>
        </span>
        <span className="fsc-footer-period">So'nggi 30 kun</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   YANGI 8 TA FUNKSIYA — Xalqaro kutubxona standartlari
══════════════════════════════════════════════════════════════ */

/* ── 1. AI O'QISH HAMROHI ── Harvard HOLLIS / JSTOR uslubi */
export function AICompanionCard() {
  type Msg = { role: "user" | "ai"; text: string; sources?: string[] };
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Salom! Kitob izlash, mavzu tushuntirish yoki tavsiya so'rash uchun yozing." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const CHIPS = ["Bu kitobni tushuntir", "O'xshash kitob tavsiya qil", "Dissertatsiya yozishda yordam ber"];

  const ANSWERS: { q: string; a: string; src: string[] }[] = [
    { q: "tushuntir",    a: "Bu asar ma'lumotlar tuzilmalari va algoritmlarni o'rganuvchi fundamental darslik. Kompyuter fanlari bo'yicha talabalar va mutaxassislar uchun asos hisoblanadi.", src: ["Cormen T.H. — CLRS (2022)", "Sedgewick R. — Algorithms (2011)"] },
    { q: "tavsiya",      a: "Sizning o'qish tarixingizga ko'ra quyidagi kitoblar mos keladi: 1) Wirth N. 'Algorithms + Data Structures' — 94% mos; 2) Knuth D. 'The Art of Computer Programming' — 89% mos.", src: ["Fond A-14", "Fond A-09"] },
    { q: "dissertatsiya", a: "Dissertatsiya tuzilmasi: kirish, adabiyotlar sharhi, metodologiya, natijalar, muhokama, xulosa. Ilmiy uslub uchun GOST 7.1-2003 standartiga rioya qiling.", src: ["GOST 7.1-2003", "ATMU dissertatsiya qo'llanmasi (2023)"] },
  ];

  function getAnswer(q: string) {
    const match = ANSWERS.find(a => q.toLowerCase().includes(a.q));
    return match ?? { a: `"${q}" bo'yicha katalogda 14 ta manbaa topildi. Eng dolzarbi: Yuldasheva A. "Axborot tizimlari" (2021) — 94% mos.`, src: ["Katalog A-14", "E-kutubxona"] };
  }

  function send(q: string) {
    if (!q.trim() || loading) return;
    setInput("");
    setMsgs(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    setTimeout(() => {
      const ans = getAnswer(q);
      setMsgs(prev => [...prev, { role: "ai", text: ans.a, sources: ans.src }]);
      setLoading(false);
    }, 1100);
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  return (
    <Card accent="#4f46e5">
      <CardHead eyebrow="SHAXSIY YORDAMCHI" title="AI o'qish hamrohi" icon="send" accent="#4f46e5" />

      {/* Chat area */}
      <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "4px 0 8px" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
            {m.role === "ai" && (
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <I n="star" s={13} c="#4f46e5" />
              </div>
            )}
            <div style={{
              maxWidth: "80%", padding: "9px 12px", borderRadius: m.role === "user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
              background: m.role === "user" ? "#4f46e5" : "#f8fafc",
              border: m.role === "ai" ? "1px solid #e2e8f0" : "none",
            }}>
              <p style={{ fontSize: 12.5, color: m.role === "user" ? "#fff" : "#1e293b", margin: 0, lineHeight: 1.5 }}>{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                  {m.sources.map((s, j) => (
                    <span key={j} style={{ fontSize: 9.5, padding: "2px 6px", borderRadius: 4, background: "#e0e7ff", color: "#3730a3", fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I n="star" s={13} c="#4f46e5" />
            </div>
            <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "#f8fafc", borderRadius: "4px 12px 12px 12px", border: "1px solid #e2e8f0" }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "#94a3b8", animation: `sfTyping 1.2s ${j * 0.2}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chips */}
      <div className="sf-suggestion-row" style={{ flexWrap: "wrap" }}>
        {CHIPS.map((c, i) => (
          <button key={i} type="button" className="sf-suggestion-chip" onClick={() => send(c)}>{c}</button>
        ))}
      </div>

      {/* Input */}
      <div className="sf-ai-row" style={{ marginTop: 6 }}>
        <input className="sf-input sf-ai-inp" placeholder="Savol yozing yoki kitob nomi kiriting..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") send(input); }} />
        <button type="button" className="sf-action-btn sf-action-sm" style={{ background: "#4f46e5" }}
          onClick={() => send(input)} disabled={loading || !input.trim()}>
          <I n="send" s={13} c="#fff" />
        </button>
      </div>
    </Card>
  );
}

/* ── 2. O'QISH JADVALI ── Notion / British Library Reading Room uslubi */
export function ReadingPlannerCard() {
  const DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
  const [done, setDone] = useState([true, true, true, false, false, false, false]);
  const [plan, setPlan] = useState([
    { day: "Dushanba",   task: "1–3-bob",  book: "Python dasturlash tili",  pages: 48, done: true  },
    { day: "Seshanba",   task: "4–6-bob",  book: "Python dasturlash tili",  pages: 52, done: true  },
    { day: "Chorshanba", task: "7–9-bob",  book: "Python dasturlash tili",  pages: 45, done: true  },
    { day: "Payshanba",  task: "1–2-bob",  book: "Ma'lumotlar bazasi",      pages: 38, done: false },
    { day: "Juma",       task: "3–4-bob",  book: "Ma'lumotlar bazasi",      pages: 41, done: false },
  ]);

  const pct = Math.round((done.filter(Boolean).length / 7) * 100);
  const pagesRead = plan.filter(p => p.done).reduce((s, p) => s + p.pages, 0);

  return (
    <Card accent="#0891b2">
      <CardHead eyebrow="SHAXSIY JADVAL" title="O'qish rejasi" icon="book" accent="#0891b2" />

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {[
          { label: "Haftalik", val: `${pct}%`, color: "#0891b2" },
          { label: "O'qilgan", val: `${pagesRead} bet`, color: "#059669" },
          { label: "Qolgan",   val: `${7 - done.filter(Boolean).length} kun`, color: "#94a3b8" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "8px 10px", background: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: s.color, margin: 0 }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Week rings */}
      <div className="sfp-week" style={{ marginBottom: 10 }}>
        {DAYS.map((d, i) => (
          <div key={i} className="sfp-day-col">
            <button type="button"
              className={`sfp-ring ${done[i] ? "sfp-ring-done" : i === 3 ? "sfp-ring-today" : ""}`}
              onClick={() => setDone(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
              style={{ cursor: "pointer", border: "none", padding: 0 }}>
              {done[i] ? <I n="check" s={11} c="#fff" /> : <span className="sfp-day-n">{i + 1}</span>}
            </button>
            <span className="sfp-day-lbl">{d}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="sf-progress-bar-wrap" style={{ marginBottom: 12 }}>
        <div className="sf-progress-bar" style={{ width: `${pct}%`, background: "#0891b2", transition: "width 0.4s" }} />
      </div>

      {/* Plan list */}
      <div className="sfp-plan-list">
        {plan.map((p, i) => (
          <div key={i}
            className={`sfp-plan-row ${p.done ? "sfp-plan-done" : i === 3 ? "sfp-plan-today" : ""}`}
            onClick={() => setPlan(prev => prev.map((x, j) => j === i ? { ...x, done: !x.done } : x))}
            style={{ cursor: "pointer" }}>
            <div className="sfp-plan-check">
              {p.done ? <I n="check" s={11} c="#0891b2" /> : null}
            </div>
            <div className="sfp-plan-body">
              <span className="sfp-plan-task">{p.task}</span>
              <span className="sfp-plan-book">{p.book}</span>
            </div>
            <span style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0 }}>{p.pages} bet</span>
            {i === 3 && !p.done && <span className="sfp-today-badge">Bugun</span>}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── 3. TADQIQOT BO'SHLIG'I ── Scopus / Web of Science uslubi */
export function ResearchGapCard() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<{ gaps: { label: string; pubs: number; maxPubs: number; trend: string; tag: string; color: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  function analyze() {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        gaps: [
          { label: `${topic} va sun'iy intellekt`,     pubs: 4,  maxPubs: 40, trend: "↑", tag: "Kam tadqiq",  color: "#dc2626" },
          { label: `${topic}: zamonaviy usullar`,      pubs: 17, maxPubs: 40, trend: "↑", tag: "O'rta",       color: "#d97706" },
          { label: `${topic} nazariyasi`,              pubs: 31, maxPubs: 40, trend: "→", tag: "Etarli",      color: "#059669" },
          { label: `${topic} amaliy tatbiqi`,          pubs: 9,  maxPubs: 40, trend: "↑", tag: "Kam tadqiq",  color: "#dc2626" },
          { label: `${topic} va boshqa fanlar`,        pubs: 3,  maxPubs: 40, trend: "↑", tag: "Bo'shliq",    color: "#7c3aed" },
        ]
      });
      setLoading(false);
    }, 1400);
  }

  return (
    <Card accent="#7c3aed">
      <CardHead eyebrow="TADQIQOT TAHLILI" title="Bo'shliq izlovchi" icon="layers" accent="#7c3aed" />
      <div className="sfr-body">
        <div className="sf-ai-row">
          <input className="sf-input sfr-inp" placeholder="Tadqiqot mavzuingizni kiriting..."
            value={topic} onChange={e => setTopic(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") analyze(); }} />
          <button type="button" className="sf-action-btn sf-action-sm" style={{ background: "#7c3aed" }}
            onClick={analyze} disabled={loading || !topic.trim()}>
            {loading ? <span className="sf-spinner" /> : "Tahlil"}
          </button>
        </div>
        {result && (
          <div className="sfr-results">
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0 6px", borderBottom: "1px solid #f1f5f9", marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Yo'nalish</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nashrlar soni</span>
            </div>
            {result.gaps.map((g, i) => (
              <div key={i} className="sfr-row" style={{ marginBottom: 8 }}>
                <div className="sfr-label-wrap">
                  <span className="sfr-label">{g.label}</span>
                  <span className="sfr-tag" style={{ color: g.color, background: g.color + "15" }}>{g.tag}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 7, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(g.pubs / g.maxPubs) * 100}%`, background: g.color, borderRadius: 10, transition: "width 0.7s cubic-bezier(.34,1.56,.64,1)" }} />
                  </div>
                  <span style={{ fontSize: 11, color: g.color, fontWeight: 700, fontFamily: "ui-monospace,monospace", width: 42, textAlign: "right" }}>{g.trend} {g.pubs}</span>
                </div>
              </div>
            ))}
            <p style={{ fontSize: 10, color: "#94a3b8", fontStyle: "italic", margin: "8px 0 0", padding: "8px 0 0", borderTop: "1px solid #f1f5f9" }}>
              Manba: ATMU ilmiy katalogi va ochiq arxivlar · Yangilangan: bugun
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ── 4. OVOZLI QIDIRUV ── Real Web Speech API */
export function VoiceSearchCard() {
  type Phase = "idle" | "listening" | "processing" | "results" | "error";
  type Lang = "uz-UZ" | "ru-RU" | "en-US";

  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [lang, setLang] = useState<Lang>("uz-UZ");
  const [errorMsg, setErrorMsg] = useState("");
  const [results, setResults] = useState<{ title: string; author: string; year: number; shelf: string; available: boolean }[]>([]);
  const [waveH, setWaveH] = useState<number[]>(Array(18).fill(4));
  const recRef = useRef<any>(null);
  const waveRef = useRef<NodeJS.Timeout | null>(null);

  const CATALOG = [
    { title: "Ma'lumotlar bazasi: amaliy qo'llanma", author: "Yuldasheva A.G.", year: 2022, shelf: "A-14", available: true  },
    { title: "Python dasturlash tili",                author: "Ergashev N.",     year: 2023, shelf: "B-03", available: false },
    { title: "Kiberxavfsizlik asoslari",              author: "Qodirov J.B.",    year: 2021, shelf: "C-07", available: true  },
    { title: "Sun'iy intellektga kirish",             author: "Russell S.",      year: 2022, shelf: "A-09", available: true  },
    { title: "Algoritm va ma'lumotlar tuzilmasi",     author: "Cormen T.H.",     year: 2020, shelf: "A-11", available: false },
    { title: "Iqtisodiy nazariya asoslari",           author: "Toshmatov B.R.",  year: 2021, shelf: "D-02", available: true  },
  ];

  const POPULAR = [
    "Iqtisodiyot bo'yicha yangi kitoblar",
    "Algoritm va dasturlash darsliklari",
    "Magistratura uchun dissertatsiyalar",
  ];

  function doSearch(q: string) {
    const words = q.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const found = CATALOG.filter(b =>
      words.some(w => b.title.toLowerCase().includes(w) || b.author.toLowerCase().includes(w))
    );
    setResults(found.length ? found : CATALOG.slice(0, 3));
  }

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setErrorMsg("Chrome yoki Edge brauzeri kerak. Hozirgi brauzeringiz ovozni qo'llab-quvvatlamaydi.");
      setPhase("error");
      return;
    }
    setTranscript(""); setInterim(""); setResults([]); setErrorMsg("");
    const r = new SR();
    r.lang = lang;
    r.continuous = false;
    r.interimResults = true;
    r.maxAlternatives = 1;

    r.onstart = () => {
      setPhase("listening");
      waveRef.current = setInterval(() => {
        setWaveH(Array(18).fill(0).map(() => 4 + Math.random() * 32));
      }, 120);
    };
    r.onresult = (e: any) => {
      let fin = "", inter = "";
      for (const res of Array.from(e.results) as any[]) {
        if (res.isFinal) fin += res[0].transcript;
        else inter += res[0].transcript;
      }
      if (fin) setTranscript(fin);
      setInterim(inter);
    };
    r.onend = () => {
      clearInterval(waveRef.current!);
      setWaveH(Array(18).fill(4));
      setInterim("");
      setPhase("processing");
      setTimeout(() => {
        const q = transcript || interim;
        if (q) { doSearch(q); setPhase("results"); }
        else setPhase("idle");
      }, 600);
    };
    r.onerror = (e: any) => {
      clearInterval(waveRef.current!);
      setWaveH(Array(18).fill(4));
      const msgs: Record<string, string> = {
        "not-allowed": "Mikrofon ruxsati berilmadi — brauzer sozlamalaridan ruxsat bering",
        "no-speech":   "Ovoz aniqlanmadi — yaqinroq gapiring",
        "network":     "Tarmoq xatosi — internetni tekshiring",
      };
      setErrorMsg(msgs[e.error] ?? `Xato: ${e.error}`);
      setPhase("error");
    };
    r.start();
    recRef.current = r;
  }

  function stopListening() { recRef.current?.stop(); }
  function reset() { setPhase("idle"); setTranscript(""); setResults([]); setErrorMsg(""); setWaveH(Array(18).fill(4)); }

  useEffect(() => () => { recRef.current?.stop(); clearInterval(waveRef.current!); }, []);

  const LANGS: { code: Lang; label: string }[] = [
    { code: "uz-UZ", label: "O'zbekcha" },
    { code: "ru-RU", label: "Русский" },
    { code: "en-US", label: "English" },
  ];

  return (
    <Card accent="#b45309">
      {/* Header */}
      <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 12 }}>
        <div className="sf-card-head" style={{ marginBottom: 10 }}>
          <div className="sf-card-icon" style={{ background: "#fff7ed", color: "#b45309" }}>
            <I n="mic" s={17} c="#b45309" />
          </div>
          <div>
            <p className="sf-eyebrow">OVOZLI QIDIRUV</p>
            <h3 className="sf-title">Gapiring, tizim eshitadi</h3>
          </div>
        </div>
        {/* Language selector */}
        <div style={{ display: "flex", gap: 4 }}>
          {LANGS.map(l => (
            <button key={l.code} type="button"
              onClick={() => { setLang(l.code); reset(); }}
              style={{
                flex: 1, padding: "5px 4px", borderRadius: 6,
                border: `1.5px solid ${lang === l.code ? "#b45309" : "#e2e8f0"}`,
                background: lang === l.code ? "#fff7ed" : "transparent",
                color: lang === l.code ? "#b45309" : "#94a3b8",
                fontSize: 10.5, fontWeight: 700, cursor: "pointer", transition: "all .15s",
              }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mic + waveform */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "4px 0 16px" }}>
        {/* Waveform */}
        <div style={{ display: "flex", alignItems: "center", gap: 2.5, height: 44, width: "100%" }}>
          {waveH.map((h, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: 3,
              height: `${h}px`,
              background: phase === "listening"
                ? `hsl(${30 + i * 4}, 80%, ${45 + i % 3 * 8}%)`
                : "#f1f5f9",
              transition: phase === "listening" ? "height 0.1s ease" : "height 0.3s ease",
              maxWidth: 6,
            }} />
          ))}
        </div>

        {/* Mic button */}
        <button type="button"
          onClick={phase === "listening" ? stopListening : startListening}
          disabled={phase === "processing"}
          style={{
            width: 72, height: 72, borderRadius: "50%",
            border: `3px solid ${phase === "listening" ? "#b45309" : "#fed7aa"}`,
            background: phase === "listening" ? "#b45309" : "#fff7ed",
            color: phase === "listening" ? "#fff" : "#b45309",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: phase === "listening" ? "0 0 0 10px #b4530918, 0 0 0 20px #b4530908" : "none",
            transition: "all 0.25s",
          }}>
          {phase === "processing"
            ? <span className="sf-spinner" style={{ borderTopColor: "#b45309" }} />
            : <I n={phase === "listening" ? "stop" : "mic"} s={30} c="currentColor" />}
        </button>

        {/* Status text */}
        <div style={{ textAlign: "center", minHeight: 36 }}>
          {phase === "idle" && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Tugmani bosib gapiring</p>}
          {phase === "listening" && (
            <p style={{ fontSize: 12.5, color: "#b45309", margin: 0, fontStyle: "italic" }}>
              {interim || "Tinglamoqda..."}
            </p>
          )}
          {phase === "processing" && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Katalogdan qidirilmoqda...</p>}
          {phase === "results" && (
            <p style={{ fontSize: 12, color: "#334155", margin: 0 }}>
              <span style={{ fontStyle: "italic", color: "#b45309" }}>"{transcript}"</span>
            </p>
          )}
          {phase === "error" && <p style={{ fontSize: 11.5, color: "#dc2626", margin: 0 }}>{errorMsg}</p>}
        </div>
      </div>

      {/* Results */}
      {phase === "results" && results.length > 0 && (
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
              {results.length} ta natija
            </p>
            <button type="button" className="sf-ghost-btn" onClick={reset} style={{ fontSize: 10 }}>
              <I n="refresh" s={11} c="#94a3b8" /> Qayta
            </button>
          </div>
          {results.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < results.length - 1 ? "1px solid #f8fafc" : "none" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 6, background: "#fff7ed", color: "#92400e",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9.5, fontWeight: 800, flexShrink: 0, fontFamily: "ui-monospace,monospace"
              }}>{r.shelf}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</p>
                <p style={{ fontSize: 10.5, color: "#64748b", margin: 0 }}>{r.author} · {r.year}</p>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, flexShrink: 0,
                background: r.available ? "#d1fae5" : "#fee2e2",
                color: r.available ? "#065f46" : "#9b1a2f",
              }}>{r.available ? "Mavjud" : "Berilgan"}</span>
            </div>
          ))}
        </div>
      )}

      {/* Popular queries */}
      {phase === "idle" && (
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Ko'p so'raladigan</p>
          {POPULAR.map((q, i) => (
            <button key={i} type="button" className="sfv-recent-row"
              onClick={() => { setTranscript(q); doSearch(q); setPhase("results"); }}>
              <I n="search" s={12} c="#94a3b8" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── 5. MATN TARJIMASI ── DeepL uslubi */
export function LiveTranslatorCard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ out: string; terms: { en: string; uz: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const EXAMPLE = "Machine learning algorithms require large datasets for training. The backpropagation method adjusts neural network weights iteratively.";

  function translate(src?: string) {
    const s = src ?? text;
    if (!s.trim()) return;
    setText(s); setLoading(true);
    setTimeout(() => {
      setResult({
        out: "Mashinali o'rganish algoritmlari o'qitish uchun katta ma'lumotlar to'plamlarini talab qiladi. Orqaga tarqalish usuli neyron tarmoq og'irliklarini qayta-qayta sozlaydi.",
        terms: [
          { en: "machine learning",  uz: "mashinali o'rganish" },
          { en: "backpropagation",   uz: "orqaga tarqalish"    },
          { en: "neural network",    uz: "neyron tarmoq"       },
          { en: "dataset",           uz: "ma'lumotlar to'plami" },
        ]
      });
      setLoading(false);
    }, 1100);
  }

  return (
    <Card accent="#0369a1">
      <CardHead eyebrow="TARJIMA VA ATAMALAR" title="Matn tarjimasi" icon="globe" accent="#0369a1" />

      {/* Language pair */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#334155", padding: "5px", background: "#f1f5f9", borderRadius: 6 }}>Inglizcha</span>
        <I n="arrow" s={14} c="#94a3b8" />
        <span style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#0369a1", padding: "5px", background: "#e0f2fe", borderRadius: 6 }}>O'zbekcha</span>
      </div>

      <textarea className="sf-textarea" rows={3}
        placeholder="Inglizcha matn kiriting..."
        value={text} onChange={e => { setText(e.target.value); if (result) setResult(null); }} />

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" className="sf-action-btn" style={{ background: "#0369a1" }}
          onClick={() => translate()} disabled={loading || !text.trim()}>
          {loading ? <span className="sf-spinner" /> : "Tarjima qilish"}
        </button>
        <button type="button" className="sf-ghost-btn" onClick={() => translate(EXAMPLE)}>
          Namuna
        </button>
        {result && (
          <button type="button" className="sf-ghost-btn" onClick={() => { setText(""); setResult(null); }}>
            <I n="x" s={12} c="#94a3b8" />
          </button>
        )}
      </div>

      {result && (
        <>
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 9, padding: "11px 14px", marginTop: 2 }}>
            <p style={{ fontSize: 12.5, color: "#0c4a6e", lineHeight: 1.65, margin: 0, fontFamily: "Georgia,serif" }}>{result.out}</p>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "10px 0 6px" }}>Texnik atamalar</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {result.terms.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 10px", background: "#f8fafc", borderRadius: 7, borderLeft: "3px solid #0369a1" }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0f172a", fontFamily: "ui-monospace,monospace", flex: 1 }}>{t.en}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>&#x2192;</span>
                  <span style={{ fontSize: 11.5, color: "#0369a1", fontWeight: 600, flex: 1 }}>{t.uz}</span>
                  <button type="button" style={{ border: "none", background: "none", cursor: "pointer", padding: 2, color: "#94a3b8" }}
                    onClick={() => navigator.clipboard?.writeText(t.uz)}>
                    <I n="copy" s={11} c="#94a3b8" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

/* ── 6. KOLLEKSIYA TAHLILI ── Ex Libris Alma uslubi */
export function CollectionAnalyticsCard() {
  const [selected, setSelected] = useState<string | null>(null);
  const [ordered, setOrdered] = useState(false);

  const SUBJECTS = [
    { name: "Dasturlash",  demand: 87, stock: 42, new: 12, color: "#4f46e5" },
    { name: "Iqtisodiyot", demand: 74, stock: 68, new: 4,  color: "#0891b2" },
    { name: "Matematika",  demand: 61, stock: 58, new: 3,  color: "#059669" },
    { name: "Huquq",       demand: 55, stock: 23, new: 8,  color: "#dc2626" },
    { name: "Psixologiya", demand: 48, stock: 41, new: 2,  color: "#d97706" },
    { name: "Tarix",       demand: 32, stock: 55, new: 0,  color: "#7c3aed" },
  ];

  const critical = SUBJECTS.filter(s => s.demand > s.stock);

  return (
    <Card accent="#059669">
      <CardHead eyebrow="FOND HOLATI" title="Kolleksiya tahlili" icon="bar" accent="#059669" />

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Jami soha",  val: SUBJECTS.length, color: "#334155" },
          { label: "Tanqislik",  val: critical.length, color: "#dc2626" },
          { label: "Yangi kitob", val: SUBJECTS.reduce((s, x) => s + x.new, 0), color: "#059669" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "8px 4px", background: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 18, fontWeight: 900, color: s.color, margin: 0, fontFamily: "Georgia,serif" }}>{s.val}</p>
            <p style={{ fontSize: 9.5, color: "#94a3b8", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        {[["#334155","Talab"], ["#cbd5e1","Fond"], ["#fca5a5","Tanqis"]].map(([c, l], i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#64748b", fontWeight: 600 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: c, flexShrink: 0 }} />{l}
          </span>
        ))}
      </div>

      {/* Bars */}
      {SUBJECTS.map((s, i) => {
        const gap = s.demand > s.stock;
        const isSel = selected === s.name;
        return (
          <div key={i}
            onClick={() => setSelected(isSel ? null : s.name)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 6px", cursor: "pointer", borderRadius: 6, background: isSel ? "#f8fafc" : "transparent", transition: "background .12s" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#334155", width: 80, flexShrink: 0 }}>{s.name}</span>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ height: 6, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.demand}%`, background: gap ? "#fca5a5" : "#c7d2fe", borderRadius: 10 }} />
              </div>
              <div style={{ height: 6, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.stock}%`, background: s.color, borderRadius: 10, opacity: .75 }} />
              </div>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20, flexShrink: 0,
              fontFamily: "ui-monospace,monospace",
              background: gap ? "#fce8ea" : "#d1fae5",
              color: gap ? "#9b1a2f" : "#065f46",
            }}>{gap ? `-${s.demand - s.stock}` : "OK"}</span>
          </div>
        );
      })}

      {/* Action footer */}
      <button type="button"
        onClick={() => setOrdered(true)}
        style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          marginTop: 10, padding: "9px 12px", borderRadius: 8, cursor: "pointer",
          background: ordered ? "#d1fae5" : "#fef2f2",
          border: `1px solid ${ordered ? "#6ee7b7" : "#fecaca"}`,
          color: ordered ? "#065f46" : "#9b1a2f",
          fontSize: 11.5, fontWeight: 600, textAlign: "left",
        }}>
        <I n={ordered ? "check" : "bell"} s={13} c="currentColor" />
        {ordered ? "Buyurtma yuborildi — ombor xabar qilindi" : `${critical.length} ta tanqis soha — xarid buyurtmasini yuborish`}
      </button>
    </Card>
  );
}

/* ── 7. QAYTARISH BASHORATI ── Koha ILS uslubi */
export function ReturnPredictionCard() {
  const [loans, setLoans] = useState([
    { id: 1, name: "S. Mirzayev",  init: "SM", book: "Algoritm asoslari",     due: -2, risk: 98, color: "#dc2626", sms: false },
    { id: 2, name: "N. Hasanova",  init: "NH", book: "Veb dasturlash",         due: 1,  risk: 84, color: "#ea580c", sms: false },
    { id: 3, name: "B. Toshmatov", init: "BT", book: "Ma'lumotlar bazasi",     due: 3,  risk: 61, color: "#d97706", sms: false },
    { id: 4, name: "Z. Rahimova",  init: "ZR", book: "Ingliz tili o'quv qo'l.", due: 5,  risk: 32, color: "#ca8a04", sms: false },
    { id: 5, name: "A. Yusupov",   init: "AY", book: "Matematika I",           due: 8,  risk: 12, color: "#65a30d", sms: false },
  ]);

  function sendSms(id: number) {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, sms: true } : l));
  }

  const overdue = loans.filter(l => l.due < 0).length;
  const smsCount = loans.filter(l => l.sms).length;

  return (
    <Card accent="#dc2626">
      <CardHead eyebrow="QAYTARISH BASHORATI" title="Kechikish xavfi" icon="shield" accent="#dc2626" />

      {/* Stats */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Muddati o'tgan", val: overdue, color: "#dc2626", bg: "#fef2f2" },
          { label: "Yuqori xavf",    val: loans.filter(l => l.risk > 70).length, color: "#ea580c", bg: "#fff7ed" },
          { label: "SMS yuborildi",  val: smsCount, color: "#059669", bg: "#f0fdf4" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "7px 8px", background: s.bg, borderRadius: 8, textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 900, color: s.color, margin: 0, fontFamily: "Georgia,serif" }}>{s.val}</p>
            <p style={{ fontSize: 9, color: "#94a3b8", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 72px 70px", padding: "5px 8px", background: "#f8fafc", borderRadius: 6, marginBottom: 3 }}>
        {["O'quvchi", "Kitob", "Kun", "Xavf"].map((h, i) => (
          <span key={i} style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "ui-monospace,monospace" }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {loans.map((l) => (
        <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 72px 70px", padding: "8px 8px", alignItems: "center", borderBottom: "1px solid #f8fafc", transition: "background .12s" }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#fafafa"}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#0f172a", fontWeight: 600, minWidth: 0 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: l.color + "22", color: l.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8.5, fontWeight: 800, flexShrink: 0 }}>
              {l.init}
            </span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</span>
          </span>
          <span style={{ fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 4 }}>{l.book}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: l.due < 0 ? "#dc2626" : l.due <= 3 ? "#d97706" : "#65a30d", whiteSpace: "nowrap" }}>
            {l.due < 0 ? `${Math.abs(l.due)} k. o'tdi` : `${l.due} kun`}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {l.risk > 50 ? (
              <button type="button"
                onClick={() => sendSms(l.id)}
                style={{
                  fontSize: 9.5, padding: "3px 7px", borderRadius: 5, border: "none", cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap",
                  background: l.sms ? "#d1fae5" : "#fee2e2",
                  color: l.sms ? "#065f46" : "#9b1a2f",
                  transition: "all .15s",
                }}>
                {l.sms ? "Yuborildi" : "SMS"}
              </button>
            ) : (
              <span style={{ fontSize: 10, fontWeight: 700, color: l.color, fontFamily: "ui-monospace,monospace" }}>{l.risk}%</span>
            )}
          </span>
        </div>
      ))}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, padding: "9px 12px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#dc2626", flexShrink: 0, animation: "fsc-pulse 1.5s ease-in-out infinite" }} />
        <span style={{ fontSize: 11.5, color: "#9b1a2f" }}>
          {smsCount > 0 ? `${smsCount} ta SMS yuborildi` : `${overdue} ta kitob muddati o'tdi — SMS tugmasini bosing`}
        </span>
      </div>
    </Card>
  );
}

/* ── 8. KITOB KASHFIYOTCHI ── Goodreads / Open Library uslubi */
export function SerendipityCard() {
  const [prefs, setPrefs] = useState({ sci: 3, hist: 2, tech: 4, lit: 1 });
  const [book, setBook] = useState<{ title: string; author: string; year: number; pages: number; match: number; why: string; color: string; genre: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const BOOKS = [
    { title: "Turing testi",              author: "Andrew Hodges",  year: 2019, pages: 312, match: 94, why: "Texnologiya va fan qiziqishingiz asosida", color: "#4f46e5", genre: "Ilm-fan" },
    { title: "Ulug' Ipak yo'li",          author: "Peter Frankopan",year: 2020, pages: 428, match: 88, why: "Tarix bo'limidan ko'p o'qiganingiz asosida", color: "#b45309", genre: "Tarix" },
    { title: "Koinot geometriyasi",       author: "Sean Carroll",   year: 2021, pages: 376, match: 91, why: "Matematik va fizika qiziqishlaringizga mos", color: "#0891b2", genre: "Fizika" },
    { title: "Sapiens: Qisqa tarix",      author: "Yuval Noah Harari",year: 2018,pages: 498,match: 86, why: "Ko'p o'qilgan janrlaringiz asosida",       color: "#059669", genre: "Tarix" },
    { title: "Cheksiz o'yin",             author: "Simon Sinek",    year: 2022, pages: 256, match: 82, why: "Menejment va liderlik qiziqishingiz asosida",color: "#7c3aed", genre: "Biznes" },
  ];

  function discover() {
    setLoading(true); setBook(null); setSaved(false);
    setTimeout(() => {
      const weights = BOOKS.map(b => {
        const g = b.genre;
        let w = b.match;
        if (g === "Ilm-fan") w += prefs.sci * 3;
        if (g === "Tarix")   w += prefs.hist * 3;
        if (g === "Fizika")  w += (prefs.sci + prefs.tech);
        if (g === "Biznes")  w += prefs.tech * 2;
        return w;
      });
      const max = Math.max(...weights);
      const idx = weights.indexOf(max);
      setBook(BOOKS[idx]);
      setLoading(false);
    }, 1200);
  }

  const GENRES = [
    { key: "sci",  label: "Fan va ilm"   },
    { key: "hist", label: "Tarix"        },
    { key: "tech", label: "Texnologiya"  },
    { key: "lit",  label: "Adabiyot"     },
  ];

  return (
    <Card accent="#7c3aed">
      <CardHead eyebrow="KITOB KASHFIYOTI" title="Sizga mos kitob" icon="star" accent="#7c3aed" />

      {/* Sliders */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
        {GENRES.map(g => {
          const val = prefs[g.key as keyof typeof prefs];
          return (
            <div key={g.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, width: 90, flexShrink: 0 }}>{g.label}</span>
              <input type="range" min={1} max={5} value={val}
                style={{ flex: 1, accentColor: "#7c3aed" }}
                onChange={e => setPrefs(p => ({ ...p, [g.key]: Number(e.target.value) }))} />
              <span style={{ fontSize: 11, color: "#7c3aed", width: 56, textAlign: "right", flexShrink: 0, letterSpacing: 1 }}>
                {"●".repeat(val)}{"○".repeat(5 - val)}
              </span>
            </div>
          );
        })}
      </div>

      <button type="button" className="sf-action-btn"
        style={{ background: "#7c3aed", alignSelf: "stretch", justifyContent: "center" }}
        onClick={discover}>
        {loading ? <span className="sf-spinner" /> : <><I n="star" s={14} c="#fff" /> Kitob kashf qil</>}
      </button>

      {book && (
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 14, borderRadius: 12, border: `1.5px solid ${book.color}33`, background: `${book.color}08`, marginTop: 2 }}>
          {/* Book spine */}
          <div style={{ width: 48, height: 68, borderRadius: 4, background: book.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, writingMode: "vertical-rl", textOrientation: "mixed" }}>
            <span style={{ fontSize: 8, fontWeight: 800, color: "#fff", opacity: .9, textTransform: "uppercase", letterSpacing: 1 }}>
              {book.author.split(" ").pop()}
            </span>
          </div>
          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: "0 0 2px", fontFamily: "Georgia,serif", lineHeight: 1.3 }}>{book.title}</p>
            <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px" }}>{book.author} · {book.year} · {book.pages} bet</p>
            <p style={{ fontSize: 11, color: book.color, fontStyle: "italic", margin: "0 0 8px" }}>{book.why}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: book.color, fontFamily: "ui-monospace,monospace" }}>{book.match}% mos</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: book.color + "18", color: book.color, fontWeight: 700 }}>{book.genre}</span>
              <button type="button"
                onClick={() => setSaved(s => !s)}
                style={{ marginLeft: "auto", border: "none", background: "none", cursor: "pointer", color: saved ? book.color : "#94a3b8" }}>
                <I n="star" s={15} c={saved ? book.color : "#94a3b8"} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ════════════════════════════════════
   PANEL WRAPPER
════════════════════════════════════ */
export function SmartFeaturesPanel({ role }: { role: string }) {
  return (
    <div className="sf-panel">
      {role === "student" && (
        <>
          <div className="sf-grid-2"><ReadingStreakCard /><RecommendationsCard /></div>
          <div className="sf-grid-2"><CitationCard /><PlagiarismCard /></div>
          <div className="sf-grid-2"><AICompanionCard /><ReadingPlannerCard /></div>
          <div className="sf-grid-2"><ResearchGapCard /><VoiceSearchCard /></div>
          <div className="sf-grid-2"><LiveTranslatorCard /><SerendipityCard /></div>
        </>
      )}
      {role === "teacher" && (
        <>
          <div className="sf-grid-2"><CoursePackCard /><CitationCard /></div>
          <div className="sf-grid-2"><AICompanionCard /><ResearchGapCard /></div>
          <SerendipityCard />
        </>
      )}
      {role === "librarian" && (
        <>
          <div className="sf-grid-2"><QRShelfCard /><AISearchCard /></div>
          <div className="sf-grid-2"><VoiceSearchCard /><CollectionAnalyticsCard /></div>
          <ReturnPredictionCard />
        </>
      )}
      {role === "admin" && (
        <>
          <FeatureStatsCard />
          <div className="sf-grid-2" style={{ marginTop: 16 }}><AISearchCard /><CitationCard /></div>
          <div className="sf-grid-2"><CollectionAnalyticsCard /><ReturnPredictionCard /></div>
        </>
      )}
    </div>
  );
}
