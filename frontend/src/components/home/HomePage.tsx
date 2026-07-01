import { Link, useParams } from "react-router-dom";
import { BookOpen, Users, Library, GraduationCap, Globe, Building2, Search, Bot, BookMarked, LayoutDashboard } from "lucide-react";
import { departments, books, resources } from "../../data/mock";
import { useI18n } from "../../lib/i18n";
import type { Locale } from "../../types";

const stats = [
  { Icon: BookOpen, value: "670+", label: "Elektron resurslar" },
  { Icon: Users, value: "48+", label: "O'qituvchilar" },
  { Icon: Library, value: "6", label: "Kafedra kutubxonasi" },
  { Icon: GraduationCap, value: "4", label: "Ta'lim yo'nalishlari" },
  { Icon: Globe, value: "3", label: "Til" },
  { Icon: Building2, value: "2", label: "Fakultet" },
];

const newsItems = [
  {
    id: 1,
    category: "YANGILIKLAR",
    date: "Iyun 29, 2026",
    source: "ATMU",
    title: "Ma'lumotlar bazasi bo'yicha yangi darsliklar fondga qo'shildi",
    image: null,
    large: true,
  },
  {
    id: 2,
    category: "E'LON",
    date: "Iyun 20, 2026",
    source: "ATMU",
    title: "2026/2027 o'quv yili uchun kafedra resurslari yangilandi",
    image: null,
  },
  {
    id: 3,
    category: "HAMKORLIK",
    date: "Iyun 15, 2026",
    source: "ATMU",
    title: "Xalqaro kutubxona tizimi bilan integratsiya amalga oshirildi",
    image: null,
  },
  {
    id: 4,
    category: "HAMKORLIK",
    date: "May 19, 2026",
    source: "ATMU",
    title: "Elektron resurslar bazasi kengaytirildi va yangi qidiruv tizimi ishga tushirildi",
    image: null,
  },
  {
    id: 5,
    category: "SEMINAR",
    date: "May 10, 2026",
    source: "ATMU",
    title: "AI kutubxonachi va citation generator bo'yicha workshop",
    image: null,
  },
  {
    id: 6,
    category: "TADBIR",
    date: "Apr 26, 2026",
    source: "ATMU",
    title: "O'qish madaniyatini yuksaltirish bo'yicha universitetlar hamkorligi",
    image: null,
  },
];

const events = [
  {
    id: 1,
    date: "26-27 MART",
    category: "Kafedra",
    source: "ATMU",
    sourceDate: "Dek 19, 2025",
    title: "Axborot texnologiyalari bo'yicha ilmiy konferensiya",
    large: true,
  },
  {
    id: 2,
    date: "18 APREL",
    category: "Pedagog",
    source: "ATMU",
    sourceDate: "Apr 17, 2026",
    title: "Elektron ta'lim resurslari bo'yicha seminar",
    large: true,
  },
  {
    id: 3,
    date: "07",
    month: "YAN",
    category: "YANGILIK",
    categoryDate: "Yan 07, 2025",
    title: "Raqamli kutubxona va masofaviy ta'lim infratuzilmasi yangilandi",
    listItem: true,
  },
  {
    id: 4,
    date: "20",
    month: "DEK",
    category: "YANGILIK",
    categoryDate: "Dek 20, 2022",
    title: "Yangi o'quv zali jihozlari o'rnatildi",
    listItem: true,
  },
  {
    id: 5,
    date: "20",
    month: "DEK",
    category: "YANGILIK",
    categoryDate: "Dek 20, 2022",
    title: "Kutubxona fondini raqamlashtirish loyihasi boshlandi",
    listItem: true,
  },
];

const services = [
  { icon: "📅", label: "Katalog" },
  { icon: "🤖", label: "AI Kutubxonachi" },
  { icon: "📖", label: "O'quv zali" },
  { icon: "📕", label: "Kitob bron" },
  { icon: "🏛️", label: "Kafedralar" },
];

