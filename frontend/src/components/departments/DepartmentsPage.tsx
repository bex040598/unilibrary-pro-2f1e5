import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { departments as fallbackDepartments, faculties } from "../../data/mock";
import { api } from "../../lib/api";
import type { Department } from "../../types";

/* ── Discipline colour palette ── */
const DISCIPLINE_COLOR: Record<number, string> = {
  1: "#0891b2", // Axborot texnologiyalari — teal/cyber
  2: "#d97706", // Iqtisodiyot — amber
  3: "#4f46e5", // Matematika — indigo
  4: "#ea580c", // Fizika/Mexanika — orange
  5: "#059669", // Kimyo — emerald
};
function deptColor(id: number): string {
  return DISCIPLINE_COLOR[id] ?? "#7c3aed";
}

/* ── Unsplash images keyed by dept id ── */
const DEPT_IMGS: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=500&fit=crop",
  2: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&h=500&fit=crop",
  3: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&h=500&fit=crop",
  4: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=900&h=500&fit=crop",
  5: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&h=500&fit=crop",
  6: "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?w=900&h=500&fit=crop",
};
function deptImg(id: number): string {
  return DEPT_IMGS[id] ?? DEPT_IMGS[6];
}

/* ── Geometric SVG hero background (navy + subtle grid) ── */
const HeroPattern = () => (
  <svg
    className="kaf-hero-svg"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    viewBox="0 0 1400 420"
    aria-hidden="true"
  >
    {/* base fill */}
    <rect width="1400" height="420" fill="#002147" />
    {/* subtle grid lines */}
    {Array.from({ length: 18 }).map((_, i) => (
      <line
        key={`v${i}`}
        x1={i * 80}
        y1="0"
        x2={i * 80}
        y2="420"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="1"
      />
    ))}
    {Array.from({ length: 8 }).map((_, i) => (
      <line
        key={`h${i}`}
        x1="0"
        y1={i * 60}
        x2="1400"
        y2={i * 60}
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="1"
      />
    ))}
    {/* diagonal accent */}
    <line x1="0" y1="420" x2="500" y2="0" stroke="rgba(196,168,98,0.12)" strokeWidth="1.5" />
    <line x1="100" y1="420" x2="600" y2="0" stroke="rgba(196,168,98,0.07)" strokeWidth="1" />
    {/* large circle motif top-right */}
    <circle cx="1200" cy="-60" r="340" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
    <circle cx="1200" cy="-60" r="250" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    <circle cx="1200" cy="-60" r="160" fill="none" stroke="rgba(196,168,98,0.09)" strokeWidth="1" />
    {/* small dot grid bottom-left */}
    {Array.from({ length: 6 }).map((_, row) =>
      Array.from({ length: 10 }).map((_, col) => (
        <circle
          key={`d${row}-${col}`}
          cx={40 + col * 32}
          cy={300 + row * 22}
          r="1.5"
          fill="rgba(255,255,255,0.08)"
        />
      ))
    )}
    {/* gold accent bar at left edge */}
    <rect x="0" y="0" width="4" height="420" fill="rgba(196,168,98,0.6)" />
  </svg>
);

/* ── Inline progress bar for card stats ── */
function StatBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, max > 0 ? Math.round((value / max) * 100) : 0);
  return (
    <div className="kaf-stat-row">
      <span className="kaf-stat-label">{label}</span>
      <div className="kaf-stat-track">
        <div
          className="kaf-stat-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="kaf-stat-val">{value.toLocaleString()}</span>
    </div>
  );
}

