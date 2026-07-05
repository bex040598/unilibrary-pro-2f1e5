import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { departments as fallbackDepartments, faculties } from "../../data/mock";
import { api } from "../../lib/api";
import type { Department } from "../../types";

/* ══════════════════════════════════════════════════════
   DISCIPLINE METADATA
══════════════════════════════════════════════════════ */

const DISC: Record<number, { color: string; abbr: string; field: string }> = {
  1: { color: "#0c4a6e", abbr: "INF", field: "Axborot texnologiyalari" },
  2: { color: "#78350f", abbr: "IQT", field: "Iqtisodiyot va boshqaruv" },
  3: { color: "#312e81", abbr: "MAT", field: "Matematika va fizika"     },
  4: { color: "#064e3b", abbr: "MUH", field: "Muhandislik fanlari"      },
  5: { color: "#4c0519", abbr: "KIM", field: "Tabiiy fanlar"            },
  6: { color: "#1e1b4b", abbr: "PED", field: "Pedagogika va psixologiya"},
};

function disc(id: number) {
  return DISC[id] ?? { color: "#1f2937", abbr: "BOL", field: "Boshqa" };
}

/* ── mock publications across departments ── */
const RECENT_PUBS = [
  { dept: "Informatika",   year: 2025, title: "Chuqur o'qitishda yangi yondashuv",       author: "Rashidov A."    },
  { dept: "Iqtisodiyot",   year: 2025, title: "Raqamli iqtisodiyot va startap ekotizimi", author: "Umarov F.R."    },
  { dept: "Matematika",    year: 2024, title: "Sonli metodlar va optimallashtirish",       author: "Toshmatov A.B." },
  { dept: "Elektrotexnika",year: 2024, title: "Smart energetika tizimlari",                author: "Amirov S.F."    },
  { dept: "Kimyo",         year: 2024, title: "Nanomateriallar sintezi",                   author: "Nazarov B.N."   },
  { dept: "Pedagogika",    year: 2023, title: "Interfaol ta'lim metodologiyasi",           author: "Hasanov K.T."   },
];

/* ══════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════ */

