import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { useI18n } from "../../lib/i18n";
import type { Locale } from "../../types";
import { AtmuLogo } from "../common/AtmuLogo";

export function Header({ locale }: { locale: Locale; currentPath: string }) {
  const { user, logout } = useAuth();
  const { locales, setLocale } = useI18n();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const elibraryPath = user ? `/${locale}/elibrary/${user.role}` : `/${locale}/elibrary`;

  function handleLogout() {
    logout();
    setDropOpen(false);
    navigate(`/${locale}`);
  }

  const dashboardPath = user ? `/${locale}/dashboard/${user.role}` : null;

  const navLinks = [
    { to: `/${locale}`, label: "Bosh sahifa" },
    { to: `/${locale}/catalog`, label: "Elektron katalog" },
    { to: `/${locale}/elibrary`, label: "E-Library" },
    { to: `/${locale}/kafedralar`, label: "Kafedralar" },
    { to: `/${locale}/library/reading-room`, label: "O'quv zali" },
    ...(dashboardPath ? [{ to: dashboardPath, label: "Boshqaruv" }] : []),
  ];

  const isActive = (to: string) =>
    to === `/${locale}` || to === `/${locale}/`
      ? location.pathname === `/${locale}` || location.pathname === `/${locale}/`
      : location.pathname.startsWith(to);

  return (
    <header className="bod-header">
      {/* ── Utility bar ── */}
      <div className="bod-utility">
        <div className="bod-utility-inner">
          <div className="bod-utility-left">
            <span className="bod-university-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/></svg>
              Axborot Texnologiyalari va Menejment Universiteti
            </span>
          </div>
          <div className="bod-utility-right">
            <Link to={`/${locale}/elibrary/student`} className="bod-util-link">Talaba</Link>
            <Link to={`/${locale}/elibrary/teacher`} className="bod-util-link">O'qituvchi</Link>
            <Link to={`/${locale}/elibrary/librarian`} className="bod-util-link">Kutubxonachi</Link>
            <span className="bod-util-sep"/>
            <div className="bod-lang-group">
              {locales.map((lang) => (
                <button key={lang} type="button"
                  className={lang === locale ? "bod-lang bod-lang-on" : "bod-lang"}
                  onClick={() => setLocale(lang)}>
                  {lang === "uz" ? "UZ" : lang.toUpperCase()}
                </button>
              ))}
            </div>
            {user ? (
              <button type="button" className="bod-util-user" onClick={() => setDropOpen(v => !v)}>
                <div className="bod-util-avatar">
                  {user.full_name.split(" ").map(p => p[0]).join("").slice(0, 2)}
                </div>
                <span>{user.full_name.split(" ")[0]}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            ) : (
              <Link to={`/${locale}/login`} className="bod-util-login">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Kirish
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <div className="bod-navbar">
        <div className="bod-navbar-inner">
          <Link to={`/${locale}`} className="bod-brand">
            <AtmuLogo size={48} />
            <div className="bod-brand-text">
              <strong>ATMU</strong>
              <span>Smart UniLibrary</span>
            </div>
          </Link>

          <nav className="bod-nav" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={isActive(link.to) ? "bod-navlink bod-navlink-active" : "bod-navlink"}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="bod-navbar-actions">
            <button type="button" className="bod-search-btn" aria-label="Qidiruv">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button type="button" className="bod-mobile-btn" aria-label="Menu" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="bod-mobile-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="bod-mobile-link" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── User dropdown ── */}
      {dropOpen && user && (
        <>
          <div className="bod-drop-backdrop" onClick={() => setDropOpen(false)}/>
          <div className="bod-dropdown">
            <div className="bod-drop-head">
              <div className="bod-drop-avatar">
                {user.full_name.split(" ").map(p => p[0]).join("").slice(0, 2)}
              </div>
              <div>
                <strong>{user.full_name}</strong>
                <span>{user.email}</span>
                <em className={`bod-role-tag bod-role-${user.role}`}>{user.role}</em>
              </div>
            </div>
            <nav className="bod-drop-nav">
              <Link to={elibraryPath} onClick={() => setDropOpen(false)} className="bod-drop-link bod-drop-featured">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                E-Library profilim
              </Link>
              <Link to={`/${locale}/profile`} onClick={() => setDropOpen(false)} className="bod-drop-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Shaxsiy ma'lumotlar
              </Link>
              {dashboardPath && (
                <Link to={dashboardPath} onClick={() => setDropOpen(false)} className="bod-drop-link">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Boshqaruv paneli
                </Link>
              )}
              <Link to={`/${locale}/loans`} onClick={() => setDropOpen(false)} className="bod-drop-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Mening kitoblarim
              </Link>
              <Link to={`/${locale}/reservations`} onClick={() => setDropOpen(false)} className="bod-drop-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Bron qilingan kitoblar
              </Link>
              <Link to={`/${locale}/library/reading-room`} onClick={() => setDropOpen(false)} className="bod-drop-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                O'quv zali bronlari
              </Link>
            </nav>
            <div className="bod-drop-footer">
              <button type="button" className="bod-drop-logout" onClick={handleLogout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Tizimdan chiqish
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
