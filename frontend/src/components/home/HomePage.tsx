import { Link, useParams } from "react-router-dom";
import {
  BookOpen, Users, Library, GraduationCap, Globe, Building2,
  Search, Bot, MonitorPlay, BookMarked, LayoutDashboard, Layers, ArrowRight, Clock, MapPin, ChevronRight
} from "lucide-react";
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
  { id: 1, date: "26–27 MART", category: "Konferensiya", title: "Axborot texnologiyalari bo'yicha ilmiy konferensiya", img: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=360&fit=crop", time: "09:00–17:00", place: "A-blok, 201-xona" },
  { id: 2, date: "18 APREL", category: "Seminar", title: "Elektron ta'lim resurslari bo'yicha seminar", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=360&fit=crop", time: "14:00–16:00", place: "B-blok, aud. 3" },
  { id: 3, date: "07 YAN", category: "YANGILIK", title: "Raqamli kutubxona va masofaviy ta'lim infratuzilmasi yangilandi" },
  { id: 4, date: "20 DEK", category: "YANGILIK", title: "Yangi o'quv zali jihozlari o'rnatildi" },
  { id: 5, date: "15 NOY", category: "YANGILIK", title: "Kutubxona fondini raqamlashtirish loyihasi boshlandi" },
];

const stats = [
  { Icon: BookOpen,      value: "157 270", label: "Jami fond" },
  { Icon: Users,         value: "48+",     label: "O'qituvchilar" },
  { Icon: Library,       value: "42 000+", label: "Elektron kitob" },
  { Icon: GraduationCap, value: "12 500+", label: "Ilmiy maqola" },
  { Icon: Globe,         value: "3 200+",  label: "Dissertatsiya" },
  { Icon: Building2,     value: "6",       label: "Kafedra bazasi" },
];

const services = [
  { to: "catalog",              Icon: Search,          label: "Elektron katalog",  color: "#1e3a8a", bg: "#dbeafe", desc: "Kitob va resurs qidirish" },
  { to: "elibrary",             Icon: Bot,             label: "AI Kutubxonachi",   color: "#065f46", bg: "#d1fae5", desc: "Aqlli yordamchi" },
  { to: "library/reading-room", Icon: MonitorPlay,     label: "O'quv zali",        color: "#0c4a6e", bg: "#e0f2fe", desc: "Joy bron qilish" },
  { to: "reservations",         Icon: BookMarked,      label: "Kitob bron",        color: "#4c1d95", bg: "#ede9fe", desc: "Onlayn buyurtma" },
  { to: "kafedralar",           Icon: Layers,          label: "Kafedralar",        color: "#78350f", bg: "#fef3c7", desc: "6 ta kafedra bazasi" },
  { to: "dashboard",            Icon: LayoutDashboard, label: "Shaxsiy kabinet",   color: "#7f1d1d", bg: "#fee2e2", desc: "Boshqaruv paneli" },
];

/* ─── ATMU Logo SVG — haqiqiy logotipga o'xshash ─── */
function AtmuLogoWatermark() {
  return (
    <svg
      className="hp-logo-watermark"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Tashqi halqa */}
      <circle cx="250" cy="250" r="238" stroke="white" strokeWidth="5" strokeOpacity="0.25" />
      {/* Ichki halqa */}
      <circle cx="250" cy="250" r="210" stroke="white" strokeWidth="1.5" strokeOpacity="0.12" />
      {/* Eng ichki dekor halqa */}
      <circle cx="250" cy="250" r="175" stroke="white" strokeWidth="1" strokeOpacity="0.08" strokeDasharray="6 5" />

      {/* Matn — yuqori yoy bo'ylab: AXBOROT TEXNOLOGIYALARI VA */}
      <path id="topArc" d="M 60,250 A 190,190 0 0,1 440,250" fill="none" />
      <text fontSize="15" fontWeight="700" fill="white" fillOpacity="0.35" letterSpacing="3.5" fontFamily="Arial, sans-serif">
        <textPath href="#topArc" startOffset="3%">AXBOROT TEXNOLOGIYALARI VA MENEJMENT</textPath>
      </text>

      {/* Matn — pastki yoy bo'ylab: UNIVERSITETI */}
      <path id="botArc" d="M 68,270 A 185,185 0 0,0 432,270" fill="none" />
      <text fontSize="15" fontWeight="700" fill="white" fillOpacity="0.35" letterSpacing="8" fontFamily="Arial, sans-serif">
        <textPath href="#botArc" startOffset="18%">UNIVERSITETI</textPath>
      </text>

      {/* ── Markaziy ATMU harflari interlock ── */}
      {/* A harfi — orqa */}
      <path d="M170 340 L250 130 L330 340" stroke="white" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.18" fill="none"/>
      <path d="M195 278 L305 278" stroke="white" strokeWidth="18" strokeLinecap="round" strokeOpacity="0.18"/>

      {/* M harfi — ichki */}
      <path d="M175 340 L175 195 L250 270 L325 195 L325 340" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.22" fill="none"/>

      {/* T harfi — yuqori */}
      <path d="M190 165 L310 165" stroke="white" strokeWidth="20" strokeLinecap="round" strokeOpacity="0.20"/>
      <path d="M250 165 L250 225" stroke="white" strokeWidth="20" strokeLinecap="round" strokeOpacity="0.20"/>

      {/* U harfi — pastki */}
      <path d="M200 240 L200 310 Q200 345 250 345 Q300 345 300 310 L300 240" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.20" fill="none"/>

      {/* Kitob + monitor belgisi — eng pastda */}
      <rect x="228" y="375" width="44" height="32" rx="4" stroke="white" strokeWidth="3" strokeOpacity="0.28" fill="none"/>
      <path d="M228 387 L272 387" stroke="white" strokeWidth="2" strokeOpacity="0.28"/>
      <path d="M237 407 L263 407" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.28"/>
      <rect x="242" y="407" width="16" height="6" rx="2" stroke="white" strokeWidth="2" strokeOpacity="0.22" fill="none"/>

      {/* 4 burchakdagi yulduzcha dekor */}
      {[{x:250,y:58},{x:442,y:250},{x:250,y:442},{x:58,y:250}].map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="white" fillOpacity="0.30"/>
          <circle cx={p.x} cy={p.y} r="2" fill="white" fillOpacity="0.50"/>
        </g>
      ))}
    </svg>
  );
}

