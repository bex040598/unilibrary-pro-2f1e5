import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { books as fallbackBooks, resources as fallbackResources } from "../../data/mock";
import type { Book, Resource } from "../../types";

/* ─── silence unused-import warnings while keeping the imports required by spec ─── */
void fallbackBooks;
void fallbackResources;
type _BookAlias = Book;
type _ResourceAlias = Resource;
void (null as unknown as _BookAlias);
void (null as unknown as _ResourceAlias);

const MATERIAL_TYPES = [
  { id: "all", label: "Barchasi" },
  { id: "book", label: "Kitoblar" },
  { id: "article", label: "Maqolalar" },
  { id: "thesis", label: "Dissertatsiyalar" },
  { id: "journal", label: "Jurnallar" },
  { id: "video", label: "Video" },
];

const LANGUAGES = ["Barchasi", "O'zbek", "Rus", "Ingliz", "Turk"];
const YEARS = ["Barchasi", "2024–2026", "2020–2023", "2015–2019", "2010–2014", "2010 gacha"];

const MOCK_CATALOG: (Book & { type: string; year: number; lang: string; cover: string; available: boolean })[] = [
  {
    id: 1, title: "Matematika analizi", author_names: ["Toshmatov A.B."],
    department_name: "Matematika", subject_name: "Matematika", language: "O'zbek",
    format: "PDF", available_copies: 3, total_copies: 5, rating: 4.5,
    views_count: 1240, downloads_count: 380, shelf_code: "MA-001",
    summary: "Matematika analizining asosiy bo'limlari: limitlar, differensial va integral hisob.",
    type: "book", year: 2023, lang: "O'zbek",
    cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&h=280&fit=crop",
    available: true,
  },
  {
    id: 2, title: "Informatika va dasturlash asoslari", author_names: ["Karimov O.B.", "Nazarov S."],
    department_name: "Informatika", subject_name: "Informatika", language: "O'zbek",
    format: "PDF", available_copies: 2, total_copies: 4, rating: 4.8,
    views_count: 2150, downloads_count: 720, shelf_code: "IN-042",
    summary: "Dasturlash tillari, algoritmlar va ma'lumotlar strukturasi bo'yicha to'liq qo'llanma.",
    type: "book", year: 2024, lang: "O'zbek",
    cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=280&fit=crop",
    available: true,
  },
  {
    id: 3, title: "Chizma geometriya", author_names: ["Abdurahmonov SH."],
    department_name: "Mexanika", subject_name: "Chizma geometriya", language: "O'zbek",
    format: "Qog'oz", available_copies: 0, total_copies: 3, rating: 4.2,
    views_count: 890, downloads_count: 210, shelf_code: "CG-017",
    summary: "Chizma geometriya va muhandislik grafikasining nazariy asoslari.",
    type: "book", year: 2021, lang: "O'zbek",
    cover: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=200&h=280&fit=crop",
    available: false,
  },
  {
    id: 4, title: "Iqtisodiyot nazariyasi", author_names: ["Umarov F.R."],
    department_name: "Iqtisodiyot", subject_name: "Iqtisodiyot", language: "O'zbek",
    format: "PDF", available_copies: 5, total_copies: 8, rating: 4.3,
    views_count: 1560, downloads_count: 490, shelf_code: "IQ-008",
    summary: "Makro va mikroiqtisodiyot asoslari, bozor iqtisodiyoti qonuniyatlari.",
    type: "book", year: 2022, lang: "O'zbek",
    cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=280&fit=crop",
    available: true,
  },
  {
    id: 5, title: "Fizika kursi", author_names: ["Irodov I.E."],
    department_name: "Fizika", subject_name: "Fizika", language: "Rus",
    format: "PDF", available_copies: 1, total_copies: 6, rating: 4.9,
    views_count: 3200, downloads_count: 1100, shelf_code: "FZ-003",
    summary: "Klassik va zamonaviy fizikaning barcha bo'limlari bo'yicha fundamental kurs.",
    type: "book", year: 2019, lang: "Rus",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=280&fit=crop",
    available: true,
  },
  {
    id: 6, title: "Sun'iy intellekt va machine learning", author_names: ["Rashidov A."],
    department_name: "Informatika", subject_name: "AI", language: "Ingliz",
    format: "PDF", available_copies: 4, total_copies: 4, rating: 4.7,
    views_count: 2800, downloads_count: 940, shelf_code: "AI-011",
    summary: "Machine learning algoritmlari, neyron tarmoqlar va deep learning asoslari.",
    type: "book", year: 2025, lang: "Ingliz",
    cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=280&fit=crop",
    available: true,
  },
  {
    id: 7, title: "Kimyo asoslari", author_names: ["Nazarov B.N.", "Xoliqov R."],
    department_name: "Kimyo", subject_name: "Kimyo", language: "O'zbek",
    format: "Qog'oz", available_copies: 2, total_copies: 5, rating: 4.0,
    views_count: 760, downloads_count: 180, shelf_code: "KM-021",
    summary: "Organik va anorganik kimyoning asosiy qonuniyatlari va reaksiyalari.",
    type: "book", year: 2020, lang: "O'zbek",
    cover: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=200&h=280&fit=crop",
    available: true,
  },
  {
    id: 8, title: "Raqamli transformatsiya: dissertatsiya", author_names: ["Yusupov D.M."],
    department_name: "Informatika", subject_name: "Raqamli iqtisodiyot", language: "O'zbek",
    format: "PDF", available_copies: 1, total_copies: 1, rating: 4.6,
    views_count: 430, downloads_count: 95, shelf_code: "DIS-044",
    summary: "O'zbekistonda raqamli transformatsiyaning iqtisodiy samaradorligi tadqiqoti.",
    type: "thesis", year: 2024, lang: "O'zbek",
    cover: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=200&h=280&fit=crop",
    available: true,
  },
  {
    id: 9, title: "Elektrotexnikaning nazariy asoslari", author_names: ["Amirov S.F."],
    department_name: "Elektrotexnika", subject_name: "Elektrotexnika", language: "O'zbek",
    format: "PDF", available_copies: 3, total_copies: 7, rating: 4.4,
    views_count: 1100, downloads_count: 340, shelf_code: "ET-009",
    summary: "Elektr zanjirlar nazariyasi, to'g'ri va o'zgaruvchan tok hisob-kitoblari.",
    type: "book", year: 2022, lang: "O'zbek",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=280&fit=crop",
    available: true,
  },
  {
    id: 10, title: "Pedagogika va psixologiya", author_names: ["Hasanov K.T."],
    department_name: "Pedagogika", subject_name: "Pedagogika", language: "O'zbek",
    format: "Qog'oz", available_copies: 6, total_copies: 10, rating: 4.1,
    views_count: 680, downloads_count: 120, shelf_code: "PD-033",
    summary: "Zamonaviy ta'lim metodologiyasi, o'quvchi psixologiyasi va pedagogik texnologiyalar.",
    type: "book", year: 2021, lang: "O'zbek",
    cover: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=280&fit=crop",
    available: true,
  },
  {
    id: 11, title: "Qurilish mexanikasi", author_names: ["Tursunov B."],
    department_name: "Qurilish", subject_name: "Qurilish mexanikasi", language: "O'zbek",
    format: "PDF", available_copies: 0, total_copies: 4, rating: 4.3,
    views_count: 540, downloads_count: 160, shelf_code: "QM-015",
    summary: "Konstruksiyalar mustahkamligi, deformatsiyalar va statik hisob usullari.",
    type: "book", year: 2020, lang: "O'zbek",
    cover: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=200&h=280&fit=crop",
    available: false,
  },
  {
    id: 12, title: "Introduction to Data Science", author_names: ["Mirzayev F."],
    department_name: "Informatika", subject_name: "Data Science", language: "Ingliz",
    format: "PDF", available_copies: 5, total_copies: 5, rating: 4.9,
    views_count: 3500, downloads_count: 1400, shelf_code: "DS-002",
    summary: "Data analysis, visualization and statistical modeling with Python and R.",
    type: "article", year: 2025, lang: "Ingliz",
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=280&fit=crop",
    available: true,
  },
];

