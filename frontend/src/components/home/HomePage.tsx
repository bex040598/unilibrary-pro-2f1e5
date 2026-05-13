import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { books, departments, readingRooms, resources } from "../../data/mock";
import { StatCard } from "../common/StatCard";
import { SectionHeading } from "../common/SectionHeading";
import { Badge } from "../common/Badge";
import { AILibrarianPanel } from "../ai/AILibrarianPanel";
import { useI18n } from "../../lib/i18n";
import type { Locale } from "../../types";

const heroTabs = [
  "Kitoblar",
  "Kafedra resurslari",
  "Maqolalar",
  "Dissertatsiyalar",
  "Video darslar",
  "O'quv zali",
  "AI yordamchi"
];

const workflowSteps = [
  {
    step: "01",
    title: "O'qituvchi yuklaydi",
    body: "Ma'ruza, laboratoriya, test va metodik materiallar kafedra bo'yicha topshiriladi."
  },
  {
    step: "02",
    title: "Kutubxonachi tasdiqlaydi",
    body: "Pending review oqimi orqali sifat, versiya va ko'rinish nazorat qilinadi."
  },
  {
    step: "03",
    title: "Talaba foydalanadi",
    body: "Katalogdan qidiradi, yuklab oladi, band qiladi yoki AI yordamchi orqali topadi."
  },
  {
    step: "04",
    title: "Zalga kirish va qaytarish",
    body: "QR, Face ID va qaytarish muddati nazorati bir ekotizim ichida ishlaydi."
  }
];

const announcements = [
  "18-may kuni kutubxona fondini raqamlashtirish bo'yicha seminar o'tkaziladi.",
  "20-may oralig'ida reading room uzaytirilgan rejimda ishlaydi.",
  "24-may kuni AI citation va diplom ishi uchun adabiyot tanlash bo'yicha workshop bo'ladi."
];

const studentAlerts = [
  "\"Advanced Database Systems\" kitobi 3 kundan so'ng qaytarilishi kerak.",
  "Kiberxavfsizlik bo'yicha yangi o'zbekcha darslik katalogga qo'shildi.",
  "Ertaga 10:00 da Markaziy o'quv zalida sizning broningiz mavjud."
];

const localeSearchCopy: Record<Locale, { title: string; description: string; suggestion: string }> = {
  uz: {
    title: "Universal smart qidiruv",
    description: "Kitob, kafedra materiali, maqola, video dars, dissertatsiya va o'quv zali bronlarini bitta qidiruv oqimida boshqaring.",
    suggestion: "AI kutubxonachi 2-kurs, fan, muallif va til kesimida eng mos resurslarni tavsiya qiladi."
  },
  ru: {
    title: "Universal smart search",
    description: "Knigi, resursy kafedr, stat'i, video-uroki, dissertatsii i bronirovanie zala v odnom poiskovom potoke.",
    suggestion: "AI bibliotekar rekomenduet materialy po kursu, predmetu, avtoru i yazyku."
  },
  en: {
    title: "Universal smart search",
    description: "Books, department resources, articles, video lessons, dissertations, and reading room bookings in one search flow.",
    suggestion: "The AI librarian recommends the best sources by course, subject, author, and language."
  },
  tr: {
    title: "Evrensel akilli arama",
    description: "Kitaplar, bolum kaynaklari, makaleler, video dersler, tezler ve etut salonu rezervasyonlari tek arama akisi icinde.",
    suggestion: "AI kutuphane yardimcisi ders, yazar, dil ve sinifa gore en uygun kaynaklari onerir."
  }
};

