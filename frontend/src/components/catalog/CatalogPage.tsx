import { useState, useMemo, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { books as fallbackBooks, resources as fallbackResources } from "../../data/mock";
import type { Book, Resource } from "../../types";

/* ══════════════════════════════════════════════════════
   MOCK CATALOG DATA
══════════════════════════════════════════════════════ */

const MOCK_CATALOG = [
  { id:1,  title:"Matematika analizi",                     authors:["Toshmatov A.B."],            dept:"Matematika",    subj:"Matematika",          lang:"O'zbek", format:"PDF",    year:2023, call:"MA-001", rating:4.5, views:1240, dl:380,  avail:3, total:5,  type:"book",    summary:"Limitlar, differensial va integral hisob asoslari. O'zbek tilida to'liq bayon.", cover:"https://images.unsplash.com/photo-1509228468518-180dd4864904?w=180&h=240&fit=crop" },
  { id:2,  title:"Informatika va dasturlash asoslari",     authors:["Karimov O.B.","Nazarov S."],  dept:"Informatika",   subj:"Informatika",         lang:"O'zbek", format:"PDF",    year:2024, call:"IN-042", rating:4.8, views:2150, dl:720,  avail:2, total:4,  type:"book",    summary:"Dasturlash tillari, algoritmlar va ma'lumotlar strukturasi.",                    cover:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=180&h=240&fit=crop" },
  { id:3,  title:"Chizma geometriya",                      authors:["Abdurahmonov Sh."],           dept:"Mexanika",      subj:"Geometriya",           lang:"O'zbek", format:"Qog'oz", year:2021, call:"CG-017", rating:4.2, views:890,  dl:210,  avail:0, total:3,  type:"book",    summary:"Muhandislik grafikasining nazariy asoslari va amaliy mashqlar.",                 cover:"https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=180&h=240&fit=crop" },
  { id:4,  title:"Iqtisodiyot nazariyasi",                 authors:["Umarov F.R."],                dept:"Iqtisodiyot",   subj:"Iqtisodiyot",         lang:"O'zbek", format:"PDF",    year:2022, call:"IQ-008", rating:4.3, views:1560, dl:490,  avail:5, total:8,  type:"book",    summary:"Makro va mikroiqtisodiyot, bozor qonuniyatlari.",                                cover:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=180&h=240&fit=crop" },
  { id:5,  title:"Fizika kursi",                           authors:["Irodov I.E."],                dept:"Fizika",        subj:"Fizika",              lang:"Rus",    format:"PDF",    year:2019, call:"FZ-003", rating:4.9, views:3200, dl:1100, avail:1, total:6,  type:"book",    summary:"Klassik va zamonaviy fizikaning barcha bo'limlari bo'yicha fundamental kurs.",   cover:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=240&fit=crop" },
  { id:6,  title:"Sun'iy intellekt va machine learning",   authors:["Rashidov A."],                dept:"Informatika",   subj:"Informatika",         lang:"Ingliz", format:"PDF",    year:2025, call:"AI-011", rating:4.7, views:2800, dl:940,  avail:4, total:4,  type:"book",    summary:"ML algoritmlari, neyron tarmoqlar va deep learning asoslari.",                  cover:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=180&h=240&fit=crop" },
  { id:7,  title:"Kimyo asoslari",                         authors:["Nazarov B.N.","Xoliqov R."],  dept:"Kimyo",         subj:"Kimyo",               lang:"O'zbek", format:"Qog'oz", year:2020, call:"KM-021", rating:4.0, views:760,  dl:180,  avail:2, total:5,  type:"book",    summary:"Organik va anorganik kimyoning asosiy qonuniyatlari.",                           cover:"https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=180&h=240&fit=crop" },
  { id:8,  title:"Raqamli transformatsiya",                authors:["Yusupov D.M."],               dept:"Informatika",   subj:"Raqamli iqtisodiyot", lang:"O'zbek", format:"PDF",    year:2024, call:"DIS-044",rating:4.6, views:430,  dl:95,   avail:1, total:1,  type:"thesis",  summary:"O'zbekistonda raqamli transformatsiyaning iqtisodiy samaradorligi tadqiqoti.",   cover:"https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=180&h=240&fit=crop" },
  { id:9,  title:"Elektrotexnikaning nazariy asoslari",    authors:["Amirov S.F."],                dept:"Elektrotexnika",subj:"Elektrotexnika",       lang:"O'zbek", format:"PDF",    year:2022, call:"ET-009", rating:4.4, views:1100, dl:340,  avail:3, total:7,  type:"book",    summary:"Elektr zanjirlar, to'g'ri va o'zgaruvchan tok hisob-kitoblari.",                cover:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=180&h=240&fit=crop" },
  { id:10, title:"Pedagogika va psixologiya",              authors:["Hasanov K.T."],               dept:"Pedagogika",    subj:"Pedagogika",          lang:"O'zbek", format:"Qog'oz", year:2021, call:"PD-033", rating:4.1, views:680,  dl:120,  avail:6, total:10, type:"book",    summary:"Zamonaviy ta'lim metodologiyasi va o'quvchi psixologiyasi.",                    cover:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=180&h=240&fit=crop" },
  { id:11, title:"Qurilish mexanikasi",                    authors:["Tursunov B."],                dept:"Qurilish",      subj:"Mexanika",            lang:"O'zbek", format:"PDF",    year:2020, call:"QM-015", rating:4.3, views:540,  dl:160,  avail:0, total:4,  type:"book",    summary:"Konstruksiyalar mustahkamligi, deformatsiyalar va statik hisob usullari.",      cover:"https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=180&h=240&fit=crop" },
  { id:12, title:"Introduction to Data Science",           authors:["Mirzayev F."],                dept:"Informatika",   subj:"Ma'lumotlar ilmi",    lang:"Ingliz", format:"PDF",    year:2025, call:"DS-002", rating:4.9, views:3500, dl:1400, avail:5, total:5,  type:"article", summary:"Data analysis, visualization and statistical modeling with Python and R.",        cover:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=180&h=240&fit=crop" },
];

const TYPE_META: Record<string, { color: string; label: string }> = {
  book:    { color: "#002147", label: "Kitob"         },
  article: { color: "#0e7490", label: "Maqola"        },
  thesis:  { color: "#7c1d3f", label: "Dissertatsiya" },
};

const SUBJECTS = ["Barchasi","Matematika","Informatika","Iqtisodiyot","Fizika","Kimyo","Pedagogika","Mexanika","Elektrotexnika"];

/* ── sub-components ── */

function Stars({ r }: { r: number }) {
  return (
    <span className="jc-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(r) ? "#d97706" : "#d1d5db" }}>★</span>
      ))}
      <em>{r.toFixed(1)}</em>
    </span>
  );
}

function CallBadge({ code }: { code: string }) {
  return <span className="jc-call">{code}</span>;
}

function TypeBadge({ type }: { type: string }) {
  const m = TYPE_META[type] ?? TYPE_META.book;
  return <span className="jc-type-badge" style={{ background: m.color }}>{m.label}</span>;
}

function AvailBadge({ avail, total }: { avail: number; total: number }) {
  return avail > 0
    ? <span className="jc-avail ok">{avail}/{total} mavjud</span>
    : <span className="jc-avail no">Mavjud emas</span>;
}

type CItem = typeof MOCK_CATALOG[0];

/* ── Detail modal ── */
function DetailModal({ item, onClose }: { item: CItem; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const m = TYPE_META[item.type] ?? TYPE_META.book;

  return (
    <div className="jc-veil" onClick={onClose}>
      <div className="jc-modal" onClick={e => e.stopPropagation()}>
        <button className="jc-modal-x" onClick={onClose}>✕</button>
        <div className="jc-modal-body">
          <div className="jc-modal-left">
            <img src={item.cover} alt={item.title} className="jc-modal-cover" />
            <div className="jc-modal-rule" style={{ background: m.color }} />
          </div>
          <div className="jc-modal-right">
            <div className="jc-modal-badges">
              <TypeBadge type={item.type} />
              <CallBadge code={item.call} />
              <AvailBadge avail={item.avail} total={item.total} />
            </div>
            <h2 className="jc-modal-title">{item.title}</h2>
            <p className="jc-modal-authors">{item.authors.join("; ")}</p>
            <Stars r={item.rating} />
            <p className="jc-modal-summary">{item.summary}</p>
            <dl className="jc-modal-dl">
              <div><dt>Bo'lim</dt><dd>{item.dept}</dd></div>
              <div><dt>Mavzu</dt><dd>{item.subj}</dd></div>
              <div><dt>Til</dt><dd>{item.lang}</dd></div>
              <div><dt>Format</dt><dd>{item.format}</dd></div>
              <div><dt>Yil</dt><dd>{item.year}</dd></div>
              <div><dt>Kod</dt><dd className="jc-modal-call">{item.call}</dd></div>
            </dl>
            <p className="jc-modal-cnt">{item.views.toLocaleString()} ko'rish · {item.dl.toLocaleString()} yuklab olish</p>
            <div className="jc-modal-acts">
              {item.format === "PDF" && <button className="jc-act-primary">Online o'qish</button>}
              {item.format === "PDF" && <button className="jc-act-secondary">Yuklab olish</button>}
              {item.avail > 0 && <button className="jc-act-secondary">Bron qilish</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */

export function CatalogPage() {
  const { locale } = useParams<{ locale: string }>();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery]       = useState("");
  const [typeF, setTypeF]       = useState("all");
  const [langF, setLangF]       = useState("Barchasi");
  const [yearF, setYearF]       = useState("Barchasi");
  const [subjF, setSubjF]       = useState("Barchasi");
  const [availF, setAvailF]     = useState(false);
  const [sort, setSort]         = useState<"rating"|"views"|"year"|"title">("rating");
  const [view, setView]         = useState<"list"|"grid">("list");
  const [selected, setSelected] = useState<CItem | null>(null);

  const filtered = useMemo(() => {
    let r = [...MOCK_CATALOG];
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.authors.some(a => a.toLowerCase().includes(q)) ||
        b.dept.toLowerCase().includes(q) ||
        b.subj.toLowerCase().includes(q)
      );
    }
    if (typeF !== "all")           r = r.filter(b => b.type === typeF);
    if (langF !== "Barchasi")      r = r.filter(b => b.lang === langF);
    if (subjF !== "Barchasi")      r = r.filter(b => b.subj === subjF || b.dept === subjF);
    if (availF)                    r = r.filter(b => b.avail > 0);
    if (yearF === "2024–2026")     r = r.filter(b => b.year >= 2024);
    else if (yearF === "2020–2023") r = r.filter(b => b.year >= 2020 && b.year <= 2023);
    else if (yearF === "2015–2019") r = r.filter(b => b.year >= 2015 && b.year <= 2019);
    else if (yearF === "2010 gacha") r = r.filter(b => b.year < 2010);
    r.sort((a,b) =>
      sort === "rating" ? b.rating - a.rating :
      sort === "views"  ? b.views  - a.views  :
      sort === "year"   ? b.year   - a.year   :
      a.title.localeCompare(b.title)
    );
    return r;
  }, [query, typeF, langF, yearF, subjF, availF, sort]);

  const chips = [
    ...(typeF !== "all"      ? [{ label: TYPE_META[typeF]?.label ?? typeF, clear: () => setTypeF("all") }]          : []),
    ...(langF !== "Barchasi" ? [{ label: langF,                            clear: () => setLangF("Barchasi") }]     : []),
    ...(subjF !== "Barchasi" ? [{ label: subjF,                            clear: () => setSubjF("Barchasi") }]     : []),
    ...(yearF !== "Barchasi" ? [{ label: yearF,                            clear: () => setYearF("Barchasi") }]     : []),
    ...(availF               ? [{ label: "Faqat mavjud",                   clear: () => setAvailF(false) }]         : []),
  ];

  const clearAll = () => {
    setTypeF("all"); setLangF("Barchasi");
    setSubjF("Barchasi"); setYearF("Barchasi"); setAvailF(false);
  };

  return (
    <div className="jc-root">

      {/* ── Masthead ── */}
      <div className="jc-masthead">
        <div className="jc-masthead-inner">
          <p className="jc-eyebrow">ATMU Smart UniLibrary · Elektron katalog</p>
          <h1 className="jc-headline">
            Fond bo'ylab<br />
            <span className="jc-hl">qidiruv</span>
          </h1>

          {/* Search bar */}
          <div className="jc-bar">
            <svg className="jc-bar-ico" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={inputRef}
              className="jc-bar-input"
              placeholder="Kitob nomi, muallif, mavzu yoki javon kodi…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button className="jc-bar-clr" onClick={() => { setQuery(""); inputRef.current?.focus(); }}>✕</button>
            )}
            <button className="jc-bar-btn">Qidirish</button>
          </div>

          {/* Stats strip */}
          <div className="jc-stats">
            <span><b>157 270</b> jami fond</span>
            <span className="jc-dot"/>
            <span><b>42 000+</b> elektron kitob</span>
            <span className="jc-dot"/>
            <span><b>12 500+</b> maqola</span>
            <span className="jc-dot"/>
            <span><b>3 200+</b> dissertatsiya</span>
          </div>
        </div>

        {/* Subject tab strip */}
        <div className="jc-subj-strip">
          <div className="jc-subj-inner">
            {SUBJECTS.map(s => (
              <button
                key={s}
                className={`jc-subj-tab${subjF === s ? " active" : ""}`}
                onClick={() => setSubjF(s)}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Layout ── */}
      <div className="jc-layout">

        {/* Sidebar */}
        <aside className="jc-aside">

          <div className="jc-sf-grp">
            <div className="jc-sf-hd">Tur</div>
            {([
              { id:"all",     label:"Barchasi",       cnt: MOCK_CATALOG.length },
              { id:"book",    label:"Kitob",           cnt: MOCK_CATALOG.filter(b=>b.type==="book").length },
              { id:"article", label:"Maqola",          cnt: MOCK_CATALOG.filter(b=>b.type==="article").length },
              { id:"thesis",  label:"Dissertatsiya",   cnt: MOCK_CATALOG.filter(b=>b.type==="thesis").length },
            ] as const).map(t => (
              <button
                key={t.id}
                className={`jc-sf-btn${typeF === t.id ? " active" : ""}`}
                onClick={() => setTypeF(t.id)}
              >
                <span>{t.label}</span>
                <span className="jc-sf-cnt">{t.cnt}</span>
              </button>
            ))}
          </div>

          <div className="jc-sf-grp">
            <div className="jc-sf-hd">Til</div>
            {["Barchasi","O'zbek","Rus","Ingliz","Turk"].map(l => (
              <button key={l} className={`jc-sf-btn${langF===l?" active":""}`} onClick={()=>setLangF(l)}>
                <span>{l}</span>
              </button>
            ))}
          </div>

          <div className="jc-sf-grp">
            <div className="jc-sf-hd">Nashr yili</div>
            {["Barchasi","2024–2026","2020–2023","2015–2019","2010 gacha"].map(y => (
              <button key={y} className={`jc-sf-btn${yearF===y?" active":""}`} onClick={()=>setYearF(y)}>
                <span>{y}</span>
              </button>
            ))}
          </div>

          <div className="jc-sf-grp">
            <label className="jc-sf-chk">
              <input type="checkbox" checked={availF} onChange={e=>setAvailF(e.target.checked)} />
              <span>Faqat mavjudlar</span>
            </label>
          </div>

          <p className="jc-aside-note">
            Qidirayotgan kitob topilmasa, kutubxonachiga murojaat qiling.
          </p>
        </aside>

        {/* Main */}
        <main className="jc-main">

          {/* Toolbar */}
          <div className="jc-toolbar">
            <div className="jc-tb-left">
              <span className="jc-res-n"><b>{filtered.length}</b> natija</span>
              {chips.map((c,i) => (
                <button key={i} className="jc-chip" onClick={c.clear}>
                  {c.label} <span className="jc-chip-x">×</span>
                </button>
              ))}
              {chips.length > 1 && (
                <button className="jc-chip-all" onClick={clearAll}>Barchasini tozalash</button>
              )}
            </div>
            <div className="jc-tb-right">
              <label className="jc-sort-lbl">
                Saralash:&nbsp;
                <select className="jc-sort" value={sort} onChange={e=>setSort(e.target.value as typeof sort)}>
                  <option value="rating">Reyting</option>
                  <option value="views">Ko'rishlar</option>
                  <option value="year">Yangilik</option>
                  <option value="title">Nom (A–Z)</option>
                </select>
              </label>
              <div className="jc-view-sw">
                <button
                  className={view==="list"?"on":""}
                  onClick={()=>setView("list")}
                  title="Ro'yxat ko'rinish"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                    <circle cx="3" cy="6" r="1.5" fill="currentColor"/><circle cx="3" cy="12" r="1.5" fill="currentColor"/><circle cx="3" cy="18" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
                <button
                  className={view==="grid"?"on":""}
                  onClick={()=>setView("grid")}
                  title="Katak ko'rinish"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="jc-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>Natija topilmadi. Qidiruv so'rovini o'zgartiring.</p>
              <button onClick={clearAll}>Filtrlarni tozalash</button>
            </div>
          )}

          {/* List view */}
          {filtered.length > 0 && view === "list" && (
            <div className="jc-list">
              {filtered.map(item => (
                <article key={item.id} className="jc-row" onClick={() => setSelected(item)}>
                  <div className="jc-row-spine" style={{ background: TYPE_META[item.type]?.color ?? "#002147" }} />
                  <div className="jc-row-body">
                    <div className="jc-row-top">
                      <TypeBadge type={item.type} />
                      <CallBadge code={item.call} />
                      <span className="jc-row-year">{item.year}</span>
                      <span className="jc-row-lang">{item.lang}</span>
                      <span className="jc-row-fmt">{item.format}</span>
                    </div>
                    <h3 className="jc-row-title">{item.title}</h3>
                    <p className="jc-row-authors">{item.authors.join("; ")} · <span className="jc-row-dept">{item.dept}</span></p>
                    <p className="jc-row-summary">{item.summary}</p>
                    <div className="jc-row-foot">
                      <Stars r={item.rating} />
                      <span className="jc-row-stat">{item.views.toLocaleString()} ko'rish</span>
                      <span className="jc-row-stat">{item.dl.toLocaleString()} yuklab</span>
                      <AvailBadge avail={item.avail} total={item.total} />
                    </div>
                  </div>
                  <button
                    className="jc-row-open"
                    onClick={e => { e.stopPropagation(); setSelected(item); }}
                    aria-label="Ko'rish"
                  >
                    Ko'rish <span className="jc-arr">→</span>
                  </button>
                </article>
              ))}
            </div>
          )}

          {/* Grid view */}
          {filtered.length > 0 && view === "grid" && (
            <div className="jc-grid">
              {filtered.map(item => (
                <article key={item.id} className="jc-card" onClick={() => setSelected(item)}>
                  <div className="jc-card-img-wrap">
                    <img src={item.cover} alt={item.title} className="jc-card-img" loading="lazy" />
                    <div className="jc-card-overlay">
                      <TypeBadge type={item.type} />
                      <AvailBadge avail={item.avail} total={item.total} />
                    </div>
                  </div>
                  <div className="jc-card-body">
                    <CallBadge code={item.call} />
                    <h3 className="jc-card-title">{item.title}</h3>
                    <p className="jc-card-auth">{item.authors[0]}{item.authors.length > 1 && " et al."}</p>
                    <div className="jc-card-foot">
                      <Stars r={item.rating} />
                      <span className="jc-card-year">{item.year}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </main>
      </div>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