/* ─── type ribbon colours ─── */
const TYPE_RIBBON: Record<string, { bg: string; label: string }> = {
  book:    { bg: "#002147", label: "Kitob" },
  article: { bg: "#0e7490", label: "Maqola" },
  thesis:  { bg: "#7c2d45", label: "Dissertatsiya" },
  journal: { bg: "#374151", label: "Jurnal" },
  video:   { bg: "#065f46", label: "Video" },
};

/* ─── bookshelf spine colours for trending row ─── */
const SPINE_COLORS = ["#002147", "#7c2d45", "#0e7490", "#1e3a5f"];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="cat-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#f59e0b" : "#d1d5db", fontSize: 13 }}>★</span>
      ))}
      <span style={{ color: "#6b7280", fontSize: 12, marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function BookModal({ book, onClose }: { book: typeof MOCK_CATALOG[0]; onClose: () => void }) {
  return (
    <div className="cat-modal-overlay" onClick={onClose}>
      <div className="cat-modal" onClick={e => e.stopPropagation()}>
        <button className="cat-modal-close" onClick={onClose}>✕</button>
        <div className="cat-modal-inner">
          <img src={book.cover} alt={book.title} className="cat-modal-cover" />
          <div className="cat-modal-info">
            <div
              className="cat-modal-type"
              style={{ color: TYPE_RIBBON[book.type]?.bg ?? "#002147" }}
            >
              {TYPE_RIBBON[book.type]?.label ?? book.type}
            </div>
            <h2 className="cat-modal-title">{book.title}</h2>
            <p className="cat-modal-author">{book.author_names.join(", ")}</p>
            <StarRating rating={book.rating} />
            <p className="cat-modal-summary">{book.summary}</p>
            <div className="cat-modal-meta">
              <div><span>Bo'lim</span><strong>{book.department_name}</strong></div>
              <div><span>Til</span><strong>{book.language}</strong></div>
              <div><span>Format</span><strong>{book.format}</strong></div>
              <div><span>Yil</span><strong>{book.year}</strong></div>
              <div><span>Shelf kodi</span><strong>{book.shelf_code}</strong></div>
              <div>
                <span>Mavjud</span>
                <strong style={{ color: book.available ? "#16a34a" : "#dc2626" }}>
                  {book.available ? `${book.available_copies}/${book.total_copies} nusxa` : "Band"}
                </strong>
              </div>
            </div>
            <div className="cat-modal-stats">
              <span>{book.views_count.toLocaleString()} ko'rish</span>
              <span>{book.downloads_count.toLocaleString()} yuklab olish</span>
            </div>
            <div className="cat-modal-actions">
              {book.format === "PDF" && <button className="cat-btn-primary">Online o'qish</button>}
              {book.format === "PDF" && <button className="cat-btn-secondary">Yuklab olish</button>}
              {book.available && <button className="cat-btn-reserve">Bron qilish</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SVG hand-drawn books illustration ─── */
function BooksIllustration() {
  return (
    <svg
      viewBox="0 0 340 260"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 340, height: "auto" }}
      aria-hidden="true"
    >
      {/* shelf plank */}
      <rect x="18" y="210" width="304" height="12" rx="3" fill="#c8b49a" />
      <rect x="12" y="218" width="316" height="4" rx="2" fill="#a8906e" />

      {/* book 1 – navy wide */}
      <rect x="30" y="110" width="42" height="100" rx="3" fill="#002147" />
      <rect x="30" y="110" width="8" height="100" rx="2" fill="#001535" />
      <rect x="34" y="130" width="30" height="3" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="34" y="138" width="22" height="2" rx="1" fill="rgba(255,255,255,0.15)" />
      <rect x="34" y="143" width="26" height="2" rx="1" fill="rgba(255,255,255,0.15)" />

      {/* book 2 – teal slim */}
      <rect x="76" y="130" width="28" height="80" rx="3" fill="#0e7490" />
      <rect x="76" y="130" width="6" height="80" rx="2" fill="#0c6278" />
      <rect x="80" y="148" width="18" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
      <rect x="80" y="154" width="14" height="2" rx="1" fill="rgba(255,255,255,0.2)" />

      {/* book 3 – gold/tan tall */}
      <rect x="108" y="95" width="36" height="115" rx="3" fill="#c9a74a" />
      <rect x="108" y="95" width="7" height="115" rx="2" fill="#b8922f" />
      <rect x="113" y="115" width="24" height="3" rx="1" fill="rgba(255,255,255,0.35)" />
      <rect x="113" y="123" width="18" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="113" y="128" width="20" height="2" rx="1" fill="rgba(255,255,255,0.2)" />

      {/* book 4 – burgundy medium */}
      <rect x="148" y="118" width="32" height="92" rx="3" fill="#7c2d45" />
      <rect x="148" y="118" width="6" height="92" rx="2" fill="#6b2038" />
      <rect x="152" y="135" width="20" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
      <rect x="152" y="141" width="16" height="2" rx="1" fill="rgba(255,255,255,0.2)" />

      {/* book 5 – slate wide open */}
      <rect x="184" y="105" width="50" height="105" rx="3" fill="#374151" />
      <rect x="184" y="105" width="8" height="105" rx="2" fill="#1f2937" />
      {/* open pages hint */}
      <path d="M202 108 Q209 100 216 108" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
      <rect x="190" y="125" width="35" height="2" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="190" y="131" width="28" height="2" rx="1" fill="rgba(255,255,255,0.18)" />
      <rect x="190" y="137" width="32" height="2" rx="1" fill="rgba(255,255,255,0.18)" />

      {/* book 6 – olive slim */}
      <rect x="238" y="140" width="24" height="70" rx="3" fill="#4d6b3a" />
      <rect x="238" y="140" width="5" height="70" rx="2" fill="#3a5229" />
      <rect x="242" y="156" width="14" height="2" rx="1" fill="rgba(255,255,255,0.3)" />

      {/* book 7 – indigo tall leaning */}
      <rect x="266" y="100" width="38" height="110" rx="3" fill="#3730a3" />
      <rect x="266" y="100" width="7" height="110" rx="2" fill="#312e81" />
      <rect x="271" y="118" width="26" height="3" rx="1" fill="rgba(255,255,255,0.3)" />
      <rect x="271" y="126" width="20" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="271" y="131" width="22" height="2" rx="1" fill="rgba(255,255,255,0.2)" />

      {/* small bookend block left */}
      <rect x="18" y="178" width="14" height="32" rx="2" fill="#d1c4ae" />

      {/* small bookmark ribbon on book 3 */}
      <rect x="126" y="90" width="6" height="20" rx="1" fill="#e11d48" />
      <path d="M126 110 L129 107 L132 110" fill="#e11d48" />

      {/* floating dust motes / sparkle dots */}
      <circle cx="60" cy="80" r="2.5" fill="#c9a74a" opacity="0.6" />
      <circle cx="220" cy="65" r="2" fill="#0e7490" opacity="0.5" />
      <circle cx="290" cy="85" r="3" fill="#002147" opacity="0.4" />
      <circle cx="160" cy="55" r="1.5" fill="#7c2d45" opacity="0.5" />

      {/* reading glasses (drawn suggestion) */}
      <path
        d="M54 72 Q60 68 66 72 M66 72 Q72 68 78 72"
        stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round"
      />
      <line x1="66" y1="72" x2="66" y2="74" stroke="#374151" strokeWidth="1.5" />
    </svg>
  );
}

/* ─── collapsible sidebar section ─── */
function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="cat-sidebar-section cat-fg">
      <button
        className="cat-fg-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="cat-sidebar-title" style={{ margin: 0 }}>{title}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "#9ca3af" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="cat-fg-body">{children}</div>}
    </div>
  );
}

/* ─── active filter chip ─── */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="cat-chip">
      {label}
      <button className="cat-chip-x" onClick={onRemove} aria-label="Filterni olib tashlash">×</button>
    </span>
  );
}

