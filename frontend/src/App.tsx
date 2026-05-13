import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { HomePage } from "./components/home/HomePage";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { CatalogPage } from "./components/catalog/CatalogPage";
import { DepartmentsPage } from "./components/departments/DepartmentsPage";
import { DepartmentPage } from "./components/departments/DepartmentPage";
import { DepartmentLibraryPage } from "./components/department-library/DepartmentLibraryPage";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { ResourceUploadPage } from "./components/resources/ResourceUploadPage";
import { ReservationsPage } from "./components/reservations/ReservationsPage";
import { LoansPage } from "./components/loans/LoansPage";
import { ReadingRoomPage } from "./components/reading-room/ReadingRoomPage";
import type { Locale } from "./types";

function LocaleGuard() {
  const { locale } = useParams();
  const supported: Locale[] = ["uz", "ru", "en", "tr"];
  if (!locale || !supported.includes(locale as Locale)) {
    return <Navigate to="/uz" replace />;
  }
  return <AppShell><Outlet /></AppShell>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/uz" replace />} />
      <Route path="/:locale" element={<LocaleGuard />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:section" element={<ProfilePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="kafedralar" element={<DepartmentsPage />} />
        <Route path="kafedralar/:departmentSlug" element={<DepartmentPage />} />
        <Route path="kafedralar/:departmentSlug/elektron-kutubxona" element={<DepartmentLibraryPage />} />
        <Route path="library/reading-room" element={<ReadingRoomPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="dashboard/:dashboardRole" element={<DashboardPage />} />
        <Route path="dashboard/student/reading-room" element={<ReadingRoomPage />} />
        <Route path="dashboard/librarian/reading-room" element={<ReadingRoomPage />} />
        <Route path="resources/upload" element={<ResourceUploadPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="loans" element={<LoansPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/uz" replace />} />
    </Routes>
  );
}

