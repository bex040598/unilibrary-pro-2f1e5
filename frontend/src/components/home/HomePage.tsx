import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const SERVICES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    title: "Elektron katalog",
    desc: "Kitob, darslik, dissertatsiya va maqolalarni muallif, mavzu yoki kafedra bo'yicha toping.",
    href: "catalog",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "AI Kutubxonachi",
    desc: "Savol bering, kitob toping, iqtibos formatlang — sun'iy intellekt 24 soat xizmatda.",
    href: "elibrary/student",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: "O'quv zali",
    desc: "Individual kabinet yoki guruh xonasi — onlayn bron qiling va istalgan vaqt keling.",
    href: "library/reading-room",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    title: "Kafedra to'plamlari",
    desc: "Axborot texnologiyalari, iqtisodiyot, menejment va boshqa kafedralarning maxsus fondi.",
    href: "kafedralar",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: "E-Library portali",
    desc: "O'qituvchilar material yuklaydi, talabalar onlayn o'qiydi — bir tizimda hammasi.",
    href: "elibrary",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Kitob bron qilish",
    desc: "Kerakli nashrni oldindan band qiling, kutubxonaga kelib oling, muddatni uzaytiring.",
    href: "reservations",
  },
];

const COLLECTIONS = [
  {
    title: "Ilmiy maqolalar", count: "12 500+",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    title: "Dissertatsiyalar", count: "3 200+",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  },
  {
    title: "Elektron kitoblar", count: "42 000+",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  {
    title: "Video ma'ruzalar", count: "1 800+",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  },
  {
    title: "Qog'oz nashrlar", count: "90 000+",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
  {
    title: "Atlaslar va xaritalar", count: "580+",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  },
];

const NEWS = [
  {
    date: "28 iyun 2026",
    category: "Yangilik",
    title: "Springer Nature ilmiy bazasiga kirish ochildi",
    desc: "Universitetimiz 14 million dan ortiq ilmiy maqolani o'z ichiga olgan Springer Nature bazasiga ulanganidan so'ng, talaba va o'qituvchilar ushbu manbadan bepul foydalanishlari mumkin.",
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=640&q=85&fit=crop",
  },
  {
    date: "20 iyun 2026",
    category: "Tadbir",
    title: "Ilmiy maqola va iqtibos yozish ustaxonasi",
    desc: "APA 7, IEEE va GOST standartlarida to'g'ri iqtibos rasmiylashtirish bo'yicha amaliy ustaxona 5-iyul kuni kutubxona konferents-zalida bo'lib o'tadi. Qatnashish bepul.",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=640&q=85&fit=crop",
  },
  {
    date: "10 iyun 2026",
    category: "E'lon",
    title: "Yozgi davr ish tartibi e'lon qilindi",
    desc: "1-iyuldan 31-avgustgacha o'quv zali dushanba–juma kunlari soat 08:00–22:00, shanba–yakshanba kunlari esa 10:00–18:00 gacha ishlaydi.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=640&q=85&fit=crop",
  },
];

const STATS = [
  { value: "157 270", label: "Jami nashrlar" },
  { value: "12 500+", label: "Ilmiy maqolalar" },
  { value: "48",      label: "Kafedra to'plamlari" },
  { value: "250+",    label: "O'quv zali o'rinlari" },
  { value: "24/7",    label: "Onlayn kirish" },
  { value: "6 000+",  label: "Ro'yxatdan o'tganlar" },
];

export function HomePage() {
  const { locale = "uz" } = useParams();

  return (
    <main className="bod-home">

      {/* ══ HERO ══ */}
      <section className="bod-hero">
        <div className="bod-hero-content">
          <div className="bod-hero-badge">ATMU Smart UniLibrary · Qarshi</div>
          <h1 className="bod-hero-h1">
            Bilim — eng<br/>mustahkam poydevor
          </h1>
          <p className="bod-hero-sub">
            O'n minglab kitob, ilmiy maqola va o'quv materiallarini bir joydan toping.
            Kafedra kutubxonalari, o'quv zali va AI yordamchi — barchasi siz uchun.
          </p>
          <div className="bod-hero-searchbox">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Kitob nomi, muallif yoki mavzu..."
              readOnly
              onClick={() => { window.location.href = `/${locale}/catalog`; }}
            />
            <Link to={`/${locale}/catalog`} className="bod-hero-searchbtn">Qidirish</Link>
          </div>
          <div className="bod-hero-chips">
            <Link to={`/${locale}/catalog`} className="bod-hero-chip bod-chip-filled">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              Katalog
            </Link>
            <Link to={`/${locale}/elibrary/student`} className="bod-hero-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              AI Yordamchi
            </Link>
            <Link to={`/${locale}/library/reading-room`} className="bod-hero-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              O'quv zali
            </Link>
            <Link to={`/${locale}/kafedralar`} className="bod-hero-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Kafedralar
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
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

      {/* ══ XIZMATLAR ══ */}
      <section className="bod-section">
        <div className="bod-container">
          <div className="bod-section-head">
            <div className="bod-section-label">Xizmatlar</div>
            <h2 className="bod-section-title">Kutubxona imkoniyatlaridan foydalaning</h2>
            <p className="bod-section-desc">
              Raqamli va jismoniy resurslardan to'liq foydalanish uchun zamonaviy vositalar
            </p>
          </div>
          <div className="bod-services-grid">
            {SERVICES.map((s) => (
              <Link key={s.title} to={`/${locale}/${s.href}`} className="bod-service-card">
                <div className="bod-service-icon">{s.icon}</div>
                <div className="bod-service-body">
                  <h3 className="bod-service-title">{s.title}</h3>
                  <p className="bod-service-desc">{s.desc}</p>
                  <span className="bod-service-more">
                    Ko'rish
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TO'PLAMLAR ══ */}
      <section className="bod-section bod-section-dark">
        <div className="bod-container">
          <div className="bod-section-head">
            <div className="bod-section-label">To'plamlar</div>
            <h2 className="bod-section-title">Fond turlari bo'yicha ko'ring</h2>
          </div>
          <div className="bod-collections-grid">
            {COLLECTIONS.map((c) => (
              <Link key={c.title} to={`/${locale}/catalog`} className="bod-coll-card">
                <div className="bod-coll-icon">{c.icon}</div>
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
              <img
                src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=900&q=85&fit=crop"
                alt="Talaba kutubxonada o'qimoqda"
              />
              <div className="bod-feature-img-badge">
                <strong>157 270</strong>
                <span>nashr mavjud</span>
              </div>
            </div>
            <div className="bod-feature-body">
              <div className="bod-section-label">Sun'iy intellekt</div>
              <h2 className="bod-feature-title">AI yordamchi bilan o'qishni osonlashtiring</h2>
              <p className="bod-feature-desc">
                ATMU AI Kutubxonachi sizga savol berish, kerakli kitobni topish va iqtibos
                rasmiylashtirish imkonini beradi. Kutubxona fondidan bir zumda javob oling —
                istalgan vaqt, istalgan qurilmadan.
              </p>
              <ul className="bod-feature-list">
                <li><span className="bod-list-dot"/><span>Kitob va maqola topib, tavsiya etadi</span></li>
                <li><span className="bod-list-dot"/><span>APA, IEEE, GOST formatida iqtibos tuzadi</span></li>
                <li><span className="bod-list-dot"/><span>Mavzu bo'yicha adabiyotlar ro'yxatini tayyorlaydi</span></li>
                <li><span className="bod-list-dot"/><span>Kurs ishi va dissertatsiya yozishda ko'maklashadi</span></li>
              </ul>
              <Link to={`/${locale}/elibrary/student`} className="bod-btn-primary">
                AI Yordamchiga o'tish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ YANGILIKLAR ══ */}
      <section className="bod-section bod-bg-light">
        <div className="bod-container">
          <div className="bod-section-head bod-section-head-row">
            <div>
              <div className="bod-section-label">Yangiliklar</div>
              <h2 className="bod-section-title">Kutubxona hayotidan</h2>
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
                  <a href="#" className="bod-news-link">Batafsil →</a>
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
              <img
                src="https://images.unsplash.com/photo-1568667256549-094345857637?w=900&q=85&fit=crop"
                alt="Zamonaviy o'quv zali"
              />
              <div className="bod-feature-img-badge">
                <strong>250+</strong>
                <span>o'quv o'rni</span>
              </div>
            </div>
            <div className="bod-feature-body">
              <div className="bod-section-label">O'quv muhiti</div>
              <h2 className="bod-feature-title">Qulay va jim muhitda diqqatni jamlang</h2>
              <p className="bod-feature-desc">
                Keng o'quv zali, individual kabinetlar va guruh xonalari siz uchun doim ochiq.
                Tezkor Wi-Fi, kompyuter stansiyalari va tinch muhit — samarali o'qish uchun hamma narsa.
              </p>
              <div className="bod-mini-stats">
                <div className="bod-mini-stat"><strong>250+</strong><span>O'rindiq</span></div>
                <div className="bod-mini-stat"><strong>18</strong><span>Kabinet</span></div>
                <div className="bod-mini-stat"><strong>08–22</strong><span>Ish vaqti</span></div>
              </div>
              <Link to={`/${locale}/library/reading-room`} className="bod-btn-primary">
                O'rindiq bron qilish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="bod-cta-section">
        <div className="bod-cta-inner">
          <h2 className="bod-cta-title">Kutubxonaga a'zo bo'ling</h2>
          <p className="bod-cta-desc">
            Ro'yxatdan o'ting va barcha xizmatlardan bepul foydalaning —
            katalog, o'quv zali, AI yordamchi va ko'proq.
          </p>
          <div className="bod-cta-btns">
            <Link to={`/${locale}/register`} className="bod-btn-white">Ro'yxatdan o'tish</Link>
            <Link to={`/${locale}/catalog`}  className="bod-btn-outline-white">Katalogni ko'rish</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
