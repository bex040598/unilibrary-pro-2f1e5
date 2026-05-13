import { Link, useParams } from "react-router-dom";
import { departments, resources } from "../../data/mock";
import { SectionHeading } from "../common/SectionHeading";
import { Badge } from "../common/Badge";

export function DepartmentPage() {
  const { locale = "uz", departmentSlug = "" } = useParams();
  const department = departments.find((item) => item.slug === departmentSlug) ?? departments[0];
  const departmentResources = resources.filter((resource) => resource.department_id === department.id);

  return (
    <div className="page department-page">
      <div className="breadcrumbs">
        <span>Bosh sahifa</span>
        <span>→</span>
        <span>Tuzilma</span>
        <span>→</span>
        <span>Kafedralar</span>
        <span>→</span>
        <span>{department.name}</span>
      </div>
      <div className="department-layout">
        <aside className="side-panel">
          <nav className="profile-nav">
            <span>Kafedra haqida</span>
            <span>Tarkib</span>
            <span>O‘quv jarayoni</span>
            <span>Fanlar</span>
            <Link to={`/${locale}/kafedralar/${department.slug}/elektron-kutubxona`}>Elektron kutubxona</Link>
            <span>Video darslar</span>
            <span>Ilmiy maqolalar</span>
            <span>Foydali havolalar</span>
            <span>Bog‘lanish</span>
          </nav>
        </aside>
        <section className="content-panel">
          <SectionHeading eyebrow="Department" title={department.name} description={department.summary} />
          <div className="glass-panel">
            <h3>Kafedra mudiri</h3>
            <p>{department.head_name}</p>
            <div className="resource-meta">
              <span>{department.subjects_count} fan</span>
              <span>{department.teachers_count} o‘qituvchi</span>
              <span>{department.resources_count} elektron resurs</span>
            </div>
          </div>
          <div className="preview-grid">
            {departmentResources.map((resource) => (
              <article key={resource.id} className="preview-card">
                <div className="preview-topline">
                  <Badge label={resource.material_type} tone="info" />
                  <span>{resource.format}</span>
                </div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

