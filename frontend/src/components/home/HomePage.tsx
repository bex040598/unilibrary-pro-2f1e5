import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const SERVICES = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    title: "Elektron katalog",
    desc: "157 000+ kitob, dissertatsiya va ilmiy maqolalar. Muallif, mavzu va kafedra bo'yicha qidiring.",
    href: "catalog", color: "#002147",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
        <circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/>
      </svg>
    ),
    title: "AI Kutubxonachi",
    desc: "Sun'iy intellekt yordamida kitob topish, iqtibos formatlash va o'quv maslahat olish.",
    href: "elibrary/student", color: "#9b1a2f",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: "O'quv zali",
    desc: "24/7 o'quv zallari va individual kabinetlarni onlayn bron qiling. 250+ o'rindiq mavjud.",
    href: "library/reading-room", color: "#1a5c2a",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    title: "Kafedra kutubxonalari",
    desc: "AT, Iqtisodiyot, Menejment, Pedagogika kafedralarining maxsus to'plamlari.",
    href: "kafedralar", color: "#744210",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: "E-Library portali",
    desc: "O'qituvchi va talabalar uchun elektron materiallar: darsliklar, laboratoriya ishlari, video.",
    href: "elibrary", color: "#1e3a5f",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Kitob bron qilish",
    desc: "Kerakli kitobni onlayn bron qiling, kutubxonaga kelib oling va muddatini uzaytiring.",
    href: "reservations", color: "#5b21b6",
  },
];

const COLLECTIONS = [
  { title: "Ilmiy maqolalar",    count: "12 500+", icon: "📄", bg: "#002147" },
  { title: "Dissertatsiyalar",   count: "3 200+",  icon: "🎓", bg: "#9b1a2f" },
  { title: "Elektron kitoblar",  count: "42 000+", icon: "📱", bg: "#1a5c2a" },
  { title: "Video darslar",      count: "1 800+",  icon: "🎬", bg: "#744210" },
  { title: "Qog'oz nashrlari",   count: "90 000+", icon: "📚", bg: "#1e3a5f" },
  { title: "Atlaslar & xaritalar", count: "580+",  icon: "🗺️", bg: "#5b21b6" },
];

