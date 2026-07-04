import { Link, useParams } from "react-router-dom";
import { BookOpen, Users, Library, GraduationCap, Globe, Building2, Search, Bot, MonitorPlay, BookMarked, LayoutDashboard, Layers, ArrowRight, Clock, MapPin } from "lucide-react";
import { departments, books } from "../../data/mock";
import type { Locale } from "../../types";

const newsItems = [
  { id: 1, category: "YANGILIKLAR", date: "Iyun 29, 2026", title: "Ma'lumotlar bazasi bo'yicha yangi darsliklar fondga qo'shildi", img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&h=520&fit=crop", large: true },
  { id: 2, category: "E'LON", date: "Iyun 20, 2026", title: "2026/2027 o'quv yili uchun kafedra resurslari yangilandi", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=320&fit=crop" },
  { id: 3, category: "HAMKORLIK", date: "Iyun 15, 2026", title: "Xalqaro kutubxona tizimi bilan integratsiya amalga oshirildi", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=320&fit=crop" },
  { id: 4, category: "RAQAMLI", date: "May 19, 2026", title: "Elektron resurslar bazasi kengaytirildi va yangi qidiruv tizimi ishga tushirildi", img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=340&fit=crop" },
  { id: 5, category: "SEMINAR", date: "May 10, 2026", title: "AI kutubxonachi va citation generator bo'yicha workshop", img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=340&fit=crop" },
  { id: 6, category: "TADBIR", date: "Apr 26, 2026", title: "O'qish madaniyatini yuksaltirish bo'yicha universitetlar hamkorligi", img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=340&fit=crop" },
];

const events = [
  { id: 1, date: "26–27 MART", category: "Konferensiya", title: "Axborot texnologiyalari bo'yicha ilmiy konferensiya", img: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=360&fit=crop", time: "09:00 – 17:00", place: "A-blok, 201-xona" },
  { id: 2, date: "18 APREL", category: "Seminar", title: "Elektron ta'lim resurslari bo'yicha seminar", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=360&fit=crop", time: "14:00 – 16:00", place: "B-blok, auditoriya 3" },
  { id: 3, date: "07 YAN", category: "YANGILIK", title: "Raqamli kutubxona va masofaviy ta'lim infratuzilmasi yangilandi" },
  { id: 4, date: "20 DEK", category: "YANGILIK", title: "Yangi o'quv zali jihozlari o'rnatildi" },
  { id: 5, date: "15 NOY", category: "YANGILIK", title: "Kutubxona fondini raqamlashtirish loyihasi boshlandi" },
];

const stats = [
  { Icon: BookOpen, value: "157 270", label: "Jami fond" },
  { Icon: Users, value: "48+", label: "O'qituvchilar" },
  { Icon: Library, value: "42 000+", label: "Elektron kitob" },
  { Icon: GraduationCap, value: "12 500+", label: "Ilmiy maqola" },
  { Icon: Globe, value: "3 200+", label: "Dissertatsiya" },
  { Icon: Building2, value: "6", label: "Kafedra bazasi" },
];

const services = [
  { to: "catalog", Icon: Search, label: "Elektron katalog", color: "#1a2f5a", bg: "linear-gradient(135deg,#e8f0fe,#c7d7f9)", desc: "Kitob va resurs qidirish" },
  { to: "elibrary", Icon: Bot, label: "AI Kutubxonachi", color: "#065f46", bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)", desc: "Aqlli yordamchi" },
  { to: "library/reading-room", Icon: MonitorPlay, label: "O'quv zali", color: "#0c4a6e", bg: "linear-gradient(135deg,#e0f2fe,#bae6fd)", desc: "Joy bron qilish" },
  { to: "reservations", Icon: BookMarked, label: "Kitob bron", color: "#4c1d95", bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", desc: "Onlayn buyurtma" },
  { to: "kafedralar", Icon: Layers, label: "Kafedralar", color: "#92400e", bg: "linear-gradient(135deg,#fef3c7,#fde68a)", desc: "6 ta kafedra bazasi" },
  { to: "dashboard", Icon: LayoutDashboard, label: "Shaxsiy kabinet", color: "#991b1b", bg: "linear-gradient(135deg,#fee2e2,#fecaca)", desc: "Boshqaruv paneli" },
];

/* ATMU Logo SVG — inline watermark uchun */
function AtmuLogoWatermark() {
  return (
    <svg className="hp-hero-logo-bg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="200" cy="200" r="195" stroke="white" strokeWidth="6" strokeOpacity="0.18" />
      <circle cx="200" cy="200" r="168" stroke="white" strokeWidth="2" strokeOpacity="0.10" />
      {/* A harfi */}
      <path d="M140 290 L200 120 L260 290" stroke="white" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.22" fill="none"/>
      <path d="M158 240 L242 240" stroke="white" strokeWidth="14" strokeLinecap="round" strokeOpacity="0.22"/>
      {/* T harfi */}
      <path d="M170 155 L230 155" stroke="white" strokeWidth="14" strokeLinecap="round" strokeOpacity="0.16"/>
      <path d="M200 155 L200 200" stroke="white" strokeWidth="14" strokeLinecap="round" strokeOpacity="0.16"/>
      {/* M harfi */}
      <path d="M155 210 L155 265 L200 235 L245 265 L245 210" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.14" fill="none"/>
      {/* Kitob belgisi pastda */}
      <rect x="182" y="308" width="36" height="26" rx="3" stroke="white" strokeWidth="3" strokeOpacity="0.20"/>
      <path d="M182 321 L218 321" stroke="white" strokeWidth="2" strokeOpacity="0.20"/>
      {/* Doira yoylari — matn joyi */}
      <path d="M60 200 A140 140 0 0 1 340 200" stroke="white" strokeWidth="1.5" strokeOpacity="0.08" fill="none" strokeDasharray="4 4"/>
    </svg>
  );
}

export function HomePage() {
  const { locale = "uz" } = useParams();
  const safeLocale = (["uz","ru","en","tr"].includes(locale) ? locale : "uz") as Locale;
  const featuredDepts = departments.slice(0, 3);
  const featuredBooks = books.slice(0, 3);

  return (
    <div className="hp-root">

      {/* ═══ HERO ═══ */}
      <section className="hp-hero">
        {/* Animatsiyali fon elementlari */}
        <div className="hp-hero-glow hp-hero-glow-1" />
        <div className="hp-hero-glow hp-hero-glow-2" />
        <div className="hp-hero-glow hp-hero-glow-3" />
        <div className="hp-hero-dots" />

        {/* ATMU logo watermark */}
        <AtmuLogoWatermark />

        <div className="hp-hero-inner">
          <div className="hp-hero-badge">
            <span className="hp-hero-badge-dot" />
            ATMU · 2026/2027 o'quv yili
          </div>

          <h1 className="hp-hero-title">
            <span className="hp-hero-title-main">Smart</span>
            <span className="hp-hero-title-accent"> UniLibrary</span>
          </h1>

          <p className="hp-hero-sub">
            Axborot texnologiyalari va menejment universiteti<br />
            zamonaviy elektron kutubxona portali
          </p>

          {/* Qidiruv */}
          <div className="hp-hero-search">
            <Search size={18} className="hp-search-icon" />
            <input className="hp-search-input" placeholder="Kitob, muallif yoki mavzu qidiring..." readOnly
              onClick={() => window.location.href = `/${safeLocale}/catalog`} />
            <Link to={`/${safeLocale}/catalog`} className="hp-search-btn">Qidirish</Link>
          </div>

          {/* Quick links */}
          <div className="hp-hero-links">
            <Link to={`/${safeLocale}/catalog`} className="hp-hero-link hp-hero-link-primary">
              <GraduationCap size={17} /> Elektron katalog
            </Link>
            <Link to={`/${safeLocale}/kafedralar`} className="hp-hero-link">
              <Layers size={17} /> Kafedralar
            </Link>
            <Link to={`/${safeLocale}/elibrary`} className="hp-hero-link">
              <Bot size={17} /> AI Kutubxonachi
            </Link>
            <Link to={`/${safeLocale}/library/reading-room`} className="hp-hero-link">
              <MonitorPlay size={17} /> O'quv zali
            </Link>
          </div>
        </div>

        {/* Pastki statistika banneri */}
        <div className="hp-hero-stats-bar">
          {stats.map(s => (
            <div key={s.label} className="hp-hero-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ XIZMATLAR GRID ═══ */}
      <section className="hp-section hp-services-section">
        <div className="hp-section-head">
          <div>
            <h2 className="hp-section-title">Interaktiv xizmatlar</h2>
            <p className="hp-section-sub">Talaba, o'qituvchi va kutubxonachi uchun alohida kabinet</p>
          </div>
          <Link to={`/${safeLocale}/dashboard`} className="hp-see-all">Barchasini ko'rish <ArrowRight size={15}/></Link>
        </div>
        <div className="hp-services-grid">
          {services.map(s => (
            <Link key={s.to} to={`/${safeLocale}/${s.to}`} className="hp-service-card">
              <div className="hp-service-icon" style={{ background: s.bg }}>
                <s.Icon size={24} color={s.color} strokeWidth={1.8} />
              </div>
              <div className="hp-service-text">
                <strong>{s.label}</strong>
                <span>{s.desc}</span>
              </div>
              <ArrowRight size={16} className="hp-service-arrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ YANGILIKLAR ═══ */}
      <section className="hp-section hp-news-section">
        <div className="hp-section-head">
          <div>
            <h2 className="hp-section-title">Kutubxona yangiliklari</h2>
            <p className="hp-section-sub">So'nggi tadbirlar va e'lonlar</p>
          </div>
          <Link to={`/${safeLocale}/catalog`} className="hp-see-all">Barchasini ko'rish <ArrowRight size={15}/></Link>
        </div>

        <div className="hp-news-layout">
          {/* Katta yangilik */}
          <article className="hp-news-featured">
            <div className="hp-news-img-wrap">
              <img src={newsItems[0].img} alt={newsItems[0].title} className="hp-news-img" />
              <div className="hp-news-overlay">
                <span className="hp-news-tag">{newsItems[0].category}</span>
                <h3 className="hp-news-featured-title">{newsItems[0].title}</h3>
                <span className="hp-news-date">{newsItems[0].date}</span>
              </div>
            </div>
          </article>

          {/* Kichik yangiliklar */}
          <div className="hp-news-side">
            {newsItems.slice(1, 4).map(item => (
              <article key={item.id} className="hp-news-card">
                <div className="hp-news-card-img">
                  <img src={item.img} alt={item.title} className="hp-news-img" />
                  <span className="hp-news-tag hp-news-tag-sm">{item.category}</span>
                </div>
                <div className="hp-news-card-body">
                  <p className="hp-news-card-title">{item.title}</p>
                  <span className="hp-news-date">{item.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Qo'shimcha 3 ta */}
        <div className="hp-news-row3">
          {newsItems.slice(3, 6).map(item => (
            <article key={item.id} className="hp-news-mini">
              <div className="hp-news-mini-img">
                <img src={item.img} alt={item.title} className="hp-news-img" />
                <span className="hp-news-tag hp-news-tag-sm">{item.category}</span>
              </div>
              <div className="hp-news-mini-body">
                <p className="hp-news-mini-title">{item.title}</p>
                <span className="hp-news-date">{item.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ TADBIRLAR ═══ */}
      <section className="hp-events-section">
        <div className="hp-events-inner">
          <div className="hp-section-head">
            <div>
              <h2 className="hp-section-title">Kutilayotgan tadbirlar</h2>
              <p className="hp-section-sub">Eng yaqin konferensiya va seminarlar</p>
            </div>
          </div>
          <div className="hp-events-grid">
            {/* 2 ta katta */}
            {events.filter(e => e.img).map(ev => (
              <article key={ev.id} className="hp-event-card">
                <div className="hp-event-img-wrap">
                  <img src={ev.img} alt={ev.title} className="hp-news-img" />
                  <div className="hp-event-overlay">
                    <span className="hp-event-date-chip">{ev.date}</span>
                    <div className="hp-event-info">
                      <span className="hp-news-tag">{ev.category}</span>
                      <h3 className="hp-event-title">{ev.title}</h3>
                      <div className="hp-event-meta">
                        {ev.time && <span><Clock size={12}/> {ev.time}</span>}
                        {ev.place && <span><MapPin size={12}/> {ev.place}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Ro'yxat */}
            <div className="hp-event-list">
              <div className="hp-event-list-head">Oxirgi yangiliklar</div>
              {events.filter(e => !e.img).map(ev => (
                <div key={ev.id} className="hp-event-list-item">
                  <div className="hp-event-list-date">{ev.date}</div>
                  <div className="hp-event-list-body">
                    <span className="hp-event-list-tag">{ev.category}</span>
                    <p className="hp-event-list-title">{ev.title}</p>
                    <Link to={`/${safeLocale}/catalog`} className="hp-batafsil">Batafsil →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ KAFEDRA KUTUBXONALARI ═══ */}
      <section className="hp-section">
        <div className="hp-section-head">
          <div>
            <h2 className="hp-section-title">Kafedra kutubxonalari</h2>
            <p className="hp-section-sub">6 ta kafedra bo'yicha resurslar</p>
          </div>
          <Link to={`/${safeLocale}/kafedralar`} className="hp-see-all">Barchasini ko'rish <ArrowRight size={15}/></Link>
        </div>
        <div className="hp-dept-grid">
          {featuredDepts.map((dept, i) => (
            <article key={dept.id} className="hp-dept-card">
              <div className="hp-dept-accent" style={{ background: ["#1a2f5a","#065f46","#7c3aed"][i] }} />
              <div className="hp-dept-icon-wrap" style={{ background: ["#e8f0fe","#d1fae5","#ede9fe"][i] }}>
                <span style={{ color: ["#1a2f5a","#065f46","#7c3aed"][i], fontWeight: 800, fontSize: 18 }}>{dept.name.slice(0,2)}</span>
              </div>
              <h3 className="hp-dept-name">{dept.name}</h3>
              <p className="hp-dept-desc">{dept.summary}</p>
              <div className="hp-dept-badges">
                <span>{dept.resources_count} resurs</span>
                <span>{dept.subjects_count} fan</span>
                <span>{dept.teachers_count} o'qituvchi</span>
              </div>
              <Link to={`/${safeLocale}/kafedralar/${dept.slug}/elektron-kutubxona`} className="hp-dept-link">
                Kutubxonaga kirish <ArrowRight size={14}/>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ MASHHUR KITOBLAR ═══ */}
      <section className="hp-books-section">
        <div className="hp-books-inner">
          <div className="hp-section-head">
            <div>
              <h2 className="hp-section-title hp-section-title-white">Mashhur kitoblar</h2>
              <p className="hp-section-sub hp-section-sub-white">Eng ko'p o'qilgan va yuklangan resurslar</p>
            </div>
            <Link to={`/${safeLocale}/catalog`} className="hp-see-all hp-see-all-white">Barchasini ko'rish <ArrowRight size={15}/></Link>
          </div>
          <div className="hp-books-grid">
            {featuredBooks.map((book, i) => (
              <article key={book.id} className="hp-book-card">
                <div className="hp-book-cover" style={{ background: ["linear-gradient(135deg,#1a2f5a,#2d4a8a)","linear-gradient(135deg,#065f46,#047857)","linear-gradient(135deg,#7c3aed,#5b21b6)"][i] }}>
                  <span className="hp-book-letter">{book.title.slice(0,1)}</span>
                </div>
                <div className="hp-book-info">
                  <span className="hp-book-dept">{book.department_name}</span>
                  <h3 className="hp-book-title">{book.title}</h3>
                  <p className="hp-book-sub">{book.subject_name}</p>
                  <div className="hp-book-avail">
                    <span className={`hp-avail-dot ${book.available_copies > 0 ? "ok" : "busy"}`} />
                    {book.available_copies}/{book.total_copies} nusxa mavjud
                  </div>
                  <Link to={`/${safeLocale}/reservations`} className="hp-book-btn">
                    Bron qilish
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="hp-cta">
        <div className="hp-cta-inner">
          <div className="hp-cta-text">
            <h2>Kutubxonaning to'liq imkoniyatlaridan foydalaning</h2>
            <p>157 000+ fond, AI qidiruv, onlayn bron va o'quv zali — barchasi bir portada</p>
          </div>
          <div className="hp-cta-btns">
            <Link to={`/${safeLocale}/catalog`} className="hp-cta-btn-primary">Katalogga kirish</Link>
            <Link to={`/${safeLocale}/dashboard`} className="hp-cta-btn-secondary">Shaxsiy kabinet</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
