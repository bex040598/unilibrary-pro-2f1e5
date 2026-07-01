import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { books as fallbackBooks, departments as fallbackDepartments, resources as fallbackResources } from "../../data/mock";
import type { Book, Resource } from "../../types";

const CATALOG_SECTIONS = [
  "ATMU kutubxonasi",
  "Elektron resurslar",
  "Dissertatsiyalar va tezislar",
  "Davriy nashrlar",
  "Akademik litsey",
  "Video darsliklar",
  "Audio darslar",
  "Yakuniy malakaviy ish",
];

const SEARCH_MODES = [
  "Reytingli bepul qidiruv",
  "Kalit so'zlar bo'yicha qidiruv",
  "Kengaytirilgan qidiruv",
  "Professional qidiruv",
  "Mutaxassis qidiruvi",
  "GRNTI bo'yicha qidiruv",
  "Ta'lim maqsadlari uchun",
  "Elektron matnlarda kengaytirilgan qidiruv",
  "MESH tezaurusini qidirish",
  "Ma'lumotlar bazasini ko'rib chiqish",
];

const STATS = {
  sanadan: "2020-yil 1-sentabr",
  bugungi: 47,
  oyiga: 47,
  jami: 75245,
  bugungiKatalog: 74,
  yillikKatalog: 28699,
  jamiKatalog: 157270,
  bugunYuklangan: 2,
  yiligaYuklangan: 1478,
};

const FEATURED_BOOKS = [
  { id: 1, author: "Abdurahmonov SH.", title: "Chizma geometriya [Matn]: Darslik / SH. Abdurahmonov, 2005. – 188 b.", img: "https://picsum.photos/seed/book1/120/160" },
  { id: 2, author: "Amirov SF", title: "Elektrotexnikaning nazariy asoslari: o'quv qo'llanma, 2007. – 412 b.", img: "https://picsum.photos/seed/book2/120/160" },
  { id: 3, author: "Karimov O.B.", title: "Informatika va dasturlash asoslari: darslik, 2022. – 320 b.", img: "https://picsum.photos/seed/book3/120/160" },
];

const ONLINE_USERS = [
  "To'ychiyev|1786733266",
  "Sadikov|-133663310",
  "Abdullayev|1815855375",
  "Abduvaxitov|-650253001",
  "Xabibullayeva|-1668611417",
];

interface BookModalProps { book: (typeof FEATURED_BOOKS)[0]; onClose: () => void }

