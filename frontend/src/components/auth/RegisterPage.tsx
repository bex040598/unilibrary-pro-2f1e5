import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { AtmuLogo } from "../common/AtmuLogo";

const STEPS = ["Rol tanlash", "Shaxsiy ma'lumotlar", "O'quv ma'lumotlari", "Parol o'rnatish"];

const ROLES = [
  {
    id: "student",
    label: "Talaba",
    desc: "Kitob qidirish, o'quv zali bron qilish va AI yordamchidan foydalaning",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    id: "teacher",
    label: "O'qituvchi",
    desc: "O'quv materiallar yuklash va talabalar faolligini kuzatib boring",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: "librarian",
    label: "Kutubxonachi",
    desc: "Materiallarni ko'rib chiqing, tasdiqlang va kutubxona fondini boshqaring",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    id: "department",
    label: "Kafedra",
    desc: "Kafedra kutubxonasini boshqaring va o'quv dasturini shakllantirib boring",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
];

export function RegisterPage() {
  const { locale = "uz" } = useParams();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({
    role: "student",
    full_name: "",
    email: "",
    phone: "",
    department_id: "1",
    faculty_id: "1",
    course: "1",
    semester: "1",
    student_id: "",
    teacher_title: "",
    password: "",
    consent_face_id: false,
  });

  const upd = (k: string, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const canNext = useMemo(() => {
    if (step === 0) return Boolean(form.role);
    if (step === 1) return Boolean(form.full_name.trim() && form.email.trim());
    if (step === 2) return Boolean(form.department_id);
    if (step === 3) return form.password.length >= 8;
    return true;
  }, [form, step]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
    try {
      setLoading(true);
      setError(null);
      const user = await register({
        ...form,
        department_id: Number(form.department_id),
        faculty_id: Number(form.faculty_id),
        course: Number(form.course),
        semester: Number(form.semester),
      });
      navigate(`/${locale}/dashboard/${user.role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ro'yxatdan o'tishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root auth-root-reg">

      {/* ── Chap panel ── */}
      <div className="auth-left">
        <div className="auth-left-inner">

          <div className="auth-logo-wrap">
            <AtmuLogo size={80} dark={false} />
          </div>

          <div className="auth-org">
            <h2 className="auth-org-name">
              Axborot Texnologiyalari<br/>va Menejment Universiteti
            </h2>
            <p className="auth-org-type">Nodavlat oliy ta'lim tashkiloti</p>
          </div>

          <div className="auth-divider"/>

          {/* Qadam ko'rsatkichi */}
          <div className="auth-steps-list">
            {STEPS.map((s, i) => (
              <div key={s} className={`auth-step-item ${i === step ? "auth-step-active" : i < step ? "auth-step-done" : ""}`}>
                <div className="auth-step-num">
                  {i < step
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : i + 1
                  }
                </div>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div className="auth-divider"/>

          <div className="auth-address">
            <div className="auth-address-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Qashqadaryo viloyati, Qarshi tumani,<br/>Mirmiron MFY, 26-uy</span>
            </div>
          </div>

          <div className="auth-left-footer">
            <p>© 2026 ATMU Smart UniLibrary</p>
          </div>
        </div>
      </div>

      {/* ── O'ng panel ── */}
      <div className="auth-right">
        <div className="auth-form-wrap">

          {/* Mobil logo */}
          <div className="auth-mobile-logo">
            <div className="auth-mobile-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div>
              <strong>ATMU Smart UniLibrary</strong>
              <span>Ro'yxatdan o'tish</span>
            </div>
          </div>

          {/* Qadam sarlavhasi */}
          <div className="auth-step-header">
            <div className="auth-step-progress">
              <div className="auth-step-bar" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}/>
            </div>
            <div className="auth-step-info">
              <span className="auth-step-count">{step + 1} / {STEPS.length}</span>
              <span className="auth-step-name">{STEPS[step]}</span>
            </div>
          </div>

          <h1 className="auth-title">{STEPS[step]}</h1>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* ─ 1: Rol ─ */}
            {step === 0 && (
              <div className="auth-role-grid">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    className={`auth-role-card ${form.role === r.id ? "auth-role-selected" : ""}`}
                    onClick={() => upd("role", r.id)}
                  >
                    <div className="auth-role-icon">{r.icon}</div>
                    <strong className="auth-role-label">{r.label}</strong>
                    <p className="auth-role-desc">{r.desc}</p>
                    <div className="auth-role-check">
                      {form.role === r.id && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ─ 2: Shaxsiy ─ */}
            {step === 1 && (
              <div className="auth-fields">
                <div className="auth-field">
                  <label className="auth-label" htmlFor="full_name">To'liq ismi-sharifi</label>
                  <div className="auth-input-wrap">
                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input id="full_name" className="auth-input" placeholder="Masalan: Bobur Toshmatov"
                      value={form.full_name} onChange={e => upd("full_name", e.target.value)} required/>
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-email">Elektron pochta</label>
                  <div className="auth-input-wrap">
                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input id="reg-email" type="email" className="auth-input" placeholder="misol@atmu.uz"
                      value={form.email} onChange={e => upd("email", e.target.value)} required/>
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="phone">Telefon raqam</label>
                  <div className="auth-input-wrap">
                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <input id="phone" className="auth-input" placeholder="+998 90 000 00 00"
                      value={form.phone} onChange={e => upd("phone", e.target.value)}/>
                  </div>
                </div>
              </div>
            )}

            {/* ─ 3: O'quv ─ */}
            {step === 2 && (
              <div className="auth-fields">
                <div className="auth-field">
                  <label className="auth-label">Fakultet</label>
                  <div className="auth-input-wrap">
                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    <select className="auth-input auth-select"
                      value={form.faculty_id} onChange={e => upd("faculty_id", e.target.value)}>
                      <option value="1">Raqamli texnologiyalar fakulteti</option>
                      <option value="2">Ijtimoiy fanlar fakulteti</option>
                    </select>
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Kafedra</label>
                  <div className="auth-input-wrap">
                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                    <select className="auth-input auth-select"
                      value={form.department_id} onChange={e => upd("department_id", e.target.value)}>
                      <option value="1">Axborot texnologiyalari</option>
                      <option value="2">Iqtisodiyot</option>
                      <option value="3">Matematika</option>
                      <option value="4">Filologiya</option>
                      <option value="5">Tarix</option>
                      <option value="6">Pedagogika</option>
                    </select>
                  </div>
                </div>
                {(form.role === "student") && (
                  <div className="auth-field-row">
                    <div className="auth-field">
                      <label className="auth-label">Kurs</label>
                      <div className="auth-input-wrap">
                        <select className="auth-input auth-select" value={form.course} onChange={e => upd("course", e.target.value)}>
                          {[1,2,3,4].map(n => <option key={n} value={n}>{n}-kurs</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Semestr</label>
                      <div className="auth-input-wrap">
                        <select className="auth-input auth-select" value={form.semester} onChange={e => upd("semester", e.target.value)}>
                          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}-semestr</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                {form.role === "student" && (
                  <div className="auth-field">
                    <label className="auth-label">Talaba ID raqami</label>
                    <div className="auth-input-wrap">
                      <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                      </svg>
                      <input className="auth-input" placeholder="Masalan: AT-2301"
                        value={form.student_id} onChange={e => upd("student_id", e.target.value)}/>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─ 4: Parol ─ */}
            {step === 3 && (
              <div className="auth-fields">
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-pwd">Parol</label>
                  <div className="auth-input-wrap">
                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input id="reg-pwd" type={showPwd ? "text" : "password"} className="auth-input"
                      placeholder="Kamida 8 ta belgi"
                      value={form.password} onChange={e => upd("password", e.target.value)} required/>
                    <button type="button" className="auth-eye" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                      {showPwd
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div className="auth-pwd-strength">
                      <div className="auth-pwd-bars">
                        {[1,2,3,4].map(n => (
                          <div key={n} className="auth-pwd-bar"
                            style={{ background: form.password.length >= n * 2
                              ? (form.password.length >= 8 ? "#0e9f6e" : "#d6a84f")
                              : "#e5e7eb" }}
                          />
                        ))}
                      </div>
                      <span>{form.password.length < 4 ? "Juda qisqa" : form.password.length < 8 ? "O'rtacha" : "Yaxshi"}</span>
                    </div>
                  )}
                </div>

                {/* Xulosa kartasi */}
                <div className="auth-summary">
                  <h4 className="auth-summary-title">Ro'yxatdan o'tish ma'lumotlari</h4>
                  <div className="auth-summary-rows">
                    <div className="auth-summary-row"><span>Rol</span><strong>{ROLES.find(r => r.id === form.role)?.label}</strong></div>
                    <div className="auth-summary-row"><span>Ism</span><strong>{form.full_name || "—"}</strong></div>
                    <div className="auth-summary-row"><span>Email</span><strong>{form.email || "—"}</strong></div>
                    {form.student_id && <div className="auth-summary-row"><span>ID</span><strong>{form.student_id}</strong></div>}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="auth-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div className="auth-btn-row">
              {step > 0 && (
                <button type="button" className="auth-back-btn" onClick={() => setStep(s => s - 1)}>
                  ← Orqaga
                </button>
              )}
              <button type="submit" className="auth-submit auth-submit-flex" disabled={!canNext || loading}>
                {loading
                  ? <><span className="auth-spinner"/>Yakunlanmoqda...</>
                  : step === STEPS.length - 1
                    ? "Ro'yxatdan o'tish"
                    : "Davom etish →"
                }
              </button>
            </div>
          </form>

          <p className="auth-switch">
            Allaqachon akkauntingiz bormi?{" "}
            <Link to={`/${locale}/login`} className="auth-switch-link">Tizimga kirish</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
