import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { useI18n } from "../../lib/i18n";
import type { Locale } from "../../types";

export function Header({ locale }: { locale: Locale; currentPath: string }) {
  const { user, logout } = useAuth();
  const { t, locales, setLocale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = useMemo(() => ([
    { to: `/${locale}`, label: t("nav.home") },
    { to: `/${locale}/catalog`, label: t("common.catalog") },
    { to: `/${locale}/kafedralar`, label: t("common.departments") },
    { to: `/${locale}/library/reading-room`, label: t("common.readingRoom") },
    { to: `/${locale}/dashboard`, label: t("common.dashboard") }
  ]), [locale, t]);

  return (
    <header className="site-header">
      <div className="top-strip">
        <span>ATMU internal academic portal</span>
        <span>Face ID + AI + Department Libraries</span>
      </div>
      <div className="header-main">
        <Link to={`/${locale}`} className="brand-mark">
          <div className="brand-seal">ATMU</div>
          <div>
            <strong>Axborot texnologiyalari va menejment universiteti</strong>
            <span>{t("common.appName")}</span>
          </div>
        </Link>
        <nav className="header-nav">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <div className="locale-switcher">
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
              <button type="button" className="avatar-trigger" onClick={() => setMenuOpen((value) => !value)}>
                <span>{user.full_name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
              </button>
              {menuOpen ? (
                <div className="dropdown-panel">
                  <p>{user.full_name}</p>
                  <span>{user.email}</span>
                  <Link to={`/${locale}/profile`}>{t("common.profile")}</Link>
                  <Link to={`/${locale}/dashboard/${user.role}`}>{t("common.dashboard")}</Link>
                  <Link to={`/${locale}/loans`}>Mening kitoblarim</Link>
                  <Link to={`/${locale}/reservations`}>Band qilingan kitoblar</Link>
                  <Link to={`/${locale}/profile/reading-room`}>O'quv zali bronlari</Link>
                  <Link to={`/${locale}/profile/face-id`}>Face ID</Link>
                  <Link to={`/${locale}/profile/security`}>Xavfsizlik</Link>
                  <button type="button" onClick={logout}>{t("common.logout")}</button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="auth-actions">
              <Link to={`/${locale}/login`} className="ghost-button">{t("common.login")}</Link>
              <Link to={`/${locale}/register`} className="primary-button small">{t("common.register")}</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

