import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { departments, resources as fallbackResources } from "../../data/mock";
import { api } from "../../lib/api";
import type { Resource } from "../../types";
import { SectionHeading } from "../common/SectionHeading";
import { AILibrarianPanel } from "../ai/AILibrarianPanel";
import { Badge } from "../common/Badge";

export function DepartmentLibraryPage() {
  const { departmentSlug = "" } = useParams();
  const department = departments.find((item) => item.slug === departmentSlug) ?? departments[0];
  const [resources, setResources] = useState<Resource[]>(fallbackResources.filter((resource) => resource.department_id === department.id));
  const [materialFilter, setMaterialFilter] = useState("all");

  useEffect(() => {
    api.departmentResources(department.id).then(setResources).catch(() => undefined);
  }, [department.id]);

  const filteredResources = useMemo(() => resources.filter((resource) => (
    materialFilter === "all" || resource.material_type === materialFilter
  )), [materialFilter, resources]);

  return (
    <div className="page">
      <SectionHeading
        eyebrow="Department e-library"
        title={`${department.name} elektron kutubxonasi`}
        description="Darsliklar, ma’ruza matnlari, laboratoriya ishlari, video darslar, testlar, ilmiy maqolalar va AI kafedra yordamchisi."
      />
      <div className="filter-row">
        <label>
          Material turi
          <select value={materialFilter} onChange={(event) => setMaterialFilter(event.target.value)}>
            <option value="all">Barcha turlar</option>
            {[...new Set(resources.map((item) => item.material_type))].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="stats-grid compact">
        <article className="stat-card stat-blue"><p>Resurslar</p><strong>{department.resources_count}</strong></article>
        <article className="stat-card stat-gold"><p>Fanlar</p><strong>{department.subjects_count}</strong></article>
        <article className="stat-card stat-teal"><p>O‘qituvchilar</p><strong>{department.teachers_count}</strong></article>
        <article className="stat-card stat-emerald"><p>Yuklab olishlar</p><strong>{department.downloads_count}</strong></article>
      </div>
      <div className="preview-grid">
        {filteredResources.map((resource) => (
          <article key={resource.id} className="preview-card">
            <div className="preview-topline">
              <Badge label={resource.material_type} tone="warning" />
              <span>{resource.course}-kurs / {resource.semester}-semestr</span>
            </div>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <div className="resource-meta">
              <span>{resource.author_name}</span>
              <span>{resource.language}</span>
              <span>{resource.format}</span>
            </div>
          </article>
        ))}
      </div>
      <AILibrarianPanel compact />
    </div>
  );
}