function BookModal({ book, onClose }: BookModalProps) {
  return (
    <div className="irbis-modal-overlay" onClick={onClose}>
      <div className="irbis-modal" onClick={(e) => e.stopPropagation()}>
        <button className="irbis-modal-close" onClick={onClose}>×</button>
        <div className="irbis-modal-body">
          <img src={book.img} alt={book.author} className="irbis-modal-img" />
          <div className="irbis-modal-info">
            <strong>{book.author}</strong>
            <p>{book.title}</p>
            <a href="#" className="irbis-catalog-link">Catalog yozuviga o'ting</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogPage() {
  const { locale = "uz" } = useParams();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState(0);
  const [activeMode, setActiveMode] = useState(0);
  const [selectedBook, setSelectedBook] = useState<typeof FEATURED_BOOKS[0] | null>(null);
  const [sliderIdx, setSliderIdx] = useState(0);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [catalogSection, setCatalogSection] = useState(0);

  const filteredBooks = useMemo(() =>
    fallbackBooks.filter((b) =>
      !search || `${b.title} ${b.subject_name}`.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const filteredResources = useMemo(() =>
    fallbackResources.filter((r) =>
      !search || `${r.title} ${r.subject_name}`.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchSubmitted(true);
  }

  const allResults: Array<{ type: "book"; item: Book } | { type: "resource"; item: Resource }> = [
    ...filteredBooks.map((b) => ({ type: "book" as const, item: b })),
    ...filteredResources.map((r) => ({ type: "resource" as const, item: r })),
  ];

  return (
    <div className="irbis-root">
      {/* ── Yuqori qidiruv satri ── */}
      <div className="irbis-topbar">
        <form className="irbis-top-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Поиск......"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="irbis-top-input"
          />
          <button type="submit" className="irbis-top-search-btn">Qidirish</button>
        </form>
        <div className="irbis-toplinks">
          <Link to={`/${locale}/catalog`}>Kutubxona haqida</Link>
          <Link to={`/${locale}`}>Kontaktlar</Link>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="irbis-header">
        <div className="irbis-header-logo">
          <img src="https://picsum.photos/seed/atmu-logo/80/80" alt="ATMU" className="irbis-logo-img" />
        </div>
        <div className="irbis-header-title">
          <em>ATMU Smart UniLibrary — elektron katalog tizimi</em>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="irbis-breadcrumb">
        <span>Siz shu yerdasiz: </span>
        <Link to={`/${locale}`}>Bosh sahifa</Link>
        {searchSubmitted && search && <><span> › </span><span>Qidiruv natijalari</span></>}
        <span className="irbis-date">01 | 07 | 2026</span>
      </div>

      {/* ── Asosiy 3 ustun ── */}
      <div className="irbis-layout">
        {/* ── Chap panel ── */}
        <aside className="irbis-sidebar">
          {/* Menyu */}
          <div className="irbis-panel">
            <div className="irbis-panel-title">Asosiy menyu</div>
            <ul className="irbis-menu">
              <li className="irbis-menu-home"><Link to={`/${locale}`}>Uy</Link></li>
              <li><Link to={`/${locale}/catalog`}>Elektron katalog</Link></li>
              <li><Link to={`/${locale}/catalog`}>Nashr reytingi</Link></li>
              <li><Link to={`/${locale}/catalog`}>Yangi kelganlar</Link></li>
              <li><Link to={`/${locale}`}>Sayt xaritasi</Link></li>
              <li><Link to={`/${locale}`}>Sensorli interfeys</Link></li>
            </ul>
          </div>

          {/* Avtorizatsiya */}
          <div className="irbis-panel">
            <div className="irbis-panel-title">Avtorizatsiya</div>
            {user ? (
              <div className="irbis-logged-in">
                <div className="irbis-user-avatar">{user.full_name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</div>
                <strong>{user.full_name}</strong>
                <span className={`irbis-role-badge irbis-role-${user.role}`}>{user.role}</span>
                <Link to={`/${locale}/elibrary/${user.role}`} className="irbis-elib-btn">E-Library profilim</Link>
              </div>
            ) : (
              <form className="irbis-login-form" onSubmit={(e) => { e.preventDefault(); window.location.href = `/${locale}/login`; }}>
                <label>Familiya</label>
                <input type="text" className="irbis-login-input" />
                <label>Parol</label>
                <input type="password" className="irbis-login-input" />
                <label className="irbis-remember">
                  <input type="checkbox" /> Meni eslaysizmi
                </label>
                <Link to={`/${locale}/login`} className="irbis-login-btn">Tizimga kirish</Link>
              </form>
            )}
          </div>

          {/* Doimiy so'rovlar */}
          <div className="irbis-panel">
            <button className="irbis-save-btn">So'rovni saqlash</button>
            <button className="irbis-save-btn">Saqlangan so'rovlar</button>
          </div>

          {/* Statistika */}
          <div className="irbis-panel">
            <div className="irbis-panel-title">Statistika</div>
            <table className="irbis-stat-table">
              <tbody>
                <tr><td>Sanadan boshlab:</td><td>{STATS.sanadan}</td></tr>
                <tr><td>Bugungi tashriflar:</td><td>{STATS.bugungi}</td></tr>
                <tr><td>Oyiga tashriflar soni:</td><td>{STATS.oyiga}</td></tr>
                <tr><td>Jami tashriflar:</td><td>{STATS.jami.toLocaleString()}</td></tr>
                <tr><td>Bugungi katalog qidiruvlari</td><td>{STATS.bugungiKatalog}</td></tr>
                <tr><td>Yilliga katalog qidiruvlari</td><td>{STATS.yillikKatalog.toLocaleString()}</td></tr>
                <tr><td>Jami katalog qidiruvlari</td><td>{STATS.jamiKatalog.toLocaleString()}</td></tr>
                <tr><td>Bugun yuklangan hujjatlar</td><td>{STATS.bugunYuklangan}</td></tr>
                <tr><td>Yilliga yuklangan hujjatlar</td><td>{STATS.yiligaYuklangan}-yil</td></tr>
              </tbody>
            </table>
          </div>

          {/* Hozirda saytda */}
          <div className="irbis-panel">
            <div className="irbis-panel-title">Hozirda saytda</div>
            <p className="irbis-online-text">Hozirda saytda 28 ta mehmon va 5 ta ro'yxatdan o'tgan foydalanuvchi mavjud.</p>
            <ul className="irbis-online-list">
              {ONLINE_USERS.map((u) => <li key={u}><a href="#">› {u}</a></li>)}
            </ul>
          </div>
        </aside>

        {/* ── Markaziy kontent ── */}
        <main className="irbis-main">
          {/* Slider */}
          <div className="irbis-slider">
            <div className="irbis-slider-counter">{sliderIdx + 1}</div>
            <img
              src={`https://picsum.photos/seed/campus${sliderIdx}/900/300`}
              alt="Campus"
              className="irbis-slider-img"
            />
            <button className="irbis-slide-prev" onClick={() => setSliderIdx((i) => (i + 2) % 3)}>‹</button>
            <button className="irbis-slide-next" onClick={() => setSliderIdx((i) => (i + 1) % 3)}>›</button>
            <div className="irbis-slider-title">ATMU — Smart UniLibrary tizimi</div>
          </div>

          {/* Eng mashhur / So'ngi yangiliklar */}
          {!searchSubmitted && (
            <div className="irbis-two-col-grid">
              <div className="irbis-col-block">
                <div className="irbis-col-title">Eng mashhur</div>
                <ul className="irbis-link-list">
                  <li><a href="#">› Foydalanuvchi uchun J-IRBIS 2.0</a></li>
                  <li><a href="#">› Kutubxona xodimlari uchun J-IRBIS 2.0</a></li>
                  <li><a href="#">› Ish vaqti</a></li>
                  <li><a href="#">› Kutubxona haqida ma'lumot</a></li>
                </ul>
              </div>
              <div className="irbis-col-block">
                <div className="irbis-col-title">So'ngi yangiliklar</div>
                <ul className="irbis-link-list">
                  <li><a href="#">› Kutubxona haqida ma'lumot</a></li>
                  <li><a href="#">› Ish vaqti</a></li>
                  <li><a href="#">› Kutubxona xodimlari uchun J-IRBIS 2.0</a></li>
                  <li><a href="#">› Foydalanuvchi uchun J-IRBIS 2.0</a></li>
                </ul>
              </div>
            </div>
          )}

          {/* ── Qidiruv natijalari ── */}
          {searchSubmitted && search && (
            <div className="irbis-results">
              <div className="irbis-results-header">
                <h2>Elektron kataloglarga kirish</h2>
              </div>

              {/* Qidiruv rejimlari */}
              <div className="irbis-accordion-item">
                <button className="irbis-accordion-btn">
                  ► Aloqadorlik reytingi bilan oddiy qidiruv
                </button>
              </div>
              <div className="irbis-accordion-item">
                <button className="irbis-accordion-btn">
                  ► Postlarni namoyish qilish sozlamalari
                </button>
              </div>

              {/* Progress */}
              <div className="irbis-progress-bar">
                <div className="irbis-progress-fill" />
              </div>
              <p className="irbis-results-count">
                Topilgan hujjatlar: {allResults.length}; 1 dan {Math.min(allResults.length, 10)} gacha bo'lgan hujjatlar ko'rsatilmoqda.
              </p>
              <p className="irbis-results-query">So'rov: (&gt;=1/A60 {search})</p>

              {/* Natijalar ro'yxati */}
              {allResults.slice(0, 10).map((result, idx) => {
                const isBook = result.type === "book";
                const item = result.item as Book & Resource;
                return (
                  <div key={idx} className="irbis-result-card">
                    <div className="irbis-result-check">
                      <span className="irbis-result-num">{idx + 1}</span>
                      <input type="checkbox" />
                    </div>
                    <img
                      src={`https://picsum.photos/seed/res${item.id}/80/110`}
                      alt={item.title}
                      className="irbis-result-cover"
                    />
                    <div className="irbis-result-info">
                      <div className="irbis-result-tabs">
                        <button className="irbis-rtab irbis-rtab-active">Bibliografik yozuv</button>
                        <button className="irbis-rtab">Nusxalar va rezervasyonlar</button>
                      </div>
                      <div className="irbis-result-stars">{"★".repeat(3)}{"☆".repeat(2)}</div>
                      <div className="irbis-result-type">{isBook ? "Kitob" : item.material_type || "Resurs"}</div>
                      <strong className="irbis-result-author">{item.subject_name}</strong>
                      <p className="irbis-result-title">{item.title} / {item.department_name}</p>
                      <div className="irbis-result-actions">
                        <button className="irbis-raction">Raf shifrlari</button>
                        <button className="irbis-raction">Tizimli indekslar</button>
                        <button className="irbis-raction">Kirish nuqtalari</button>
                        <button className="irbis-raction">Post URL manzili</button>
                        <button className="irbis-raction">Ulashish</button>
                      </div>
                      <a href="#" className="irbis-batafsil">
                        ✎ Batafsil ma'lumot: {item.title}
                      </a>
                    </div>
                  </div>
                );
              })}

              {/* Saqlash va chop etish */}
              <div className="irbis-accordion-item">
                <button className="irbis-accordion-btn">► Yozuvlarni saqlash va chop etish</button>
              </div>

              {/* Sahifalash */}
              <div className="irbis-pagination">
                {[1,2,3,4,5].map((p) => (
                  <button key={p} className={`irbis-page-btn${p === 1 ? " active" : ""}`}>{p}</button>
                ))}
              </div>
            </div>
          )}

          {/* Ish vaqti bloki */}
          {!searchSubmitted && (
            <>
              <div className="irbis-section-title">Uy</div>
              <div className="irbis-news-block">
                <div className="irbis-news-item">
                  <div className="irbis-news-header">
                    <span className="irbis-news-rating">Reyting: ●●●○○ / 2</span>
                    <div className="irbis-news-actions">🖨 📋</div>
                  </div>
                  <div className="irbis-news-title">ISH VAQTI</div>
                  <strong>Ilmiy-texnik kutubxonaning bo'limlari:</strong>
                  <ul>
                    <li>› NTB Direktorligi 09:00-17:00</li>
                    <li>› Ishga yollash bo'limi 09:00-17:00</li>
                    <li>› Ilmiy va bibliografiya bo'limi 08:00-18:00</li>
                    <li>› Ilmiy adabiyotlarga xizmat ko'rsatish bo'limi 08:00-18:00</li>
                  </ul>
                </div>
              </div>

              {/* 3 ustunli xabarlar */}
              <div className="irbis-three-col">
                <div className="irbis-col-news">
                  <div className="irbis-col-news-title">KUTUBXONA HAQIDA MA'LUMOT</div>
                  <div className="irbis-news-rating">Reyting: ●●●○○ / 4</div>
                  <p>ATMU axborot-resurs markazi fondida 139 486 nomdagi 774 532 ta nashr birligidan iborat. Shu jumladan: 231 175 ta ilmiy nusxa, 212 318 ta darslik, 31 919 ta badiiy adabiyot, 28 945 ta boshqa adabiyot, 131 999 ta elektron va 26 ta noyob adabiyot. To'liq matnli ma'lumotlar bazasi mavjud.</p>
                </div>
                <div className="irbis-col-news">
                  <div className="irbis-col-news-title">FOYDALANUVCHI UCHUN J-IRBIS 2.0</div>
                  <div className="irbis-news-rating">Reyting: ●●●○○ / 1</div>
                  <p>J-IRBIS 2.0 ning asosiy xususiyati korporativ ish rejimlarini qo'llab-quvvatlashidir. Modul IRBIS TCP/IP server protokoli, IRBIS WEB, J-IRBIS 1.X va Z39-50 protokoli orqali kirish mumkin bo'lgan resurslarni qidirish imkonini beradi.</p>
                  <a href="#" className="irbis-read-more">► Batafsil ma'lumot: Foydalanuvchi uchun J-IRBIS 2.0</a>
                </div>
                <div className="irbis-col-news">
                  <div className="irbis-col-news-title">KUTUBXONA XODIMLARI UCHUN J-IRBIS 2.0</div>
                  <div className="irbis-news-rating">Reyting: ○○○○○ / 0</div>
                  <p>Modul imkoniyatlarining bunday keng doirasini tavsiflab uni boshqarish haddan tashqari murakkab degan taassurot qoldirishi mumkin. Ko'plab kutubxona veb-qidiruv yechimlari rivojlanish uchun katta salohiyatga ega.</p>
                </div>
              </div>
            </>
          )}
        </main>

        {/* ── O'ng panel ── */}
        <aside className="irbis-right">
          {/* Biblioslider */}
          <div className="irbis-panel">
            <div className="irbis-panel-title">Biblioslider</div>
            <div className="irbis-biblio-slider">
              <button className="irbis-biblio-prev" onClick={() => setSliderIdx((i) => (i + 2) % 3)}>◄</button>
              <div className="irbis-biblio-book" onClick={() => setSelectedBook(FEATURED_BOOKS[sliderIdx % FEATURED_BOOKS.length])}>
                <img
                  src={FEATURED_BOOKS[sliderIdx % FEATURED_BOOKS.length].img}
                  alt="Kitob"
                  className="irbis-biblio-img"
                />
              </div>
              <button className="irbis-biblio-next" onClick={() => setSliderIdx((i) => (i + 1) % 3)}>►</button>
            </div>
            <p className="irbis-biblio-author">{FEATURED_BOOKS[sliderIdx % FEATURED_BOOKS.length].author}</p>
            <p className="irbis-biblio-desc">{FEATURED_BOOKS[sliderIdx % FEATURED_BOOKS.length].title}</p>
            <button className="irbis-koprq-btn" onClick={() => setSelectedBook(FEATURED_BOOKS[sliderIdx % FEATURED_BOOKS.length])}>
              Ko'proq o'qish
            </button>
          </div>

          {/* Elektron katalog filtrlari */}
          <div className="irbis-panel">
            <div className="irbis-panel-title">Elektron katalog</div>
            <ul className="irbis-catalog-check">
              {CATALOG_SECTIONS.map((s, i) => (
                <li key={s}>
                  <label>
                    <input
                      type="checkbox"
                      checked={i === catalogSection}
                      onChange={() => setCatalogSection(i)}
                    />
                    {" "}{s}
                  </label>
                </li>
              ))}
            </ul>
            <a href="#" className="irbis-select-all">Hammasini tanlang</a>
          </div>

          {/* Qidiruv rejimlari */}
          <div className="irbis-panel">
            <div className="irbis-panel-title">Qidiruv rejimlari</div>
            <ul className="irbis-modes">
              {SEARCH_MODES.map((m, i) => (
                <li key={m}>
                  <button
                    className={`irbis-mode-btn${i === activeMode ? " active" : ""}`}
                    onClick={() => setActiveMode(i)}
                  >
                    › {m}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Ovoz berish */}
          <div className="irbis-panel">
            <div className="irbis-panel-title">Ovoz berish</div>
            <p className="irbis-poll-q">Kutubxonaning yangi veb-sayti sizga yoqdimi?</p>
            <div className="irbis-poll-item">
              <span>Ha, menga yoqadi</span>
              <div className="irbis-poll-bar"><div className="irbis-poll-fill" style={{ width: "100%", background: "#4a90d9" }} /></div>
              <span>100%</span>
            </div>
            <div className="irbis-poll-item">
              <span>Umumiy hisobda</span>
              <div className="irbis-poll-bar"><div className="irbis-poll-fill" style={{ width: "0%", background: "#999" }} /></div>
              <span>0%</span>
            </div>
            <div className="irbis-poll-item">
              <span>Menga bu unchalik yoqmaydi</span>
              <div className="irbis-poll-bar"><div className="irbis-poll-fill" style={{ width: "0%", background: "#999" }} /></div>
              <span>0%</span>
            </div>
            <div className="irbis-poll-item">
              <span>Yoqtirmaslik</span>
              <div className="irbis-poll-bar"><div className="irbis-poll-fill" style={{ width: "0%", background: "#c0392b" }} /></div>
              <span>0%</span>
            </div>
            <p className="irbis-poll-total">Jami ovozlar: 1</p>
            <a href="#" className="irbis-poll-results">Natijalarni ko'rsatish »</a>
          </div>

          {/* Fotogalereya */}
          <div className="irbis-panel">
            <div className="irbis-panel-title">Fotogalereya</div>
            <img src="https://picsum.photos/seed/gallery1/200/120" alt="Galereya" className="irbis-gallery-img" />
          </div>

          {/* Tadbirlar taqvimi */}
          <div className="irbis-panel">
            <div className="irbis-panel-title">Tadbirlar taqvimi</div>
            <p className="irbis-cal-note">ma'lumot: iCagenda komponent menyusi nashr etilmagan!</p>
            <div className="irbis-calendar-header">
              <button>◄◄</button>
              <button>◄</button>
              <strong>2026-YIL IYUL</strong>
              <button>►</button>
            </div>
            <div className="irbis-cal-days">
              {[1,2,3,4,5,6,7,8,9,10].map((d) => (
                <button key={d} className={`irbis-cal-day${d === 1 ? " active" : ""}`}>{d}</button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Book modal */}
      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}