export function HomePage() {
  const { locale = "uz" } = useParams();
  const safeLocale = (["uz", "ru", "en", "tr"].includes(locale) ? locale : "uz") as Locale;
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return resources.slice(0, 4);
    }
    return resources.filter((resource) =>
      `${resource.title} ${resource.subject_name} ${resource.author_name} ${resource.department_name} ${resource.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase())
    ).slice(0, 4);
  }, [query]);

  const featuredDepartments = departments.slice(0, 3);
  const featuredBooks = books.slice(0, 2);
  const searchCopy = localeSearchCopy[safeLocale];

  return (
    <div className="page">
      <section className="hero-panel home-hero">
        <div className="hero-copy">
          <div className="hero-badge-row">
            <Badge label="ATMU internal portal module" tone="info" />
            <Badge label="AI + Face ID + Reservation workflows" tone="success" />
          </div>
          <p className="hero-route">atmu.uz / Tuzilma / Kafedralar / Axborot texnologiyalari / Elektron kutubxona</p>
          <h1>{t("hero.title")}</h1>
          <p>{t("hero.subtitle")}</p>
          <div className="hero-buttons">
            <Link to={`/${locale}/catalog`} className="primary-button">{t("hero.catalogCta")}</Link>
            <Link to={`/${locale}/kafedralar`} className="ghost-button">{t("hero.departmentsCta")}</Link>
            <a href="#ai-preview" className="ghost-button">{t("hero.aiCta")}</a>
            <Link to={`/${locale}/library/reading-room`} className="ghost-button">{t("hero.readingRoomCta")}</Link>
          </div>
          <div className="trust-ribbon">
            <div className="trust-card">
              <strong>6 ta kafedra</strong>
              <span>Har biri alohida elektron kutubxona va statistika bilan</span>
            </div>
            <div className="trust-card">
              <strong>670+ resurs</strong>
              <span>Darslik, ma'ruza, laboratoriya, test, video va maqolalar</span>
            </div>
            <div className="trust-card">
              <strong>89 active loans</strong>
              <span>Due date, overdue va renewal request nazorati bilan</span>
            </div>
          </div>
        </div>

        <div className="hero-visual control-deck">
          <div className="signal-grid" aria-hidden="true" />
          <div className="deck-panel deck-panel-main">
            <div className="deck-heading">
              <span className="pulse-dot" />
              <strong>Smart UniLibrary Command Center</strong>
              <span>live academic operations</span>
            </div>
            <div className="metric-cluster">
              <div className="metric-tile">
                <span>Bugungi ko'rishlar</span>
                <strong>128</strong>
                <small>AI qidiruvdan 34 ta kirish</small>
              </div>
              <div className="metric-tile">
                <span>Bo'sh joylar</span>
                <strong>23</strong>
                <small>Markaziy o'quv zalida real-time holat</small>
              </div>
              <div className="metric-tile">
                <span>Band qilingan kitoblar</span>
                <strong>7</strong>
                <small>3 tasi tasdiq kutmoqda</small>
              </div>
              <div className="metric-tile">
                <span>Face ID</span>
                <strong>Active</strong>
                <small>Rozilik asosida xavfsiz kirish</small>
              </div>
            </div>
          </div>

          <div className="deck-panel deck-panel-side">
            <div className="mini-heading">
              <strong>AI kutubxonachi</strong>
              <span>Katalog va kafedra resurslari bilan bog'langan</span>
            </div>
            <div className="assistant-response">
              <p>2-kurs ma'lumotlar bazasi bo'yicha eng mos materiallar tayyorlandi.</p>
              <div className="assistant-tags">
                <span>Laboratoriya</span>
                <span>PDF</span>
                <span>Axborot texnologiyalari</span>
              </div>
            </div>
          </div>

          <div className="deck-panel deck-panel-availability">
            <div className="mini-heading">
              <strong>Availability board</strong>
              <span>Bugungi oqim va operatsiyalar</span>
            </div>
            <div className="availability-list">
              <div>
                <span>Advanced Database Systems</span>
                <strong>3/5 nusxa mavjud</strong>
              </div>
              <div>
                <span>Kafedra review queue</span>
                <strong>4 ta pending material</strong>
              </div>
              <div>
                <span>Reading room occupancy</span>
                <strong>{readingRooms[0].occupancy_rate}% band</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="search-panel home-search-panel">
        <SectionHeading
          eyebrow="Smart search"
          title={searchCopy.title}
          description={searchCopy.description}
        />
        <div className="tab-row">
          {heroTabs.map((tab) => (
            <button key={tab} type="button" className="chip-button">{tab}</button>
          ))}
        </div>
        <div className="search-layout">
          <div>
            <div className="search-input-wrap">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("hero.searchPlaceholder")}
              />
              <button type="button" className="primary-button">{t("common.search")}</button>
            </div>
            <div className="preview-grid home-preview-grid">
              {searchResults.map((item) => (
                <article key={item.id} className="preview-card resource-preview-card">
                  <div className="preview-topline">
                    <Badge label={item.material_type} tone="info" />
                    <Badge label={item.status} tone="success" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="resource-meta">
                    <span>{item.department_name}</span>
                    <span>{item.subject_name}</span>
                    <span>{item.course}-kurs / {item.semester}-semestr</span>
                  </div>
                  <div className="resource-actions">
                    <Link to={`/${locale}/catalog`} className="ghost-button small">Ochish</Link>
                    <button type="button" className="primary-button small">AI tavsiya</button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="glass-panel smart-aside">
            <SectionHeading
              eyebrow="AI signal"
              title="Qidiruvga biriktirilgan yordamchi"
              description={searchCopy.suggestion}
            />
            <div className="smart-aside-card">
              <span>Namuna so'rov</span>
              <strong>"Menga 2-kurs ma'lumotlar bazasi bo'yicha laboratoriyalar kerak"</strong>
            </div>
            <div className="signal-bars">
              <div>
                <span>Fan mosligi</span>
                <div className="signal-bar"><i style={{ width: "92%" }} /></div>
              </div>
              <div>
                <span>Til mosligi</span>
                <div className="signal-bar"><i style={{ width: "74%" }} /></div>
              </div>
              <div>
                <span>Kafedra relevance</span>
                <div className="signal-bar"><i style={{ width: "88%" }} /></div>
              </div>
            </div>
            <div className="assistant-tags">
              <span>Citation generator</span>
              <span>APA</span>
              <span>PDF preview</span>
              <span>Reserve flow</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="stats-grid compact">
        <StatCard label="Jami elektron resurslar" value="670+" helper="Kafedralar va markaziy katalog bo'yicha" />
        <StatCard label="Kafedralar soni" value="6" helper="2 fakultet kesimida" accent="gold" />
        <StatCard label="Bugun yuklangan materiallar" value="14" helper="3 tasi pending review" accent="teal" />
        <StatCard label="Active loans" value="89" helper="12 ta due today, 5 overdue" accent="emerald" />
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Workflow"
          title="Kutubxona jarayonlari haqiqiy platforma sifatida ko'rinsin"
          description="Resurs yuklash, tasdiqlash, katalogdan foydalanish, kitob band qilish va o'quv zali kirishi bitta premium workflow ichida ko'rsatiladi."
        />
        <div className="workflow-grid">
          {workflowSteps.map((item) => (
            <article key={item.step} className="workflow-card">
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Kafedra hub"
          title="Har bir kafedra uchun alohida elektron kutubxona"
          description="ATMU ichki portal uslubida fanlar, o'qituvchilar, ko'rish statistikasi va yangi material badge'lari bilan ishlaydigan kafedra markazlari."
          action={<Link to={`/${locale}/kafedralar`} className="ghost-button">Barchasini ko'rish</Link>}
        />
        <div className="department-grid home-department-grid">
          {featuredDepartments.map((department) => (
            <article key={department.id} className="department-card premium-department-card">
              <div className="department-card-head">
                <div className="department-icon">{department.name.slice(0, 2)}</div>
                {department.has_new_materials ? <Badge label="Yangi material" tone="success" /> : null}
              </div>
              <h3>{department.name}</h3>
              <p>{department.summary}</p>
              <div className="department-metrics">
                <span>{department.resources_count} resurs</span>
                <span>{department.subjects_count} fan</span>
                <span>{department.teachers_count} o'qituvchi</span>
                <span>{department.downloads_count} yuklab olish</span>
              </div>
              <div className="department-footnote">
                <strong>Eng faol fan:</strong>
                <span>{department.active_subject}</span>
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
        <div className="glass-panel reserve-panel">
          <SectionHeading
            eyebrow="Quick reserve"
            title="Kitob band qilish va olish oqimi"
            description="Talaba nusxani ko'radi, pickup vaqtini tanlaydi, QR confirmation oladi va kutubxonachi orqali loan yaratiladi."
          />
          <div className="reserve-book-list">
            {featuredBooks.map((book) => (
              <article key={book.id} className="list-card premium-list-card">
                <h3>{book.title}</h3>
                <p>{book.subject_name} / {book.department_name}</p>
                <div className="resource-meta">
                  <span>{book.available_copies}/{book.total_copies} nusxa</span>
                  <span>{book.shelf_code}</span>
                  <span>Rating {book.rating}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="resource-actions">
            <Link to={`/${locale}/reservations`} className="primary-button small">Band qilish</Link>
            <Link to={`/${locale}/loans`} className="ghost-button">Qaytarish muddatlarini ko'rish</Link>
          </div>
          <div className="alert-strip warning">Renewal request va overdue monitoring student dashboard ichida real ko'rinishda ishlaydi.</div>
        </div>

        <div className="glass-panel seat-panel">
          <SectionHeading
            eyebrow="Reading room"
            title="Premium seat map va occupancy holati"
            description="Bo'sh joy, band joy, tanlangan joy, check-in va no-show monitoringi bir sahifada ko'rinadi."
          />
          <div className="mini-seat-grid premium-seat-grid">
            {Array.from({ length: 18 }, (_, index) => (
              <span key={index} className={`seat-dot ${index % 4 === 0 ? "reserved" : index % 5 === 0 ? "occupied" : "available"}`} />
            ))}
          </div>
          <div className="occupancy-row">
            <div>
              <span>{readingRooms[0].name}</span>
              <strong>{readingRooms[0].available_seats} ta joy bo'sh</strong>
            </div>
            <div className="signal-bar">
              <i style={{ width: `${readingRooms[0].occupancy_rate}%` }} />
            </div>
          </div>
          <div className="resource-actions">
            <Link to={`/${locale}/library/reading-room`} className="primary-button small">Joy band qilish</Link>
            <Link to={`/${locale}/dashboard/student/reading-room`} className="ghost-button">Mening bronlarim</Link>
          </div>
        </div>
      </section>

      <section className="spotlight-grid">
        <div id="ai-preview"><AILibrarianPanel compact /></div>

        <div className="glass-panel spotlight-panel">
          <SectionHeading
            eyebrow="Face ID + QR"
            title="Face ID va xavfsiz check-in"
            description="Kamera ruxsati, secure context, embedding, consent va fallback authentication birga boshqariladi."
          />
          <ul className="feature-list">
            <li>Face ID ixtiyoriy va rozilik asosida ishlaydi.</li>
            <li>QR confirmation reservation va seat booking oqimiga biriktirilgan.</li>
            <li>Password va OTP fallback sabab foydalanuvchi bloklanib qolmaydi.</li>
          </ul>
        </div>

        <div className="glass-panel spotlight-panel">
          <SectionHeading
            eyebrow="Monitoring"
            title="Kutubxonachi uchun operatsion panel"
            description="Due-today loans, overdue holatlar, pending review materiallar va seat occupancy bir joyda jamlangan."
          />
          <ul className="feature-list">
            <li>12 ta due today loan</li>
            <li>5 ta overdue kitob</li>
            <li>4 ta pending review resurs</li>
            <li>2 ta no-show seat booking</li>
          </ul>
        </div>
      </section>

      <section className="triple-grid">
        <div className="glass-panel">
          <SectionHeading eyebrow="Talaba uchun" title="Ogohlantirishlar va yaqinlashayotgan vazifalar" />
          <ul className="feature-list">
            {studentAlerts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="glass-panel">
          <SectionHeading eyebrow="O'qituvchi uchun" title="Resurs yuklash chaqiruvi" />
          <p>Lecture notes, lab files, testlar, video darslar va metodik qo'llanmalarni pending review oqimi bilan yuklang.</p>
          <div className="resource-actions">
            <Link to={`/${locale}/resources/upload`} className="primary-button small">Yangi resurs yuklash</Link>
            <Link to={`/${locale}/dashboard/teacher`} className="ghost-button">Mening resurslarim</Link>
          </div>
        </div>

        <div className="glass-panel">
          <SectionHeading eyebrow="E'lonlar" title="Yangiliklar va akademik kalendar" />
          <ul className="feature-list">
            {announcements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
