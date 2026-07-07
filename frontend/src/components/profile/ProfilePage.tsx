import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { api } from "../../lib/api";
import { FaceCapture } from "../face-id/FaceCapture";
import { departments as fallbackDepartments, resources as fallbackResources } from "../../data/mock";
import type { Loan, Reservation, Resource, Role } from "../../types";
import { SmartFeaturesPanel } from "../common/SmartFeatures";

/* ── Role colors ── */
const ROLE_COLOR: Record<Role, { bg: string; badge: string; label: string }> = {
  student:    { bg: "#0c4a6e", badge: "#0ea5e9", label: "Talaba"        },
  teacher:    { bg: "#1e3a5f", badge: "#6366f1", label: "O'qituvchi"    },
  librarian:  { bg: "#064e3b", badge: "#10b981", label: "Kutubxonachi"  },
  department: { bg: "#78350f", badge: "#f59e0b", label: "Kafedra"       },
  admin:      { bg: "#3b0764", badge: "#a855f7", label: "Admin"         },
};

const ROLE_DASHBOARD: Record<Role, string> = {
  student:    "/dashboard/student",
  teacher:    "/dashboard/teacher",
  librarian:  "/dashboard/librarian",
  department: "/dashboard/department",
  admin:      "/admin",
};

type Tab = "overview" | "smart" | "library" | "settings" | "security" | "face-id";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview",  label: "Umumiy",         icon: "⊞" },
  { id: "smart",     label: "Smart xizmatlar", icon: "✦" },
  { id: "library",   label: "Kutubxona",       icon: "⊡" },
  { id: "settings",  label: "Sozlamalar",      icon: "⊙" },
  { id: "security",  label: "Xavfsizlik",      icon: "⊛" },
  { id: "face-id",   label: "Face ID",          icon: "◉" },
];

/* ── Avatar initials ── */
function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}

