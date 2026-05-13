import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import type { Loan, Reservation, Resource, Role } from "../../types";
import { resources as fallbackResources } from "../../data/mock";
import { AILibrarianPanel } from "../ai/AILibrarianPanel";
import { EmptyState } from "../common/EmptyState";
import { StatCard } from "../common/StatCard";

export function DashboardPage() {
  const { dashboardRole, locale = "uz" } = useParams();
  const { user, accessToken } = useAuth();
  const role = (dashboardRole as Role | undefined) ?? user?.role ?? "student";
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources] = useState<Resource[]>(fallbackResources);
  const [report, setReport] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!accessToken) return;
    api.myLoans(accessToken).then(setLoans).catch(() => undefined);
    api.myReservations(accessToken).then(setReservations).catch(() => undefined);
    api.departmentResources(user?.department_id ?? undefined).then(setResources).catch(() => undefined);
    api.reportsLibrary(accessToken).then((response) => setReport(response.data)).catch(() => undefined);
  }, [accessToken, user?.department_id]);

  const cards = useMemo(() => {
    if (role === "student") {
      return [
        { label: "Mening kitoblarim", value: String(loans.length), helper: "Due date va overdue bilan" },
        { label: "Band qilingan kitoblar", value: String(reservations.length), helper: "QR confirmation tayyor" },
        { label: "O'quv zali bronlari", value: String(report.seat_reservations ?? 0), helper: "Upcoming bookings" },
        { label: "Face ID status", value: user?.face_id_enabled ? "Active" : "Optional", helper: "Profile orqali boshqariladi" }
      ];
    }
    if (role === "teacher") {
      return [
        { label: "Mening resurslarim", value: String(resources.length), helper: "Upload + status tracking" },
        { label: "Pending resources", value: String(resources.filter((item) => item.status === "pending_review").length), helper: "Approval kutmoqda" },
        { label: "Fanlarim", value: "6", helper: "Department syllabus bo'yicha" },
        { label: "Foydalanish statistikasi", value: "3.2k", helper: "Views + downloads" }
      ];
    }
    if (role === "department") {
      return [
        { label: "Jami resurslar", value: String(resources.length), helper: "Kafedra bo'yicha" },
        { label: "Approved", value: String(resources.filter((item) => item.status === "approved").length), helper: "Kutubxonada ko'rinadi" },
        { label: "Rejected", value: String(resources.filter((item) => item.status === "rejected").length), helper: "Revision talab qilinadi" },
        { label: "Eng faol o'qituvchi", value: "Aziza Yuldasheva", helper: "Laboratoriya resurslari bo'yicha" }
      ];
    }
    if (role === "librarian") {
      return [
        { label: "Bugungi bronlar", value: String(report.today_reservations ?? reservations.length), helper: "Approve/reject oqimi" },
        { label: "Due today", value: String(report.due_today ?? 0), helper: "Loan return panel" },
        { label: "Overdue", value: String(report.overdue ?? 0), helper: "Warning + fine" },
        { label: "Reading room occupancy", value: `${report.reading_room_occupancy ?? 61}%`, helper: "No-show monitoring" }
      ];
    }
    return [
      { label: "Users", value: String(report.users ?? 48), helper: "RBAC bilan" },
      { label: "Departments", value: String(report.departments ?? 6), helper: "Faculty structure" },
      { label: "Books", value: String(report.books ?? 34), helper: "Copies va shelves bilan" },
      { label: "AI logs", value: String(report.ai_queries ?? 342), helper: "Semantic search so'rovlari" }
    ];
  }, [loans.length, reservations.length, report, resources, role, user?.face_id_enabled]);

  if (!user && !dashboardRole) {
    return <div className="page"><EmptyState title="Dashboard preview" description="Role-based dashboardlarni to'liq ko'rish uchun login qiling yoki URL'da role segmentidan foydalaning." /></div>;
  }

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">Role dashboard</p>
          <h1>{role} dashboard</h1>
          <p className="section-description">Student, teacher, department, librarian va admin rollari uchun premium operatsion panel.</p>
        </div>
        <Link to={`/${locale}/resources/upload`} className="primary-button small">Resurs yuklash</Link>
      </div>
      <div className="stats-grid">
        {cards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} helper={card.helper} />
        ))}
      </div>
      <div className="triple-grid">
        <div className="glass-panel">
          <h3>Operational checklist</h3>
          <ul className="feature-list">
            <li>Header avatar dropdown active</li>
            <li>`/profile` va subroutes ishlaydi</li>
            <li>Reservation / loan / reading room workflow ko'rinadi</li>
            <li>Audit log va reports endpointlari tayyor</li>
          </ul>
        </div>
        <div className="glass-panel">
          <h3>Role quick links</h3>
          <div className="resource-actions">
            <Link to={`/${locale}/catalog`} className="ghost-button">Catalog</Link>
            <Link to={`/${locale}/reservations`} className="ghost-button">Reservations</Link>
            <Link to={`/${locale}/loans`} className="ghost-button">Loans</Link>
            <Link to={`/${locale}/library/reading-room`} className="ghost-button">Reading room</Link>
          </div>
        </div>
        <div className="glass-panel">
          <h3>Approval summary</h3>
          <p>{resources.filter((item) => item.status === "pending_review").length} ta pending_review resurs bor.</p>
          <p>{resources.filter((item) => item.status === "approved").length} ta approved material katalogda ko'rinadi.</p>
        </div>
      </div>
      <AILibrarianPanel compact />
    </div>
  );
}
