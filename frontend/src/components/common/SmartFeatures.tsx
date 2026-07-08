import { useState, useRef, useEffect } from "react";

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
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={P[n] ?? P.book} />
    </svg>
  );
}

function Card({ accent = "#002147", children }: { accent?: string; children: React.ReactNode }) {
  return <div className="sf-card" style={{ "--sf-accent": accent } as React.CSSProperties}>{children}</div>;
}
function CardHead({ eyebrow, title, icon, accent }: { eyebrow: string; title: string; icon: string; accent: string }) {
  return (
    <div className="sf-card-head">
      <div className="sf-card-icon" style={{ background: accent + "18", color: accent }}><I n={icon} s={17} c={accent} /></div>
      <div><p className="sf-eyebrow">{eyebrow}</p><h3 className="sf-title">{title}</h3></div>
    </div>
  );
}

/* ════════ 1. READING STREAK ════════ */
export function ReadingStreakCard() {
  const [done, setDone] = useState([true, true, true, true, false, false, false]);
  const DAYS = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];
  const streak = done.filter(Boolean).length;
  const pct = Math.round((streak / 7) * 100);
  const MILES = [
    { d: 7,  icon: "🔥", label: "Hafta yugurdagi", done: streak >= 7  },
    { d: 14, icon: "📚", label: "Ikki hafta",      done: streak >= 14 },
    { d: 30, icon: "⭐", label: "Oy chempioni",    done: streak >= 30 },
  ];
  return (
    <Card accent="#f97316">
      <CardHead eyebrow="KUNLIK STREAK" title="O'qish seriyasi" icon="flame" accent="#f97316" />
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "10px 0 4px" }}>
        <span style={{ fontSize: 52, fontWeight: 900, color: "#f97316", lineHeight: 1, fontFamily: "Georgia,serif" }}>{streak}</span>
        <div><div style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>kun</div><div style={{ fontSize: 11, color: "#94a3b8" }}>Maqsad: 14 kun</div></div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#f97316" }}>{pct}%</div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>haftalik</div>
        </div>
      </div>
      <div className="sf-progress-bar-wrap">
        <div className="sf-progress-bar" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#f97316,#fb923c)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "12px 0" }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <button type="button" onClick={() => setDone(p => { const n = [...p]; n[i] = !n[i]; return n; })}
              style={{ width: 30, height: 30, borderRadius: "50%", border: `2px solid ${done[i] ? "#f97316" : "#e2e8f0"}`, background: done[i] ? "#fff7ed" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {done[i] ? <I n="flame" s={12} c="#f97316" /> : <span style={{ fontSize: 10, color: "#94a3b8" }}>{i + 1}</span>}
            </button>
            <span style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 600 }}>{d}</span>
          </div>
        ))}
      </div>
      {MILES.map((m, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 8, background: m.done ? "#fff7ed" : "#f8fafc", border: `1px solid ${m.done ? "#fed7aa" : "#f1f5f9"}`, marginBottom: i < 2 ? 6 : 0 }}>
          <span style={{ fontSize: 16 }}>{m.icon}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: m.done ? "#92400e" : "#94a3b8", flex: 1 }}>{m.label}</span>
          <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "ui-monospace,monospace" }}>{m.d} kun</span>
          {m.done && <I n="check" s={13} c="#15803d" />}
        </div>
      ))}
    </Card>
  );
}