export function DepartmentsPage() {
  const { locale } = useParams<{ locale: string }>();
  const [depts, setDepts] = useState<Department[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.departments().then(r => setDepts(r)).catch(() => setDepts(fallbackDepartments));
  }, []);

  const list = depts.length > 0 ? depts : fallbackDepartments;

  /* sort: most resources first */
  const sorted = useMemo(() => [...list].sort((a, b) => (b.resources_count ?? 0) - (a.resources_count ?? 0)), [list]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(d => d.name.toLowerCase().includes(q));
  }, [sorted, search]);

  const featured = sorted[0];
  const rest = filtered.filter(d => d.id !== featured?.id);

  const active = activeId != null ? sorted.find(d => d.id === activeId) : null;

  /* totals */
  const totalRes   = sorted.reduce((s, d) => s + (d.resources_count ?? 0), 0);
  const totalTeach = sorted.reduce((s, d) => s + (d.teachers_count ?? 0), 0);

  return (
    <div className="kx-root">

      {/* ── Hero ── */}
      <div className="kx-hero">
        {/* background geometry */}
        <div className="kx-hero-geo" aria-hidden>
          <svg width="100%" height="100%" viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="kx-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#kx-grid)" />
            <circle cx="900" cy="-40" r="340" fill="rgba(196,168,98,0.07)"/>
            <circle cx="1100" cy="280" r="200" fill="rgba(196,168,98,0.04)"/>
            <line x1="0" y1="260" x2="1200" y2="200" stroke="rgba(196,168,98,0.12)" strokeWidth="1"/>
          </svg>
        </div>

        <div className="kx-hero-inner">
          <div className="kx-hero-left">
            <p className="kx-eyebrow">ATMU · Akademik bo'limlar</p>
            <h1 className="kx-hero-h">
              Ilm-fan<br />
              <em>bo'limlari</em>
            </h1>
            <p className="kx-hero-sub">
              {sorted.length} ta kafedra — muhandislik, iqtisodiyot, tabiiy fanlar va gumanitar yo'nalishlar bo'yicha.
            </p>
          </div>

          <div className="kx-hero-stats">
            <div className="kx-stat-block">
              <div className="kx-stat-n">{sorted.length}</div>
              <div className="kx-stat-l">Kafedra</div>
            </div>
            <div className="kx-stat-sep"/>
            <div className="kx-stat-block">
              <div className="kx-stat-n">{totalTeach.toLocaleString()}</div>
              <div className="kx-stat-l">O'qituvchi</div>
            </div>
            <div className="kx-stat-sep"/>
            <div className="kx-stat-block">
              <div className="kx-stat-n">{totalRes.toLocaleString()}</div>
              <div className="kx-stat-l">Resurs</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="kx-body">

        {/* ── Featured department ── */}
        {featured && (
          <div className="kx-featured">
            <div className="kx-feat-accent" style={{ background: disc(featured.id).color }} />
            <div className="kx-feat-inner">
              <div className="kx-feat-left">
                <p className="kx-feat-eyebrow">Eng yirik bo'lim</p>
                <div className="kx-feat-abbr" style={{ background: disc(featured.id).color }}>
                  {disc(featured.id).abbr}
                </div>
                <h2 className="kx-feat-name">{featured.name}</h2>
                <p className="kx-feat-field">{disc(featured.id).field}</p>
                {featured.head_name && (
                  <p className="kx-feat-head">Mudur: <strong>{featured.head_name}</strong></p>
                )}
              </div>

              <div className="kx-feat-mid">
                <div className="kx-feat-desc">
                  {featured.summary
                    ? <p>{featured.summary}</p>
                    : <p>Bo'lim talabalar uchun ilmiy-amaliy ta'lim muhitini yaratishga qaratilgan. Zamonaviy laboratoriyalar va tajribali professor-o'qituvchilar bilan jihozlangan.</p>
                  }
                </div>

                {/* Resource breakdown bars */}
                <div className="kx-feat-bars">
                  {[
                    { label: "Kitoblar",       pct: 65, clr: disc(featured.id).color },
                    { label: "Maqolalar",       pct: 22, clr: "#64748b"               },
                    { label: "Dissertatsiyalar",pct: 13, clr: "#94a3b8"               },
                  ].map(b => (
                    <div key={b.label} className="kx-feat-bar-row">
                      <span className="kx-feat-bar-lbl">{b.label}</span>
                      <div className="kx-feat-bar-track">
                        <div className="kx-feat-bar-fill" style={{ width: `${b.pct}%`, background: b.clr }} />
                      </div>
                      <span className="kx-feat-bar-pct">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="kx-feat-right">
                <div className="kx-feat-metric">
                  <div className="kx-fm-n" style={{ color: disc(featured.id).color }}>
                    {(featured.resources_count ?? 0).toLocaleString()}
                  </div>
                  <div className="kx-fm-l">Elektron resurs</div>
                </div>
                <div className="kx-feat-metric">
                  <div className="kx-fm-n">{featured.teachers_count ?? "—"}</div>
                  <div className="kx-fm-l">O'qituvchi</div>
                </div>
                <Link
                  to={`/${locale}/departments/${featured.id}`}
                  className="kx-feat-link"
                  style={{ borderColor: disc(featured.id).color, color: disc(featured.id).color }}
                >
                  Katalogni ko'rish →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Directory ── */}
        <div className="kx-dir">
          <div className="kx-dir-head">
            <h2 className="kx-dir-title">Barcha bo'limlar</h2>
            <div className="kx-dir-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="kx-dir-search"
                placeholder="Bo'lim nomi…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="kx-dir-table">
            <div className="kx-dir-thead">
              <span>Bo'lim</span>
              <span>Yo'nalish</span>
              <span>Resurslar</span>
              <span>O'qituvchilar</span>
              <span/>
            </div>

            {rest.map(d => {
              const dc = disc(d.id);
              const isOpen = activeId === d.id;
              return (
                <div key={d.id} className="kx-dir-item">
                  <div
                    className={`kx-dir-row${isOpen ? " open" : ""}`}
                    onClick={() => setActiveId(isOpen ? null : d.id)}
                  >
                    {/* Spine */}
                    <div className="kx-dir-spine" style={{ background: dc.color }} />

                    {/* Abbr badge */}
                    <div className="kx-dir-abbr" style={{ background: dc.color }}>
                      {dc.abbr}
                    </div>

                    {/* Name */}
                    <div className="kx-dir-name-col">
                      <span className="kx-dir-name">{d.name}</span>
                      {d.head_name && <span className="kx-dir-head">Mudur: {d.head_name}</span>}
                    </div>

                    {/* Field */}
                    <span className="kx-dir-field">{dc.field}</span>

                    {/* Res count */}
                    <span className="kx-dir-n" style={{ color: dc.color }}>
                      {(d.resources_count ?? 0).toLocaleString()}
                    </span>

                    {/* Teacher count */}
                    <span className="kx-dir-n">{d.teachers_count ?? "—"}</span>

                    {/* Chevron */}
                    <svg
                      className={`kx-dir-chev${isOpen ? " up" : ""}`}
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>

                  {/* Expandable detail */}
                  {isOpen && (
                    <div className="kx-dir-detail">
                      <div className="kx-dd-body">
                        <div className="kx-dd-desc">
                          {d.summary
                            ? <p>{d.summary}</p>
                            : <p>Bo'lim talabalar uchun ilmiy va amaliy ta'lim muhitini yaratishga qaratilgan.</p>
                          }
                        </div>
                        <div className="kx-dd-actions">
                          <Link
                            to={`/${locale}/departments/${d.id}`}
                            className="kx-dd-link"
                            style={{ background: dc.color }}
                          >
                            Katalogni ko'rish
                          </Link>
                          <Link
                            to={`/${locale}/catalog?dept=${encodeURIComponent(d.name)}`}
                            className="kx-dd-link-ghost"
                          >
                            Resurslar
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {rest.length === 0 && (
              <div className="kx-dir-empty">Bo'lim topilmadi</div>
            )}
          </div>
        </div>

        {/* ── Recent publications ── */}
        <div className="kx-pubs">
          <h2 className="kx-pubs-title">So'nggi nashrlar</h2>
          <div className="kx-pubs-grid">
            {RECENT_PUBS.map((p, i) => {
              const dMatch = sorted.find(d => d.name.toLowerCase().includes(p.dept.toLowerCase()));
              const dc = dMatch ? disc(dMatch.id) : { color: "#1f2937", abbr: "—", field: "" };
              return (
                <div key={i} className="kx-pub">
                  <div className="kx-pub-line" style={{ background: dc.color }} />
                  <div className="kx-pub-body">
                    <p className="kx-pub-dept" style={{ color: dc.color }}>{p.dept} · {p.year}</p>
                    <p className="kx-pub-title">{p.title}</p>
                    <p className="kx-pub-author">{p.author}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
