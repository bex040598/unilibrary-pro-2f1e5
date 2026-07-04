import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { useI18n } from "../../lib/i18n";
import { AtmuLogo } from "../common/AtmuLogo";

const DEMO_ACCOUNTS = [
  { email: "student@atmu.uz",    password: "Student123!",    role: "Talaba",        color: "#1457a8" },
  { email: "teacher@atmu.uz",    password: "Teacher123!",    role: "O'qituvchi",    color: "#0e9f6e" },
  { email: "librarian@atmu.uz",  password: "Librarian123!",  role: "Kutubxonachi",  color: "#7c3aed" },
  { email: "admin@atmu.uz",      password: "Admin123!",      role: "Administrator", color: "#9b1a2f" },
];

export function LoginPage() {
  const { locale = "uz" } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail]       = useState("student@atmu.uz");
  const [password, setPassword] = useState("Student123!");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const user = await login(email, password);
      navigate(`/${locale}/dashboard/${user.role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirish amalga oshmadi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(acc: typeof DEMO_ACCOUNTS[0]) {
    setEmail(acc.email);
    setPassword(acc.password);
    setShowDemo(false);
  }

  return (
    <div className="auth-root">

      {/* ── Chap panel ── */}
      <div className="auth-left">
        <div className="auth-left-inner">

          {/* Logotip */}
          <div className="auth-logo-wrap">
            <AtmuLogo size={96} />
          </div>

          {/* Tashkilot nomi */}
          <div className="auth-org">
            <h2 className="auth-org-name">
              Axborot Texnologiyalari<br/>va Menejment Universiteti
            </h2>
            <p className="auth-org-type">Nodavlat oliy ta'lim tashkiloti</p>
          </div>

          <div className="auth-divider"/>

          {/* Manzil */}
          <div className="auth-address">
            <div className="auth-address-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Qashqadaryo viloyati, Qarshi tumani,<br/>Mirmiron MFY, 26-uy</span>
            </div>
            <div className="auth-address-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>library@atmu.uz</span>
            </div>
            <div className="auth-address-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>(55) 404-55-55 · (95) 247-55-55</span>
            </div>
          </div>

          {/* Quyi */}
          <div className="auth-left-footer">
            <p>© 2026 ATMU Smart UniLibrary</p>
            <p>Barcha huquqlar himoyalangan</p>
          </div>
        </div>
      </div>

      {/* ── O'ng panel ── */}
      <div className="auth-right">
        <div className="auth-form-wrap">

          {/* Mobil logo */}
          <div className="auth-mobile-logo">
            <div className="auth-mobile-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div>
              <strong>ATMU Smart UniLibrary</strong>
              <span>Tizimga kirish</span>
            </div>
          </div>

          <h1 className="auth-title">Tizimga kirish</h1>
          <p className="auth-subtitle">
            Kutubxona tizimidan foydalanish uchun elektron pochtangiz va parolingizni kiriting.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Elektron pochta</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  className="auth-input"
                  placeholder="misol@atmu.uz"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="password">Parol</label>
                <a href="#" className="auth-forgot">Parolni unutdingizmi?</a>
              </div>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                  {showPwd
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? <><span className="auth-spinner"/>Tekshirilmoqda...</>
                : "Tizimga kirish"
              }
            </button>
          </form>

          {/* Demo akkauntlar */}
          <div className="auth-demo">
            <button type="button" className="auth-demo-toggle" onClick={() => setShowDemo(v => !v)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Demo akkauntlar
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: showDemo ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showDemo && (
              <div className="auth-demo-list">
                {DEMO_ACCOUNTS.map(acc => (
                  <button key={acc.email} type="button" className="auth-demo-item" onClick={() => fillDemo(acc)}>
                    <div className="auth-demo-avatar" style={{ background: acc.color }}>
                      {acc.role[0]}
                    </div>
                    <div className="auth-demo-info">
                      <strong>{acc.role}</strong>
                      <span>{acc.email}</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="auth-switch">
            Akkaunt yo'qmi?{" "}
            <Link to={`/${locale}/register`} className="auth-switch-link">
              Ro'yxatdan o'tish
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