const NEWS = [
  {
    date: "28 Iyun 2026", category: "Yangilik",
    title: "ATMU kutubxonasi Springer Nature bazasiga ulandi",
    desc: "Endi barcha talabalar Springer Nature'ning 14 million+ ilmiy maqolasiga bepul kira oladilar.",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80",
  },
  {
    date: "20 Iyun 2026", category: "Tadbir",
    title: "Ilmiy iqtibos yozish bo'yicha bepul seminar",
    desc: "APA 7, IEEE va GOST standartlarida iqtibos yozishni o'rgatuvchi seminar 5-iyulda bo'lib o'tadi.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    date: "15 Iyun 2026", category: "E'lon",
    title: "Yozgi o'quv zali ish tartibi o'zgardi",
    desc: "1-iyuldan 31-avgustgacha o'quv zali dushanba–juma 08:00–22:00, dam olish 10:00–18:00.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
];

const STATS = [
  { value: "157 270", label: "Jami nashrlar" },
  { value: "12 500+", label: "Ilmiy maqolalar" },
  { value: "48+",     label: "Kafedra to'plamlari" },
  { value: "250",     label: "O'quv zali o'rinlari" },
  { value: "24/7",    label: "Onlayn kirish" },
  { value: "6 000+",  label: "Faol foydalanuvchilar" },
];

export function HomePage() {
  const { locale = "uz" } = useParams();

  return (
    <main className="bod-home">

      {/* ══ HERO ══ */}
      <section className="bod-hero">
        <div className="bod-hero-overlay" />
        <div className="bod-hero-content">
          <div className="bod-hero-badge">ATMU Smart UniLibrary · Qarshi 2026</div>
          <h1 className="bod-hero-h1">
            Bilim va texnologiya<br/>markazi
          </h1>
          <p className="bod-hero-sub">
            157 000+ kitob, ilmiy maqola va elektron resurslarni qidiring.
            Kafedra kutubxonalari, o'quv zali bron qilish va AI yordamchi.
          </p>
          <div className="bod-hero-searchbox">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Kitob, muallif yoki mavzu bo'yicha qidiring..."
              readOnly
              onClick={() => { window.location.href = `/${locale}/catalog`; }}
            />
            <Link to={`/${locale}/catalog`} className="bod-hero-searchbtn">Qidirish</Link>
          </div>
          <div className="bod-hero-chips">
            <Link to={`/${locale}/catalog`}               className="bod-hero-chip bod-chip-filled">📚 Katalog</Link>
            <Link to={`/${locale}/elibrary/student`}      className="bod-hero-chip">🤖 AI Yordamchi</Link>
            <Link to={`/${locale}/library/reading-room`}  className="bod-hero-chip">🪑 O'quv zali</Link>
            <Link to={`/${locale}/kafedralar`}            className="bod-hero-chip">🏛️ Kafedralar</Link>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <div className="bod-statsbar">
        <div className="bod-statsbar-inner">
          {STATS.map((s) => (
            <div key={s.label} className="bod-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══ */}
      <section className="bod-section">
        <div className="bod-container">
          <div className="bod-section-head">
            <div className="bod-section-label">Xizmatlar</div>
            <h2 className="bod-section-title">Kutubxona xizmatlaridan foydalaning</h2>
            <p className="bod-section-desc">
              Raqamli va jismoniy resurslardan foydalanish uchun zamonaviy vositalar
            </p>
          </div>
          <div className="bod-services-grid">
            {SERVICES.map((s) => (
              <Link key={s.title} to={`/${locale}/${s.href}`} className="bod-service-card">
                <div className="bod-service-icon" style={{ color: s.color, background: `${s.color}14` }}>
                  {s.icon}
                </div>
                <h3 className="bod-service-title">{s.title}</h3>
                <p className="bod-service-desc">{s.desc}</p>
                <span className="bod-service-more">Batafsil →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COLLECTIONS ══ */}
      <section className="bod-section bod-bg-light">
        <div className="bod-container">
          <div className="bod-section-head">
            <div className="bod-section-label">To'plamlar</div>
            <h2 className="bod-section-title">Fondlar bo'yicha ko'rib chiqing</h2>
          </div>
          <div className="bod-collections-grid">
            {COLLECTIONS.map((c) => (
              <Link key={c.title} to={`/${locale}/catalog`} className="bod-coll-card" style={{ background: c.bg }}>
                <span className="bod-coll-icon">{c.icon}</span>
                <strong className="bod-coll-count">{c.count}</strong>
                <span className="bod-coll-label">{c.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURE: AI ══ */}
      <section className="bod-section">
        <div className="bod-container">
          <div className="bod-feature-row">
            <div className="bod-feature-img">
              <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80" alt="Kutubxona o'quv zali"/>
              <div className="bod-feature-img-badge">
                <strong>157 270</strong>
                <span>nashr mavjud</span>
              </div>
            </div>
            <div className="bod-feature-body">
              <div className="bod-section-label">AI Texnologiya</div>
              <h2 className="bod-feature-title">Sun'iy intellekt yordamida o'qing</h2>
              <p className="bod-feature-desc">
                ATMU AI Kutubxonachi — savol bering, kitob toping, iqtibos formatlang.
                157 000+ manba bazasidan oniy javoblar oling. APA, IEEE, GOST
                formatlarida avtomatik iqtibos yarating.
              </p>
              <ul className="bod-feature-list">
                <li><span className="bod-list-dot"/><span>Kitob va maqola topib, tavsiya qiladi</span></li>
                <li><span className="bod-list-dot"/><span>Iqtibos (citation) avtomatik formatlab beradi</span></li>
                <li><span className="bod-list-dot"/><span>Mavzu bo'yicha adabiyotlar ro'yxatini tuzadi</span></li>
                <li><span className="bod-list-dot"/><span>Kurs ishi va referat yozishda yordam beradi</span></li>
              </ul>
              <Link to={`/${locale}/elibrary/student`} className="bod-btn-primary">
                AI Yordamchiga kirish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ NEWS ══ */}
      <section className="bod-section bod-bg-light">
        <div className="bod-container">
          <div className="bod-section-head bod-section-head-row">
            <div>
              <div className="bod-section-label">Yangiliklar</div>
              <h2 className="bod-section-title">So'nggi xabarlar</h2>
            </div>
            <Link to={`/${locale}`} className="bod-see-all">Barcha yangiliklar →</Link>
          </div>
          <div className="bod-news-grid">
            {NEWS.map((n, i) => (
              <article key={i} className="bod-news-card">
                <div className="bod-news-img-wrap">
                  <img src={n.img} alt={n.title} className="bod-news-img"/>
                  <span className="bod-news-cat">{n.category}</span>
                </div>
                <div className="bod-news-body">
                  <time className="bod-news-date">{n.date}</time>
                  <h3 className="bod-news-title">{n.title}</h3>
                  <p className="bod-news-desc">{n.desc}</p>
                  <a href="#" className="bod-news-link">Batafsil o'qish →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURE: O'quv zali ══ */}
      <section className="bod-section">
        <div className="bod-container">
          <div className="bod-feature-row bod-feature-row-rev">
            <div className="bod-feature-img">
              <img src="https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80" alt="O'quv zali"/>
              <div className="bod-feature-img-badge">
                <strong>250+</strong>
                <span>o'rindiq</span>
              </div>
            </div>
            <div className="bod-feature-body">
              <div className="bod-section-label">O'quv zali</div>
              <h2 className="bod-feature-title">Qulay muhitda o'qing va ishlang</h2>
              <p className="bod-feature-desc">
                ATMU o'quv zali 250+ o'rindiq, individual va guruhli kabinetlar, yuqori
                tezlikli Wi-Fi va kompyuter stansiyalari bilan jihozlangan.
              </p>
              <div className="bod-mini-stats">
                <div className="bod-mini-stat"><strong>250+</strong><span>O'rindiq</span></div>
                <div className="bod-mini-stat"><strong>18</strong><span>Kabinet</span></div>
                <div className="bod-mini-stat"><strong>08–22</strong><span>Ish vaqti</span></div>
              </div>
              <Link to={`/${locale}/library/reading-room`} className="bod-btn-primary">
                O'quv zalini bron qilish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="bod-cta-section">
        <div className="bod-cta-inner">
          <h2 className="bod-cta-title">Kutubxonadan to'liq foydalaning</h2>
          <p className="bod-cta-desc">
            Barcha xizmatlardan foydalanish uchun ro'yxatdan o'ting yoki tizimga kiring
          </p>
          <div className="bod-cta-btns">
            <Link to={`/${locale}/register`} className="bod-btn-white">Ro'yxatdan o'tish</Link>
            <Link to={`/${locale}/catalog`}  className="bod-btn-outline-white">Katalogga kirish</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
