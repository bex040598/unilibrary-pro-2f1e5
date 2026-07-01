import { Link } from "react-router-dom";
import type { Locale } from "../../types";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="atmu-footer">
      {/* Fon rasmi overlay */}
      <div className="atmu-footer-bg" />

      <div className="atmu-footer-inner">
        {/* ── Chap: Logo + tavsif + ijtimoiy ── */}
        <div className="atmu-footer-brand">
          <h2 className="atmu-footer-title">ATMU Smart UniLibrary</h2>
          <div className="atmu-footer-logo-row">
            <div className="atmu-footer-logo-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <div>
                <strong>ATMU</strong>
                <span>Smart UniLibrary</span>
              </div>
            </div>
          </div>
          <p className="atmu-footer-desc">
            Talaba — bizning asosiy kuchimiz. Shu bois universitetimizda biror yangilik
            qilmoqchi bo'lsak, albatta, ular bilan fikrlashamiz kerak.
          </p>
          <div className="atmu-footer-socials">
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="atmu-social-btn" aria-label="Telegram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 1 0 24 12 12.013 12.013 0 0 0 11.944 0zm5.97 8.127l-2.027 9.545c-.15.703-.543.875-1.1.545l-3.036-2.234-1.463 1.408a.765.765 0 0 1-.612.3l.218-3.084 5.615-5.07c.244-.217-.053-.338-.378-.12l-6.942 4.37-2.99-.934c-.65-.203-.663-.65.136-.962l11.67-4.5c.54-.197 1.012.132.909.736z"/>
              </svg>
            </a>
            <a href="#" className="atmu-social-btn" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="atmu-social-btn" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── O'rta: Kontakt ── */}
        <div className="atmu-footer-contact">
          <a href="tel:+998900080498" className="atmu-footer-contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            +998 90-008-04-98
          </a>
          <a href="mailto:library@atmu.uz" className="atmu-footer-contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            library@atmu.uz
          </a>
          <div className="atmu-footer-contact-item atmu-footer-address">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Qashqadaryo viloyati, Qarshi shahri</span>
          </div>
          <a href="https://maps.app.goo.gl/DM7e8MkWe517TDBn8" target="_blank" rel="noopener noreferrer" className="atmu-footer-map-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            Manzilni olish
          </a>
        </div>

        {/* ── O'ng 1: Platforma ── */}
        <div className="atmu-footer-links">
          <h4 className="atmu-footer-links-title">Platforma</h4>
          <Link to={`/${locale}`}>Bosh sahifa</Link>
          <Link to={`/${locale}/catalog`}>Elektron katalog</Link>
          <Link to={`/${locale}/kafedralar`}>Kafedra kutubxonalari</Link>
          <Link to={`/${locale}/library/reading-room`}>O'quv zali</Link>
          <Link to={`/${locale}/elibrary`}>E-Library portal</Link>
          <Link to={`/${locale}/dashboard`}>Boshqaruv paneli</Link>
        </div>

        {/* ── O'ng 2: Havolalar ── */}
        <div className="atmu-footer-links">
          <h4 className="atmu-footer-links-title">Havolalar</h4>
          <a href="https://hemis.edu.uz" target="_blank" rel="noopener noreferrer">Hemis Xodim</a>
          <a href="https://hemis.edu.uz" target="_blank" rel="noopener noreferrer">Hemis Talaba</a>
          <a href="https://moodle.org" target="_blank" rel="noopener noreferrer">Moodle</a>
          <Link to={`/${locale}/register`}>Ro'yxatdan o'tish</Link>
          <Link to={`/${locale}/profile`}>Shaxsiy kabinet</Link>
          <Link to={`/${locale}/elibrary/student`}>Talaba E-Library</Link>
        </div>
      </div>

      {/* ── Pastki chiziq ── */}
      <div className="atmu-footer-bottom">
        <div className="atmu-footer-bottom-inner">
          <span>© 2026 ATMU Smart UniLibrary. Barcha huquqlar himoyalangan.</span>
          <div className="atmu-footer-bottom-links">
            <Link to={`/${locale}`}>Maxfiylik siyosati</Link>
            <Link to={`/${locale}`}>Foydalanish shartlari</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
