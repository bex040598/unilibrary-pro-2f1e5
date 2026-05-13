import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { departments as fallbackDepartments, faculties } from "../../data/mock";
import { api } from "../../lib/api";
import type { Department } from "../../types";
import { Badge } from "../common/Badge";
import { SectionHeading } from "../common/SectionHeading";

export function DepartmentsPage() {
  const { locale = "uz" } = useParams();
  const [departments, setDepartments] = useState<Department[]>(fallbackDepartments);
  const [facultyFilter, setFacultyFilter] = useState("all");

  useEffect(() => {
    api.departments().then(setDepartments).catch(() => undefined);
  }, []);

  const filtered = useMemo(() => departments.filter((department) => (
    facultyFilter === "all" || String(department.faculty_id) === facultyFilter
  )), [departments, facultyFilter]);

  return (
    <div className="page">
      <SectionHeading
        eyebrow="Departments"
        title="ATMU kafedralari va ularning elektron kutubxonalari"
        description="Har bir kafedra cardida fanlar, o‘qituvchilar, resurslar, yuklab olishlar va faol yo‘nalish ko‘rsatkichlari mavjud."
      />
      <div className="filter-row">
        <label>
          Fakultet
          <select value={facultyFilter} onChange={(event) => setFacultyFilter(event.target.value)}>
            <option value="all">Barcha fakultetlar</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="department-grid">
        {filtered.map((department) => (
          <article key={department.id} className="department-card">
            <div className="department-card-head">
              <div className="department-icon">{department.name.slice(0, 2)}</div>
              {department.has_new_materials ? <Badge label="Yangi" tone="success" /> : null}
            </div>
            <h3>{department.name}</h3>
            <p>{department.summary}</p>
            <div className="department-metrics">
              <span>{department.resources_count} resurs</span>
              <span>{department.subjects_count} fan</span>
              <span>{department.teachers_count} o‘qituvchi</span>
              <span>{department.active_subject}</span>
            </div>
            <div className="resource-actions">
              <Link className="ghost-button" to={`/${locale}/kafedralar/${department.slug}`}>Kafedra sahifasi</Link>
              <Link className="primary-button small" to={`/${locale}/kafedralar/${department.slug}/elektron-kutubxona`}>Elektron kutubxona</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