/* ── Icon SVGs ── */
const PencilIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════ */
export function ProfilePage() {
  const { locale = "uz", section } = useParams();
  const { user, accessToken, refreshProfile } = useAuth();
  const role = (user?.role ?? "student") as Role;
  const rc = ROLE_COLOR[role];

  /* map old section slugs → new tab ids */
  const mapSection = (s?: string): Tab => {
    if (s === "face-id") return "face-id";
    if (s === "security") return "security";
    if (s === "account") return "settings";
    if (s === "library" || s === "reservations" || s === "reading-room" || s === "workspace") return "library";
    return "overview";
  };
  const [activeTab, setActiveTab] = useState<Tab>(mapSection(section));

  /* ── Data ── */
  const [summary, setSummary] = useState({ reservations: 0, loans: 0, overdue: 0, seat_bookings: 0 });
  const [activities, setActivities] = useState<Array<{ id: number; action: string; created_at: string }>>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [resources, setResources] = useState<Resource[]>(fallbackResources);
  const [report, setReport] = useState<Record<string, number>>({});

  /* ── Edit state ── */
  const [editName, setEditName]     = useState(false);
  const [nameVal, setNameVal]       = useState("");
  const [editPhone, setEditPhone]   = useState(false);
  const [phoneVal, setPhoneVal]     = useState("");
  const [avatarUrl, setAvatarUrl]   = useState<string | null>(null);
  const [saveMsg, setSaveMsg]       = useState<string | null>(null);
  const [pwForm, setPwForm]         = useState({ cur: "", next: "", confirm: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNameVal(user?.full_name ?? "");
    setPhoneVal(user?.phone ?? "");
  }, [user?.full_name, user?.phone]);

  useEffect(() => {
    if (!accessToken || !user) return;
    api.librarySummary(accessToken).then(r => setSummary(r.data)).catch(() => {});
    api.activity(accessToken).then(r => setActivities(r.data)).catch(() => {});
    api.reportsLibrary(accessToken).then(r => setReport(r.data)).catch(() => {});
    if (role === "student") {
      api.myReservations(accessToken).then(setReservations).catch(() => {});
      api.myLoans(accessToken).then(setLoans).catch(() => {});
    }
    if (role === "teacher" || role === "department") {
      api.departmentResources(user.department_id ?? undefined).then(setResources).catch(() => {});
    }
    if (role === "librarian") {
      api.departmentResources().then(setResources).catch(() => {});
      api.reservations(accessToken).then(setReservations).catch(() => {});
    }
    if (role === "admin") {
      api.departmentResources().then(setResources).catch(() => {});
      api.reservations(accessToken).then(setReservations).catch(() => {});
    }
  }, [accessToken, role, user]);

  const departmentName = useMemo(() => {
    if (!user?.department_id) return "ATMU";
    return fallbackDepartments.find(d => d.id === user.department_id)?.name ?? "Kafedra";
  }, [user?.department_id]);

  /* ── Handlers ── */
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function saveName() {
    if (!accessToken || !nameVal.trim()) return;
    await api.updateMe(accessToken, { full_name: nameVal.trim() }).catch(() => {});
    await refreshProfile();
    setEditName(false);
    flash("Ism muvaffaqiyatli yangilandi");
  }

  async function savePhone() {
    if (!accessToken) return;
    await api.updateMe(accessToken, { phone: phoneVal }).catch(() => {});
    await refreshProfile();
    setEditPhone(false);
    flash("Telefon yangilandi");
  }

  async function savePassword() {
    if (!accessToken || pwForm.next !== pwForm.confirm) {
      flash("Parollar mos kelmadi", true); return;
    }
    await api.changePassword(accessToken, { current_password: pwForm.cur, new_password: pwForm.next }).catch(() => {});
    setPwForm({ cur: "", next: "", confirm: "" });
    flash("Parol muvaffaqiyatli o'zgartirildi");
  }

  function flash(msg: string, _err = false) {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(null), 3000);
  }

  /* ── Stats ── */
  const stats = useMemo(() => {
    switch (role) {
      case "student": return [
        { n: String(summary.loans || loans.length),         l: "Aktiv kitob",      sub: "loan"        },
        { n: String(summary.reservations || reservations.length), l: "Bron",        sub: "reservation" },
        { n: String(summary.seat_bookings),                  l: "Zal bron",         sub: "seat"        },
        { n: String(summary.overdue),                        l: "Muddati o'tgan",   sub: "overdue", warn: true },
      ];
      case "teacher": return [
        { n: String(resources.length),                                                    l: "Jami resurs",   sub: "portfolio" },
        { n: String(resources.filter(r => r.status === "pending_review").length),         l: "Pending",       sub: "review"    },
        { n: String(resources.filter(r => r.status === "approved").length),               l: "Tasdiqlangan",  sub: "approved"  },
        { n: String(resources.reduce((s, r) => s + r.views_count, 0).toLocaleString()),   l: "Ko'rishlar",    sub: "views"     },
      ];
      case "librarian": return [
        { n: String(reservations.length),                                                  l: "Bronlar",       sub: "today"     },
        { n: String(resources.filter(r => r.status === "pending_review").length),          l: "Review queue",  sub: "material"  },
        { n: String(report.overdue ?? 0),                                                  l: "Overdue",       sub: "late", warn: true },
        { n: String(report.loans ?? 0),                                                    l: "Aktiv loanlar", sub: "total"     },
      ];
      case "admin": return [
        { n: String(report.users ?? 48),                    l: "Foydalanuvchi",    sub: "RBAC"        },
        { n: String(report.departments ?? 6),               l: "Kafedra",          sub: "faculty"     },
        { n: String(reservations.length || report.reservations || 0), l: "Bronlar",sub: "global"      },
        { n: String(report.ai_queries ?? 342),              l: "AI so'rovlar",     sub: "semantic"    },
      ];
      default: return [
        { n: String(resources.length), l: "Resurslar", sub: "portfolio" },
      ];
    }
  }, [loans, reservations, resources, report, role, summary]);

  /* ── Not logged in ── */
  if (!user) return (
    <div className="prf-noauth">
      <div className="prf-noauth-inner">
        <div className="prf-noauth-icon">◉</div>
        <h2>Kirish talab etiladi</h2>
        <p>Profilingizni ko'rish uchun tizimga kiring.</p>
        <Link to={`/${locale}/login`} className="prf-noauth-btn">Kirish</Link>
      </div>
    </div>
  );

  /* ════════ RENDER ════════ */
  return (
    <div className="prf-root">

      {/* ── HERO BANNER ── */}
      <div className="prf-hero" style={{ background: rc.bg }}>
        {/* geometric pattern */}
        <svg className="prf-hero-bg" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="prf-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.06)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#prf-dots)"/>
          <ellipse cx="950" cy="-30" rx="300" ry="180" fill="rgba(255,255,255,0.03)"/>
          <ellipse cx="100" cy="220" rx="200" ry="120" fill="rgba(255,255,255,0.03)"/>
        </svg>

        <div className="prf-hero-inner">
          {/* Avatar */}
          <div className="prf-avatar-wrap" onClick={() => fileRef.current?.click()}>
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className="prf-avatar-img" />
              : <div className="prf-avatar-initials">{initials(user.full_name)}</div>
            }
            <div className="prf-avatar-cam"><CameraIcon /></div>
            <input ref={fileRef} type="file" accept="image/*" className="prf-file-hidden" onChange={handleAvatarChange}/>
          </div>

          {/* Identity */}
          <div className="prf-identity">
            {editName ? (
              <div className="prf-inline-edit">
                <input
                  className="prf-inline-input"
                  value={nameVal}
                  onChange={e => setNameVal(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditName(false); }}
                  autoFocus
                />
                <button className="prf-inline-save" onClick={saveName}><CheckIcon /> Saqlash</button>
                <button className="prf-inline-cancel" onClick={() => setEditName(false)}>Bekor</button>
              </div>
            ) : (
              <div className="prf-name-row">
                <h1 className="prf-name">{user.full_name}</h1>
                <button className="prf-edit-btn" onClick={() => setEditName(true)} title="Ismni tahrirlash">
                  <PencilIcon />
                </button>
              </div>
            )}
            <div className="prf-meta-row">
              <span className="prf-email">{user.email}</span>
              <span className="prf-sep">·</span>
              <span className="prf-dept">{departmentName}</span>
            </div>
            <div className="prf-badges">
              <span className="prf-role-badge" style={{ background: rc.badge }}>{rc.label}</span>
              <span className="prf-active-dot"/>
              <span className="prf-active-lbl">Faol</span>
            </div>
          </div>

          {/* Dashboard link */}
          <div className="prf-hero-actions">
            <Link to={`/${locale}${ROLE_DASHBOARD[role]}`} className="prf-dash-btn">
              Boshqaruv paneli →
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="prf-stats-strip">
          {stats.map((s, i) => (
            <div key={i} className={`prf-stat${s.warn ? " warn" : ""}`}>
              <div className="prf-stat-n">{s.n}</div>
              <div className="prf-stat-l">{s.l}</div>
              <div className="prf-stat-s">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="prf-tabs-wrap">
        <div className="prf-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`prf-tab${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="prf-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="prf-content">
        {saveMsg && (
          <div className="prf-toast">
            <CheckIcon /> {saveMsg}
          </div>
        )}

        {/* ─── OVERVIEW ─── */}
        {activeTab === "overview" && (
          <div className="prf-section">
            <div className="prf-grid-2">
              {/* Profile card */}
              <div className="prf-card">
                <div className="prf-card-head">
                  <h3>Shaxsiy ma'lumotlar</h3>
                </div>
                <div className="prf-info-list">
                  <div className="prf-info-row">
                    <span className="prf-info-key">To'liq ism</span>
                    <span className="prf-info-val">{user.full_name}</span>
                  </div>
                  <div className="prf-info-row">
                    <span className="prf-info-key">Email</span>
                    <span className="prf-info-val">{user.email}</span>
                  </div>
                  <div className="prf-info-row">
                    <span className="prf-info-key">Telefon</span>
                    <span className="prf-info-val">{user.phone || "—"}</span>
                  </div>
                  <div className="prf-info-row">
                    <span className="prf-info-key">Rol</span>
                    <span className="prf-info-val">
                      <span className="prf-role-badge sm" style={{ background: rc.badge }}>{rc.label}</span>
                    </span>
                  </div>
                  <div className="prf-info-row">
                    <span className="prf-info-key">Kafedra</span>
                    <span className="prf-info-val">{departmentName}</span>
                  </div>
                </div>
                <button className="prf-card-edit-btn" onClick={() => setActiveTab("settings")}>
                  Tahrirlash <PencilIcon />
                </button>
              </div>

              {/* Activity feed */}
              <div className="prf-card">
                <div className="prf-card-head">
                  <h3>So'nggi faollik</h3>
                </div>
                {activities.length > 0 ? (
                  <div className="prf-activity">
                    {activities.slice(0, 6).map((a, i) => (
                      <div key={a.id} className="prf-act-row">
                        <div className="prf-act-dot" style={{ background: rc.badge }}/>
                        <div className="prf-act-body">
                          <p className="prf-act-text">{a.action}</p>
                          <p className="prf-act-time">{new Date(a.created_at).toLocaleDateString("uz-UZ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="prf-empty-feed">
                    <p>Hozircha faollik yo'q</p>
                  </div>
                )}
              </div>
            </div>

            {/* Role feature highlights */}
            <div className="prf-features">
              <div className="prf-feat-head">
                <h3>Rolga mos imkoniyatlar</h3>
                <span className="prf-role-badge" style={{ background: rc.badge }}>{rc.label}</span>
              </div>
              <div className="prf-feat-grid">
                {role === "student" && [
                  { icon: "📚", title: "Kitob bron", desc: "Kutubxona fondidan kitob bronlash va qaytarish muddatini kuzatish." },
                  { icon: "🪑", title: "O'quv zali", desc: "O'quv zali o'rinlarini bron qilish va check-in QR kodi olish." },
                  { icon: "◉", title: "Face ID", desc: "Yuz tanish orqali tezkor kirish va check-in imkoniyati." },
                ].map(f => (
                  <div key={f.title} className="prf-feat-card">
                    <div className="prf-feat-icon">{f.icon}</div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                ))}
                {role === "teacher" && [
                  { icon: "📤", title: "Resurs yuklash", desc: "O'quv materiallari va ilmiy maqolalarni kutubxonaga yuklash." },
                  { icon: "📊", title: "Statistika", desc: "Materiallaringizni ko'rish, yuklab olish va foydalanish ko'rsatkichlari." },
                  { icon: "✅", title: "Approval holati", desc: "Yuklangan materiallarning tasdiqlash jarayonini kuzatish." },
                ].map(f => (
                  <div key={f.title} className="prf-feat-card">
                    <div className="prf-feat-icon">{f.icon}</div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                ))}
                {role === "librarian" && [
                  { icon: "🔍", title: "Bron nazorati", desc: "Barcha bronlarni ko'rish, tasdiqlash va bekor qilish." },
                  { icon: "⏰", title: "Loan panel", desc: "Bugun qaytariladigan va muddati o'tgan kitoblar nazorati." },
                  { icon: "📋", title: "Review queue", desc: "O'qituvchilar yuklagan materiallarni ko'rib chiqish." },
                ].map(f => (
                  <div key={f.title} className="prf-feat-card">
                    <div className="prf-feat-icon">{f.icon}</div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                ))}
                {role === "admin" && [
                  { icon: "👥", title: "Foydalanuvchilar", desc: "RBAC rollari, sessiyalar va foydalanuvchi boshqaruvi." },
                  { icon: "📈", title: "Hisobotlar", desc: "Kutubxona statistikasi, AI loglari va audit ma'lumotlari." },
                  { icon: "🛡️", title: "Tizim nazorati", desc: "Xavfsizlik, permissions va tizim holati monitoring." },
                ].map(f => (
                  <div key={f.title} className="prf-feat-card">
                    <div className="prf-feat-icon">{f.icon}</div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                ))}
                {(role === "department") && [
                  { icon: "🏛️", title: "Kafedra resurslari", desc: "Kafedra bo'yicha barcha elektron materiallarni boshqarish." },
                  { icon: "✅", title: "Approval", desc: "Materiallar tasdiqlash va rad etish jarayoni." },
                  { icon: "📊", title: "Statistika", desc: "Kafedra foydalanish ko'rsatkichlari va reyting." },
                ].map(f => (
                  <div key={f.title} className="prf-feat-card">
                    <div className="prf-feat-icon">{f.icon}</div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── SMART XIZMATLAR ─── */}
        {activeTab === "smart" && (
          <div className="prf-section">
            <SmartFeaturesPanel role={role} />
          </div>
        )}

        {/* ─── LIBRARY ─── */}
        {activeTab === "library" && (
          <div className="prf-section">
            {(role === "student") && (
              <div className="prf-grid-2">
                <div className="prf-card">
                  <div className="prf-card-head"><h3>Aktiv kitoblar</h3></div>
                  {loans.length > 0 ? (
                    <div className="prf-table-wrap">
                      <table className="prf-table">
                        <thead>
                          <tr><th>Kitob</th><th>Berilgan</th><th>Muddat</th></tr>
                        </thead>
                        <tbody>
                          {loans.slice(0, 5).map(l => (
                            <tr key={l.id}>
                              <td>{l.book_title ?? "—"}</td>
                              <td>{l.issued_at ? new Date(l.issued_at).toLocaleDateString("uz-UZ") : "—"}</td>
                              <td className={l.remaining_days < 0 ? "prf-overdue" : ""}>
                                {l.due_at ? new Date(l.due_at).toLocaleDateString("uz-UZ") : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <div className="prf-empty-feed"><p>Aktiv kitob yo'q</p></div>}
                  <Link to={`/${locale}/loans`} className="prf-card-link">Barchasini ko'rish →</Link>
                </div>

                <div className="prf-card">
                  <div className="prf-card-head"><h3>Bronlar</h3></div>
                  {reservations.length > 0 ? (
                    <div className="prf-table-wrap">
                      <table className="prf-table">
                        <thead>
                          <tr><th>Kitob</th><th>Holat</th><th>Sana</th></tr>
                        </thead>
                        <tbody>
                          {reservations.slice(0, 5).map(r => (
                            <tr key={r.id}>
                              <td>{r.book_title ?? "—"}</td>
                              <td><span className={`prf-status ${r.status}`}>{r.status}</span></td>
                              <td>{r.pickup_date ?? "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <div className="prf-empty-feed"><p>Bron yo'q</p></div>}
                  <Link to={`/${locale}/reservations`} className="prf-card-link">Barchasini ko'rish →</Link>
                </div>
              </div>
            )}

            {(role === "teacher" || role === "department" || role === "librarian" || role === "admin") && (
              <div className="prf-card wide">
                <div className="prf-card-head">
                  <h3>Resurslar</h3>
                  {(role === "teacher") && (
                    <Link to={`/${locale}/resources/upload`} className="prf-card-action">+ Yangi resurs</Link>
                  )}
                </div>
                {resources.length > 0 ? (
                  <div className="prf-table-wrap">
                    <table className="prf-table">
                      <thead>
                        <tr><th>Nomi</th><th>Tur</th><th>Holat</th><th>Ko'rishlar</th><th>Yuklab</th></tr>
                      </thead>
                      <tbody>
                        {resources.slice(0, 8).map(r => (
                          <tr key={r.id}>
                            <td className="prf-td-title">{r.title}</td>
                            <td>{r.material_type}</td>
                            <td><span className={`prf-status ${r.status}`}>{r.status}</span></td>
                            <td>{r.views_count}</td>
                            <td>{r.downloads_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <div className="prf-empty-feed"><p>Resurs topilmadi</p></div>}
              </div>
            )}
          </div>
        )}

        {/* ─── SETTINGS ─── */}
        {activeTab === "settings" && (
          <div className="prf-section">
            <div className="prf-grid-2">

              {/* Avatar upload */}
              <div className="prf-card">
                <div className="prf-card-head"><h3>Profil rasmi</h3></div>
                <div className="prf-avatar-upload">
                  <div className="prf-upload-preview" onClick={() => fileRef.current?.click()}>
                    {avatarUrl
                      ? <img src={avatarUrl} alt="avatar" className="prf-upload-img" />
                      : <div className="prf-upload-initials">{initials(user.full_name)}</div>
                    }
                    <div className="prf-upload-overlay"><CameraIcon /><span>Rasm yuklash</span></div>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="prf-file-hidden" onChange={handleAvatarChange}/>
                  <div className="prf-upload-hint">
                    <p>JPG, PNG yoki WebP — maksimum 5 MB</p>
                    <p>Tavsiya etilgan o'lcham: 400×400 px</p>
                  </div>
                </div>
              </div>

              {/* Name edit */}
              <div className="prf-card">
                <div className="prf-card-head"><h3>To'liq ism</h3></div>
                <div className="prf-field-group">
                  <label className="prf-label">Ism va familiya</label>
                  <div className="prf-input-row">
                    <input
                      className="prf-input"
                      value={nameVal}
                      onChange={e => setNameVal(e.target.value)}
                      placeholder="To'liq ism familiyangiz"
                    />
                    <button className="prf-save-btn" onClick={saveName} style={{ background: rc.bg }}>
                      <CheckIcon /> Saqlash
                    </button>
                  </div>
                  <p className="prf-hint">Bu ism barcha sahifalarda ko'rinadi.</p>
                </div>

                <div className="prf-field-group" style={{ marginTop: 20 }}>
                  <label className="prf-label">Telefon raqam</label>
                  <div className="prf-input-row">
                    <input
                      className="prf-input"
                      value={phoneVal}
                      onChange={e => setPhoneVal(e.target.value)}
                      placeholder="+998 9X XXX XX XX"
                    />
                    <button className="prf-save-btn" onClick={savePhone} style={{ background: rc.bg }}>
                      <CheckIcon /> Saqlash
                    </button>
                  </div>
                </div>
              </div>

              {/* Account info (read-only) */}
              <div className="prf-card">
                <div className="prf-card-head"><h3>Akkaunt ma'lumotlari</h3></div>
                <div className="prf-info-list">
                  <div className="prf-info-row">
                    <span className="prf-info-key">Email</span>
                    <span className="prf-info-val">{user.email}</span>
                  </div>
                  <div className="prf-info-row">
                    <span className="prf-info-key">Rol</span>
                    <span className="prf-info-val">
                      <span className="prf-role-badge sm" style={{ background: rc.badge }}>{rc.label}</span>
                    </span>
                  </div>
                  <div className="prf-info-row">
                    <span className="prf-info-key">Kafedra</span>
                    <span className="prf-info-val">{departmentName}</span>
                  </div>
                </div>
                <p className="prf-hint" style={{ marginTop: 12 }}>Email va rol tizim tomonidan belgilanadi.</p>
              </div>

            </div>
          </div>
        )}

        {/* ─── SECURITY ─── */}
        {activeTab === "security" && (
          <div className="prf-section">
            <div className="prf-grid-2">
              <div className="prf-card">
                <div className="prf-card-head"><h3>Parolni o'zgartirish</h3></div>
                <div className="prf-field-group">
                  <label className="prf-label">Joriy parol</label>
                  <input type="password" className="prf-input" value={pwForm.cur}
                    onChange={e => setPwForm(p => ({ ...p, cur: e.target.value }))} placeholder="••••••••"/>
                </div>
                <div className="prf-field-group">
                  <label className="prf-label">Yangi parol</label>
                  <input type="password" className="prf-input" value={pwForm.next}
                    onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} placeholder="Min. 8 belgi"/>
                </div>
                <div className="prf-field-group">
                  <label className="prf-label">Yangi parolni takrorlang</label>
                  <input type="password" className="prf-input" value={pwForm.confirm}
                    onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••"/>
                </div>
                <button className="prf-primary-btn" onClick={savePassword} style={{ background: rc.bg }}>
                  Parolni saqlash
                </button>
              </div>

              <div className="prf-card">
                <div className="prf-card-head"><h3>Kirish tarixi</h3></div>
                {activities.slice(0, 5).map((a, i) => (
                  <div key={a.id} className="prf-act-row">
                    <div className="prf-act-dot" style={{ background: rc.badge }}/>
                    <div className="prf-act-body">
                      <p className="prf-act-text">{a.action}</p>
                      <p className="prf-act-time">{new Date(a.created_at).toLocaleString("uz-UZ")}</p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="prf-empty-feed"><p>Faollik tarixi yo'q</p></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── FACE ID ─── */}
        {activeTab === "face-id" && (
          <div className="prf-section">
            <div className="prf-card wide">
              <div className="prf-card-head">
                <h3>Face ID — yuz orqali kirish</h3>
                <p className="prf-card-sub">Kamerangizni ruxsat bering, so'ng yuzingizni ro'yxatdan o'tkazing.</p>
              </div>
              <FaceCapture />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
