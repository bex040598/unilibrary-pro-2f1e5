import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { resources as allResources } from "../../data/mock";

// Mock: o'qituvchi materiallarini kim o'qiganini ko'rsatish uchun
const studentActivity = [
  { id: 1, studentName: "Bobur Toshmatov", studentId: "AT-2301", action: "O'qidi", resourceTitle: "Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari", date: "2026-06-30 14:22", pages: 18 },
  { id: 2, studentName: "Malika Yusupova", studentId: "AT-2302", action: "Yuklab oldi", resourceTitle: "Kiberxavfsizlik bo'yicha o'zbekcha darslik", date: "2026-06-30 11:05", pages: null },
  { id: 3, studentName: "Jasur Abdullayev", studentId: "AT-2304", action: "O'qidi", resourceTitle: "Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari", date: "2026-06-29 16:48", pages: 32 },
  { id: 4, studentName: "Zilola Rahimova", studentId: "AT-2305", action: "Yuklab oldi", resourceTitle: "Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari", date: "2026-06-29 09:14", pages: null },
  { id: 5, studentName: "Sherzod Mirzayev", studentId: "AT-2307", action: "O'qidi", resourceTitle: "Kiberxavfsizlik bo'yicha o'zbekcha darslik", date: "2026-06-28 13:30", pages: 7 },
  { id: 6, studentName: "Nargiza Karimova", studentId: "AT-2308", action: "O'qidi", resourceTitle: "Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari", date: "2026-06-27 10:00", pages: 25 },
  { id: 7, studentName: "Ulugbek Nazarov", studentId: "AT-2310", action: "Yuklab oldi", resourceTitle: "Kiberxavfsizlik bo'yicha o'zbekcha darslik", date: "2026-06-26 17:45", pages: null },
];

const studentReadHistory = [
  { id: 1, title: "Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari", author: "Aziza Yuldasheva", type: "Laboratoriya ishi", date: "2026-06-30", pages: 18, totalPages: 48, progress: 38 },
  { id: 2, title: "Kiberxavfsizlik bo'yicha o'zbekcha darslik", author: "Jasur Qodirov", type: "Darslik", date: "2026-06-28", pages: 32, totalPages: 210, progress: 15 },
  { id: 3, title: "Mikroiqtisodiyot bo'yicha case study to'plami", author: "Nodira Mamatqulova", type: "O'quv qo'llanma", date: "2026-06-25", pages: 60, totalPages: 90, progress: 67 },
];

const pendingResources = allResources.filter((r) => r.status === "pending_review");
const approvedResources = allResources.filter((r) => r.status === "approved");

const typeColor: Record<string, string> = {
  "Darslik": "#1457a8",
  "Laboratoriya ishi": "#0e9f6e",
  "O'quv qo'llanma": "#d6a84f",
  "Maqola": "#7c3aed",
  "Video dars": "#dc2626",
  "Test": "#0891b2",
};

