import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { useI18n } from "../../lib/i18n";
import type { Locale } from "../../types";

export function Header({ locale }: { locale: Locale; currentPath: string }) {
  const { user, logout } = useAuth();
  const { locales, setLocale } = useI18n();
  const [dropOpen, setDropOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const elibraryPath = user ? `/${locale}/elibrary/${user.role}` : `/${locale}/elibrary`;

  function handleLogout() {
    logout();
    setDropOpen(false);
    navigate(`/${locale}`);
  }

  const navLinks = [
    { to: `/${locale}`, label: "Bosh sahifa" },
    { to: `/${locale}/catalog`, label: "Elektron katalog" },
    { to: `/${locale}/elibrary`, label: "E-Library" },
    { to: `/${locale}/kafedralar`, label: "Kafedralar" },
    { to: `/${locale}/library/reading-room`, label: "O'quv zali" },
    { to: `/${locale}/dashboard`, label: "Boshqaruv" },
  ];

  return (
    <header className="atmu-header">
      {/* ── Ustki chiziq ── */}
      <div className="atmu-topbar">
        <div className="atmu-topbar-inner">
          <div className="atmu-topbar-logo">
            <Link to={`/${locale}`} className="atmu-topbar-brand">
              <div className="atmu-logo-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="atmu-topbar-name">
                <strong>ATMU Smart UniLibrary</strong>
                <span>atmu.uz</span>
              </div>
            </Link>
          </div>
          <nav className="atmu-topbar-links">
            <Link to={`/${locale}/elibrary/student`}>Talaba</Link>
            <Link to={`/${locale}/elibrary/teacher`}>O'qituvchi</Link>
            <Link to={`/${locale}/elibrary/librarian`}>Kutubxonachi</Link>
            <span className="atmu-topbar-sep" />
            <Link to={elibraryPath} className="atmu-topbar-elib">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              E-Lib
            </Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ cursor: "pointer" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {user ? (
              <div className="atmu-topbar-user" onClick={() => setDropOpen((v) => !v)}>
                <div className="atmu-topbar-avatar">
                  {user.full_name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
              </div>
            ) : (
              <Link to={`/${locale}/login`} className="atmu-topbar-loginbtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* ── Asosiy navigatsiya ── */}
      <div className="atmu-navbar">
        <div className="atmu-navbar-inner">
          <nav className="atmu-navbar-links">
            {navLinks.map((link) => {
              const active = link.to === `/${locale}` || link.to === `/${locale}/`
                ? location.pathname === `/${locale}` || location.pathname === `/${locale}/`
                : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={active ? "atmu-navlink atmu-navlink-active" : "atmu-navlink"}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="atmu-navbar-right">
            <div className="atmu-lang-switcher">
              {locales.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={lang === locale ? "atmu-lang atmu-lang-active" : "atmu-lang"}
                  onClick={() => setLocale(lang)}
                >
                  {lang === "uz" ? "O'zb" : lang.toUpperCase()}
                </button>
              ))}
            </div>
            <button type="button" className="atmu-grid-btn" aria-label="menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Dropdown ── */}
      {dropOpen && user && (
        <>
          <div className="atmu-drop-backdrop" onClick={() => setDropOpen(false)} />
          <div className="atmu-dropdown">
            <div className="atmu-drop-head">
              <div className="atmu-drop-avatar">
                {user.full_name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              </div>
              <div>
                <strong>{user.full_name}</strong>
                <span>{user.email}</span>
                <em className={`atmu-role-tag atmu-role-${user.role}`}>{user.role}</em>
              </div>
            </div>
            <div className="atmu-drop-body">
              <Link to={elibraryPath} onClick={() => setDropOpen(false)} className="atmu-drop-item atmu-drop-item-highlight">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                E-Library profilim
              </Link>
              <Link to={`/${locale}/profile`} onClick={() => setDropOpen(false)} className="atmu-drop-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Shaxsiy ma'lumotlar
              </Link>
              <Link to={`/${locale}/loans`} onClick={() => setDropOpen(false)} className="atmu-drop-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Mening kitoblarim
              </Link>
              <Link to={`/${locale}/reservations`} onClick={() => setDropOpen(false)} className="atmu-drop-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Bron qilingan kitoblar
              </Link>
              <Link to={`/${locale}/library/reading-room`} onClick={() => setDropOpen(false)} className="atmu-drop-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                O'quv zali bronlari
              </Link>
              <button type="button" className="atmu-drop-logout" onClick={handleLogout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Tizimdan chiqish
              </button>
            </div>
            {!user && (
              <div className="atmu-drop-auth">
                <Link to={`/${locale}/login`} className="atmu-drop-item" onClick={() => setDropOpen(false)}>Kirish</Link>
                <Link to={`/${locale}/register`} className="atmu-drop-item" onClick={() => setDropOpen(false)}>Ro'yxatdan o'tish</Link>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
