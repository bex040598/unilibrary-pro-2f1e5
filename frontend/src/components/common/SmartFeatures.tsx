import { useState } from "react";

/* ── Minimal icon for SmartFeatures ── */
const SF_ICONS: Record<string, string> = {
  search:   "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  loan:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  layers:   "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  bar:      "M18 20V10M12 20V4M6 20v-6",
};
function SFIcon({ id, size = 16, color = "currentColor" }: { id: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={SF_ICONS[id] ?? SF_ICONS.search} />
    </svg>
  );
}

/* ════════════════════════════════════
   READING STREAK — student
════════════════════════════════════ */
export function ReadingStreakCard() {
  const streak = 7;
  const DAYS = ["D","S","Ch","P","J","Sh","Y"];
  const BADGES = [
    { icon: "🔥", label: "7 kun streak", earned: true  },
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

/* ════════════════════════════════════
   CITATION GENERATOR — student + teacher
════════════════════════════════════ */
export function CitationCard() {
  const [format, setFormat] = useState<"APA"|"MLA"|"GOST">("APA");
  const [bookIdx, setBookIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const BOOKS = [
    { title: "Ma'lumotlar bazasi: amaliy qo'llanma", author: "Yuldasheva A.", year: 2022, publisher: "ATMU nashriyoti", place: "Nukus"    },
    { title: "Python dasturlash tili",                author: "Ergashev N.",   year: 2023, publisher: "Fan",             place: "Toshkent" },
    { title: "Kiberxavfsizlik asoslari",              author: "Qodirov J.",    year: 2021, publisher: "ATMU",            place: "Nukus"    },
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

/* ════════════════════════════════════
   PLAGIARISM PRE-CHECK — student
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

/* ════════════════════════════════════
   BOOK RECOMMENDATIONS — student
════════════════════════════════════ */
export function RecommendationsCard() {
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

/* ════════════════════════════════════
   COURSE PACK MANAGER — teacher
════════════════════════════════════ */
export function CoursePackCard() {
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

/* ════════════════════════════════════
   QR SHELF NAVIGATOR — librarian
════════════════════════════════════ */
export function QRShelfCard() {
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
        <button type="button" className="px-plag-btn" style={{background:"#002147"}}
          onClick={() => setGenerated(true)}>QR yaratish</button>
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

/* ════════════════════════════════════
   AI NATURAL SEARCH — librarian + admin
════════════════════════════════════ */
export function AISearchCard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{title:string; author:string; year:number; type:string}[]>([]);
  const [searching, setSearching] = useState(false);
  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setResults([
        { title: "Ma'lumotlar bazasini loyihalash", author: "C. J. Date",      year: 2019, type: "Darslik"   },
        { title: "SQL: to'liq qo'llanma",           author: "Ben Forta",       year: 2020, type: "Qo'llanma" },
        { title: "NoSQL ma'lumotlar bazalari",       author: "Pramod Sadalage", year: 2021, type: "Darslik"   },
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

/* ════════════════════════════════════
   FEATURE STATS — admin
════════════════════════════════════ */
export function FeatureStatsCard() {
  const STATS = [
    { icon: "search", label: "AI qidiruv",       uses: 1247, growth: 34, color: "#4f46e5", spark: [800, 950, 1050, 1180, 1247] },
    { icon: "loan",   label: "Iqtibos generator", uses: 892,  growth: 18, color: "#0891b2", spark: [580, 670, 750,  830,  892]  },
    { icon: "shield", label: "Plagiat tekshiruv", uses: 437,  growth: 61, color: "#7c3aed", spark: [170, 240, 320,  390,  437]  },
    { icon: "star",   label: "Kitob tavsiyalar",  uses: 2184, growth: 42, color: "#059669", spark: [1100,1450,1750,1980, 2184] },
    { icon: "layers", label: "Course Pack",       uses: 156,  growth: 28, color: "#d97706", spark: [75,  100, 118,  138,  156]  },
    { icon: "grid",   label: "QR navigatsiya",    uses: 341,  growth: 89, color: "#dc2626", spark: [90,  145, 210,  275,  341]  },
    { icon: "bar",    label: "Streak / Progress", uses: 678,  growth: 53, color: "#0284c7", spark: [280, 380, 490,  590,  678]  },
  ];
  const total = STATS.reduce((s, x) => s + x.uses, 0);
  const maxUses = Math.max(...STATS.map(s => s.uses));
  return (
    <div className="px-feat-card px-feat-card-full">
      <div className="px-fsc-header">
        <div className="px-feat-head">
          <p className="px-feat-eyebrow">SMART XIZMATLAR TAHLILI</p>
          <h3 className="px-feat-title">Funksiyalar foydalanish ko'rsatkichlari</h3>
        </div>
        <div className="px-fsc-total">
          <span className="px-fsc-total-n">{total.toLocaleString()}</span>
          <span className="px-fsc-total-l">Jami foydalanish</span>
        </div>
      </div>
      <div className="px-fsc-rainbow">
        {STATS.map((s, i) => (
          <div key={i} className="px-fsc-rainbow-seg" style={{flex: s.uses, background: s.color}} title={s.label} />
        ))}
      </div>
      <div className="px-fstats-grid">
        {STATS.map((s, i) => {
          const barW = ((s.uses / maxUses) * 100).toFixed(1);
          const W = 56, H = 26;
          const pts = s.spark.map((v, j) => {
            const mx = Math.max(...s.spark);
            return `${j * (W / (s.spark.length - 1))},${H - (v / mx) * H}`;
          }).join(" ");
          return (
            <div key={i} className="px-fstat-item">
              <div className="px-fstat-top">
                <div className="px-fstat-icon-wrap" style={{background: s.color + "15"}}>
                  <SFIcon id={s.icon} size={15} color={s.color} />
                </div>
                <span className="px-fstat-label">{s.label}</span>
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="px-fstat-spark">
                  <polyline points={pts} fill="none" stroke={s.color} strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" opacity="0.75"/>
                  <circle cx={W} cy={H - (s.spark[s.spark.length-1] / Math.max(...s.spark)) * H}
                    r="2.5" fill={s.color}/>
                </svg>
              </div>
              <div className="px-fstat-mid">
                <span className="px-fstat-uses">{s.uses.toLocaleString()}</span>
                <span className="px-fstat-growth">+{s.growth}%</span>
              </div>
              <div className="px-fstat-bar-track">
                <div className="px-fstat-bar-fill" style={{width:`${barW}%`, background: s.color}}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   SMART PANEL — role-based wrapper
════════════════════════════════════ */
export function SmartFeaturesPanel({ role }: { role: string }) {
  return (
    <div style={{display:"flex", flexDirection:"column", gap:16}}>
      {role === "student" && (
        <>
          <div style={{display:"flex", gap:16, flexWrap:"wrap"}}>
            <ReadingStreakCard />
            <RecommendationsCard />
          </div>
          <div style={{display:"flex", gap:16, flexWrap:"wrap"}}>
            <CitationCard />
            <PlagiarismCard />
          </div>
        </>
      )}
      {role === "teacher" && (
        <div style={{display:"flex", gap:16, flexWrap:"wrap"}}>
          <CoursePackCard />
          <CitationCard />
        </div>
      )}
      {role === "librarian" && (
        <div style={{display:"flex", gap:16, flexWrap:"wrap"}}>
          <QRShelfCard />
          <AISearchCard />
        </div>
      )}
      {role === "admin" && (
        <>
          <FeatureStatsCard />
          <div style={{display:"flex", gap:16, flexWrap:"wrap", marginTop:4}}>
            <AISearchCard />
            <CitationCard />
          </div>
        </>
      )}
    </div>
  );
}