function ResourceCard({ r, showStatus, onRead }: { r: typeof allResources[0]; showStatus?: boolean; onRead?: () => void }) {
  const color = typeColor[r.material_type] ?? "#667085";
  return (
    <div className="elib-resource-card">
      <div className="elib-resource-cover" style={{ background: color }}>
        <span>{r.title.slice(0, 1)}</span>
      </div>
      <div className="elib-resource-info">
        <div className="elib-resource-topline">
          <span className="elib-type-badge" style={{ background: `${color}18`, color }}>{r.material_type}</span>
          {showStatus && (
            <span className={`elib-status-badge elib-status-${r.status}`}>
              {r.status === "approved" ? "Tasdiqlangan" : r.status === "pending_review" ? "Ko'rib chiqilmoqda" : "Rad etildi"}
            </span>
          )}
        </div>
        <h3 className="elib-resource-title">{r.title}</h3>
        <p className="elib-resource-meta">{r.author_name} · {r.subject_name} · {r.course}-kurs</p>
        <div className="elib-resource-stats">
          <span>👁 {r.views_count}</span>
          <span>⬇ {r.downloads_count}</span>
          <span>⭐ {r.average_rating}</span>
        </div>
        <div className="elib-resource-actions">
          {r.online_read_allowed && (
            <button type="button" className="elib-btn elib-btn-primary" onClick={onRead}>
              O'qish
            </button>
          )}
          {r.download_allowed && (
            <button type="button" className="elib-btn elib-btn-ghost">Yuklab olish</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TEACHER VIEW ──────────────────────────────────────
function TeacherELibrary({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<"resources" | "activity" | "upload">("resources");
  const myResources = allResources.slice(0, 4);

  return (
    <div className="elib-page">
      <div className="elib-hero elib-hero-teacher">
        <div className="elib-hero-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <p className="elib-hero-role">O'qituvchi E-Library Profili</p>
          <h1 className="elib-hero-name">Aziza Yuldasheva</h1>
          <p className="elib-hero-dept">Axborot texnologiyalari kafedrasi · Dots.</p>
        </div>
        <div className="elib-hero-stats">
          <div className="elib-hero-stat">
            <strong>{myResources.length}</strong>
            <span>Materiallar</span>
          </div>
          <div className="elib-hero-stat">
            <strong>3.2k</strong>
            <span>Ko'rishlar</span>
          </div>
          <div className="elib-hero-stat">
            <strong>1.8k</strong>
            <span>Yuklashlar</span>
          </div>
          <div className="elib-hero-stat">
            <strong>47</strong>
            <span>Faol talabalar</span>
          </div>
        </div>
      </div>

      <div className="elib-tabs">
        <button type="button" className={`elib-tab ${activeTab === "resources" ? "active" : ""}`} onClick={() => setActiveTab("resources")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Mening materiallarim
        </button>
        <button type="button" className={`elib-tab ${activeTab === "activity" ? "active" : ""}`} onClick={() => setActiveTab("activity")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Talabalar faolligi
        </button>
        <button type="button" className={`elib-tab ${activeTab === "upload" ? "active" : ""}`} onClick={() => setActiveTab("upload")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
          Material yuklash
        </button>
      </div>

      {activeTab === "resources" && (
        <div className="elib-content">
          <div className="elib-section-header">
            <h2>Mening materiallarim ({myResources.length})</h2>
            <Link to={`/${locale}/resources/upload`} className="elib-btn elib-btn-primary">
              + Yangi material
            </Link>
          </div>
          <div className="elib-resources-grid">
            {myResources.map((r) => (
              <ResourceCard key={r.id} r={r} showStatus />
            ))}
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="elib-content">
          <div className="elib-section-header">
            <h2>Talabalar faolligi</h2>
            <span className="elib-subtitle">Kimlar materiallaringizni o'qidi yoki yuklab oldi</span>
          </div>
          <div className="elib-activity-summary">
            <div className="elib-activity-stat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <div><strong>47</strong><span>Faol talabalar</span></div>
            </div>
            <div className="elib-activity-stat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0e9f6e" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <div><strong>1,230</strong><span>Jami ko'rishlar</span></div>
            </div>
            <div className="elib-activity-stat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d6a84f" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <div><strong>742</strong><span>Jami yuklashlar</span></div>
            </div>
            <div className="elib-activity-stat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <div><strong>Bu hafta: 12</strong><span>Yangi foydalanuvchi</span></div>
            </div>
          </div>
          <div className="elib-table-wrap">
            <table className="elib-table">
              <thead>
                <tr>
                  <th>Talaba</th>
                  <th>ID</th>
                  <th>Material</th>
                  <th>Harakat</th>
                  <th>Sana</th>
                  <th>O'qilgan sahifalar</th>
                </tr>
              </thead>
              <tbody>
                {studentActivity.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="elib-student-cell">
                        <div className="elib-avatar">{item.studentName.split(" ").map((n) => n[0]).join("")}</div>
                        {item.studentName}
                      </div>
                    </td>
                    <td><span className="elib-id-badge">{item.studentId}</span></td>
                    <td className="elib-resource-cell">{item.resourceTitle}</td>
                    <td>
                      <span className={`elib-action-badge ${item.action === "O'qidi" ? "read" : "download"}`}>
                        {item.action === "O'qidi" ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        )}
                        {item.action}
                      </span>
                    </td>
                    <td className="elib-date-cell">{item.date}</td>
                    <td>{item.pages != null ? `${item.pages} bet` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "upload" && (
        <div className="elib-content">
          <div className="elib-section-header">
            <h2>Yangi material yuklash</h2>
          </div>
          <form className="elib-upload-form" onSubmit={(e) => e.preventDefault()}>
            <div className="elib-form-row">
              <div className="elib-form-group">
                <label>Material nomi</label>
                <input type="text" placeholder="Masalan: Ma'lumotlar bazasi 3-kurs laboratoriyalari" />
              </div>
              <div className="elib-form-group">
                <label>Material turi</label>
                <select>
                  <option>Darslik</option>
                  <option>O'quv qo'llanma</option>
                  <option>Laboratoriya ishi</option>
                  <option>Ma'ruza matni</option>
                  <option>Test savollari</option>
                  <option>Video dars</option>
                  <option>Ilmiy maqola</option>
                  <option>Manba</option>
                </select>
              </div>
            </div>
            <div className="elib-form-row">
              <div className="elib-form-group">
                <label>Fan nomi</label>
                <input type="text" placeholder="Masalan: Ma'lumotlar bazasi" />
              </div>
              <div className="elib-form-group">
                <label>Kurs va semestr</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <select style={{ flex: 1 }}>
                    <option>1-kurs</option><option>2-kurs</option>
                    <option>3-kurs</option><option>4-kurs</option>
                  </select>
                  <select style={{ flex: 1 }}>
                    {[1,2,3,4,5,6,7,8].map((s) => <option key={s}>{s}-semestr</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="elib-form-group">
              <label>Tavsif</label>
              <textarea rows={3} placeholder="Material haqida qisqacha ma'lumot..." />
            </div>
            <div className="elib-form-row">
              <div className="elib-form-group">
                <label>Til</label>
                <select>
                  <option value="uz">O'zbekcha</option>
                  <option value="ru">Ruscha</option>
                  <option value="en">Inglizcha</option>
                </select>
              </div>
              <div className="elib-form-group">
                <label>O'qish imkoniyati</label>
                <select>
                  <option>Onlayn o'qish va yuklab olish</option>
                  <option>Faqat onlayn o'qish</option>
                  <option>Faqat yuklab olish</option>
                </select>
              </div>
            </div>
            <div className="elib-dropzone">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              <p>Faylni shu yerga tashlang yoki <strong>tanlang</strong></p>
              <span>PDF, DOCX, PPTX, MP4 · Maksimal 100 MB</span>
              <input type="file" style={{ display: "none" }} />
            </div>
            <div className="elib-form-actions">
              <button type="submit" className="elib-btn elib-btn-primary elib-btn-lg">
                Yuklash (Kutubxonachi ko'rib chiqadi)
              </button>
              <button type="button" className="elib-btn elib-btn-ghost elib-btn-lg">Bekor qilish</button>
            </div>
            <p className="elib-upload-note">
              Material yuborilgandan so'ng kutubxonachi tomonidan ko'rib chiqiladi va tasdiqlangach talabalar uchun ochiladi.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

// ── STUDENT VIEW ──────────────────────────────────────
function StudentELibrary({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<"browse" | "history" | "loans">("browse");
  const [query, setQuery] = useState("");
  const [readingResource, setReadingResource] = useState<typeof allResources[0] | null>(null);

  const filtered = allResources.filter(
    (r) =>
      r.status === "approved" &&
      (query === "" ||
        `${r.title} ${r.subject_name} ${r.author_name}`.toLowerCase().includes(query.toLowerCase()))
  );

  if (readingResource) {
    return (
      <div className="elib-reader">
        <div className="elib-reader-header">
          <button type="button" className="elib-btn elib-btn-ghost" onClick={() => setReadingResource(null)}>
            ← Orqaga
          </button>
          <h2>{readingResource.title}</h2>
          <span>{readingResource.author_name}</span>
        </div>
        <div className="elib-reader-body">
          <div className="elib-reader-sidebar">
            <div className="elib-reader-info">
              <div className="elib-reader-cover" style={{ background: typeColor[readingResource.material_type] ?? "#1457a8" }}>
                <span>{readingResource.title.slice(0, 1)}</span>
              </div>
              <h3>{readingResource.title}</h3>
              <p>{readingResource.author_name}</p>
              <p>{readingResource.subject_name} · {readingResource.course}-kurs</p>
              <div className="elib-reader-stats">
                <span>👁 {readingResource.views_count} ko'rishlar</span>
                <span>⬇ {readingResource.downloads_count} yuklashlar</span>
                <span>⭐ {readingResource.average_rating}</span>
              </div>
            </div>
            <div className="elib-reader-desc">
              <h4>Tavsif</h4>
              <p>{readingResource.description}</p>
            </div>
            <div className="elib-reader-tags">
              {readingResource.tags.map((tag) => (
                <span key={tag} className="elib-tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="elib-reader-content">
            <div className="elib-pdf-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="1"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <p>Hujjat ko'rish paneli</p>
              <p className="elib-pdf-note">Haqiqiy tizimda PDF/EPUB onlayn o'quvchi bu yerda ko'rsatiladi</p>
              {readingResource.download_allowed && (
                <button type="button" className="elib-btn elib-btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  PDF yuklab olish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="elib-page">
      <div className="elib-hero elib-hero-student">
        <div className="elib-hero-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        <div>
          <p className="elib-hero-role">Talaba E-Library Profili</p>
          <h1 className="elib-hero-name">Bobur Toshmatov</h1>
          <p className="elib-hero-dept">Axborot texnologiyalari kafedrasi · AT-2301 · 2-kurs</p>
        </div>
        <div className="elib-hero-stats">
          <div className="elib-hero-stat">
            <strong>{filtered.length}</strong>
            <span>Mavjud materiallar</span>
          </div>
          <div className="elib-hero-stat">
            <strong>{studentReadHistory.length}</strong>
            <span>O'qilganlar</span>
          </div>
          <div className="elib-hero-stat">
            <strong>2</strong>
            <span>Olingan kitoblar</span>
          </div>
        </div>
      </div>

      <div className="elib-tabs">
        <button type="button" className={`elib-tab ${activeTab === "browse" ? "active" : ""}`} onClick={() => setActiveTab("browse")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Materiallar
        </button>
        <button type="button" className={`elib-tab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          O'qish tarixi
        </button>
        <button type="button" className={`elib-tab ${activeTab === "loans" ? "active" : ""}`} onClick={() => setActiveTab("loans")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Kitoblarim
        </button>
      </div>

      {activeTab === "browse" && (
        <div className="elib-content">
          <div className="elib-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Material nomi, muallif yoki fan bo'yicha qidiring..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="elib-resources-grid">
            {filtered.map((r) => (
              <ResourceCard key={r.id} r={r} onRead={() => setReadingResource(r)} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="elib-content">
          <h2 className="elib-content-title">O'qish tarixi</h2>
          <div className="elib-history-list">
            {studentReadHistory.map((item) => (
              <div key={item.id} className="elib-history-item">
                <div className="elib-history-cover" style={{ background: typeColor[item.type] ?? "#1457a8" }}>
                  <span>{item.title.slice(0, 1)}</span>
                </div>
                <div className="elib-history-info">
                  <h3>{item.title}</h3>
                  <p>{item.author} · {item.type}</p>
                  <div className="elib-progress-bar">
                    <div className="elib-progress-fill" style={{ width: `${item.progress}%` }} />
                  </div>
                  <span className="elib-progress-label">{item.progress}% o'qildi · {item.pages}/{item.totalPages} bet</span>
                </div>
                <div className="elib-history-meta">
                  <span>{item.date}</span>
                  <button type="button" className="elib-btn elib-btn-primary">Davom ettirish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "loans" && (
        <div className="elib-content">
          <h2 className="elib-content-title">Mening kitoblarim</h2>
          <div className="elib-loans-list">
            <div className="elib-loan-item">
              <div className="elib-loan-cover">A</div>
              <div className="elib-loan-info">
                <h3>Advanced Database Systems</h3>
                <p>Carlos Coronel · AT-DB-204</p>
                <span className="elib-loan-due">Qaytarish: 2026-07-14</span>
              </div>
              <div className="elib-loan-status">
                <span className="elib-status-badge elib-status-approved">Faol</span>
                <button type="button" className="elib-btn elib-btn-ghost">Muddatni uzaytirish</button>
              </div>
            </div>
            <div className="elib-loan-item">
              <div className="elib-loan-cover" style={{ background: "#0e9f6e" }}>K</div>
              <div className="elib-loan-info">
                <h3>Kiberxavfsizlik asoslari</h3>
                <p>Shavkat Raximov · AT-SEC-118</p>
                <span className="elib-loan-due elib-loan-due-warning">Qaytarish: 2026-07-03 (2 kun qoldi)</span>
              </div>
              <div className="elib-loan-status">
                <span className="elib-status-badge elib-status-pending_review">Yaqinlashmoqda</span>
                <button type="button" className="elib-btn elib-btn-ghost">Muddatni uzaytirish</button>
              </div>
            </div>
          </div>
          <Link to={`/${locale}/loans`} className="elib-btn elib-btn-ghost" style={{ marginTop: 16, display: "inline-block" }}>
            Barcha kitoblarni ko'rish →
          </Link>
        </div>
      )}
    </div>
  );
}

// ── LIBRARIAN VIEW ────────────────────────────────────
function LibrarianELibrary({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<"pending" | "all" | "activity">("pending");

  return (
    <div className="elib-page">
      <div className="elib-hero elib-hero-librarian">
        <div className="elib-hero-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </div>
        <div>
          <p className="elib-hero-role">Kutubxonachi Boshqaruv Paneli</p>
          <h1 className="elib-hero-name">Mohira Xudoyberdiyeva</h1>
          <p className="elib-hero-dept">Bosh kutubxonachi · ATMU Markaziy kutubxonasi</p>
        </div>
        <div className="elib-hero-stats">
          <div className="elib-hero-stat">
            <strong>{allResources.length}</strong>
            <span>Jami materiallar</span>
          </div>
          <div className="elib-hero-stat elib-stat-warn">
            <strong>{pendingResources.length}</strong>
            <span>Ko'rib chiqilmoqda</span>
          </div>
          <div className="elib-hero-stat">
            <strong>{approvedResources.length}</strong>
            <span>Tasdiqlangan</span>
          </div>
          <div className="elib-hero-stat">
            <strong>89</strong>
            <span>Faol abonementlar</span>
          </div>
        </div>
      </div>

      <div className="elib-tabs">
        <button type="button" className={`elib-tab ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Ko'rib chiqish
          {pendingResources.length > 0 && <span className="elib-badge-count">{pendingResources.length}</span>}
        </button>
        <button type="button" className={`elib-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          Barcha materiallar
        </button>
        <button type="button" className={`elib-tab ${activeTab === "activity" ? "active" : ""}`} onClick={() => setActiveTab("activity")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Umumiy faollik
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="elib-content">
          <div className="elib-section-header">
            <h2>Ko'rib chiqilishi kerak materiallar ({pendingResources.length})</h2>
          </div>
          {pendingResources.length === 0 ? (
            <div className="elib-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0e9f6e" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
              <p>Hamma material ko'rib chiqilgan!</p>
            </div>
          ) : (
            <div className="elib-review-list">
              {pendingResources.map((r) => (
                <div key={r.id} className="elib-review-item">
                  <div className="elib-review-info">
                    <span className="elib-type-badge" style={{ background: `${typeColor[r.material_type] ?? "#667085"}18`, color: typeColor[r.material_type] ?? "#667085" }}>
                      {r.material_type}
                    </span>
                    <h3>{r.title}</h3>
                    <p>{r.author_name} · {r.department_name} · {r.subject_name}</p>
                    <p className="elib-review-desc">{r.description}</p>
                  </div>
                  <div className="elib-review-actions">
                    <button type="button" className="elib-btn elib-btn-success">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Tasdiqlash
                    </button>
                    <button type="button" className="elib-btn elib-btn-danger">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Rad etish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "all" && (
        <div className="elib-content">
          <div className="elib-section-header">
            <h2>Barcha materiallar ({allResources.length})</h2>
          </div>
          <div className="elib-table-wrap">
            <table className="elib-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Muallif</th>
                  <th>Kafedra</th>
                  <th>Tur</th>
                  <th>Ko'rishlar</th>
                  <th>Yuklashlar</th>
                  <th>Holat</th>
                </tr>
              </thead>
              <tbody>
                {allResources.map((r) => (
                  <tr key={r.id}>
                    <td>{r.title}</td>
                    <td>{r.author_name}</td>
                    <td>{r.department_name}</td>
                    <td>
                      <span className="elib-type-badge" style={{ background: `${typeColor[r.material_type] ?? "#667085"}18`, color: typeColor[r.material_type] ?? "#667085" }}>
                        {r.material_type}
                      </span>
                    </td>
                    <td>{r.views_count}</td>
                    <td>{r.downloads_count}</td>
                    <td>
                      <span className={`elib-status-badge elib-status-${r.status}`}>
                        {r.status === "approved" ? "Tasdiqlangan" : r.status === "pending_review" ? "Kutilmoqda" : "Rad etildi"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="elib-content">
          <h2 className="elib-content-title">Umumiy faollik</h2>
          <div className="elib-activity-summary">
            <div className="elib-activity-stat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <div><strong>89</strong><span>Faol talabalar</span></div>
            </div>
            <div className="elib-activity-stat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0e9f6e" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <div><strong>5,234</strong><span>Jami ko'rishlar</span></div>
            </div>
            <div className="elib-activity-stat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d6a84f" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <div><strong>2,108</strong><span>Jami yuklashlar</span></div>
            </div>
            <div className="elib-activity-stat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div><strong>5</strong><span>Muddati o'tgan kitoblar</span></div>
            </div>
          </div>
          <div className="elib-table-wrap">
            <table className="elib-table">
              <thead>
                <tr>
                  <th>Talaba</th>
                  <th>ID</th>
                  <th>Material</th>
                  <th>Harakat</th>
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                {studentActivity.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="elib-student-cell">
                        <div className="elib-avatar">{item.studentName.split(" ").map((n) => n[0]).join("")}</div>
                        {item.studentName}
                      </div>
                    </td>
                    <td><span className="elib-id-badge">{item.studentId}</span></td>
                    <td className="elib-resource-cell">{item.resourceTitle}</td>
                    <td>
                      <span className={`elib-action-badge ${item.action === "O'qidi" ? "read" : "download"}`}>
                        {item.action}
                      </span>
                    </td>
                    <td className="elib-date-cell">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────
export function ELibraryPage() {
  const { locale = "uz", elibraryRole } = useParams();
  const { user } = useAuth();

  const role = elibraryRole ?? user?.role ?? "student";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {role === "teacher" && <TeacherELibrary locale={locale} />}
      {role === "student" && <StudentELibrary locale={locale} />}
      {role === "librarian" && <LibrarianELibrary locale={locale} />}
      {role !== "teacher" && role !== "student" && role !== "librarian" && (
        <div className="elib-page">
          <div className="elib-role-select">
            <h2>E-Library profilini tanlang</h2>
            <div className="elib-role-cards">
              <Link to={`/${locale}/elibrary/student`} className="elib-role-card">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <h3>Talaba</h3>
                <p>Materiallarni o'qish va yuklab olish</p>
              </Link>
              <Link to={`/${locale}/elibrary/teacher`} className="elib-role-card">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0e9f6e" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <h3>O'qituvchi</h3>
                <p>Material yuklash va talabalar faolligini kuzatish</p>
              </Link>
              <Link to={`/${locale}/elibrary/librarian`} className="elib-role-card">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d6a84f" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <h3>Kutubxonachi</h3>
                <p>Barcha materiallar va foydalanuvchilarni boshqarish</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
