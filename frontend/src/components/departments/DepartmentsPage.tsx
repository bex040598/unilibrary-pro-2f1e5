import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { departments as fallbackDepartments, faculties } from "../../data/mock";
import { api } from "../../lib/api";
import type { Department } from "../../types";

const DEPT_COLORS = [
  { bg: "#1a2f5a", light: "#e8edf7" },
  { bg: "#1a5c45", light: "#e6f4ef" },
  { bg: "#6b21a8", light: "#f3e8ff" },
  { bg: "#9a3412", light: "#fef0e7" },
  { bg: "#0e4f6e", light: "#e6f2f9" },
  { bg: "#374151", light: "#f3f4f6" },
];

const DEPT_IMGS: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=200&fit=crop",
  2: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=200&fit=crop",
  3: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=200&fit=crop",
  4: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&h=200&fit=crop",
  5: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=200&fit=crop",
  6: "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?w=600&h=200&fit=crop",
};

export function DepartmentsPage() {
  const { locale = "uz" } = useParams();
  const [departments, setDepartments] = useState<Department[]>(fallbackDepartments);
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.departments().then(setDepartments).catch(() => undefined);
  }, []);

  const filtered = useMemo(() =>
    departments.filter((d) =>
      (facultyFilter === "all" || String(d.faculty_id) === facultyFilter) &&
      (!search || d.name.toLowerCase().includes(search.toLowerCase()))
    ), [departments, facultyFilter, search]);

  const totalResources = departments.reduce((s, d) => s + d.resources_count, 0);
  const totalTeachers = departments.reduce((s, d) => s + d.teachers_count, 0);
  const totalDownloads = departments.reduce((s, d) => s + d.downloads_count, 0);

  return (
    <div className="wp-page">
      {/* ── Hero ── */}
      <div className="wp-hero">
        <div className="wp-hero-overlay" />
        <div className="wp-hero-body">
          <p className="wp-eyebrow">Kafedra kutubxonalari</p>
          <h1>Bilim — kelajak poydevori</h1>
          <p className="wp-hero-sub">Har bir kafedra o'z ixtisosligi bo'yicha elektron resurslar, darsliklar va o'quv materiallarini taqdim etadi</p>
          <div className="wp-hero-counters">
            <div className="wp-hc"><strong>{departments.length}</strong><span>Kafedra</span></div>
            <div className="wp-hc-sep" />
            <div className="wp-hc"><strong>{totalResources.toLocaleString()}</strong><span>Resurs</span></div>
            <div className="wp-hc-sep" />
            <div className="wp-hc"><strong>{totalTeachers}</strong><span>O'qituvchi</span></div>
            <div className="wp-hc-sep" />
            <div className="wp-hc"><strong>{totalDownloads.toLocaleString()}</strong><span>Yuklab olish</span></div>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="wp-toolbar">
        <div className="wp-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Kafedra nomini qidiring..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="wp-toolbar-right">
          <label className="wp-select-label">Fakultet:</label>
          <select className="wp-select" value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)}>
            <option value="all">Barchasi</option>
            {faculties.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <span className="wp-result-count">{filtered.length} ta kafedra</span>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="wp-dept-grid">
        {filtered.map((dept, idx) => {
          const col = DEPT_COLORS[idx % DEPT_COLORS.length];
          const img = DEPT_IMGS[dept.id] ?? DEPT_IMGS[1];
          return (
            <article key={dept.id} className="wp-dept-card">
              {/* Top image */}
              <div className="wp-dept-img-wrap">
                <img src={img} alt={dept.name} className="wp-dept-img" />
                <div className="wp-dept-img-overlay" style={{ background: `${col.bg}cc` }} />
                <div className="wp-dept-badge" style={{ background: col.bg }}>
                  {dept.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                </div>
                {dept.has_new_materials && (
                  <div className="wp-dept-new">Yangi</div>
                )}
              </div>

              {/* Body */}
              <div className="wp-dept-body">
                <h3 className="wp-dept-name">{dept.name}</h3>
                <p className="wp-dept-desc">{dept.summary}</p>

                <div className="wp-dept-head-row">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span className="wp-dept-head">{dept.head_name}</span>
                </div>

                <div className="wp-dept-metrics">
                  <div className="wp-metric">
                    <strong>{dept.resources_count}</strong>
                    <span>Resurs</span>
                  </div>
                  <div className="wp-metric">
                    <strong>{dept.subjects_count}</strong>
                    <span>Fan</span>
                  </div>
                  <div className="wp-metric">
                    <strong>{dept.teachers_count}</strong>
                    <span>O'qituvchi</span>
                  </div>
                  <div className="wp-metric">
                    <strong>{(dept.downloads_count / 1000).toFixed(1)}k</strong>
                    <span>Yuklab</span>
                  </div>
                </div>

                {dept.active_subject && (
                  <div className="wp-active-subject">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={col.bg} strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    <span style={{ color: col.bg }}>Faol: {dept.active_subject}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="wp-dept-footer">
                <Link to={`/${locale}/kafedralar/${dept.slug}`} className="wp-dept-btn-ghost">
                  Kafedra sahifasi
                </Link>
                <Link to={`/${locale}/kafedralar/${dept.slug}/library`} className="wp-dept-btn-fill" style={{ background: col.bg }}>
                  Elektron kutubxona
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="wp-cta-bar">
        <div>
          <h3>O'qituvchimisiz?</h3>
          <p>Resurslaringizni yuklang, talabalar foydalanishini kuzating</p>
        </div>
        <Link to={`/${locale}/resources/upload`} className="wp-cta-btn">Resurs yuklash →</Link>
      </div>
    </div>
  );
}
