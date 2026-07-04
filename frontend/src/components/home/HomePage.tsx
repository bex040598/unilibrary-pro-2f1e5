import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const SUBJECTS = [
  { label: "Axborot texnologiyalari", count: "4 200" },
  { label: "Iqtisodiyot va menejment", count: "3 800" },
  { label: "Matematika va fizika", count: "2 900" },
  { label: "Kimyo va biologiya", count: "2 100" },
  { label: "Qurilish va mexanika", count: "1 750" },
  { label: "Pedagogika va psixologiya", count: "1 600" },
  { label: "Huquq va ijtimoiy fanlar", count: "1 400" },
  { label: "Til va adabiyot", count: "1 200" },
];

const FEATURED = [
  {
    title: "Ma'lumotlar bazasi tizimlarini loyihalash",
    author: "C. Coronel, S. Morris",
    type: "Darslik", year: "2024", field: "Axborot texnologiyalari",
    cover: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=240&h=320&fit=crop",
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    author: "S. Russell, P. Norvig",
    type: "Darslik", year: "2023", field: "AI va ML",
    cover: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=240&h=320&fit=crop",
  },
  {
    title: "Mikroiqtisodiyot nazariyasi",
    author: "N. G. Mankiw",
    type: "Darslik", year: "2023", field: "Iqtisodiyot",
    cover: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=240&h=320&fit=crop",
  },
  {
    title: "Kiberxavfsizlik asoslari",
    author: "W. Stallings",
    type: "Darslik", year: "2024", field: "Kiberxavfsizlik",
    cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=240&h=320&fit=crop",
  },
  {
    title: "Introduction to Data Science",
    author: "F. Mirzayev",
    type: "O'quv qo'llanma", year: "2025", field: "Ma'lumotlar tahlili",
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=240&h=320&fit=crop",
  },
];

const NEWS = [
  {
    date: "28 iyun 2026",
    category: "Yangilik",
    title: "Springer Nature ilmiy bazasiga kirish ochildi",
    desc: "14 million dan ortiq ilmiy maqolani o'z ichiga olgan Springer Nature bazasiga ulanish rasmiylashdi. Talaba va o'qituvchilar ushbu manbadan bepul foydalanishlari mumkin.",
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=640&q=85&fit=crop",
  },
  {
    date: "20 iyun 2026",
    category: "Tadbir",
    title: "Ilmiy maqola va iqtibos yozish ustaxonasi",
    desc: "APA 7, IEEE va GOST standartlarida to'g'ri iqtibos rasmiylashtirish bo'yicha amaliy ustaxona 5-iyul kuni kutubxona konferents-zalida bo'lib o'tadi.",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=640&q=85&fit=crop",
  },
  {
    date: "10 iyun 2026",
    category: "E'lon",
    title: "Yozgi davr ish tartibi e'lon qilindi",
    desc: "1-iyuldan 31-avgustgacha o'quv zali dushanba–juma 08:00–22:00, shanba–yakshanba 10:00–18:00 gacha ishlaydi.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=640&q=85&fit=crop",
  },
];

