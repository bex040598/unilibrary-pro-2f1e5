import { Outlet, useLocation, useParams } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { Locale } from "../../types";

export function AppShell({ children }: { children?: React.ReactNode }) {
  const { locale } = useParams();
  const location = useLocation();

  return (
    <div className="app-shell">
      <div className="ornament-grid" aria-hidden="true" />
      <Header locale={(locale as Locale) ?? "uz"} currentPath={location.pathname} />
      <main>{children ?? <Outlet />}</main>
      <Footer locale={(locale as Locale) ?? "uz"} />
    </div>
  );
}

