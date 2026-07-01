import { Link, useParams } from "react-router-dom";
import {
  BookOpen, Users, Library, GraduationCap, Globe, Building2,
  Search, Bot, MonitorPlay, BookMarked, LayoutDashboard, Layers
} from "lucide-react";
import { departments, books } from "../../data/mock";
import type { Locale } from "../../types";

/* ── Ta'lim/kutubxona mavzusidagi rasmlar (Unsplash) ── */
const newsItems = [
  {
    id: 1,
    category: "YANGILIKLAR",
    date: "Iyun 29, 2026",
    source: "ATMU",
    title: "Ma'lumotlar bazasi bo'yicha yangi darsliklar fondga qo'shildi",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&h=520&fit=crop",
    large: true,
  },
  {
    id: 2,
    category: "E'LON",
    date: "Iyun 20, 2026",
    source: "ATMU",
    title: "2026/2027 o'quv yili uchun kafedra resurslari yangilandi",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=320&fit=crop",
  },
  {
    id: 3,
    category: "HAMKORLIK",
    date: "Iyun 15, 2026",
    source: "ATMU",
    title: "Xalqaro kutubxona tizimi bilan integratsiya amalga oshirildi",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=320&fit=crop",
  },
  {
    id: 4,
    category: "HAMKORLIK",
    date: "May 19, 2026",
    source: "ATMU",
    title: "Elektron resurslar bazasi kengaytirildi va yangi qidiruv tizimi ishga tushirildi",
    img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=340&fit=crop",
  },
  {
    id: 5,
    category: "SEMINAR",
    date: "May 10, 2026",
    source: "ATMU",
    title: "AI kutubxonachi va citation generator bo'yicha workshop",
    img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=340&fit=crop",
  },
  {
    id: 6,
    category: "TADBIR",
    date: "Apr 26, 2026",
    source: "ATMU",
    title: "O'qish madaniyatini yuksaltirish bo'yicha universitetlar hamkorligi",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=340&fit=crop",
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
    img: "https://images.unsplash.com/photo-1562774053-701939374585?w=540&h=380&fit=crop",
    large: true,
  },
  {
    id: 2,
    date: "18 APREL",
    category: "Pedagog",
    source: "ATMU",
    sourceDate: "Apr 17, 2026",
    title: "Elektron ta'lim resurslari bo'yicha seminar",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=540&h=380&fit=crop",
    large: true,
  },
  {
    id: 3, date: "07", month: "YAN", category: "YANGILIK",
    categoryDate: "Yan 07, 2025",
    title: "Raqamli kutubxona va masofaviy ta'lim infratuzilmasi yangilandi",
    listItem: true,
  },
  {
    id: 4, date: "20", month: "DEK", category: "YANGILIK",
    categoryDate: "Dek 20, 2024",
    title: "Yangi o'quv zali jihozlari o'rnatildi",
    listItem: true,
  },
  {
    id: 5, date: "15", month: "NOY", category: "YANGILIK",
    categoryDate: "Noy 15, 2024",
    title: "Kutubxona fondini raqamlashtirish loyihasi boshlandi",
    listItem: true,
  },
];

const stats = [
  { Icon: BookOpen,      value: "670+", label: "Elektron resurslar" },
  { Icon: Users,         value: "48+",  label: "O'qituvchilar" },
  { Icon: Library,       value: "6",    label: "Kafedra kutubxonasi" },
  { Icon: GraduationCap, value: "4",    label: "Ta'lim yo'nalishlari" },
  { Icon: Globe,         value: "3",    label: "Til" },
  { Icon: Building2,     value: "2",    label: "Fakultet" },
];

/* ── Xizmatlar ikonkalari ── */
const services = [
  {
    to: "catalog",
    Icon: Search,
    label: "Elektron katalog",
    color: "#1457a8",
    bg: "#e8f0fe",
    desc: "Kitob va resurs qidirish",
  },
  {
    to: "elibrary",
    Icon: Bot,
    label: "AI Kutubxonachi",
    color: "#059669",
    bg: "#d1fae5",
    desc: "Aqlli yordamchi",
  },
  {
    to: "library/reading-room",
    Icon: MonitorPlay,
    label: "O'quv zali",
    color: "#0891b2",
    bg: "#cffafe",
    desc: "Joy bron qilish",
  },
  {
    to: "reservations",
    Icon: BookMarked,
    label: "Kitob bron qilish",
    color: "#7c3aed",
    bg: "#ede9fe",
    desc: "Onlayn buyurtma",
  },
  {
    to: "kafedralar",
    Icon: Layers,
    label: "Kafedralar",
    color: "#d97706",
    bg: "#fef3c7",
    desc: "6 ta kafedra bazasi",
  },
  {
    to: "dashboard",
    Icon: LayoutDashboard,
    label: "Boshqaruv paneli",
    color: "#dc2626",
    bg: "#fee2e2",
    desc: "Shaxsiy kabinet",
  },
];