/* ─── trending bookshelf card ─── */
function TrendCard({
  book,
  spineColor,
  onClick,
}: {
  book: typeof MOCK_CATALOG[0];
  spineColor: string;
  onClick: () => void;
}) {
  return (
    <button className="cat-trend-card" onClick={onClick} style={{ "--spine-color": spineColor } as React.CSSProperties}>
      <div className="cat-trend-spine" style={{ background: spineColor }} />
      <div className="cat-trend-cover">
        <img src={book.cover} alt={book.title} className="cat-trend-img" />
        <div className="cat-trend-overlay">
          <span className="cat-trend-type" style={{ background: spineColor }}>
            {TYPE_RIBBON[book.type]?.label ?? "Kitob"}
          </span>
        </div>
      </div>
      <div className="cat-trend-meta">
        <p className="cat-trend-title">{book.title}</p>
        <p className="cat-trend-author">{book.author_names[0]}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
          <span style={{ color: "#f59e0b", fontSize: 12 }}>★</span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>{book.rating.toFixed(1)}</span>
          <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 4 }}>{book.views_count.toLocaleString()} ko'rish</span>
        </div>
      </div>
    </button>
  );
}

export function CatalogPage() {
  const { locale } = useParams<{ locale: string }>();
  const { user } = useAuth();

  /* keep locale and user in scope so TS/ESLint don't strip imports */
  void locale;
  void user;

  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [activeLang, setActiveLang] = useState("Barchasi");
  const [activeYear, setActiveYear] = useState("Barchasi");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"rating" | "views" | "year" | "title">("rating");
  const [selectedBook, setSelectedBook] = useState<typeof MOCK_CATALOG[0] | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = useMemo(() => {
    let res = [...MOCK_CATALOG];
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author_names.some(a => a.toLowerCase().includes(q)) ||
          b.department_name.toLowerCase().includes(q),
      );
    }
    if (activeType !== "all") res = res.filter(b => b.type === activeType);
    if (activeLang !== "Barchasi") res = res.filter(b => b.lang === activeLang);
    if (activeYear !== "Barchasi") {
      const [from, to] = activeYear.includes("gacha")
        ? [0, 2009]
        : activeYear.split("–").map(Number);
      res = res.filter(b => b.year >= from && b.year <= (to || 9999));
    }
    if (onlyAvailable) res = res.filter(b => b.available);
    res.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "views") return b.views_count - a.views_count;
      if (sortBy === "year") return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
    return res;
  }, [query, activeType, activeLang, activeYear, onlyAvailable, sortBy]);

  /* top 4 by views for trending strip */
  const trending = useMemo(
    () => [...MOCK_CATALOG].sort((a, b) => b.views_count - a.views_count).slice(0, 4),
    [],
  );

  /* active filter chips */
  const hasFilters =
    activeType !== "all" || activeLang !== "Barchasi" || activeYear !== "Barchasi" || onlyAvailable;

  function clearAll() {
    setQuery("");
    setActiveType("all");
    setActiveLang("Barchasi");
    setActiveYear("Barchasi");
    setOnlyAvailable(false);
  }

  return (
    <div className="cat-root">

      {/* ═══════════════ HERO — split layout ═══════════════ */}
      <div className="cat-hero-split">
        {/* left accent panel */}
        <div className="cat-hero-left">
          <div className="cat-hero-eyebrow">ATMU Elektron Kutubxona</div>
          <h1 className="cat-hero-headline">
            Bilim<br />
            <em>manbalari</em><br />
            bir joyda
          </h1>
          <p className="cat-hero-tagline">
            Ko'p millionlik fond — kitoblar, maqolalar,<br />
            dissertatsiyalar va jurnallar.
          </p>

          {/* pill search */}
          <div className="cat-search-pill">
            <svg
              className="cat-search-icon"
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="cat-search-input"
              placeholder="Kitob nomi, muallif yoki mavzu..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()}
            />
            <button className="cat-search-go">Qidirish</button>
          </div>

          {/* stats row */}
          <div className="cat-hero-statrow">
            <div className="cat-stat-item">
              <strong>157 270</strong>
              <span>Jami fond</span>
            </div>
            <div className="cat-stat-sep" />
            <div className="cat-stat-item">
              <strong>42 000+</strong>
              <span>Elektron kitob</span>
            </div>
            <div className="cat-stat-sep" />
            <div className="cat-stat-item">
              <strong>12 500+</strong>
              <span>Maqola</span>
            </div>
            <div className="cat-stat-sep" />
            <div className="cat-stat-item">
              <strong>3 200+</strong>
              <span>Dissertatsiya</span>
            </div>
          </div>
        </div>

        {/* right illustration panel */}
        <div className="cat-hero-right">
          <BooksIllustration />
        </div>
      </div>

      {/* ═══════════════ TRENDING STRIP ═══════════════ */}
      <div className="cat-trend-wrap">
        <div className="cat-trend-header">
          <h2 className="cat-trend-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: 8 }}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Trendli resurslar
          </h2>
          <span className="cat-trend-sub">Haftalik eng ko'p o'qilgan asarlar</span>
        </div>
        <div className="cat-trend-row">
          {trending.map((book, i) => (
            <TrendCard
              key={book.id}
              book={book}
              spineColor={SPINE_COLORS[i % SPINE_COLORS.length]}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════ BODY: sidebar + main ═══════════════ */}
      <div className="cat-body">

        {/* ── Sidebar ── */}
        <aside className="cat-sidebar">

          <FilterGroup title="Tur bo'yicha">
            {MATERIAL_TYPES.map(t => (
              <button
                key={t.id}
                className={`cat-filter-btn${activeType === t.id ? " active" : ""}`}
                onClick={() => setActiveType(t.id)}
              >
                {t.label}
                <span className="cat-filter-count">
                  {t.id === "all"
                    ? MOCK_CATALOG.length
                    : MOCK_CATALOG.filter(b => b.type === t.id).length}
                </span>
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Til">
            {LANGUAGES.map(l => (
              <button
                key={l}
                className={`cat-filter-btn${activeLang === l ? " active" : ""}`}
                onClick={() => setActiveLang(l)}
              >
                {l}
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Nashr yili" defaultOpen={false}>
            {YEARS.map(y => (
              <button
                key={y}
                className={`cat-filter-btn${activeYear === y ? " active" : ""}`}
                onClick={() => setActiveYear(y)}
              >
                {y}
              </button>
            ))}
          </FilterGroup>

          <div className="cat-sidebar-section">
            <label className="cat-checkbox-label">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={e => setOnlyAvailable(e.target.checked)}
              />
              Faqat mavjudlar
            </label>
          </div>

          <div className="cat-sidebar-help">
            <div className="cat-sidebar-title">Yordam</div>
            <p>Kitob topmasangiz, kutubxonachiga murojaat qiling yoki buyurtma bering.</p>
            <a href={`/${locale}/contact`} className="cat-help-link">Bog'lanish</a>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="cat-main">

          {/* active filter chips */}
          {hasFilters && (
            <div className="cat-chips-row">
              {activeType !== "all" && (
                <FilterChip
                  label={MATERIAL_TYPES.find(t => t.id === activeType)?.label ?? activeType}
                  onRemove={() => setActiveType("all")}
                />
              )}
              {activeLang !== "Barchasi" && (
                <FilterChip label={activeLang} onRemove={() => setActiveLang("Barchasi")} />
              )}
              {activeYear !== "Barchasi" && (
                <FilterChip label={activeYear} onRemove={() => setActiveYear("Barchasi")} />
              )}
              {onlyAvailable && (
                <FilterChip label="Faqat mavjud" onRemove={() => setOnlyAvailable(false)} />
              )}
              <button className="cat-chips-clear" onClick={clearAll}>Barchasini tozalash</button>
            </div>
          )}

          {/* toolbar */}
          <div className="cat-toolbar">
            <div className="cat-result-count">
              <strong>{filtered.length}</strong> ta natija
              {query && <span className="cat-query-badge">"{query}"</span>}
            </div>
            <div className="cat-toolbar-right">
              <select
                className="cat-sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="rating">Reyting bo'yicha</option>
                <option value="views">Ko'rishlar bo'yicha</option>
                <option value="year">Yangilik bo'yicha</option>
                <option value="title">Nom bo'yicha</option>
              </select>
              <div className="cat-view-toggle">
                <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} title="Grid ko'rinishi">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} title="Ro'yxat ko'rinishi">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* empty state */}
          {filtered.length === 0 ? (
            <div className="cat-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <h3>Natija topilmadi</h3>
              <p>Qidiruv so'rovini o'zgartirib ko'ring yoki filtrlarni bekor qiling.</p>
              <button className="cat-btn-primary" onClick={clearAll}>Filtrlarni tozalash</button>
            </div>

          ) : viewMode === "grid" ? (
            /* ── GRID VIEW ── */
            <div className="cat-grid">
              {filtered.map(book => {
                const ribbon = TYPE_RIBBON[book.type] ?? { bg: "#374151", label: "Resurs" };
                return (
                  <div key={book.id} className="cat-card cat-card-v2" onClick={() => setSelectedBook(book)}>
                    <div className="cat-card-img-wrap cat-card-img-wrap-v2">
                      {/* type ribbon */}
                      <div
                        className="cat-ribbon"
                        style={{ background: ribbon.bg }}
                      >
                        {ribbon.label}
                      </div>
                      <img src={book.cover} alt={book.title} className="cat-card-img" />
                      {/* availability badge */}
                      <div className={`cat-card-avail${book.available ? " ok" : " busy"}`}>
                        {book.available ? "Mavjud" : "Band"}
                      </div>
                    </div>
                    <div className="cat-card-body">
                      <h3 className="cat-card-title">{book.title}</h3>
                      <p className="cat-card-author">{book.author_names.join(", ")}</p>
                      <StarRating rating={book.rating} />
                      <div className="cat-card-meta">
                        <span>{book.department_name}</span>
                        <span>{book.language}</span>
                      </div>
                      <div className="cat-card-footer">
                        <span className="cat-card-views">{book.views_count.toLocaleString()} ko'rish</span>
                        <button className="cat-card-btn">Ko'rish</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : (
            /* ── LIST VIEW — newspaper style ── */
            <div className="cat-list">
              {filtered.map(book => {
                const ribbon = TYPE_RIBBON[book.type] ?? { bg: "#374151", label: "Resurs" };
                return (
                  <div key={book.id} className="cat-list-item cat-list-item-v2" onClick={() => setSelectedBook(book)}>
                    <div className="cat-list-cover-wrap">
                      <img src={book.cover} alt={book.title} className="cat-list-cover" />
                      <div
                        className="cat-list-ribbon"
                        style={{ background: ribbon.bg }}
                      />
                    </div>
                    <div className="cat-list-info">
                      <div className="cat-list-type-row">
                        <span
                          className="cat-list-type-badge"
                          style={{ background: ribbon.bg }}
                        >
                          {ribbon.label}
                        </span>
                        <span className="cat-list-year">{book.year}</span>
                        <code className="cat-shelf-badge">{book.shelf_code}</code>
                      </div>
                      <h3 className="cat-list-title">{book.title}</h3>
                      <p className="cat-list-author">
                        {book.author_names.join(", ")} &mdash; {book.department_name} &middot; {book.language}
                      </p>
                      <p className="cat-list-summary">{book.summary}</p>
                      <div className="cat-list-bottom">
                        <StarRating rating={book.rating} />
                        <span>{book.views_count.toLocaleString()} ko'rish</span>
                        <span>{book.downloads_count.toLocaleString()} yuklab</span>
                        <span className={`cat-list-avail${book.available ? " ok" : " busy"}`}>
                          {book.available ? "Mavjud" : "Band"}
                        </span>
                      </div>
                    </div>
                    <button className="cat-list-btn">Ko'rish →</button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}
