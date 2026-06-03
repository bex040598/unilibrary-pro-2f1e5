import { Link } from "react-router-dom";
import type { Locale } from "../../types";

export function Footer({ locale }: { locale: Locale }) {
  const runtimeConfig = (globalThis as {
    __ATMU_RUNTIME_CONFIG__?: {
      apiBaseUrl?: string;
    };
  }).__ATMU_RUNTIME_CONFIG__;

  const docsBaseUrl =
    runtimeConfig?.apiBaseUrl ??
    import.meta.env.VITE_API_BASE_URL ??
    (typeof window !== "undefined" && window.location.hostname !== "127.0.0.1" && window.location.hostname !== "localhost"
      ? `${window.location.origin}/api`
      : "http://127.0.0.1:8000");

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h3>ATMU Smart UniLibrary</h3>
          <p>
            Axborot texnologiyalari va menejment universiteti uchun kafedralar kesimida ishlaydigan
            premium elektron kutubxona, o'quv zali va AI tavsiya platformasi.
          </p>
        </div>
        <div>
          <h4>Platforma</h4>
          <Link to={`/${locale}/catalog`}>Elektron katalog</Link>
          <Link to={`/${locale}/kafedralar`}>Kafedra kutubxonalari</Link>
          <Link to={`/${locale}/library/reading-room`}>O'quv zali</Link>
        </div>
        <div>
          <h4>Foydalanuvchi</h4>
          <Link to={`/${locale}/register`}>Ro'yxatdan o'tish</Link>
          <Link to={`/${locale}/profile`}>Shaxsiy kabinet</Link>
          <Link to={`/${locale}/dashboard`}>Dashboard</Link>
        </div>
        <div>
          <h4>Integratsiyalar</h4>
          <a href={`${docsBaseUrl}/docs`} target="_blank" rel="noreferrer">
            Swagger /docs
          </a>
          <span>Face ID secure capture</span>
          <span>AI source cards</span>
        </div>
      </div>
      <p className="footer-note">(c) 2026 ATMU Smart UniLibrary. Premium academic portal module.</p>
    </footer>
  );
}
