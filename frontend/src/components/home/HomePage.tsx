import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { departments, readingRooms, resources } from "../../data/mock";
import { StatCard } from "../common/StatCard";
import { SectionHeading } from "../common/SectionHeading";
import { Badge } from "../common/Badge";
import { AILibrarianPanel } from "../ai/AILibrarianPanel";
import { useI18n } from "../../lib/i18n";

const heroTabs = ["Kitoblar", "Kafedra resurslari", "Maqolalar", "Dissertatsiyalar", "Video darslar", "O‘quv zali", "AI yordamchi"];

export function HomePage() {
  const { locale = "uz" } = useParams();
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return resources.slice(0, 3);
    }
    return resources.filter((resource) =>
      `${resource.title} ${resource.subject_name} ${resource.author_name} ${resource.department_name}`
        .toLowerCase()
        .includes(query.toLowerCase())
    ).slice(0, 4);
  }, [query]);

  return (
    <div className="page">
      <section className="hero-panel">
        <div className="hero-copy">
          <Badge label="ATMU Digital Library Ecosystem" tone="info" />
          <h1>{t("hero.title")}</h1>
          <p>{t("hero.subtitle")}</p>
          <div className="hero-buttons">
            <Link to={`/${locale}/catalog`} className="primary-button">{t("hero.catalogCta")}</Link>
            <Link to={`/${locale}/kafedralar`} className="ghost-button">{t("hero.departmentsCta")}</Link>
            <a href="#ai-preview" className="ghost-button">{t("hero.aiCta")}</a>
            <Link to={`/${locale}/library/reading-room`} className="ghost-button">{t("hero.readingRoomCta")}</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="library-stack">
            <div className="book-layer" />
            <div className="book-layer secondary" />
            <div className="book-layer tertiary" />
          </div>
          <div className="visual-card top-left">
            <span>Bugun 128 ta resurs ko‘rildi</span>
          </div>
          <div className="visual-card top-right">
            <span>23 ta bo‘sh o‘quv zali joyi</span>
          </div>
          <div className="visual-card bottom-left">
            <span>7 ta kitob band qilindi</span>
          </div>
          <div className="visual-card bottom-right">
            <span>Face ID active • 6 ta kafedra resurs markazi</span>
          </div>
          <div className="ai-mini-card">
            <strong>AI assistant</strong>
            <p>Katalog, kafedra resurslari va citation generator bog‘langan.</p>
          </div>
        </div>
      </section>

      <section className="search-panel">
        <div className="tab-row">
          {heroTabs.map((tab) => (
            <button key={tab} type="button" className="chip-button">{tab}</button>
          ))}
        </div>
        <div className="search-input-wrap">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("hero.searchPlaceholder")}
          />
          <button type="button" className="primary-button">{t("common.search")}</button>
        </div>
        <div className="preview-grid">
          {searchResults.map((item) => (
            <article key={item.id} className="preview-card">
              <div className="preview-topline">
                <Badge label={item.material_type} tone="info" />
                <Badge label={item.status} tone="success" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="resource-meta">
                <span>{item.department_name}</span>
                <span>{item.subject_name}</span>
                <span>{item.format}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Jami elektron resurslar" value="670+" helper="Kafedralar va markaziy katalog bo‘yicha" />
        <StatCard label="Kafedralar soni" value="6" helper="2 fakultet bo‘yicha" accent="gold" />
        <StatCard label="Bugun yuklangan materiallar" value="14" helper="3 tasi pending review" accent="teal" />
        <StatCard label="Active loans" value="89" helper="12 ta due-today, 5 overdue" accent="emerald" />
        <StatCard label="Bo‘sh o‘quv zali joylari" value="23" helper="Markaziy zal bo‘yicha real-time" />
        <StatCard label="AI so‘rovlar" value="342" helper="Uz/Ru/En/Tr ko‘rinishida" accent="teal" />
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Kafedra hub"
          title="Har bir kafedra uchun alohida elektron kutubxona"
          description="ATMU ichki portal uslubida ishlaydigan, fanlar, o‘qituvchilar va raqamli resurslar bilan bog‘langan kafedra sahifalari."
          action={<Link to={`/${locale}/kafedralar`} className="ghost-button">Barchasini ko‘rish</Link>}
        />
        <div className="department-grid">
          {departments.map((department) => (
            <article key={department.id} className="department-card">
              <div className="department-card-head">
                <div className="department-icon">{department.name.slice(0, 2)}</div>
                {department.has_new_materials ? <Badge label="Yangi material" tone="success" /> : null}
              </div>
              <h3>{department.name}</h3>
              <p>{department.summary}</p>
              <div className="department-metrics">
                <span>{department.resources_count} resurs</span>
                <span>{department.subjects_count} fan</span>
                <span>{department.teachers_count} o‘qituvchi</span>
                <span>{department.downloads_count} yuklab olish</span>
              </div>
              <div className="resource-actions">
                <Link className="primary-button small" to={`/${locale}/kafedralar/${department.slug}/elektron-kutubxona`}>
                  Elektron kutubxonaga kirish
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="split-grid">
        <div className="glass-panel">
          <SectionHeading eyebrow="Quick reserve" title="Kitob band qilish tezkor paneli" description="Olish sanasi, vaqt va QR confirmation bilan real reservation workflow." />
          <div className="list-card">
            <h3>Advanced Database Systems</h3>
            <p>3 ta nusxa mavjud • Shelf AT-DB-204</p>
            <div className="resource-actions">
              <Link to={`/${locale}/reservations`} className="primary-button small">Band qilish</Link>
              <Link to={`/${locale}/catalog`} className="ghost-button">Katalogdan ko‘rish</Link>
            </div>
          </div>
          <div className="alert-strip warning">Renewal request va overdue monitoring student dashboard ichida ko‘rinadi.</div>
        </div>
        <div className="glass-panel">
          <SectionHeading eyebrow="Seat booking" title="O‘quv zali mini xaritasi" description="Bo‘sh joy, band joy va tanlangan joylar uchun premium seat grid." />
          <div className="mini-seat-grid">
            {Array.from({ length: 18 }, (_, index) => (
              <span key={index} className={`seat-dot ${index % 4 === 0 ? "reserved" : index % 5 === 0 ? "occupied" : "available"}`} />
            ))}
          </div>
          <div className="resource-meta">
            <span>{readingRooms[0].name}</span>
            <span>{readingRooms[0].available_seats} seats available</span>
            <Link to={`/${locale}/library/reading-room`} className="ghost-button">Bron qilish</Link>
          </div>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading eyebrow="Highlights" title="Yangi resurslar va eng ko‘p o‘qilgan materiallar" />
        <div className="preview-grid">
          {resources.map((item) => (
            <article key={item.id} className="preview-card">
              <div className="preview-topline">
                <Badge label={item.department_name ?? ""} tone="info" />
                <span>{item.views_count} views</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="resource-actions">
                <Link to={`/${locale}/catalog`} className="ghost-button">Batafsil</Link>
                <button type="button" className="ghost-button">Saqlash</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="triple-grid">
        <div id="ai-preview"><AILibrarianPanel compact /></div>
        <div className="glass-panel">
          <SectionHeading eyebrow="Face ID + QR" title="Face ID va QR check-in preview" description="Kamera ruxsati, secure context nazorati va QR asosida kutubxona oqimlari." />
          <ul className="feature-list">
            <li>Face ID active holati va profile orqali boshqaruv</li>
            <li>QR confirmation reservation va seat booking’da ishlaydi</li>
            <li>Biometrik rozilik, embedding storage va password fallback</li>
          </ul>
        </div>
        <div className="glass-panel">
          <SectionHeading eyebrow="Monitoring" title="Kutubxonachi uchun monitoring preview" description="Pending resources, due-today loans va reading room occupancy bitta panelda." />
          <ul className="feature-list">
            <li>12 ta due-today loan</li>
            <li>5 ta overdue kitob</li>
            <li>4 ta pending_review resurs</li>
            <li>2 ta no-show seat booking</li>
          </ul>
        </div>
      </section>

      <section className="triple-grid">
        <div className="glass-panel">
          <SectionHeading eyebrow="Student alerts" title="Talaba uchun ogohlantirishlar" />
          <ul className="feature-list">
            <li>“Advanced Database Systems” 3 kundan so‘ng qaytarilishi kerak</li>
            <li>Kiberxavfsizlik bo‘yicha yangi o‘zbekcha resurs qo‘shildi</li>
            <li>Ertaga 10:00 da markaziy o‘quv zalida bron bor</li>
          </ul>
        </div>
        <div className="glass-panel">
          <SectionHeading eyebrow="Teacher call" title="O‘qituvchi uchun resurs yuklash chaqiruvi" />
          <p>Lecture notes, labs, testlar va metodik qo‘llanmalarni `pending_review` oqimi bilan yuklang.</p>
          <Link to={`/${locale}/resources/upload`} className="primary-button small">Yangi resurs yuklash</Link>
        </div>
        <div className="glass-panel">
          <SectionHeading eyebrow="Announcements" title="Yangiliklar va akademik kalendar" />
          <ul className="feature-list">
            <li>18-may: kutubxona fondini raqamlashtirish bo‘yicha seminar</li>
            <li>20-may: oraliq nazoratlar uchun extended reading room hours</li>
            <li>24-may: “AI for citation” workshop</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