export function HomePage() {
  const { locale = "uz" } = useParams();
  const sl = (["uz","ru","en","tr"].includes(locale) ? locale : "uz") as Locale;
  const featuredDepts = departments.slice(0, 3);
  const featuredBooks  = books.slice(0, 3);

  return (
    <div className="hp-root">

      {/* ══════════════ HERO ══════════════ */}
      <section className="hp-hero">
        {/* fon layer-lari */}
        <div className="hp-hero-bg-grid" />
        <div className="hp-hero-glow g1" />
        <div className="hp-hero-glow g2" />
        <div className="hp-hero-glow g3" />

        {/* Logo watermark */}
        <AtmuLogoWatermark />

        {/* Chap tomon mazmun */}
        <div className="hp-hero-left">
          <div className="hp-hero-badge">
            <span className="hp-badge-dot" />
            ATMU · 2026/2027 o'quv yili
          </div>

          <h1 className="hp-hero-h1">
            <span className="hp-h1-white">Smart</span>
            <br />
            <span className="hp-h1-gold">UniLibrary</span>
          </h1>

          <p className="hp-hero-desc">
            Axborot texnologiyalari va menejment universiteti<br />
            zamonaviy elektron kutubxona portali — barcha resurslar,<br />
            AI qidiruv va bron bir joyda.
          </p>

          {/* Qidiruv */}
          <div className="hp-hero-searchbox">
            <Search size={17} className="hp-sb-icon" />
            <input
              className="hp-sb-input"
              placeholder="Kitob, muallif yoki mavzu..."
              readOnly
              onClick={() => { window.location.href = `/${sl}/catalog`; }}
            />
            <Link to={`/${sl}/catalog`} className="hp-sb-btn">Qidirish</Link>
          </div>

          {/* Tezkor havolalar */}
          <div className="hp-hero-chips">
            <Link to={`/${sl}/catalog`}               className="hp-chip hp-chip-gold"><GraduationCap size={15}/> Katalog</Link>
            <Link to={`/${sl}/kafedralar`}            className="hp-chip"><Layers size={15}/> Kafedralar</Link>
            <Link to={`/${sl}/elibrary`}              className="hp-chip"><Bot size={15}/> AI Yordamchi</Link>
            <Link to={`/${sl}/library/reading-room`}  className="hp-chip"><MonitorPlay size={15}/> O'quv zali</Link>
          </div>
        </div>

        {/* O'ng tomon — floating kartochkalar */}
        <div className="hp-hero-right">
          <div className="hp-float-card hp-fc-1">
            <BookOpen size={20} color="#c4a862" />
            <div>
              <strong>157 270</strong>
              <span>Jami fond</span>
            </div>
          </div>
          <div className="hp-float-card hp-fc-2">
            <GraduationCap size={20} color="#22c55e" />
            <div>
              <strong>12 500+</strong>
              <span>Ilmiy maqola</span>
            </div>
          </div>
          <div className="hp-float-card hp-fc-3">
            <Users size={20} color="#60a5fa" />
            <div>
              <strong>48+</strong>
              <span>O'qituvchi</span>
            </div>
          </div>
        </div>

        {/* Statistika banneri */}
        <div className="hp-statsbar">
          {stats.map(s => (
            <div key={s.label} className="hp-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ XIZMATLAR ══════════════ */}
      <section className="hp-section hp-svc-wrap">
        <div className="hp-sh">
          <div>
            <h2 className="hp-stitle">Interaktiv xizmatlar</h2>
            <p className="hp-ssub">Talaba, o'qituvchi va kutubxonachi uchun alohida kabinet</p>
          </div>
          <Link to={`/${sl}/dashboard`} className="hp-seeall">Barchasini ko'rish <ArrowRight size={14}/></Link>
        </div>
        <div className="hp-svc-grid">
          {services.map(s => (
            <Link key={s.to} to={`/${sl}/${s.to}`} className="hp-svc-card">
              <div className="hp-svc-icon" style={{ background: s.bg }}>
                <s.Icon size={22} color={s.color} strokeWidth={1.8} />
              </div>
              <div className="hp-svc-txt">
                <strong>{s.label}</strong>
                <span>{s.desc}</span>
              </div>
              <ChevronRight size={16} className="hp-svc-arr" />
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════ YANGILIKLAR ══════════════ */}
      <section className="hp-section hp-news-bg">
        <div className="hp-sh">
          <div>
            <h2 className="hp-stitle">Kutubxona yangiliklari</h2>
            <p className="hp-ssub">So'nggi tadbirlar va e'lonlar</p>
          </div>
          <Link to={`/${sl}/catalog`} className="hp-seeall">Barchasini ko'rish <ArrowRight size={14}/></Link>
        </div>

        <div className="hp-news-main">
          {/* Katta featured */}
          <article className="hp-nfeat">
            <div className="hp-nfeat-img">
              <img src={newsItems[0].img} alt={newsItems[0].title} />
              <div className="hp-nfeat-overlay">
                <span className="hp-ntag">{newsItems[0].category}</span>
                <h3>{newsItems[0].title}</h3>
                <span className="hp-ndate">{newsItems[0].date}</span>
              </div>
            </div>
          </article>

          {/* O'ng tomondagi kichik kartalar */}
          <div className="hp-nside">
            {newsItems.slice(1,4).map(n => (
              <article key={n.id} className="hp-ncard">
                <div className="hp-ncard-img">
                  <img src={n.img} alt={n.title} />
                  <span className="hp-ntag hp-ntag-abs">{n.category}</span>
                </div>
                <div className="hp-ncard-body">
                  <p className="hp-ncard-title">{n.title}</p>
                  <span className="hp-ndate">{n.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Pastki 3 ta mini */}
        <div className="hp-nmini-row">
          {newsItems.slice(3,6).map(n => (
            <article key={n.id} className="hp-nmini">
              <div className="hp-nmini-img"><img src={n.img} alt={n.title} /><span className="hp-ntag hp-ntag-abs">{n.category}</span></div>
              <div className="hp-nmini-body">
                <p>{n.title}</p>
                <span className="hp-ndate">{n.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════ TADBIRLAR ══════════════ */}
      <section className="hp-evt-section">
        <div className="hp-section">
          <div className="hp-sh">
            <div>
              <h2 className="hp-stitle">Kutilayotgan tadbirlar</h2>
              <p className="hp-ssub">Eng yaqin konferensiya va seminarlar</p>
            </div>
          </div>
          <div className="hp-evt-grid">
            {events.filter(e => e.img).map(ev => (
              <article key={ev.id} className="hp-evt-card">
                <div className="hp-evt-img">
                  <img src={ev.img} alt={ev.title} />
                  <div className="hp-evt-overlay">
                    <span className="hp-evt-chip">{ev.date}</span>
                    <div className="hp-evt-info">
                      <span className="hp-ntag">{ev.category}</span>
                      <h3>{ev.title}</h3>
                      <div className="hp-evt-meta">
                        {ev.time  && <span><Clock  size={11}/> {ev.time}</span>}
                        {ev.place && <span><MapPin size={11}/> {ev.place}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <div className="hp-evt-list">
              <div className="hp-evtl-head">Oxirgi yangiliklar</div>
              {events.filter(e => !e.img).map(ev => (
                <div key={ev.id} className="hp-evtl-item">
                  <div className="hp-evtl-date">{ev.date}</div>
                  <div className="hp-evtl-body">
                    <span className="hp-evtl-tag">{ev.category}</span>
                    <p>{ev.title}</p>
                    <Link to={`/${sl}/catalog`} className="hp-batafsil">Batafsil →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ KAFEDRALAR ══════════════ */}
      <section className="hp-section">
        <div className="hp-sh">
          <div>
            <h2 className="hp-stitle">Kafedra kutubxonalari</h2>
            <p className="hp-ssub">6 ta kafedra bo'yicha resurslar</p>
          </div>
          <Link to={`/${sl}/kafedralar`} className="hp-seeall">Barchasini ko'rish <ArrowRight size={14}/></Link>
        </div>
        <div className="hp-dept-grid">
          {featuredDepts.map((d,i) => {
            const colors = [["#1e3a8a","#dbeafe"],["#065f46","#d1fae5"],["#4c1d95","#ede9fe"]];
            const [c,bg] = colors[i];
            return (
              <article key={d.id} className="hp-dept-card">
                <div className="hp-dept-bar" style={{ background: c }} />
                <div className="hp-dept-ico" style={{ background: bg, color: c }}>{d.name.slice(0,2)}</div>
                <h3 className="hp-dept-name">{d.name}</h3>
                <p className="hp-dept-desc">{d.summary}</p>
                <div className="hp-dept-tags">
                  <span>{d.resources_count} resurs</span>
                  <span>{d.subjects_count} fan</span>
                  <span>{d.teachers_count} o'qituvchi</span>
                </div>
                <Link to={`/${sl}/kafedralar/${d.slug}/elektron-kutubxona`} className="hp-dept-link" style={{ color: c }}>
                  Kutubxonaga kirish <ArrowRight size={13}/>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* ══════════════ MASHHUR KITOBLAR ══════════════ */}
      <section className="hp-books-section">
        <div className="hp-section">
          <div className="hp-sh">
            <div>
              <h2 className="hp-stitle hp-stitle-white">Mashhur kitoblar</h2>
              <p className="hp-ssub hp-ssub-white">Eng ko'p o'qilgan va yuklangan resurslar</p>
            </div>
            <Link to={`/${sl}/catalog`} className="hp-seeall hp-seeall-white">Barchasini ko'rish <ArrowRight size={14}/></Link>
          </div>
          <div className="hp-books-grid">
            {featuredBooks.map((b,i) => {
              const grads = ["linear-gradient(135deg,#1e3a8a,#3b82f6)","linear-gradient(135deg,#065f46,#10b981)","linear-gradient(135deg,#4c1d95,#8b5cf6)"];
              return (
                <article key={b.id} className="hp-book-card">
                  <div className="hp-book-cover" style={{ background: grads[i] }}>
                    <span>{b.title[0]}</span>
                  </div>
                  <div className="hp-book-info">
                    <span className="hp-book-dept">{b.department_name}</span>
                    <h3 className="hp-book-title">{b.title}</h3>
                    <p className="hp-book-sub">{b.subject_name}</p>
                    <div className="hp-book-avail">
                      <span className={`hp-avail-dot ${b.available_copies > 0 ? "ok" : ""}`} />
                      {b.available_copies}/{b.total_copies} nusxa mavjud
                    </div>
                    <Link to={`/${sl}/reservations`} className="hp-book-btn">Bron qilish</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="hp-cta">
        <div className="hp-cta-logo-bg" aria-hidden="true">
          <svg viewBox="0 0 300 300" fill="none">
            <circle cx="150" cy="150" r="145" stroke="white" strokeWidth="3" strokeOpacity="0.15"/>
            <circle cx="150" cy="150" r="120" stroke="white" strokeWidth="1" strokeOpacity="0.08" strokeDasharray="5 4"/>
            <path d="M100 210 L150 80 L200 210" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.12" fill="none"/>
            <path d="M115 170 L185 170" stroke="white" strokeWidth="11" strokeLinecap="round" strokeOpacity="0.12"/>
          </svg>
        </div>
        <div className="hp-cta-inner">
          <div className="hp-cta-text">
            <h2>Kutubxonaning to'liq imkoniyatlaridan foydalaning</h2>
            <p>157 000+ fond, AI qidiruv, onlayn bron va o'quv zali — barchasi bir portada</p>
          </div>
          <div className="hp-cta-btns">
            <Link to={`/${sl}/catalog`}   className="hp-cta-p">Katalogga kirish</Link>
            <Link to={`/${sl}/dashboard`} className="hp-cta-s">Shaxsiy kabinet</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