export function HomePage() {
  const { locale = "uz" } = useParams();
  const { t } = useI18n();
  const safeLocale = (["uz", "ru", "en", "tr"].includes(locale) ? locale : "uz") as Locale;

  const featuredDepts = departments.slice(0, 3);
  const featuredBooks = books.slice(0, 3);

  return (
    <div className="tstu-home">
      {/* ── HERO ── */}
      <section className="tstu-hero">
        <div className="tstu-hero-overlay" />
        <div className="tstu-hero-content">
          <p className="tstu-hero-breadcrumb">atmu.uz / Tuzilma / Smart UniLibrary</p>
          <h1 className="tstu-hero-title">Smart UniLibrary</h1>
          <div className="tstu-hero-divider">
            <span />
            <strong>ATMU 2026</strong>
            <span />
          </div>
          <p className="tstu-hero-sub">2026/2027 o'quv yili uchun elektron kutubxona portali</p>
          <Link to={`/${safeLocale}/catalog`} className="tstu-hero-btn">
            <span className="tstu-hero-btn-icon">📚</span>
            Katalogga kirish
          </Link>
        </div>
        <div className="tstu-hero-actions">
          <Link to={`/${safeLocale}/kafedralar`} className="tstu-action-chip">Kafedralar</Link>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="tstu-action-chip tstu-action-chip-tg"
          >
            ✈ Telegram kanal
          </a>
        </div>
      </section>

      {/* ── ABOUT / STATS ── */}
      <section className="tstu-about">
        <h2 className="tstu-section-title">ATMU Smart UniLibrary haqida</h2>
        <p className="tstu-about-text">
          Axborot texnologiyalari va menejment universiteti elektron kutubxona portali —
          kafedra resurslari, sun'iy intellekt qidiruvi, kitob bron qilish va o'quv zali
          boshqaruvini bir tizimda birlashtirgan zamonaviy raqamli platforma.
        </p>
        <div className="tstu-stats">
          {stats.map((s) => (
            <div key={s.label} className="tstu-stat-item">
              <s.Icon size={32} color="rgba(255,255,255,0.85)" className="tstu-stat-icon" />
              <strong className="tstu-stat-value">{s.value}</strong>
              <span className="tstu-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWS ── */}
      <section className="tstu-section">
        <div className="tstu-section-header">
          <h2 className="tstu-section-heading">Kutubxona yangiliklari</h2>
          <Link to={`/${safeLocale}/catalog`} className="tstu-see-all">Barchasini ko'rish →</Link>
        </div>
        <div className="tstu-news-grid">
          {/* Large card */}
          <article className="tstu-news-card tstu-news-large">
            <div className="tstu-news-img tstu-news-img-large">
              <div className="tstu-news-img-placeholder" />
              <div className="tstu-news-img-overlay">
                <span className="tstu-news-tag">{newsItems[0].category}</span>
                <span className="tstu-news-meta">{newsItems[0].source} • {newsItems[0].date}</span>
                <h3 className="tstu-news-title-white">{newsItems[0].title}</h3>
              </div>
            </div>
          </article>
          {/* Small cards */}
          <div className="tstu-news-small-col">
            {newsItems.slice(1, 3).map((item) => (
              <article key={item.id} className="tstu-news-card tstu-news-small">
                <div className="tstu-news-img tstu-news-img-small">
                  <div className="tstu-news-img-placeholder" />
                  <span className="tstu-news-tag tstu-news-tag-abs">{item.category}</span>
                </div>
                <div className="tstu-news-body">
                  <span className="tstu-news-meta">{item.source} • {item.date}</span>
                  <h3 className="tstu-news-title">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
        {/* Second row */}
        <div className="tstu-news-grid tstu-news-grid-second">
          {newsItems.slice(3, 6).map((item) => (
            <article key={item.id} className="tstu-news-card tstu-news-row2">
              <div className="tstu-news-img tstu-news-img-medium">
                <div className="tstu-news-img-placeholder" />
                <span className="tstu-news-tag tstu-news-tag-abs">{item.category}</span>
              </div>
              <div className="tstu-news-body">
                <span className="tstu-news-meta">{item.source} • {item.date}</span>
                <h3 className="tstu-news-title">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="tstu-section tstu-section-light">
        <div className="tstu-section-header">
          <h2 className="tstu-section-heading">Kutilyotgan tadbirlar</h2>
        </div>
        <div className="tstu-events-grid">
          {/* Left: 2 large event cards */}
          <div className="tstu-events-cards">
            {events.filter((e) => e.large).map((ev) => (
              <article key={ev.id} className="tstu-event-card">
                <div className="tstu-event-img-placeholder">
                  <div className="tstu-event-img-inner">
                    <span className="tstu-event-date-badge">{ev.date}</span>
                  </div>
                  <div className="tstu-event-overlay">
                    <span className="tstu-news-meta">{ev.source} • {ev.sourceDate} • {ev.category}</span>
                    <h3 className="tstu-event-title">{ev.title}</h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {/* Right: list items */}
          <div className="tstu-events-list">
            {events.filter((e) => e.listItem).map((ev) => (
              <div key={ev.id} className="tstu-event-list-item">
                <div className="tstu-event-date-col">
                  <strong>{ev.date}</strong>
                  <span>{ev.month}</span>
                </div>
                <div className="tstu-event-list-body">
                  <span className="tstu-event-list-meta">
                    <span className="tstu-event-list-tag">{ev.category}</span>
                    {ev.categoryDate}
                  </span>
                  <p className="tstu-event-list-title">{ev.title}</p>
                  <Link to={`/${safeLocale}/catalog`} className="tstu-batafsil">Batafsil →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE SERVICES ── */}
      <section className="tstu-section tstu-services-section">
        <div className="tstu-section-header">
          <h2 className="tstu-section-heading">Interaktiv xizmatlar</h2>
          <Link to={`/${safeLocale}/catalog`} className="tstu-see-all">Barchasini ko'rish</Link>
        </div>
        <div className="tstu-services-banner">
          <div className="tstu-services-banner-left">
            <span className="tstu-services-banner-icon">🔌</span>
            <p className="tstu-services-banner-text">
              <strong>Kutubxona elektron xizmatlaridan samarali foydalaning!</strong>
            </p>
          </div>
          <div className="tstu-services-banner-right">
            <div className="tstu-services-mockup">
              <div className="tstu-mockup-screen">
                <div className="tstu-mockup-bar" />
                <div className="tstu-mockup-line" />
                <div className="tstu-mockup-line tstu-mockup-line-short" />
              </div>
            </div>
          </div>
        </div>
        <div className="tstu-services-chips">
          <Link to={`/${safeLocale}/catalog`} className="tstu-service-chip">
            <Search size={28} color="#1457a8" />
            <span>Elektron katalog</span>
          </Link>
          <Link to={`/${safeLocale}/elibrary`} className="tstu-service-chip">
            <Bot size={28} color="#0e9f6e" />
            <span>AI Kutubxonachi</span>
          </Link>
          <Link to={`/${safeLocale}/library/reading-room`} className="tstu-service-chip">
            <BookOpen size={28} color="#0891b2" />
            <span>O'quv zali</span>
          </Link>
          <Link to={`/${safeLocale}/reservations`} className="tstu-service-chip">
            <BookMarked size={28} color="#7c3aed" />
            <span>Kitob bron qilish</span>
          </Link>
          <Link to={`/${safeLocale}/kafedralar`} className="tstu-service-chip">
            <Library size={28} color="#d6a84f" />
            <span>Kafedralar</span>
          </Link>
          <Link to={`/${safeLocale}/dashboard`} className="tstu-service-chip">
            <LayoutDashboard size={28} color="#dc2626" />
            <span>Boshqaruv paneli</span>
          </Link>
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section className="tstu-section">
        <div className="tstu-section-header">
          <h2 className="tstu-section-heading">Kafedra kutubxonalari</h2>
          <Link to={`/${safeLocale}/kafedralar`} className="tstu-see-all">Barchasini ko'rish →</Link>
        </div>
        <div className="tstu-dept-grid">
          {featuredDepts.map((dept) => (
            <article key={dept.id} className="tstu-dept-card">
              <div className="tstu-dept-icon">{dept.name.slice(0, 2)}</div>
              <h3 className="tstu-dept-name">{dept.name}</h3>
              <p className="tstu-dept-summary">{dept.summary}</p>
              <div className="tstu-dept-meta">
                <span>{dept.resources_count} resurs</span>
                <span>{dept.subjects_count} fan</span>
                <span>{dept.teachers_count} o'qituvchi</span>
              </div>
              <Link
                to={`/${safeLocale}/kafedralar/${dept.slug}/elektron-kutubxona`}
                className="tstu-dept-link"
              >
                Kutubxonaga kirish →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── BOOKS CATALOG STRIP ── */}
      <section className="tstu-section tstu-section-dark">
        <div className="tstu-section-header">
          <h2 className="tstu-section-heading tstu-section-heading-white">Mashhur kitoblar</h2>
          <Link to={`/${safeLocale}/catalog`} className="tstu-see-all tstu-see-all-white">Barchasini ko'rish →</Link>
        </div>
        <div className="tstu-books-grid">
          {featuredBooks.map((book) => (
            <article key={book.id} className="tstu-book-card">
              <div className="tstu-book-cover">
                <span>{book.title.slice(0, 1)}</span>
              </div>
              <div className="tstu-book-info">
                <h3 className="tstu-book-title">{book.title}</h3>
                <p className="tstu-book-meta">{book.department_name} · {book.subject_name}</p>
                <div className="tstu-book-availability">
                  <span className="tstu-availability-dot" />
                  {book.available_copies}/{book.total_copies} nusxa mavjud
                </div>
                <Link to={`/${safeLocale}/reservations`} className="tstu-book-btn">Band qilish</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
