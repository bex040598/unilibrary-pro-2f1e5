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

const AI_FEATURES = [
  {
    num: "01",
    title: "Aqlli kutubxona qidiruvchi",
    desc: "Talaba so'roviga ko'ra mos kitoblar topiladi, boshlovchilar uchun eng tavsiya etiladigan 3 ta resurs, har birining qisqacha tavsifi va yuklab olish havolasi bilan birga ko'rsatiladi.",
  },
  {
    num: "02",
    title: "PDF bilan suhbat (Chat with PDF)",
    desc: "500 betlik kitob yoki maqola yuklanadi. \"5-bob nima haqida?\" yoki \"Muallif neyron tarmoqlarni qanday tushuntirgan?\" kabi savollarga AI bir necha soniyada aniq javob beradi.",
  },
  {
    num: "03",
    title: "Dissertatsiya yordamchisi",
    desc: "Magistr yoki doktorant mavzusiga mos 20 ta maqola, dolzarb tadqiqotlar, metodologiyalar va ilmiy bo'shliqlar (research gap) ro'yxati taqdim etiladi.",
  },
  {
    num: "04",
    title: "Bir nechta kitobni taqqoslash",
    desc: "\"Django va Laravel haqida yozilgan kitoblar orasidagi farq nima?\" — AI bir nechta kitobni bir vaqtda tahlil qilib, umumlashtirilgan taqqoslash beradi.",
  },
  {
    num: "05",
    title: "Avtomatik referat va xulosa",
    desc: "AI kitob yoki maqoladan 10 qatorlik, 1 betlik yoki batafsil xulosa tayyorlaydi. O'quv rejasi va tadqiqot uchun vaqtni sezilarli darajada qisqartiradi.",
  },
  {
    num: "06",
    title: "Murakkab matnni soddalashtirish",
    desc: "Ilmiy matn yoki texnik paragraf tanlanadi. AI uni oddiy, tushunarli tilda qayta izohlaydi — 1-kurs talabasidan tortib magistrantgacha mos darajada.",
  },
  {
    num: "07",
    title: "Avtomatik test va savol yaratish",
    desc: "Har qanday kitob yoki bobdan 20 ta test, 10 ta ochiq savol va 5 ta case-study avtomatik tuziladi. O'qituvchilar uchun baholash materiallarini tayyorlash vaqtini keskin qisqartiradi.",
  },
  {
    num: "08",
    title: "Slayd tayyorlash",
    desc: "\"5-bob asosida 15 slayd tayyorla\" — AI sarlavhalar, asosiy fikrlar, tavsiya etilgan rasmlar va xulosa bilan tayyor taqdimot strukturasini yaratadi.",
  },
  {
    num: "09",
    title: "Citation Generator",
    desc: "Bir tugma orqali APA 7, IEEE, MLA, Chicago va GOST formatlarida to'g'ri iqtibos yaratiladi. Manba ma'lumotlari avtomatik to'ldiriladi.",
  },
  {
    num: "10",
    title: "Semantik qidiruv",
    desc: "Oddiy qidiruv faqat kalit so'zni topadi. RAG texnologiyasi ma'noni tushunadi: \"Banklarda xavfsiz tranzaksiyalar\" deb yozsangiz ham blockchain kitoblari topiladi.",
  },
  {
    num: "11",
    title: "AI Tavsiya tizimi",
    desc: "Foydalanuvchi Python, Data Science, ML kitoblarini o'qigan bo'lsa, AI unga Deep Learning, PyTorch, NLP va Computer Vision resurslarini shaxsiy tavsiya qiladi.",
  },
  {
    num: "12",
    title: "Ilmiy xatolarni aniqlash",
    desc: "Talaba matn yuklaydi — AI noto'g'ri ma'lumotlarni, eskirgan manbalarni va havolasiz jumlalarni avtomatik aniqlab, tuzatish tavsiyalari beradi.",
  },
  {
    num: "13",
    title: "Mualliflar bo'yicha ekspert tahlil",
    desc: "\"Andrew Ng qaysi mavzularda yozgan?\" — AI kutubxonadagi barcha materiallarni tahlil qilib, muallif yo'nalishlari, asosiy ishlari va atiqotlari bo'yicha to'liq hisobot beradi.",
  },
  {
    num: "14",
    title: "Ovozli kutubxonachi",
    desc: "Foydalanuvchi mikrofon orqali \"Sun'iy intellekt kitoblarini top\" deb aytadi. AI topadi, o'qib beradi va qisqacha tushuntiradi — qo'llar band bo'lsa ham ishlaydi.",
  },
  {
    num: "15",
    title: "Rasm orqali qidirish",
    desc: "Talaba kitobning bir sahifasini suratga oladi. AI OCR orqali matnni ajratadi, shu kitobni topadi va o'xshash adabiyotlarni tavsiya qiladi.",
  },
  {
    num: "16",
    title: "Yagona universitet bilim bazasi",
    desc: "Elektron kitoblar, maqolalar, dissertatsiyalar, me'yoriy hujjatlar, taqdimotlar, laboratoriya ishlari, video darslar va yangiliklar — bitta savol bilan barcha manbadan javob.",
  },
];

const AI_ADMIN = [
  "Eng ko'p qidirilgan mavzularni real vaqtda ko'rsatadi",
  "Talab yuqori, lekin resurs yetishmayotgan yo'nalishlarni aniqlaydi",
  "Yangi kitob xarid qilish bo'yicha ma'lumotga asoslangan tavsiyalar beradi",
  "Avtomatik annotatsiya va kalit so'zlar yaratadi",
  "Dublikat hujjatlarni aniqlaydi va metadata sifatini yaxshilaydi",
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

      {/* ══ SUN'IY INTELLEKT ══ */}
      <section className="hl-section hl-section-gray">
        <div className="hl-container">
          <div className="hl-section-hd">
            <div>
              <p className="hl-ai-eyebrow">RAG — Retrieval-Augmented Generation</p>
              <h2>Sun'iy intellekt imkoniyatlari</h2>
            </div>
            <Link to={`/${locale}/elibrary/student`} className="hl-see-all">AI Yordamchini sinab ko'ring →</Link>
          </div>

          <div className="hl-ai-grid">
            {AI_FEATURES.map(f => (
              <div key={f.num} className="hl-ai-card">
                <span className="hl-ai-num">{f.num}</span>
                <div className="hl-ai-body">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Admin panel strip */}
          <div className="hl-ai-admin">
            <div className="hl-ai-admin-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Administrator uchun qo'shimcha imkoniyatlar
            </div>
            <ul className="hl-ai-admin-list">
              {AI_ADMIN.map(item => (
                <li key={item}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ NEWS ══ */}
      <section className="hl-section hl-section-white">
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
