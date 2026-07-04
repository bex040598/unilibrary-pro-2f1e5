import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { books as fallbackBooks, resources as fallbackResources } from "../../data/mock";
import type { Book, Resource } from "../../types";

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

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="cat-stars">
      {[1,2,3,4,5].map(i => (
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
            <div className="cat-modal-type">{book.type === "thesis" ? "Dissertatsiya" : book.type === "article" ? "Maqola" : "Kitob"}</div>
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
              <div><span>Mavjud</span><strong style={{ color: book.available ? "#16a34a" : "#dc2626" }}>{book.available ? `${book.available_copies}/${book.total_copies} nusxa` : "Band"}</strong></div>
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

export function CatalogPage() {
  const { locale } = useParams<{ locale: string }>();
  const { user } = useAuth();

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
      res = res.filter(b => b.title.toLowerCase().includes(q) || b.author_names.some(a => a.toLowerCase().includes(q)) || b.department_name.toLowerCase().includes(q));
    }
    if (activeType !== "all") res = res.filter(b => b.type === activeType);
    if (activeLang !== "Barchasi") res = res.filter(b => b.lang === activeLang);
    if (activeYear !== "Barchasi") {
      const [from, to] = activeYear.includes("gacha") ? [0, 2009] : activeYear.split("–").map(Number);
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

  return (
    <div className="cat-root">
      {/* Hero */}
      <div className="cat-hero">
        <div className="cat-hero-inner">
          <h1 className="cat-hero-title">Elektron Katalog</h1>
          <p className="cat-hero-sub">ATMU kutubxonasining to'liq elektron fondiga kirish</p>
          <div className="cat-hero-search">
            <input
              className="cat-hero-input"
              placeholder="Kitob nomi, muallif yoki mavzu bo'yicha qidiring..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="cat-hero-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Qidirish
            </button>
          </div>
          <div className="cat-hero-stats">
            <div><strong>157,270</strong><span>Jami fond</span></div>
            <div><strong>42,000+</strong><span>Elektron kitob</span></div>
            <div><strong>12,500+</strong><span>Maqola</span></div>
            <div><strong>3,200+</strong><span>Dissertatsiya</span></div>
          </div>
        </div>
      </div>

      <div className="cat-body">
        {/* Sidebar */}
        <aside className="cat-sidebar">
          <div className="cat-sidebar-section">
            <div className="cat-sidebar-title">Tur bo'yicha</div>
            {MATERIAL_TYPES.map(t => (
              <button
                key={t.id}
                className={`cat-filter-btn${activeType === t.id ? " active" : ""}`}
                onClick={() => setActiveType(t.id)}
              >
                {t.label}
                <span className="cat-filter-count">{t.id === "all" ? MOCK_CATALOG.length : MOCK_CATALOG.filter(b => b.type === t.id).length}</span>
              </button>
            ))}
          </div>

          <div className="cat-sidebar-section">
            <div className="cat-sidebar-title">Til</div>
            {LANGUAGES.map(l => (
              <button
                key={l}
                className={`cat-filter-btn${activeLang === l ? " active" : ""}`}
                onClick={() => setActiveLang(l)}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="cat-sidebar-section">
            <div className="cat-sidebar-title">Nashr yili</div>
            {YEARS.map(y => (
              <button
                key={y}
                className={`cat-filter-btn${activeYear === y ? " active" : ""}`}
                onClick={() => setActiveYear(y)}
              >
                {y}
              </button>
            ))}
          </div>

          <div className="cat-sidebar-section">
            <label className="cat-checkbox-label">
              <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} />
              Faqat mavjudlar
            </label>
          </div>

          <div className="cat-sidebar-help">
            <div className="cat-sidebar-title">Yordam</div>
            <p>Kitob topmasangiz, kutubxonachiga murojaat qiling yoki buyurtma bering.</p>
            <a href={`/${locale}/contact`} className="cat-help-link">Bog'lanish</a>
          </div>
        </aside>

        {/* Main */}
        <main className="cat-main">
          <div className="cat-toolbar">
            <div className="cat-result-count">
              <strong>{filtered.length}</strong> ta natija topildi
              {query && <span className="cat-query-badge">"{query}"</span>}
            </div>
            <div className="cat-toolbar-right">
              <select className="cat-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                <option value="rating">Reyting bo'yicha</option>
                <option value="views">Ko'rishlar bo'yicha</option>
                <option value="year">Yangilik bo'yicha</option>
                <option value="title">Nom bo'yicha</option>
              </select>
              <div className="cat-view-toggle">
                <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </button>
                <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="cat-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <h3>Natija topilmadi</h3>
              <p>Qidiruv so'rovini o'zgartirib ko'ring yoki filtrlarni bekor qiling.</p>
              <button className="cat-btn-primary" onClick={() => { setQuery(""); setActiveType("all"); setActiveLang("Barchasi"); setActiveYear("Barchasi"); }}>Filtrlarni tozalash</button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="cat-grid">
              {filtered.map(book => (
                <div key={book.id} className="cat-card" onClick={() => setSelectedBook(book)}>
                  <div className="cat-card-img-wrap">
                    <img src={book.cover} alt={book.title} className="cat-card-img" />
                    <div className={`cat-card-avail${book.available ? " ok" : " busy"}`}>
                      {book.available ? "Mavjud" : "Band"}
                    </div>
                    <div className="cat-card-type">{book.type === "thesis" ? "Dissertatsiya" : book.type === "article" ? "Maqola" : "Kitob"}</div>
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
              ))}
            </div>
          ) : (
            <div className="cat-list">
              {filtered.map(book => (
                <div key={book.id} className="cat-list-item" onClick={() => setSelectedBook(book)}>
                  <img src={book.cover} alt={book.title} className="cat-list-cover" />
                  <div className="cat-list-info">
                    <div className="cat-list-type">{book.type === "thesis" ? "Dissertatsiya" : book.type === "article" ? "Maqola" : "Kitob"} · {book.year}</div>
                    <h3 className="cat-list-title">{book.title}</h3>
                    <p className="cat-list-author">{book.author_names.join(", ")} · {book.department_name} · {book.language}</p>
                    <p className="cat-list-summary">{book.summary}</p>
                    <div className="cat-list-bottom">
                      <StarRating rating={book.rating} />
                      <span>{book.views_count.toLocaleString()} ko'rish</span>
                      <span>{book.downloads_count.toLocaleString()} yuklab</span>
                      <span className={`cat-list-avail${book.available ? " ok" : " busy"}`}>{book.available ? "Mavjud" : "Band"}</span>
                    </div>
                  </div>
                  <button className="cat-list-btn">Ko'rish →</button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}
