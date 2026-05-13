import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { canApprove, canUploadResources } from "../../lib/permissions";
import { departments as fallbackDepartments } from "../../data/mock";
import type { Resource } from "../../types";
import { EmptyState } from "../common/EmptyState";
import { Badge } from "../common/Badge";

export function ResourceUploadPage() {
  const { user, accessToken } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "Yangi ATMU resursi",
    description: "Kafedra elektron kutubxonasi uchun premium raqamli material.",
    author_name: user?.full_name ?? "Teacher",
    department_id: String(user?.department_id ?? 1),
    subject_name: "Ma’lumotlar bazasi",
    course: "2",
    semester: "4",
    material_type: "Ma’ruza matni",
    language: "uz",
    format: "PDF",
    academic_year: "2025/2026",
    visibility: "department",
    download_allowed: true,
    online_read_allowed: true
  });

  useEffect(() => {
    api.departmentResources(user?.department_id ?? 1).then(setResources).catch(() => undefined);
  }, [user?.department_id]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return;
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append("keywords", "atmu,library,resource");
    formData.append("tags", "lecture,premium");
    const resource = await api.createResource(accessToken, formData);
    setResources((current) => [resource, ...current]);
    setMessage("Resurs yaratildi va pending_review oqimiga tayyorlandi.");
  }

  async function workflowAction(id: number, action: "submit" | "approve" | "reject" | "revision") {
    if (!accessToken) return;
    if (action === "submit") await api.submitResource(accessToken, id);
    if (action === "approve") await api.approveResource(accessToken, id);
    if (action === "reject") await api.rejectResource(accessToken, id);
    if (action === "revision") await api.requestRevision(accessToken, id);
    const refreshed = await api.departmentResources(user?.department_id ?? 1);
    setResources(refreshed);
  }

  if (!user) {
    return <div className="page"><EmptyState title="Login talab qilinadi" description="Resurs yuklash va approval workflow uchun teacher, department yoki librarian akkaunti bilan kiring." /></div>;
  }

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">Resource upload workflow</p>
          <h1>Yangi resurs yuklash va approval panel</h1>
          <p className="section-description">Teacher upload qiladi, resurs `pending_review` ga tushadi, librarian yoki department approver tasdiqlaydi.</p>
        </div>
      </div>
      {message ? <p className="success-text">{message}</p> : null}
      {canUploadResources(user.role) ? (
        <form className="form-stack glass-panel" onSubmit={handleCreate}>
          <div className="grid-two">
            <label>Resurs nomi<input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></label>
            <label>Muallif<input value={form.author_name} onChange={(event) => setForm((current) => ({ ...current, author_name: event.target.value }))} /></label>
            <label>Kafedra
              <select value={form.department_id} onChange={(event) => setForm((current) => ({ ...current, department_id: event.target.value }))}>
                {fallbackDepartments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
              </select>
            </label>
            <label>Fan<input value={form.subject_name} onChange={(event) => setForm((current) => ({ ...current, subject_name: event.target.value }))} /></label>
            <label>Kurs<input value={form.course} onChange={(event) => setForm((current) => ({ ...current, course: event.target.value }))} /></label>
            <label>Semestr<input value={form.semester} onChange={(event) => setForm((current) => ({ ...current, semester: event.target.value }))} /></label>
            <label>Material turi<input value={form.material_type} onChange={(event) => setForm((current) => ({ ...current, material_type: event.target.value }))} /></label>
            <label>Til<input value={form.language} onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))} /></label>
            <label>Fayl formati<input value={form.format} onChange={(event) => setForm((current) => ({ ...current, format: event.target.value }))} /></label>
            <label>Akademik yil<input value={form.academic_year} onChange={(event) => setForm((current) => ({ ...current, academic_year: event.target.value }))} /></label>
          </div>
          <label>Tavsif<textarea rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></label>
          <div className="button-row">
            <button type="submit" className="primary-button">Yangi resurs yuklash</button>
          </div>
        </form>
      ) : null}

      <div className="table-wrap glass-panel">
        <table>
          <thead>
            <tr>
              <th>Nomi</th>
              <th>Muallif</th>
              <th>Status</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.title}</td>
                <td>{resource.author_name}</td>
                <td><Badge label={resource.status} tone={resource.status === "approved" ? "success" : "warning"} /></td>
                <td>
                  <div className="table-actions">
                    <button type="button" className="ghost-button" onClick={() => workflowAction(resource.id, "submit")}>Submit</button>
                    {canApprove(user.role) ? <button type="button" className="ghost-button" onClick={() => workflowAction(resource.id, "approve")}>Approve</button> : null}
                    {canApprove(user.role) ? <button type="button" className="ghost-button" onClick={() => workflowAction(resource.id, "reject")}>Reject</button> : null}
                    {canApprove(user.role) ? <button type="button" className="ghost-button" onClick={() => workflowAction(resource.id, "revision")}>Revision</button> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