export function HomePage() {
  const { locale = "uz" } = useParams();
  const safeLocale = (["uz", "ru", "en", "tr"].includes(locale) ? locale : "uz") as Locale;

  const featuredDepts = departments.slice(0, 3);
  const featuredBooks = books.slice(0, 3);

  return (
    <div className="tstu-home">

      {/* ── HERO ── */}
      <section className="tstu-hero">
        <div className="tstu-hero-content">
          <p className="tstu-hero-breadcrumb">atmu.uz / Tuzilma / Smart UniLibrary</p>
          <h1 className="tstu-hero-title">Smart UniLibrary</h1>
          <div className="tstu-hero-divider">
            <span /><strong>ATMU 2026</strong><span />
          </div>
          <p className="tstu-hero-sub">2026/2027 o'quv yili uchun elektron kutubxona portali</p>
          <Link to={`/${safeLocale}/catalog`} className="tstu-hero-btn">
            <GraduationCap size={20} />
            Katalogga kirish
          </Link>
        </div>
        <div className="tstu-hero-actions">
          <Link to={`/${safeLocale}/kafedralar`} className="tstu-action-chip">Kafedralar</Link>
          <Link to={`/${safeLocale}/elibrary`} className="tstu-action-chip tstu-action-chip-tg">
            E-Library portali
          </Link>
        </div>
      </section>

      {/* ── STATISTIKA ── */}
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
              <s.Icon size={34} color="rgba(255,255,255,0.9)" />
              <strong className="tstu-stat-value">{s.value}</strong>
              <span className="tstu-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── YANGILIKLAR ── */}
      <section className="tstu-section">
        <div className="tstu-section-header">
          <h2 className="tstu-section-heading">Kutubxona yangiliklari</h2>
          <Link to={`/${safeLocale}/catalog`} className="tstu-see-all">Barchasini ko'rish →</Link>
        </div>

        {/* Katta + 2 kichik */}
        <div className="tstu-news-grid">
          <article className="tstu-news-card tstu-news-large">
            <div className="tstu-news-img tstu-news-img-large">
              <img src={newsItems[0].img} alt={newsItems[0].title} className="tstu-news-photo" />
              <div className="tstu-news-img-overlay">
                <span className="tstu-news-tag">{newsItems[0].category}</span>
                <span className="tstu-news-meta">{newsItems[0].source} • {newsItems[0].date}</span>
                <h3 className="tstu-news-title-white">{newsItems[0].title}</h3>
              </div>
            </div>
          </article>

          <div className="tstu-news-small-col">
            {newsItems.slice(1, 3).map((item) => (
              <article key={item.id} className="tstu-news-card tstu-news-small">
                <div className="tstu-news-img tstu-news-img-small">
                  <img src={item.img} alt={item.title} className="tstu-news-photo" />
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

        {/* 3 ta qo'shimcha */}
        <div className="tstu-news-grid tstu-news-grid-second">
          {newsItems.slice(3, 6).map((item) => (
            <article key={item.id} className="tstu-news-card tstu-news-row2">
              <div className="tstu-news-img tstu-news-img-medium">
                <img src={item.img} alt={item.title} className="tstu-news-photo" />
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

      {/* ── TADBIRLAR ── */}
      <section className="tstu-section tstu-section-light">
        <div className="tstu-section-header">
          <h2 className="tstu-section-heading">Kutilayotgan tadbirlar</h2>
        </div>
        <div className="tstu-events-grid">
          <div className="tstu-events-cards">
            {events.filter((e) => e.large).map((ev) => (
              <article key={ev.id} className="tstu-event-card">
                <div className="tstu-event-img-placeholder">
                  <img src={ev.img} alt={ev.title} className="tstu-news-photo" />
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

      {/* ── INTERAKTIV XIZMATLAR ── */}
      <section className="tstu-section tstu-services-section">
        <div className="tstu-section-header">
          <h2 className="tstu-section-heading">Interaktiv xizmatlar</h2>
          <Link to={`/${safeLocale}/elibrary`} className="tstu-see-all">Barchasini ko'rish</Link>
        </div>

        {/* Banner */}
        <div className="tstu-services-banner">
          <div className="tstu-services-banner-left">
            <div className="tstu-banner-icon-wrap">
              <Library size={36} color="#1457a8" />
            </div>
            <div>
              <h3 className="tstu-banner-title">Kutubxona elektron xizmatlaridan samarali foydalaning!</h3>
              <p className="tstu-banner-sub">Talaba, o'qituvchi va kutubxonachi uchun alohida shaxsiy kabinet</p>
            </div>
          </div>
          <div className="tstu-services-banner-right">
            <div className="tstu-services-mockup">
              <div className="tstu-mockup-screen">
                <div className="tstu-mockup-bar" />
                <div className="tstu-mockup-line" />
                <div className="tstu-mockup-line tstu-mockup-line-short" />
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  {["#e8f0fe", "#d1fae5", "#fef3c7"].map((c, i) => (
                    <div key={i} style={{ height: 24, flex: 1, borderRadius: 4, background: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Xizmatlar grid */}
        <div className="tstu-services-chips">
          {services.map((s) => (
            <Link key={s.to} to={`/${safeLocale}/${s.to}`} className="tstu-service-chip">
              <div className="tstu-service-icon-wrap" style={{ background: s.bg }}>
                <s.Icon size={26} color={s.color} strokeWidth={1.8} />
              </div>
              <span className="tstu-service-label">{s.label}</span>
              <span className="tstu-service-desc">{s.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── KAFEDRA KUTUBXONALARI ── */}
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

      {/* ── MASHHUR KITOBLAR ── */}
      <section className="tstu-section tstu-section-dark">
        <div className="tstu-section-header">
          <h2 className="tstu-section-heading tstu-section-heading-white">Mashhur kitoblar</h2>
          <Link to={`/${safeLocale}/catalog`} className="tstu-see-all tstu-see-all-white">
            Barchasini ko'rish →
          </Link>
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
                <Link to={`/${safeLocale}/reservations`} className="tstu-book-btn">
                  Bron qilish
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