export function HomePage() {
  const { locale = "uz" } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/${locale}/catalog${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  }

  return (
    <main>

      {/* ══ HERO ══ */}
      <section className="hl-hero">
        <div className="hl-hero-inner">
          <p className="hl-hero-eyebrow">Axborot Texnologiyalari va Menejment Universiteti</p>
          <h1 className="hl-hero-h1">Smart UniLibrary</h1>
          <p className="hl-hero-sub">
            157&thinsp;270 ta nashr, 48 ta kafedra to'plami va AI yordamchi — bilimga bir qidiruv masofasida.
          </p>
          <form className="hl-search" onSubmit={handleSearch}>
            <svg className="hl-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="hl-search-input"
              type="text"
              placeholder="Kitob, muallif, mavzu yoki kafedra..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className="hl-search-btn">Qidirish</button>
          </form>
          <div className="hl-hero-links">
            <Link to={`/${locale}/catalog`}>Elektron katalog</Link>
            <span/>
            <Link to={`/${locale}/kafedralar`}>Kafedra to'plamlari</Link>
            <span/>
            <Link to={`/${locale}/elibrary/student`}>AI Yordamchi</Link>
            <span/>
            <Link to={`/${locale}/library/reading-room`}>O'quv zali</Link>
          </div>
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <div className="hl-stats">
        <div className="hl-stats-inner">
          <div className="hl-stat"><strong>157&thinsp;270</strong><span>Jami nashrlar</span></div>
          <div className="hl-stat-sep"/>
          <div className="hl-stat"><strong>42&thinsp;000+</strong><span>Elektron kitob</span></div>
          <div className="hl-stat-sep"/>
          <div className="hl-stat"><strong>12&thinsp;500+</strong><span>Ilmiy maqola</span></div>
          <div className="hl-stat-sep"/>
          <div className="hl-stat"><strong>48</strong><span>Kafedra fondi</span></div>
        </div>
      </div>

      {/* ══ BROWSE BY SUBJECT ══ */}
      <section className="hl-section hl-section-white">
        <div className="hl-container">
          <div className="hl-section-hd">
            <h2>Yo'nalish bo'yicha ko'ring</h2>
            <Link to={`/${locale}/catalog`} className="hl-see-all">Barcha yo'nalishlar →</Link>
          </div>
          <div className="hl-subjects">
            {SUBJECTS.map(s => (
              <Link key={s.label} to={`/${locale}/catalog`} className="hl-subject-item">
                <span className="hl-subject-label">{s.label}</span>
                <span className="hl-subject-count">{s.count} ta manba</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED RESOURCES ══ */}
      <section className="hl-section hl-section-gray">
        <div className="hl-container">
          <div className="hl-section-hd">
            <h2>Eng ko'p foydalanilgan</h2>
            <Link to={`/${locale}/catalog`} className="hl-see-all">Katalogga o'tish →</Link>
          </div>
          <div className="hl-featured-grid">
            {FEATURED.map(f => (
              <Link key={f.title} to={`/${locale}/catalog`} className="hl-featured-card">
                <div className="hl-featured-cover">
                  <img src={f.cover} alt={f.title} />
                </div>
                <div className="hl-featured-info">
                  <span className="hl-featured-field">{f.field}</span>
                  <h3 className="hl-featured-title">{f.title}</h3>
                  <p className="hl-featured-author">{f.author}</p>
                  <div className="hl-featured-meta">
                    <span>{f.type}</span>
                    <span>{f.year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section className="hl-section hl-section-white">
        <div className="hl-container">
          <div className="hl-section-hd">
            <h2>Kutubxona xizmatlari</h2>
          </div>
          <div className="hl-services">
            <Link to={`/${locale}/catalog`} className="hl-service">
              <div className="hl-service-num">01</div>
              <div className="hl-service-content">
                <h3>Elektron katalog</h3>
                <p>Kitob, darslik, dissertatsiya va maqolalarni muallif, mavzu yoki kafedra bo'yicha toping.</p>
              </div>
              <svg className="hl-service-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to={`/${locale}/elibrary`} className="hl-service">
              <div className="hl-service-num">02</div>
              <div className="hl-service-content">
                <h3>E-Library portali</h3>
                <p>O'qituvchilar material yuklaydi, talabalar onlayn o'qiydi va yuklab oladi — bir tizimda.</p>
              </div>
              <svg className="hl-service-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to={`/${locale}/elibrary/student`} className="hl-service">
              <div className="hl-service-num">03</div>
              <div className="hl-service-content">
                <h3>AI Kutubxonachi</h3>
                <p>Savol bering, kitob toping, iqtibos formatlang — sun'iy intellekt yordamchisi 24/7 xizmatda.</p>
              </div>
              <svg className="hl-service-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to={`/${locale}/library/reading-room`} className="hl-service">
              <div className="hl-service-num">04</div>
              <div className="hl-service-content">
                <h3>O'quv zali</h3>
                <p>Individual kabinet yoki guruh xonasi — onlayn bron qiling va istalgan vaqt keling.</p>
              </div>
              <svg className="hl-service-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to={`/${locale}/kafedralar`} className="hl-service">
              <div className="hl-service-num">05</div>
              <div className="hl-service-content">
                <h3>Kafedra to'plamlari</h3>
                <p>Har bir kafedra o'z ixtisosligi bo'yicha elektron resurslar, darsliklar va materiallar to'plami.</p>
              </div>
              <svg className="hl-service-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to={`/${locale}/reservations`} className="hl-service">
              <div className="hl-service-num">06</div>
              <div className="hl-service-content">
                <h3>Kitob bron qilish</h3>
                <p>Kerakli nashrni oldindan band qiling, kutubxonaga kelib oling, muddatni uzaytiring.</p>
              </div>
              <svg className="hl-service-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ NEWS ══ */}
      <section className="hl-section hl-section-gray">
        <div className="hl-container">
          <div className="hl-section-hd">
            <h2>Kutubxona yangiliklari</h2>
            <Link to={`/${locale}`} className="hl-see-all">Barcha yangiliklar →</Link>
          </div>
          <div className="hl-news-grid">
            {NEWS.map((n, i) => (
              <article key={i} className="hl-news-card">
                <div className="hl-news-img">
                  <img src={n.img} alt={n.title} />
                  <span className="hl-news-cat">{n.category}</span>
                </div>
                <div className="hl-news-body">
                  <time>{n.date}</time>
                  <h3>{n.title}</h3>
                  <p>{n.desc}</p>
                  <span className="hl-news-read">Batafsil o'qish →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA STRIP ══ */}
      <section className="hl-cta">
        <div className="hl-cta-inner">
          <div className="hl-cta-text">
            <h2>Kutubxona kartasi olmadingizmi?</h2>
            <p>Ro'yxatdan o'ting va 157&thinsp;270 ta nashrga darhol kirish imkoniga ega bo'ling.</p>
          </div>
          <div className="hl-cta-actions">
            <Link to={`/${locale}/register`} className="hl-cta-btn-primary">Ro'yxatdan o'tish</Link>
            <Link to={`/${locale}/catalog`} className="hl-cta-btn-ghost">Katalogni ko'rish</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