/* ════════ 2. RECOMMENDATIONS ════════ */
export function RecommendationsCard() {
  const [liked, setLiked] = useState<number[]>([0]);
  const RECS = [
    { title: "Algoritm va ma'lumotlar tuzilmasi", author: "T. Cormen",   match: 97, type: "Majburiy",   color: "#002147", bg: "#e8edf5" },
    { title: "Veb dasturlash asoslari",            author: "B. Flanagan", match: 91, type: "Tavsiya",    color: "#0891b2", bg: "#e0f2fe" },
    { title: "Sun'iy intellektga kirish",          author: "S. Russell",  match: 85, type: "Qo'shimcha", color: "#7c3aed", bg: "#ede9fe" },
    { title: "Python bilan ma'lumotlar tahlili",   author: "W. McKinney", match: 78, type: "Qo'shimcha", color: "#7c3aed", bg: "#ede9fe" },
  ];
  return (
    <Card accent="#059669">
      <CardHead eyebrow="KURSGA MOS TAVSIYALAR" title="Tavsiya etilgan kitoblar" icon="target" accent="#059669" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        {RECS.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#cbd5e1", width: 16 }}>{i + 1}</span>
            <div style={{ width: 32, height: 40, borderRadius: 4, background: r.bg, color: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, flexShrink: 0, fontFamily: "Georgia,serif" }}>{r.title[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</p>
              <p style={{ fontSize: 10.5, color: "#64748b", margin: 0 }}>{r.author}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: r.color }}>{r.match}%</span>
              <span style={{ fontSize: 9.5, padding: "1px 6px", borderRadius: 20, background: r.bg, color: r.color, fontWeight: 700 }}>{r.type}</span>
            </div>
            <button type="button" onClick={() => setLiked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
              style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}>
              <I n="star" s={14} c={liked.includes(i) ? "#f97316" : "#e2e8f0"} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ════════ 3. CITATION ════════ */
export function CitationCard() {
  const [fmt, setFmt] = useState<"APA" | "MLA" | "GOST">("APA");
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
    MLA:  `${b.author}. "${b.title}." ${b.publisher}, ${b.year}.`,
    GOST: `${b.author} ${b.title}. -- ${b.place}: ${b.publisher}, ${b.year}. -- 348 b.`,
  };
  return (
    <Card accent="#0891b2">
      <CardHead eyebrow="IQTIBOS FORMATLASH" title="Adabiyotlar ro'yxati" icon="quote" accent="#0891b2" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <select className="sf-input" value={bookIdx} onChange={e => setBookIdx(+e.target.value)}>
          {BOOKS.map((bk, i) => <option key={i} value={i}>{bk.title}</option>)}
        </select>
        <div style={{ display: "flex", gap: 6 }}>
          {(["APA","MLA","GOST"] as const).map(f => (
            <button key={f} type="button" onClick={() => setFmt(f)}
              style={{ flex: 1, padding: "6px 4px", borderRadius: 7, border: `1.5px solid ${fmt === f ? "#0891b2" : "#e2e8f0"}`, background: fmt === f ? "#0891b2" : "transparent", color: fmt === f ? "#fff" : "#64748b", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "10px 12px" }}>
          <p style={{ fontSize: 12.5, color: "#0c4a6e", lineHeight: 1.6, margin: 0, fontFamily: "Georgia,serif" }}>{cites[fmt]}</p>
        </div>
        <button type="button" className="sf-action-btn" style={{ background: "#0891b2" }}
          onClick={() => { navigator.clipboard?.writeText(cites[fmt]); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
          <I n="copy" s={14} c="#fff" /> {copied ? "Nusxalandi!" : "Nusxalash"}
        </button>
      </div>
    </Card>
  );
}

/* ════════ 4. PLAGIARISM ════════ */
export function PlagiarismCard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ pct: number; srcs: { name: string; pct: number }[] } | null>({
    pct: 8,
    srcs: [
      { name: "Yuldasheva A. — Ma'lumotlar bazasi (2022)", pct: 5 },
      { name: "Ergashev N. — Python (2023)",               pct: 3 },
    ]
  });
  const [busy, setBusy] = useState(false);
  function check() {
    if (!text.trim()) return;
    setBusy(true); setResult(null);
    setTimeout(() => {
      const pct = Math.floor(Math.random() * 20) + 5;
      setResult({ pct, srcs: [{ name: "Kutubxona manbalari", pct: Math.floor(pct * .6) }, { name: "Internet manbalar", pct: Math.ceil(pct * .4) }] });
      setBusy(false);
    }, 1600);
  }
  const safe = (result?.pct ?? 0) < 20;
  return (
    <Card accent="#7c3aed">
      <CardHead eyebrow="MATN TAHLILI" title="Plagiat tekshiruvi" icon="shield" accent="#7c3aed" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        {result && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 14px", borderRadius: 10, background: safe ? "#f0fdf4" : "#fef2f2", border: `1px solid ${safe ? "#bbf7d0" : "#fecaca"}` }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: safe ? "#16a34a" : "#dc2626", lineHeight: 1, fontFamily: "Georgia,serif" }}>{result.pct}%</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: safe ? "#16a34a" : "#dc2626", textTransform: "uppercase" }}>{safe ? "Maqbul" : "Yuqori"}</div>
            </div>
            <div style={{ flex: 1 }}>
              {result.srcs.map((s, i) => (
                <div key={i} style={{ marginBottom: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
                    <span style={{ color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>{s.name}</span>
                    <span style={{ fontWeight: 700, color: "#334155", flexShrink: 0 }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: "#e2e8f0", borderRadius: 10 }}>
                    <div style={{ height: "100%", width: `${Math.min(s.pct * 6, 100)}%`, background: "#f59e0b", borderRadius: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <textarea className="sf-textarea" rows={3} placeholder="Kurs ishi matnini shu yerga joylashtiring..." value={text} onChange={e => setText(e.target.value)} />
        <button type="button" className="sf-action-btn" style={{ background: "#7c3aed" }}
          onClick={check} disabled={busy || !text.trim()}>
          {busy ? <><span className="sf-spinner" /> Tekshirilmoqda...</> : <><I n="search" s={14} c="#fff" /> Tekshirish</>}
        </button>
      </div>
    </Card>
  );
}

/* ════════ 5. COURSE PACK ════════ */
export function CoursePackCard() {
  const [packs, setPacks] = useState([
    { name: "Ma'lumotlar bazasi — 3-kurs",   items: 7, students: 42, views: 187, pct: 92, color: "#002147" },
    { name: "Kiberxavfsizlik — Magistratura", items: 5, students: 18, views: 94,  pct: 68, color: "#0891b2" },
    { name: "Python asoslari — 2-kurs",       items: 9, students: 65, views: 312, pct: 45, color: "#059669" },
  ]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  return (
    <Card accent="#d97706">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="sf-card-icon" style={{ background: "#fef3c718", color: "#d97706" }}><I n="pack" s={17} c="#d97706" /></div>
          <div><p className="sf-eyebrow">KURS MATERIALLARI</p><h3 className="sf-title">Resurs to'plamlari</h3></div>
        </div>
        <button type="button" onClick={() => setAdding(!adding)}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: "1.5px solid #002147", background: "#002147", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
          <I n="plus" s={13} c="#fff" /> Yangi
        </button>
      </div>
      {adding && (
        <div style={{ padding: 10, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, marginBottom: 10 }}>
          <input className="sf-input" placeholder="To'plam nomi..." value={newName} onChange={e => setNewName(e.target.value)}
            style={{ marginBottom: 6 }}
            onKeyDown={e => { if (e.key === "Enter" && newName.trim()) { setPacks(p => [...p, { name: newName.trim(), items: 0, students: 0, views: 0, pct: 0, color: "#7c3aed" }]); setNewName(""); setAdding(false); } }} />
          <p style={{ fontSize: 10, color: "#92400e", margin: 0 }}>Enter tugmasi bilan saqlang</p>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {packs.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: 10, borderRadius: 9, background: "#f8fafc", border: "1px solid #f1f5f9", alignItems: "center" }}>
            <div style={{ width: 4, borderRadius: 4, alignSelf: "stretch", background: p.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
              <div style={{ display: "flex", gap: 8, fontSize: 10, color: "#64748b" }}>
                <span>{p.items} material</span><span>·</span><span>{p.students} talaba</span><span>·</span>
                <span style={{ color: p.color, fontWeight: 700 }}>{p.pct}% faollik</span>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: p.color }}>{p.views}</div>
              <div style={{ fontSize: 9.5, color: "#94a3b8" }}>ko'rish</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ════════ 6. QR SHELF ════════ */
export function QRShelfCard() {
  const [selected, setSelected] = useState(0);
  const SHELVES = [
    { id: "A-14", topic: "Informatika",  books: 28, scans: 47 },
    { id: "B-03", topic: "Iqtisodiyot", books: 34, scans: 31 },
    { id: "C-07", topic: "Matematika",  books: 19, scans: 22 },
    { id: "D-11", topic: "Tilshunoslik",books: 41, scans: 63 },
  ];
  const s = SHELVES[selected];
  return (
    <Card accent="#002147">
      <CardHead eyebrow="JAVON NAVIGATSIYASI" title="QR-kod boshqaruvi" icon="qr" accent="#002147" />
      <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <svg width={80} height={80} viewBox="0 0 88 88">
            {[0,1,2,3,4,5,6,7,8].flatMap(r => [0,1,2,3,4,5,6,7,8].map(c => {
              const on = (r * 8 + c + r * c + r + c) % 4 !== 0;
              return on ? <rect key={`${r}-${c}`} x={c*10+1} y={r*10+1} width={8} height={8} rx={1.5} fill="#002147" /> : null;
            }))}
            <rect x={1}  y={1}  width={28} height={28} rx={3} fill="none" stroke="#002147" strokeWidth={2.5} />
            <rect x={7}  y={7}  width={16} height={16} rx={2} fill="#002147" />
            <rect x={59} y={1}  width={28} height={28} rx={3} fill="none" stroke="#002147" strokeWidth={2.5} />
            <rect x={65} y={7}  width={16} height={16} rx={2} fill="#002147" />
            <rect x={1}  y={59} width={28} height={28} rx={3} fill="none" stroke="#002147" strokeWidth={2.5} />
            <rect x={7}  y={65} width={16} height={16} rx={2} fill="#002147" />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#002147", fontFamily: "ui-monospace,monospace", padding: "3px 10px", background: "#e8edf5", borderRadius: 6 }}>{s.id}</span>
          <button type="button" className="sf-ghost-btn" style={{ fontSize: 10 }}><I n="print" s={11} c="#002147" /> Chop</button>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: "4px 8px", marginBottom: 4 }}>
            {["Javon","Mavzu","Kitob","Skan"].map((h,i) => <span key={i} style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>)}
          </div>
          {SHELVES.map((sh, i) => (
            <div key={i} onClick={() => setSelected(i)}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: "4px 8px", padding: "6px", borderRadius: 7, cursor: "pointer", marginBottom: 3, background: selected === i ? "#e8edf5" : "transparent", border: `1px solid ${selected === i ? "#002147" : "transparent"}` }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#002147", fontFamily: "ui-monospace,monospace" }}>{sh.id}</span>
              <span style={{ fontSize: 11, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sh.topic}</span>
              <span style={{ fontSize: 11, color: "#64748b", textAlign: "center" }}>{sh.books}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#002147", textAlign: "center" }}>{sh.scans}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ════════ 7. AI SEARCH ════════ */
export function AISearchCard() {
  const [query, setQuery] = useState("ma'lumotlar bazasi");
  const [results, setResults] = useState([
    { title: "Ma'lumotlar bazasini loyihalash", author: "C. J. Date",  year: 2019, shelf: "A-14", available: true  },
    { title: "SQL: to'liq qo'llanma",           author: "Ben Forta",  year: 2020, shelf: "A-14", available: false },
    { title: "NoSQL ma'lumotlar bazalari",       author: "P. Sadalage",year: 2021, shelf: "B-02", available: true  },
  ]);
  const [busy, setBusy] = useState(false);
  const CATALOG = [
    { title: "Ma'lumotlar bazasini loyihalash", author: "C. J. Date",  year: 2019, shelf: "A-14", available: true  },
    { title: "SQL: to'liq qo'llanma",           author: "Ben Forta",   year: 2020, shelf: "A-14", available: false },
    { title: "NoSQL ma'lumotlar bazalari",       author: "P. Sadalage", year: 2021, shelf: "B-02", available: true  },
    { title: "Python dasturlash tili",           author: "Ergashev N.", year: 2023, shelf: "B-03", available: true  },
    { title: "Kiberxavfsizlik asoslari",         author: "Qodirov J.",  year: 2021, shelf: "C-07", available: false },
    { title: "Algoritm va ma'lumotlar tuzilmasi",author: "Cormen T.H.", year: 2020, shelf: "A-11", available: true  },
  ];
  function search(q: string) {
    setQuery(q); setBusy(true);
    setTimeout(() => {
      const words = q.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const found = CATALOG.filter(b => words.some(w => b.title.toLowerCase().includes(w) || b.author.toLowerCase().includes(w)));
      setResults(found.length ? found : CATALOG.slice(0, 3));
      setBusy(false);
    }, 900);
  }
  const CHIPS = ["python darslik", "kiberxavfsizlik", "algoritm"];
  return (
    <Card accent="#4f46e5">
      <CardHead eyebrow="QIDIRUV TIZIMI" title="Semantik qidiruv" icon="search" accent="#4f46e5" />
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <input className="sf-input" style={{ flex: 1 }} value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search(query)} placeholder="Kitob nomi, muallif yoki mavzu..." />
        <button type="button" className="sf-action-btn sf-action-sm" style={{ background: "#4f46e5", flexShrink: 0 }}
          onClick={() => search(query)} disabled={busy}>
          {busy ? <span className="sf-spinner" /> : <I n="search" s={14} c="#fff" />}
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
        {CHIPS.map((c, i) => <button key={i} type="button" className="sf-suggestion-chip" onClick={() => search(c)}>{c}</button>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
        {results.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#c7d2fe", width: 18 }}>{i + 1}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</p>
              <p style={{ fontSize: 10.5, color: "#64748b", margin: 0 }}>{r.author} · {r.year} · <span style={{ fontFamily: "ui-monospace,monospace", fontWeight: 700 }}>{r.shelf}</span></p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, flexShrink: 0, background: r.available ? "#d1fae5" : "#fee2e2", color: r.available ? "#065f46" : "#9b1a2f" }}>
              {r.available ? "Mavjud" : "Berilgan"}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ════════ 8. FEATURE STATS ════════ */
export function FeatureStatsCard() {
  const STATS = [
    { icon: "target", label: "Kitob tavsiyalar",   uses: 2184, growth: 42, color: "#34d399", spark: [1100,1450,1750,1980,2184] },
    { icon: "search", label: "AI qidiruv",         uses: 1247, growth: 34, color: "#818cf8", spark: [800,950,1050,1180,1247] },
    { icon: "quote",  label: "Iqtibos formatlash", uses: 892,  growth: 18, color: "#38bdf8", spark: [580,670,750,830,892] },
    { icon: "flame",  label: "O'qish seriyasi",    uses: 678,  growth: 53, color: "#fb923c", spark: [280,380,490,590,678] },
    { icon: "shield", label: "Plagiat tekshiruvi", uses: 437,  growth: 61, color: "#c084fc", spark: [170,240,320,390,437] },
    { icon: "qr",     label: "QR navigatsiya",     uses: 341,  growth: 89, color: "#f87171", spark: [90,145,210,275,341] },
    { icon: "pack",   label: "Kurs materiallari",  uses: 156,  growth: 28, color: "#fbbf24", spark: [75,100,118,138,156] },
  ];
  const total = STATS.reduce((s, x) => s + x.uses, 0);
  const maxU = STATS[0].uses;
  const top = [...STATS].sort((a,b) => b.growth - a.growth)[0];
  function Spark({ vals, color }: { vals: number[]; color: string }) {
    const W = 44, H = 20, mx = Math.max(...vals), mn = Math.min(...vals), rng = mx - mn || 1;
    const pts = vals.map((v,i) => `${i*(W/(vals.length-1))},${H-((v-mn)/rng)*H}`).join(" ");
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0, overflow: "visible" }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
        <circle cx={W} cy={H-((vals[vals.length-1]-mn)/rng)*H} r="2.5" fill={color} />
      </svg>
    );
  }
  return (
    <div className="fsc-root">
      <div className="fsc-header">
        <div className="fsc-header-left"><span className="fsc-live-dot" /><span className="fsc-eyebrow">FAOLIYAT TAHLILI</span></div>
        <div className="fsc-header-right"><span className="fsc-total-n">{total.toLocaleString()}</span><span className="fsc-total-l">jami sessiya</span></div>
      </div>
      <div className="fsc-river">{STATS.map((s,i) => <div key={i} className="fsc-river-seg" title={s.label} style={{ flex: s.uses, background: s.color, opacity: .85 }} />)}</div>
      <div className="fsc-board">
        <div className="fsc-board-header"><span>#</span><span>Funksiya</span><span>Foydalanish</span><span>Trend</span><span>Sessiya</span><span>O'sish</span></div>
        {STATS.map((s,i) => (
          <div key={i} className="fsc-row" style={{ "--fsc-color": s.color } as React.CSSProperties}>
            <span className="fsc-col-rank">{i===0?<span className="fsc-crown">①</span>:<span className="fsc-rank-n">{i+1}</span>}</span>
            <span className="fsc-col-name"><span className="fsc-icon-dot" style={{ background:s.color+"22",color:s.color }}><I n={s.icon} s={12} c={s.color} /></span><span className="fsc-name-text">{s.label}</span></span>
            <span className="fsc-col-bar"><span className="fsc-bar-track"><span className="fsc-bar-fill" style={{ width:`${(s.uses/maxU)*100}%`,background:s.color }} /></span></span>
            <span className="fsc-col-spark"><Spark vals={s.spark} color={s.color} /></span>
            <span className="fsc-col-n">{s.uses.toLocaleString()}</span>
            <span className="fsc-col-g" style={{ color:s.growth>50?"#4ade80":s.growth>30?"#a3e635":"#facc15" }}>+{s.growth}%</span>
          </div>
        ))}
      </div>
      <div className="fsc-footer">
        <span className="fsc-trophy">↑</span>
        <span className="fsc-footer-text">Eng tez o'suvchi: <strong style={{ color:top.color }}>{top.label}</strong><span className="fsc-footer-pct"> +{top.growth}% bu hafta</span></span>
        <span className="fsc-footer-period">So'nggi 30 kun</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   YANGI 8 TA FUNKSIYA
════════════════════════════════════ */

/* ── AI O'QISH HAMROHI ── */
export function AICompanionCard() {
  type Msg = { role: "user" | "ai"; text: string; srcs?: string[] };
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai",   text: "Salom! Men ATMU kutubxonasining AI yordamchisiman." },
    { role: "user", text: "Algoritm bo'yicha eng yaxshi darslikni ayting" },
    { role: "ai",   text: "Sizning kurs dasturingizga ko'ra ikkita eng mos darslik:\n1. Cormen T.H. «CLRS» — fundamental, 94% mos\n2. Sedgewick R. — amaliy misollar ko'p, 88% mos\nIkkisi ham A-11 javonida mavjud.", srcs: ["Javon A-11 · 2 nusxa"] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const CHIPS = ["Tavsiya qil", "Tushuntir", "Dissertatsiya yordam"];
  const ANSWERS = [
    { q: "tavsiya",       a: "Wirth N. 'Algoritm + Ma'lumotlar tuzilmasi' — 94% mos; Knuth D. 'The Art of Computer Programming' — 89% mos.",       srcs: ["A-14 javon", "A-09 javon"] },
    { q: "tushuntir",     a: "Ushbu kitob 3 qismdan iborat: nazariy asos, algoritm tahlili, amaliy topshiriqlar. Har bir bob test savollari bilan.", srcs: ["ATMU o'quv dasturi"] },
    { q: "dissertatsiya", a: "Dissertatsiya: kirish (aktuallik, maqsad), 3 bob (nazariya, metodologiya, natija), xulosa, adabiyotlar. GOST 7.1-2003.", srcs: ["GOST 7.1-2003", "ATMU qo'llanma 2023"] },
  ];
  function send(q: string) {
    if (!q.trim() || loading) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", text: q }]);
    setLoading(true);
    setTimeout(() => {
      const m = ANSWERS.find(a => q.toLowerCase().includes(a.q));
      const ans = m ?? { a: `"${q}" bo'yicha katalogda 14 ta manba topildi. Yuldasheva A. "Axborot tizimlari" (2021) — 94% mos.`, srcs: ["Fond A-07"] };
      setMsgs(p => [...p, { role: "ai", text: ans.a, srcs: ans.srcs }]);
      setLoading(false);
    }, 900);
  }
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  return (
    <Card accent="#4f46e5">
      <CardHead eyebrow="SHAXSIY YORDAMCHI" title="AI o'qish hamrohi" icon="send" accent="#4f46e5" />
      <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "8px 0", marginTop: 4 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
            {m.role === "ai" && <div style={{ width: 26, height: 26, borderRadius: 8, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I n="star" s={13} c="#4f46e5" /></div>}
            <div style={{ maxWidth: "82%", padding: "8px 11px", borderRadius: m.role === "user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px", background: m.role === "user" ? "#4f46e5" : "#f8fafc", border: m.role === "ai" ? "1px solid #e2e8f0" : "none" }}>
              <p style={{ fontSize: 12, color: m.role === "user" ? "#fff" : "#1e293b", margin: 0, lineHeight: 1.55, whiteSpace: "pre-line" }}>{m.text}</p>
              {m.srcs && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>{m.srcs.map((s, j) => <span key={j} style={{ fontSize: 9.5, padding: "2px 6px", borderRadius: 4, background: "#e0e7ff", color: "#3730a3", fontWeight: 600 }}>{s}</span>)}</div>}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}><I n="star" s={13} c="#4f46e5" /></div>
            <div style={{ display: "flex", gap: 4, padding: "9px 13px", background: "#f8fafc", borderRadius: "4px 12px 12px 12px", border: "1px solid #e2e8f0" }}>
              {[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "#94a3b8", animation: `sfTyping 1.2s ${j*0.2}s ease-in-out infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", margin: "6px 0 4px" }}>
        {CHIPS.map((c, i) => <button key={i} type="button" className="sf-suggestion-chip" onClick={() => send(c)}>{c}</button>)}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input className="sf-input" style={{ flex: 1 }} placeholder="Savol yozing..." value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(input); }} />
        <button type="button" className="sf-action-btn sf-action-sm" style={{ background: "#4f46e5" }}
          onClick={() => send(input)} disabled={loading || !input.trim()}><I n="send" s={13} c="#fff" /></button>
      </div>
    </Card>
  );
}

/* ── O'QISH JADVALI ── */
export function ReadingPlannerCard() {
  const DAYS = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];
  const [done, setDone] = useState([true, true, true, false, false, false, false]);
  const [plan, setPlan] = useState([
    { task: "1–3-bob", book: "Python dasturlash tili",  pages: 48, done: true,  today: false },
    { task: "4–6-bob", book: "Python dasturlash tili",  pages: 52, done: true,  today: false },
    { task: "7–9-bob", book: "Python dasturlash tili",  pages: 45, done: true,  today: false },
    { task: "1–2-bob", book: "Ma'lumotlar bazasi",      pages: 38, done: false, today: true  },
    { task: "3–4-bob", book: "Ma'lumotlar bazasi",      pages: 41, done: false, today: false },
  ]);
  const pct = Math.round((done.filter(Boolean).length / 7) * 100);
  const read = plan.filter(p => p.done).reduce((s, p) => s + p.pages, 0);
  return (
    <Card accent="#0891b2">
      <CardHead eyebrow="SHAXSIY JADVAL" title="O'qish rejasi" icon="book" accent="#0891b2" />
      <div style={{ display: "flex", gap: 8, margin: "10px 0 8px" }}>
        {[{l:"Haftalik",v:`${pct}%`,c:"#0891b2"},{l:"O'qilgan",v:`${read} bet`,c:"#059669"},{l:"Qolgan",v:`${7-done.filter(Boolean).length} kun`,c:"#94a3b8"}].map((s,i) => (
          <div key={i} style={{ flex:1, padding:"7px 8px", background:"#f8fafc", borderRadius:8, border:"1px solid #f1f5f9", textAlign:"center" }}>
            <p style={{ fontSize:14, fontWeight:800, color:s.c, margin:"0 0 1px", fontFamily:"Georgia,serif" }}>{s.v}</p>
            <p style={{ fontSize:9.5, color:"#94a3b8", margin:0, fontWeight:600, textTransform:"uppercase" }}>{s.l}</p>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <button type="button" onClick={() => setDone(p => { const n=[...p]; n[i]=!n[i]; return n; })}
              style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${done[i]?"#0891b2":i===3?"#0891b2":"#e2e8f0"}`, background:done[i]?"#0891b2":i===3?"#e0f2fe":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {done[i] ? <I n="check" s={11} c="#fff" /> : <span style={{ fontSize:10, color:i===3?"#0891b2":"#94a3b8", fontWeight:700 }}>{i+1}</span>}
            </button>
            <span style={{ fontSize:9.5, color:i===3?"#0891b2":"#94a3b8", fontWeight:i===3?700:500 }}>{d}</span>
          </div>
        ))}
      </div>
      <div className="sf-progress-bar-wrap" style={{ marginBottom:10 }}>
        <div className="sf-progress-bar" style={{ width:`${pct}%`, background:"#0891b2", transition:"width 0.4s" }} />
      </div>
      {plan.map((p, i) => (
        <div key={i} onClick={() => setPlan(prev => prev.map((x,j) => j===i?{...x,done:!x.done}:x))}
          style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:8, cursor:"pointer", marginBottom:i<plan.length-1?5:0, background:p.done?"#f0f9ff":p.today?"#e0f2fe":"#f8fafc", border:`1px solid ${p.today&&!p.done?"#0891b2":p.done?"#bae6fd":"#f1f5f9"}` }}>
          <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${p.done?"#0891b2":"#e2e8f0"}`, background:p.done?"#0891b2":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {p.done && <I n="check" s={10} c="#fff" />}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <span style={{ fontSize:12, fontWeight:700, color:p.done?"#64748b":"#0f172a", textDecoration:p.done?"line-through":"none" }}>{p.task}</span>
            <span style={{ fontSize:10.5, color:"#94a3b8", marginLeft:6 }}>{p.book}</span>
          </div>
          <span style={{ fontSize:10, color:"#94a3b8", flexShrink:0 }}>{p.pages} bet</span>
          {p.today && !p.done && <span style={{ fontSize:9.5, fontWeight:700, padding:"2px 7px", borderRadius:20, background:"#0891b2", color:"#fff", flexShrink:0 }}>Bugun</span>}
        </div>
      ))}
    </Card>
  );
}

/* ── TADQIQOT BO'SHLIG'I ── */
export function ResearchGapCard() {
  const [topic, setTopic] = useState("Informatika");
  const [gaps, setGaps] = useState([
    { label: "Informatika va sun'iy intellekt", pubs: 4,  color: "#dc2626", tag: "Kam tadqiq" },
    { label: "Informatika: zamonaviy usullar",  pubs: 17, color: "#d97706", tag: "O'rta"      },
    { label: "Informatika nazariyasi",          pubs: 31, color: "#059669", tag: "Etarli"     },
    { label: "Informatika amaliy tatbiqi",      pubs: 9,  color: "#dc2626", tag: "Kam tadqiq" },
    { label: "Informatika va boshqa fanlar",    pubs: 3,  color: "#7c3aed", tag: "Bo'shliq"   },
  ]);
  const [busy, setBusy] = useState(false);
  function analyze() {
    if (!topic.trim()) return;
    setBusy(true);
    setTimeout(() => {
      setGaps([
        { label: `${topic} va sun'iy intellekt`, pubs: Math.floor(Math.random()*10)+2,  color:"#dc2626", tag:"Kam tadqiq" },
        { label: `${topic}: zamonaviy usullar`,  pubs: Math.floor(Math.random()*20)+10, color:"#d97706", tag:"O'rta"      },
        { label: `${topic} nazariyasi`,          pubs: Math.floor(Math.random()*20)+25, color:"#059669", tag:"Etarli"     },
        { label: `${topic} amaliy tatbiqi`,      pubs: Math.floor(Math.random()*12)+4,  color:"#dc2626", tag:"Kam tadqiq" },
        { label: `${topic} va boshqa fanlar`,    pubs: Math.floor(Math.random()*6)+2,   color:"#7c3aed", tag:"Bo'shliq"   },
      ]);
      setBusy(false);
    }, 1000);
  }
  const mx = Math.max(...gaps.map(g => g.pubs));
  return (
    <Card accent="#7c3aed">
      <CardHead eyebrow="TADQIQOT TAHLILI" title="Bo'shliq izlovchi" icon="layers" accent="#7c3aed" />
      <div style={{ display:"flex", gap:6, marginTop:10 }}>
        <input className="sf-input" style={{ flex:1 }} value={topic} onChange={e => setTopic(e.target.value)}
          placeholder="Tadqiqot mavzuingizni kiriting..." onKeyDown={e => e.key==="Enter" && analyze()} />
        <button type="button" className="sf-action-btn sf-action-sm" style={{ background:"#7c3aed" }}
          onClick={analyze} disabled={busy||!topic.trim()}>
          {busy?<span className="sf-spinner"/>:"Tahlil"}
        </button>
      </div>
      <div style={{ marginTop:10 }}>
        {gaps.map((g, i) => (
          <div key={i} style={{ marginBottom:9 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
              <span style={{ fontSize:11, color:"#334155", fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.label}</span>
              <span style={{ fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:20, background:g.color+"18", color:g.color, flexShrink:0, marginLeft:8 }}>{g.tag}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ flex:1, height:8, background:"#f1f5f9", borderRadius:10, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(g.pubs/mx)*100}%`, background:g.color, borderRadius:10, transition:"width .6s cubic-bezier(.34,1.56,.64,1)" }} />
              </div>
              <span style={{ fontSize:11, fontWeight:800, color:g.color, fontFamily:"ui-monospace,monospace", width:30, textAlign:"right" }}>{g.pubs}</span>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize:10, color:"#94a3b8", fontStyle:"italic", margin:"6px 0 0", paddingTop:8, borderTop:"1px solid #f1f5f9" }}>
        Manba: ATMU ilmiy katalogi · Yangilangan: bugun
      </p>
    </Card>
  );
}

/* ── OVOZLI QIDIRUV ── Real Web Speech API + matn fallback */
export function VoiceSearchCard() {
  type Phase = "idle"|"listening"|"processing"|"results"|"error";
  type Lang = "uz-UZ"|"ru-RU"|"en-US";
  const [phase, setPhase] = useState<Phase>("results");
  const [transcript, setTranscript] = useState("ma'lumotlar bazasi darsliklari");
  const [interim, setInterim] = useState("");
  const [lang, setLang] = useState<Lang>("uz-UZ");
  const [errMsg, setErrMsg] = useState("");
  const [textQ, setTextQ] = useState("");
  const [results, setResults] = useState([
    { title:"Ma'lumotlar bazasini loyihalash", author:"C. J. Date",  year:2019, shelf:"A-14", available:true  },
    { title:"SQL: to'liq qo'llanma",           author:"Ben Forta",   year:2020, shelf:"A-14", available:false },
    { title:"NoSQL ma'lumotlar bazalari",       author:"P. Sadalage", year:2021, shelf:"B-02", available:true  },
  ]);
  const [waveH, setWaveH] = useState<number[]>(Array(20).fill(4));
  const recRef = useRef<any>(null);
  const waveRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const CATALOG = [
    { title:"Ma'lumotlar bazasini loyihalash", author:"C. J. Date",  year:2019, shelf:"A-14", available:true  },
    { title:"SQL: to'liq qo'llanma",           author:"Ben Forta",   year:2020, shelf:"A-14", available:false },
    { title:"NoSQL ma'lumotlar bazalari",       author:"P. Sadalage", year:2021, shelf:"B-02", available:true  },
    { title:"Python dasturlash tili",           author:"Ergashev N.", year:2023, shelf:"B-03", available:true  },
    { title:"Kiberxavfsizlik asoslari",         author:"Qodirov J.",  year:2021, shelf:"C-07", available:false },
    { title:"Sun'iy intellektga kirish",        author:"Russell S.",  year:2022, shelf:"A-09", available:true  },
    { title:"Algoritm va ma'lumotlar tuzilmasi",author:"Cormen T.H.", year:2020, shelf:"A-11", available:false },
    { title:"Iqtisodiy nazariya asoslari",      author:"Toshmatov B.",year:2021, shelf:"D-02", available:true  },
  ];

  function doSearch(q: string) {
    const words = q.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const found = CATALOG.filter(b => words.some(w => b.title.toLowerCase().includes(w) || b.author.toLowerCase().includes(w)));
    setResults(found.length ? found : CATALOG.slice(0, 3));
    setTranscript(q); setPhase("results");
  }

  function startMic() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setErrMsg("Chrome yoki Edge brauzerida ishlaydi. Quyida matn qidiruvdan foydalaning."); setPhase("error"); return; }
    setPhase("listening"); setInterim(""); setErrMsg("");
    waveRef.current = setInterval(() => setWaveH(Array(20).fill(0).map(() => 4+Math.random()*36)), 100);
    const r = new SR(); r.lang = lang; r.continuous = false; r.interimResults = true;
    r.onresult = (e: any) => { let fin="",inter=""; for(const res of Array.from(e.results) as any[]){if(res.isFinal)fin+=res[0].transcript;else inter+=res[0].transcript;} if(fin)setTranscript(fin); setInterim(inter); };
    r.onend = () => { clearInterval(waveRef.current!); setWaveH(Array(20).fill(4)); setPhase("processing"); setTimeout(() => doSearch(transcript||interim||"ma'lumotlar bazasi"), 500); };
    r.onerror = (e: any) => { clearInterval(waveRef.current!); setWaveH(Array(20).fill(4)); const m:Record<string,string>={"not-allowed":"Mikrofon ruxsati berilmadi","no-speech":"Ovoz aniqlanmadi","network":"Tarmoq xatosi"}; setErrMsg(m[e.error]??`Xato: ${e.error}`); setPhase("error"); };
    r.start(); recRef.current = r;
  }
  function stopMic() { recRef.current?.stop(); }
  function reset() { setPhase("idle"); setTranscript(""); setResults([]); setErrMsg(""); setWaveH(Array(20).fill(4)); }
  useEffect(() => () => { recRef.current?.stop(); clearInterval(waveRef.current!); }, []);

  const LANGS: {code: Lang; flag: string}[] = [{code:"uz-UZ",flag:"UZ"},{code:"ru-RU",flag:"RU"},{code:"en-US",flag:"EN"}];

  return (
    <Card accent="#b45309">
      <div style={{ borderBottom:"1px solid #f1f5f9", paddingBottom:10, marginBottom:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div className="sf-card-head" style={{ marginBottom:0 }}>
            <div className="sf-card-icon" style={{ background:"#fff7ed", color:"#b45309" }}><I n="mic" s={17} c="#b45309" /></div>
            <div><p className="sf-eyebrow">OVOZLI QIDIRUV</p><h3 className="sf-title">Ovoz va matn qidiruv</h3></div>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {LANGS.map(l => (
              <button key={l.code} type="button" onClick={() => setLang(l.code)}
                style={{ padding:"3px 8px", borderRadius:5, border:`1.5px solid ${lang===l.code?"#b45309":"#e2e8f0"}`, background:lang===l.code?"#fff7ed":"transparent", color:lang===l.code?"#b45309":"#94a3b8", fontSize:10, fontWeight:700, cursor:"pointer" }}>
                {l.flag}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <input className="sf-input" style={{ flex:1 }} value={textQ} onChange={e => setTextQ(e.target.value)}
            placeholder="Matn bilan qidirish..."
            onKeyDown={e => { if(e.key==="Enter"&&textQ.trim()){doSearch(textQ);setTextQ("");}}} />
          <button type="button" className="sf-action-btn sf-action-sm" style={{ background:"#b45309", flexShrink:0 }}
            onClick={() => { if(textQ.trim()){doSearch(textQ);setTextQ("");}}}>
            <I n="search" s={14} c="#fff" />
          </button>
          <button type="button" onClick={phase==="listening"?stopMic:startMic} title="Mikrofon bilan qidirish"
            style={{ width:38, height:38, borderRadius:9, border:`1.5px solid ${phase==="listening"?"#b45309":"#e2e8f0"}`, background:phase==="listening"?"#b45309":"#fff7ed", color:phase==="listening"?"#fff":"#b45309", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .15s", boxShadow:phase==="listening"?"0 0 0 6px #b4530920":"none" }}>
            {phase==="processing"?<span className="sf-spinner" style={{ borderTopColor:"#b45309" }}/>:<I n={phase==="listening"?"stop":"mic"} s={16} c="currentColor"/>}
          </button>
        </div>
      </div>

      {phase==="listening" && (
        <div style={{ display:"flex", alignItems:"center", gap:2, height:36, marginBottom:6, justifyContent:"center" }}>
          {waveH.map((h, i) => <div key={i} style={{ flex:1, maxWidth:5, borderRadius:3, height:`${h}px`, background:`hsl(${30+i*3},75%,50%)`, transition:"height 0.08s ease" }} />)}
        </div>
      )}
      {(phase==="listening"||phase==="processing") && (
        <p style={{ fontSize:12, color:"#b45309", fontStyle:"italic", margin:"0 0 8px", textAlign:"center" }}>
          {phase==="listening"?(interim||"Tinglamoqda..."):"Qidirilmoqda..."}
        </p>
      )}
      {phase==="error" && <div style={{ padding:"8px 10px", borderRadius:8, background:"#fef2f2", border:"1px solid #fecaca", fontSize:11.5, color:"#dc2626", marginBottom:8 }}>{errMsg}</div>}

      {results.length > 0 && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <p style={{ fontSize:10, color:"#64748b", margin:0 }}>
              {transcript&&<><span style={{ fontStyle:"italic", color:"#b45309" }}>"{transcript}"</span> · </>}{results.length} ta natija
            </p>
            <button type="button" className="sf-ghost-btn" style={{ fontSize:10 }} onClick={reset}><I n="refresh" s={11} c="#94a3b8"/> Yangi</button>
          </div>
          {results.slice(0,4).map((r, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:i<Math.min(results.length,4)-1?"1px solid #f8fafc":"none" }}>
              <div style={{ width:30, height:30, borderRadius:6, background:"#fff7ed", color:"#92400e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, flexShrink:0, fontFamily:"ui-monospace,monospace" }}>{r.shelf}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12, fontWeight:700, color:"#0f172a", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.title}</p>
                <p style={{ fontSize:10.5, color:"#64748b", margin:0 }}>{r.author} · {r.year}</p>
              </div>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, flexShrink:0, background:r.available?"#d1fae5":"#fee2e2", color:r.available?"#065f46":"#9b1a2f" }}>
                {r.available?"Mavjud":"Berilgan"}
              </span>
            </div>
          ))}
        </div>
      )}

      {phase==="idle" && results.length===0 && (
        <div>
          <p style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 6px" }}>Mashhur qidiruvlar</p>
          {["2020-yildan keyin iqtisodiyot kitoblari","Karimov muallifli dissertatsiyalar","Dasturlash bo'yicha o'zbek manbalari"].map((q,i) => (
            <button key={i} type="button" className="sfv-recent-row" onClick={() => doSearch(q)}>
              <I n="search" s={12} c="#94a3b8"/><span>{q}</span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── MATN TARJIMASI ── */
export function LiveTranslatorCard() {
  const [text, setText] = useState("Machine learning algorithms require large datasets.");
  const [result, setResult] = useState<{out:string;terms:{en:string;uz:string}[]}|null>({
    out: "Mashinali o'rganish algoritmlari katta ma'lumotlar to'plamlarini talab qiladi.",
    terms: [{en:"machine learning",uz:"mashinali o'rganish"},{en:"dataset",uz:"ma'lumotlar to'plami"},{en:"algorithm",uz:"algoritm"}]
  });
  const [loading, setLoading] = useState(false);
  const EXAMPLE = "Machine learning algorithms require large datasets for training. The backpropagation method adjusts neural network weights iteratively.";
  function translate(src?: string) {
    const s = src ?? text; if (!s.trim()) return;
    setText(s); setLoading(true);
    setTimeout(() => {
      setResult({ out:"Mashinali o'rganish algoritmlari o'qitish uchun katta ma'lumotlar to'plamlarini talab qiladi. Orqaga tarqalish usuli neyron tarmoq og'irliklarini sozlaydi.", terms:[{en:"machine learning",uz:"mashinali o'rganish"},{en:"backpropagation",uz:"orqaga tarqalish"},{en:"neural network",uz:"neyron tarmoq"},{en:"dataset",uz:"ma'lumotlar to'plami"}] });
      setLoading(false);
    }, 900);
  }
  return (
    <Card accent="#0369a1">
      <CardHead eyebrow="TARJIMA VA ATAMALAR" title="Matn tarjimasi" icon="globe" accent="#0369a1" />
      <div style={{ display:"flex", alignItems:"center", gap:8, margin:"10px 0 8px" }}>
        <span style={{ flex:1, textAlign:"center", fontSize:11, fontWeight:700, color:"#334155", padding:"5px", background:"#f1f5f9", borderRadius:6 }}>Inglizcha</span>
        <I n="arrow" s={14} c="#94a3b8"/>
        <span style={{ flex:1, textAlign:"center", fontSize:11, fontWeight:700, color:"#0369a1", padding:"5px", background:"#e0f2fe", borderRadius:6 }}>O'zbekcha</span>
      </div>
      <textarea className="sf-textarea" rows={2} placeholder="Inglizcha matn kiriting..." value={text}
        onChange={e => { setText(e.target.value); if(result)setResult(null); }} />
      <div style={{ display:"flex", gap:8, marginTop:6 }}>
        <button type="button" className="sf-action-btn" style={{ background:"#0369a1" }} onClick={() => translate()} disabled={loading||!text.trim()}>
          {loading?<span className="sf-spinner"/>:"Tarjima qilish"}
        </button>
        <button type="button" className="sf-ghost-btn" onClick={() => translate(EXAMPLE)}>Namuna</button>
        {result&&<button type="button" className="sf-ghost-btn" onClick={()=>{setText("");setResult(null);}}><I n="x" s={12} c="#94a3b8"/></button>}
      </div>
      {result && (
        <>
          <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:9, padding:"10px 13px", marginTop:8 }}>
            <p style={{ fontSize:12.5, color:"#0c4a6e", lineHeight:1.65, margin:0, fontFamily:"Georgia,serif" }}>{result.out}</p>
          </div>
          <div style={{ marginTop:8 }}>
            <p style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 6px" }}>Texnik atamalar</p>
            {result.terms.map((t,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 10px", background:"#f8fafc", borderRadius:7, borderLeft:"3px solid #0369a1", marginBottom:4 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#0f172a", fontFamily:"ui-monospace,monospace", flex:1 }}>{t.en}</span>
                <span style={{ fontSize:11, color:"#0369a1", fontWeight:600, flex:1 }}>{t.uz}</span>
                <button type="button" style={{ border:"none",background:"none",cursor:"pointer",padding:2 }} onClick={() => navigator.clipboard?.writeText(t.uz)}><I n="copy" s={11} c="#94a3b8"/></button>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

/* ── KOLLEKSIYA TAHLILI ── */
export function CollectionAnalyticsCard() {
  const [ordered, setOrdered] = useState(false);
  const SUBJECTS = [
    { name:"Dasturlash",  demand:87, stock:42, new:12, color:"#4f46e5" },
    { name:"Iqtisodiyot", demand:74, stock:68, new:4,  color:"#0891b2" },
    { name:"Matematika",  demand:61, stock:58, new:3,  color:"#059669" },
    { name:"Huquq",       demand:55, stock:23, new:8,  color:"#dc2626" },
    { name:"Psixologiya", demand:48, stock:41, new:2,  color:"#d97706" },
    { name:"Tarix",       demand:32, stock:55, new:0,  color:"#7c3aed" },
  ];
  const critical = SUBJECTS.filter(s => s.demand > s.stock);
  return (
    <Card accent="#059669">
      <CardHead eyebrow="FOND HOLATI" title="Kolleksiya tahlili" icon="bar" accent="#059669" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, margin:"10px 0 12px" }}>
        {[{l:"Jami soha",v:SUBJECTS.length,c:"#334155"},{l:"Tanqislik",v:critical.length,c:"#dc2626"},{l:"Yangi kitob",v:SUBJECTS.reduce((s,x)=>s+x.new,0),c:"#059669"}].map((s,i) => (
          <div key={i} style={{ textAlign:"center", padding:"8px 4px", background:"#f8fafc", borderRadius:8, border:"1px solid #f1f5f9" }}>
            <p style={{ fontSize:20, fontWeight:900, color:s.c, margin:0, fontFamily:"Georgia,serif" }}>{s.v}</p>
            <p style={{ fontSize:9.5, color:"#94a3b8", margin:0, fontWeight:600, textTransform:"uppercase" }}>{s.l}</p>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:8 }}>
        {[["#94a3b8","Talab"],["#e2e8f0","Fond"],["#fca5a5","Tanqis"]].map(([c,l],i) => (
          <span key={i} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"#64748b", fontWeight:600 }}>
            <span style={{ width:10, height:10, borderRadius:3, background:c, flexShrink:0 }}/>{l}
          </span>
        ))}
      </div>
      {SUBJECTS.map((s, i) => {
        const gap = s.demand > s.stock;
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", marginBottom:4 }}>
            <span style={{ fontSize:11, fontWeight:700, color:"#334155", width:76, flexShrink:0 }}>{s.name}</span>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:3 }}>
              <div style={{ height:6, background:"#f1f5f9", borderRadius:10 }}><div style={{ height:"100%", width:`${s.demand}%`, background:gap?"#fca5a5":"#c7d2fe", borderRadius:10 }}/></div>
              <div style={{ height:6, background:"#f1f5f9", borderRadius:10 }}><div style={{ height:"100%", width:`${s.stock}%`, background:s.color, borderRadius:10, opacity:.7 }}/></div>
            </div>
            <span style={{ fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:20, flexShrink:0, fontFamily:"ui-monospace,monospace", background:gap?"#fce8ea":"#d1fae5", color:gap?"#9b1a2f":"#065f46" }}>
              {gap?`-${s.demand-s.stock}`:"OK"}
            </span>
          </div>
        );
      })}
      <button type="button" onClick={() => setOrdered(true)}
        style={{ display:"flex", alignItems:"center", gap:8, width:"100%", marginTop:10, padding:"9px 12px", borderRadius:8, cursor:"pointer", background:ordered?"#d1fae5":"#fef2f2", border:`1px solid ${ordered?"#6ee7b7":"#fecaca"}`, color:ordered?"#065f46":"#9b1a2f", fontSize:11.5, fontWeight:600 }}>
        <I n={ordered?"check":"bell"} s={13} c="currentColor"/>
        {ordered?"Buyurtma yuborildi — ombor xabar qilindi":`${critical.length} ta tanqis soha — xarid buyurtmasini yuborish`}
      </button>
    </Card>
  );
}

/* ── QAYTARISH BASHORATI ── */
export function ReturnPredictionCard() {
  const [loans, setLoans] = useState([
    { id:1, name:"S. Mirzayev",  init:"SM", book:"Algoritm asoslari",    due:-2, risk:98, color:"#dc2626", sms:false },
    { id:2, name:"N. Hasanova",  init:"NH", book:"Veb dasturlash",        due:1,  risk:84, color:"#ea580c", sms:false },
    { id:3, name:"B. Toshmatov", init:"BT", book:"Ma'lumotlar bazasi",    due:3,  risk:61, color:"#d97706", sms:false },
    { id:4, name:"Z. Rahimova",  init:"ZR", book:"Ingliz tili qo'llanma", due:5,  risk:32, color:"#ca8a04", sms:false },
    { id:5, name:"A. Yusupov",   init:"AY", book:"Matematika I",          due:8,  risk:12, color:"#65a30d", sms:false },
  ]);
  const overdue = loans.filter(l=>l.due<0).length;
  const smsCnt = loans.filter(l=>l.sms).length;
  return (
    <Card accent="#dc2626">
      <CardHead eyebrow="QAYTARISH BASHORATI" title="Kechikish xavfi" icon="shield" accent="#dc2626" />
      <div style={{ display:"flex", gap:8, margin:"10px 0 12px" }}>
        {[{l:"Muddati o'tgan",v:overdue,c:"#dc2626",bg:"#fef2f2"},{l:"Yuqori xavf",v:loans.filter(l=>l.risk>70).length,c:"#ea580c",bg:"#fff7ed"},{l:"SMS yuborildi",v:smsCnt,c:"#059669",bg:"#f0fdf4"}].map((s,i) => (
          <div key={i} style={{ flex:1, padding:"7px 8px", background:s.bg, borderRadius:8, textAlign:"center" }}>
            <p style={{ fontSize:18, fontWeight:900, color:s.c, margin:0, fontFamily:"Georgia,serif" }}>{s.v}</p>
            <p style={{ fontSize:9, color:"#94a3b8", margin:0, fontWeight:600, textTransform:"uppercase" }}>{s.l}</p>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 70px 72px", padding:"4px 8px", background:"#f8fafc", borderRadius:6, marginBottom:4 }}>
        {["O'quvchi","Kitob","Kun","Xavf"].map((h,i) => <span key={i} style={{ fontSize:9.5, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</span>)}
      </div>
      {loans.map(l => (
        <div key={l.id} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 70px 72px", padding:"7px 8px", alignItems:"center", borderBottom:"1px solid #f8fafc" }}>
          <span style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, color:"#0f172a", fontWeight:600, minWidth:0 }}>
            <span style={{ width:22, height:22, borderRadius:6, background:l.color+"22", color:l.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8.5, fontWeight:800, flexShrink:0 }}>{l.init}</span>
            <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.name}</span>
          </span>
          <span style={{ fontSize:11, color:"#64748b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:4 }}>{l.book}</span>
          <span style={{ fontSize:11, fontWeight:700, color:l.due<0?"#dc2626":l.due<=3?"#d97706":"#65a30d", whiteSpace:"nowrap" }}>
            {l.due<0?`${Math.abs(l.due)} k. o'tdi`:`${l.due} kun`}
          </span>
          <span>
            {l.risk>50?(
              <button type="button" onClick={() => setLoans(p=>p.map(x=>x.id===l.id?{...x,sms:true}:x))}
                style={{ fontSize:9.5, padding:"3px 7px", borderRadius:5, border:"none", cursor:"pointer", fontWeight:700, whiteSpace:"nowrap", background:l.sms?"#d1fae5":"#fee2e2", color:l.sms?"#065f46":"#9b1a2f", transition:"all .15s" }}>
                {l.sms?"Yuborildi":"SMS"}
              </button>
            ):<span style={{ fontSize:10, fontWeight:700, color:l.color, fontFamily:"ui-monospace,monospace" }}>{l.risk}%</span>}
          </span>
        </div>
      ))}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, padding:"8px 12px", background:"#fef2f2", borderRadius:8, border:"1px solid #fecaca" }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:"#dc2626", flexShrink:0, animation:"fsc-pulse 1.5s ease-in-out infinite" }}/>
        <span style={{ fontSize:11, color:"#9b1a2f" }}>{smsCnt>0?`${smsCnt} ta SMS yuborildi`:`${overdue} ta kitob muddati o'tdi — SMS tugmalarini bosing`}</span>
      </div>
    </Card>
  );
}

/* ── KITOB KASHFIYOTCHI ── */
export function SerendipityCard() {
  const BOOKS = [
    { title:"Turing testi",         author:"Andrew Hodges",     year:2019, pages:312, match:94, color:"#4f46e5", genre:"Ilm-fan" },
    { title:"Ulug' Ipak yo'li",     author:"Peter Frankopan",   year:2020, pages:428, match:88, color:"#b45309", genre:"Tarix"   },
    { title:"Koinot geometriyasi",  author:"Sean Carroll",      year:2021, pages:376, match:91, color:"#0891b2", genre:"Fizika"  },
    { title:"Sapiens: Qisqa tarix", author:"Yuval Noah Harari", year:2018, pages:498, match:86, color:"#059669", genre:"Tarix"   },
    { title:"Cheksiz o'yin",        author:"Simon Sinek",       year:2022, pages:256, match:82, color:"#7c3aed", genre:"Biznes"  },
  ];
  const [prefs, setPrefs] = useState({sci:3,hist:2,tech:4,lit:1});
  function getBest(p: typeof prefs) {
    const w = BOOKS.map(b => { let s=b.match; if(b.genre==="Ilm-fan")s+=p.sci*3; if(b.genre==="Tarix")s+=p.hist*3; if(b.genre==="Fizika")s+=(p.sci+p.tech); if(b.genre==="Biznes")s+=p.tech*2; return s; });
    return BOOKS[w.indexOf(Math.max(...w))];
  }
  const [book, setBook] = useState(() => getBest({sci:3,hist:2,tech:4,lit:1}));
  const [saved, setSaved] = useState(false);
  const GENRES = [{key:"sci",label:"Fan va ilm"},{key:"hist",label:"Tarix"},{key:"tech",label:"Texnologiya"},{key:"lit",label:"Adabiyot"}];
  function updatePref(key: string, val: number) {
    const newPrefs = { ...prefs, [key]: val };
    setPrefs(newPrefs); setSaved(false); setBook(getBest(newPrefs));
  }
  return (
    <Card accent="#7c3aed">
      <CardHead eyebrow="KITOB KASHFIYOTI" title="Sizga mos kitob" icon="star" accent="#7c3aed" />
      <div style={{ display:"flex", gap:12, alignItems:"flex-start", padding:12, borderRadius:12, border:`1.5px solid ${book.color}33`, background:`${book.color}08`, margin:"10px 0 12px" }}>
        <div style={{ width:44, height:62, borderRadius:5, background:book.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontSize:10, fontWeight:800, color:"#fff", writingMode:"vertical-rl", textTransform:"uppercase", letterSpacing:1, opacity:.9 }}>{book.author.split(" ").pop()}</span>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:13.5, fontWeight:700, color:"#0f172a", margin:"0 0 2px", fontFamily:"Georgia,serif", lineHeight:1.3 }}>{book.title}</p>
          <p style={{ fontSize:11, color:"#64748b", margin:"0 0 6px" }}>{book.author} · {book.year} · {book.pages} bet</p>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:13, fontWeight:800, color:book.color }}>{book.match}%</span>
            <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:book.color+"18", color:book.color, fontWeight:700 }}>{book.genre}</span>
            <button type="button" onClick={() => setSaved(s=>!s)} style={{ marginLeft:"auto", border:"none", background:"none", cursor:"pointer" }}>
              <I n="star" s={15} c={saved?book.color:"#e2e8f0"}/>
            </button>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:10 }}>
        {GENRES.map(g => {
          const val = prefs[g.key as keyof typeof prefs];
          return (
            <div key={g.key} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:11, color:"#64748b", fontWeight:600, width:88, flexShrink:0 }}>{g.label}</span>
              <input type="range" min={1} max={5} value={val} style={{ flex:1, accentColor:"#7c3aed" }}
                onChange={e => updatePref(g.key, Number(e.target.value))} />
              <span style={{ fontSize:11, color:"#7c3aed", width:54, textAlign:"right", flexShrink:0, letterSpacing:1 }}>{"●".repeat(val)}{"○".repeat(5-val)}</span>
            </div>
          );
        })}
      </div>
      <button type="button" className="sf-action-btn" style={{ background:"#7c3aed", width:"100%", justifyContent:"center" }}
        onClick={() => { const b=getBest(prefs); setBook(b); setSaved(false); }}>
        <I n="refresh" s={14} c="#fff"/> Boshqa kitob tavsiya qil
      </button>
    </Card>
  );
}

/* ════════════════════════════════════
   PANEL WRAPPER
════════════════════════════════════ */
export function SmartFeaturesPanel({ role }: { role: string }) {
  return (
    <div className="sf-panel">
      {role === "student" && (<>
        <div className="sf-grid-2"><ReadingStreakCard /><RecommendationsCard /></div>
        <div className="sf-grid-2"><CitationCard /><PlagiarismCard /></div>
        <div className="sf-grid-2"><AICompanionCard /><ReadingPlannerCard /></div>
        <div className="sf-grid-2"><ResearchGapCard /><VoiceSearchCard /></div>
        <div className="sf-grid-2"><LiveTranslatorCard /><SerendipityCard /></div>
      </>)}
      {role === "teacher" && (<>
        <div className="sf-grid-2"><CoursePackCard /><CitationCard /></div>
        <div className="sf-grid-2"><AICompanionCard /><ResearchGapCard /></div>
        <SerendipityCard />
      </>)}
      {role === "librarian" && (<>
        <div className="sf-grid-2"><QRShelfCard /><AISearchCard /></div>
        <div className="sf-grid-2"><VoiceSearchCard /><CollectionAnalyticsCard /></div>
        <ReturnPredictionCard />
      </>)}
      {role === "admin" && (<>
        <FeatureStatsCard />
        <div className="sf-grid-2" style={{ marginTop: 16 }}><AISearchCard /><CitationCard /></div>
        <div className="sf-grid-2"><CollectionAnalyticsCard /><ReturnPredictionCard /></div>
      </>)}
    </div>
  );
}