/* ── Featured (hero) card — first card, full-width ── */
function FeaturedCard({
  dept,
  locale,
}: {
  dept: Department;
  locale: string;
}) {
  const color = deptColor(dept.id);
  const img = deptImg(dept.id);
  const initials = dept.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="kaf-featured">
      {/* Left — image */}
      <div className="kaf-featured-img-wrap">
        <img src={img} alt={dept.name} className="kaf-featured-img" />
        <div
          className="kaf-featured-img-veil"
          style={{
            background: `linear-gradient(to right, ${color}ee 0%, ${color}88 60%, transparent 100%)`,
          }}
        />
        {/* Overlaid stats */}
        <div className="kaf-featured-overlay-stats">
          <div className="kaf-fos-item">
            <strong>{dept.resources_count.toLocaleString()}</strong>
            <span>Resurs</span>
          </div>
          <div className="kaf-fos-sep" />
          <div className="kaf-fos-item">
            <strong>{dept.teachers_count}</strong>
            <span>O'qituvchi</span>
          </div>
          <div className="kaf-fos-sep" />
          <div className="kaf-fos-item">
            <strong>{dept.subjects_count}</strong>
            <span>Fan</span>
          </div>
        </div>
        {dept.has_new_materials && (
          <div className="kaf-featured-badge kaf-new-badge">Yangi</div>
        )}
      </div>

      {/* Right — content */}
      <div className="kaf-featured-body" style={{ borderLeftColor: color }}>
        <div className="kaf-featured-eyebrow" style={{ color }}>
          <div className="kaf-initials-circle" style={{ background: color }}>
            {initials}
          </div>
          <span>Yetakchi kafedra</span>
        </div>
        <h2 className="kaf-featured-title">{dept.name}</h2>
        <p className="kaf-featured-desc">{dept.summary}</p>

        {dept.head_name && (
          <div className="kaf-head-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{dept.head_name}</span>
          </div>
        )}

        {dept.active_subject && (
          <div className="kaf-active-tag" style={{ borderColor: color, color }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Faol: {dept.active_subject}
          </div>
        )}

        <div className="kaf-featured-actions">
          <Link
            to={`/${locale}/kafedralar/${dept.slug}`}
            className="kaf-btn-outline"
            style={{ borderColor: color, color }}
          >
            Kafedra sahifasi
          </Link>
          <Link
            to={`/${locale}/kafedralar/${dept.slug}/library`}
            className="kaf-btn-solid"
            style={{ background: color }}
          >
            Elektron kutubxona →
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ── Regular card — spine accent, 3-col grid ── */
function DeptCard({
  dept,
  locale,
  maxResources,
  maxTeachers,
}: {
  dept: Department;
  locale: string;
  maxResources: number;
  maxTeachers: number;
}) {
  const color = deptColor(dept.id);
  const img = deptImg(dept.id);
  const initials = dept.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="kaf-card">
      {/* Left spine accent */}
      <div className="kaf-spine" style={{ background: color }} />

      <div className="kaf-card-inner">
        {/* Thumbnail row */}
        <div className="kaf-thumb-row">
          <div className="kaf-thumb-wrap">
            <img src={img} alt={dept.name} className="kaf-thumb-img" />
            <div
              className="kaf-thumb-veil"
              style={{ background: `${color}55` }}
            />
          </div>
          <div className="kaf-thumb-meta">
            <div className="kaf-initials-sm" style={{ background: color }}>
              {initials}
            </div>
            {dept.has_new_materials && (
              <span className="kaf-chip-new">Yangi</span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="kaf-card-body">
          <h3 className="kaf-card-title">{dept.name}</h3>
          <p className="kaf-card-desc">{dept.summary}</p>

          {dept.head_name && (
            <div className="kaf-card-head">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{dept.head_name}</span>
            </div>
          )}

          {/* Inline stat bars */}
          <div className="kaf-bars">
            <StatBar
              label="Resurslar"
              value={dept.resources_count}
              max={maxResources}
              color={color}
            />
            <StatBar
              label="O'qituvchilar"
              value={dept.teachers_count}
              max={maxTeachers}
              color={color}
            />
          </div>

          {/* Inline pill metrics */}
          <div className="kaf-pill-row">
            <span className="kaf-pill" style={{ borderColor: color, color }}>
              {dept.subjects_count} fan
            </span>
            <span className="kaf-pill" style={{ borderColor: "#e2ddd6", color: "#78716c" }}>
              {(dept.downloads_count / 1000).toFixed(1)}k yuklab
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="kaf-card-footer" style={{ borderTopColor: `${color}33` }}>
          <Link
            to={`/${locale}/kafedralar/${dept.slug}`}
            className="kaf-foot-ghost"
            style={{ color }}
          >
            Kafedra
          </Link>
          <span className="kaf-foot-divider" />
          <Link
            to={`/${locale}/kafedralar/${dept.slug}/library`}
            className="kaf-foot-solid"
            style={{ background: color }}
          >
            Kutubxona →
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════ */
export function DepartmentsPage() {
  const { locale = "uz" } = useParams();
  const [departments, setDepartments] = useState<Department[]>(fallbackDepartments);
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.departments().then(setDepartments).catch(() => undefined);
  }, []);

  const filtered = useMemo(
    () =>
      departments.filter(
        (d) =>
          (facultyFilter === "all" || String(d.faculty_id) === facultyFilter) &&
          (!search || d.name.toLowerCase().includes(search.toLowerCase()))
      ),
    [departments, facultyFilter, search]
  );

  const totalResources = departments.reduce((s, d) => s + d.resources_count, 0);
  const totalTeachers = departments.reduce((s, d) => s + d.teachers_count, 0);
  const totalDownloads = departments.reduce((s, d) => s + d.downloads_count, 0);

  /* Featured = department with most resources */
  const featuredDept = useMemo(
    () =>
      filtered.length > 0
        ? [...filtered].sort((a, b) => b.resources_count - a.resources_count)[0]
        : null,
    [filtered]
  );
  const restDepts = useMemo(
    () => (featuredDept ? filtered.filter((d) => d.id !== featuredDept.id) : filtered),
    [filtered, featuredDept]
  );

  const maxResources = Math.max(...departments.map((d) => d.resources_count), 1);
  const maxTeachers = Math.max(...departments.map((d) => d.teachers_count), 1);

  return (
    <div className="wp-page kaf-page">

      {/* ── Hero — geometric SVG, no photo bg ── */}
      <div className="kaf-hero">
        <HeroPattern />
        <div className="kaf-hero-body">
          <p className="kaf-eyebrow">Kafedra kutubxonalari</p>
          <h1 className="kaf-hero-h1">Bilim — kelajak poydevori</h1>
          <p className="kaf-hero-sub">
            Har bir kafedra o'z ixtisosligi bo'yicha elektron resurslar,
            darsliklar va o'quv materiallarini taqdim etadi
          </p>
          <div className="kaf-hero-counters">
            <div className="kaf-hc">
              <strong>{departments.length}</strong>
              <span>Kafedra</span>
            </div>
            <div className="kaf-hc-sep" />
            <div className="kaf-hc">
              <strong>{totalResources.toLocaleString()}</strong>
              <span>Resurs</span>
            </div>
            <div className="kaf-hc-sep" />
            <div className="kaf-hc">
              <strong>{totalTeachers}</strong>
              <span>O'qituvchi</span>
            </div>
            <div className="kaf-hc-sep" />
            <div className="kaf-hc">
              <strong>{totalDownloads.toLocaleString()}</strong>
              <span>Yuklab olish</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar — inline, no "Fakultet:" label ── */}
      <div className="kaf-toolbar">
        <div className="kaf-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Kafedra nomini qidiring…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="kaf-toolbar-right">
          <select
            className="kaf-filter-select"
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
          >
            <option value="all">Barcha fakultetlar</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <span className="kaf-count-chip">{filtered.length} ta kafedra</span>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="kaf-content">
        {filtered.length === 0 ? (
          <div className="kaf-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1cdc8" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>Kafedra topilmadi</p>
          </div>
        ) : (
          <>
            {/* Featured hero card */}
            {featuredDept && (
              <FeaturedCard dept={featuredDept} locale={locale} />
            )}

            {/* 3-col grid for the rest */}
            {restDepts.length > 0 && (
              <div className="kaf-grid">
                {restDepts.map((dept) => (
                  <DeptCard
                    key={dept.id}
                    dept={dept}
                    locale={locale}
                    maxResources={maxResources}
                    maxTeachers={maxTeachers}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom strip — "O'qituvchimisiz?" ── */}
      <div className="kaf-cta-strip">
        <div className="kaf-cta-text">
          <h3>O'qituvchimisiz?</h3>
          <p>Resurslaringizni yuklang, talabalar foydalanishini kuzating</p>
        </div>
        <Link to={`/${locale}/resources/upload`} className="kaf-cta-btn">
          Resurs yuklash →
        </Link>
      </div>
    </div>
  );
}
