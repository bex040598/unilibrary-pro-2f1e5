import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { useI18n } from "../../lib/i18n";
import type { Locale } from "../../types";

export function Header({ locale }: { locale: Locale; currentPath: string }) {
  const { user, logout } = useAuth();
  const { t, locales, setLocale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = useMemo(() => ([
    { to: `/${locale}`, label: "Bosh sahifa" },
    { to: `/${locale}/catalog`, label: "Elektron katalog" },
    { to: `/${locale}/elibrary`, label: "E-Library" },
    { to: `/${locale}/kafedralar`, label: "Kafedralar" },
    { to: `/${locale}/library/reading-room`, label: "O'quv zali" },
    { to: `/${locale}/dashboard`, label: "Boshqaruv" },
  ]), [locale]);

  const elibraryPath = user
    ? `/${locale}/elibrary/${user.role}`
    : `/${locale}/elibrary`;

  const roleWorkspaceLabel = useMemo(() => {
    switch (user?.role) {
      case "student": return "Talaba E-Library";
      case "teacher": return "O'qituvchi E-Library";
      case "librarian": return "Kutubxonachi paneli";
      case "department": return "Kafedra boshqaruvi";
      case "admin": return "Tizim boshqaruvi";
      default: return "E-Library profili";
    }
  }, [user?.role]);

  return (
    <header className="site-header tstu-header">
      {/* Top strip */}
      <div className="tstu-top-strip">
        <span>ATMU Smart UniLibrary · AI + Face ID + Kafedra kutubxonalari</span>
        <div className="tstu-top-strip-links">
          <Link to={`/${locale}/elibrary/student`}>Talaba</Link>
          <Link to={`/${locale}/elibrary/teacher`}>O'qituvchi</Link>
          <Link to={`/${locale}/elibrary/librarian`}>Kutubxonachi</Link>
          <Link to={`/${locale}/elibrary`} className="tstu-elib-highlight">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            E-Lib
          </Link>
        </div>
      </div>

      {/* Main header */}
      <div className="header-main tstu-header-main">
        <Link to={`/${locale}`} className="brand-mark tstu-brand">
          <div className="brand-seal tstu-seal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div>
            <strong>Axborot texnologiyalari va menejment universiteti</strong>
            <span>ATMU Smart UniLibrary</span>
          </div>
        </Link>

        <nav className="header-nav tstu-nav">
          {links.map((link) => {
            const isActive = link.to === `/${locale}`
              ? location.pathname === `/${locale}` || location.pathname === `/${locale}/`
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={isActive ? "tstu-nav-active" : ""}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions tstu-header-actions">
          <div className="locale-switcher tstu-locale">
            {locales.map((item) => (
              <button
                key={item}
                type="button"
                className={item === locale ? "active" : ""}
                onClick={() => setLocale(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>

          {user ? (
            <div className="avatar-dropdown">
              <button
                type="button"
                className="avatar-trigger"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span>{user.full_name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</span>
              </button>
              {menuOpen && (
                <div className="dropdown-panel tstu-dropdown">
                  <div className="tstu-dropdown-header">
                    <strong>{user.full_name}</strong>
                    <span>{user.email}</span>
                    <span className="tstu-role-chip">{user.role}</span>
                  </div>
                  <div className="tstu-dropdown-section">
                    <Link to={elibraryPath} onClick={() => setMenuOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      {roleWorkspaceLabel}
                    </Link>
                    <Link to={`/${locale}/profile`} onClick={() => setMenuOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Profil sozlamalari
                    </Link>
                    <Link to={`/${locale}/loans`} onClick={() => setMenuOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      Mening kitoblarim
                    </Link>
                    <Link to={`/${locale}/reservations`} onClick={() => setMenuOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Bron qilingan kitoblar
                    </Link>
                    <Link to={`/${locale}/library/reading-room`} onClick={() => setMenuOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                      O'quv zali bronlari
                    </Link>
                    <Link to={`/${locale}/profile/face-id`} onClick={() => setMenuOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 9H4V4h5v5zm6 0h5V4h-5v5zM9 15H4v5h5v-5zm6 0h5v5h-5v-5z"/></svg>
                      Face ID
                    </Link>
                  </div>
                  <button type="button" className="tstu-logout-btn" onClick={logout}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-actions tstu-auth">
              <Link to={`/${locale}/login`} className="ghost-button tstu-login-btn">Kirish</Link>
              <Link to={`/${locale}/register`} className="primary-button small tstu-register-btn">Ro'yxatdan o'tish</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
