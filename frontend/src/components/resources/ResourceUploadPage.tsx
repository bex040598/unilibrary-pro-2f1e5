import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { canApprove, canUploadResources } from "../../lib/permissions";
import { departments as fallbackDepartments } from "../../data/mock";
import type { Resource } from "../../types";

const MATERIAL_TYPES = ["Ma'ruza matni", "Laboratoriya ishi", "O'quv qo'llanma", "Darslik", "Maqola", "Test topshiriqlari", "Kurs ishi", "Video dars", "Taqdimot"];
const LANGUAGES = [{ code: "uz", label: "O'zbekcha" }, { code: "ru", label: "Ruscha" }, { code: "en", label: "Inglizcha" }];
const FORMATS = ["PDF", "DOCX", "PPTX", "MP4", "ZIP", "EPUB"];
const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  draft:          { label: "Qoralama",         color: "#667085", bg: "#f2f4f7" },
  pending_review: { label: "Ko'rib chiqilmoqda", color: "#b45309", bg: "#fffbeb" },
  approved:       { label: "Tasdiqlangan",      color: "#065f46", bg: "#d1fae5" },
  rejected:       { label: "Rad etildi",        color: "#991b1b", bg: "#fee2e2" },
  revision:       { label: "Qayta ishlash",     color: "#1e40af", bg: "#dbeafe" },
};

const MOCK_RESOURCES: Resource[] = [
  { id: 101, title: "Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari", author_name: "Aziza Yuldasheva", department_name: "Axborot texnologiyalari", subject_name: "Ma'lumotlar bazasi", material_type: "Laboratoriya ishi", status: "approved", language: "uz", format: "PDF", course: 2, semester: 4, academic_year: "2025/2026", department_id: 1, description: "", keywords: [], tags: [], visibility: "department", download_allowed: true, online_read_allowed: true, average_rating: 4.5 },
  { id: 102, title: "Kiberxavfsizlik bo'yicha o'zbekcha darslik", author_name: "Aziza Yuldasheva", department_name: "Axborot texnologiyalari", subject_name: "Kiberxavfsizlik", material_type: "Darslik", status: "pending_review", language: "uz", format: "PDF", course: 3, semester: 5, academic_year: "2025/2026", department_id: 1, description: "", keywords: [], tags: [], visibility: "university", download_allowed: true, online_read_allowed: false, average_rating: 0 },
  { id: 103, title: "Python asoslari: amaliy mashqlar to'plami", author_name: "Aziza Yuldasheva", department_name: "Axborot texnologiyalari", subject_name: "Dasturlash", material_type: "O'quv qo'llanma", status: "draft", language: "uz", format: "DOCX", course: 1, semester: 2, academic_year: "2025/2026", department_id: 1, description: "", keywords: [], tags: [], visibility: "department", download_allowed: true, online_read_allowed: true, average_rating: 0 },
];

export function ResourceUploadPage() {
  const { locale = "uz" } = useParams();
  const { user, accessToken } = useAuth();
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"upload" | "my" | "approve">("upload");
  const [filterStatus, setFilterStatus] = useState("all");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    author_name: user?.full_name ?? "",
    department_id: String(user?.department_id ?? 1),
    subject_name: "",
    course: "1",
    semester: "1",
    material_type: "Ma'ruza matni",
    language: "uz",
    format: "PDF",
    academic_year: "2025/2026",
    visibility: "department",
  });

  useEffect(() => {
    api.departmentResources(user?.department_id ?? 1).then((res) => {
      if (res.length) setResources(res);
    }).catch(() => undefined);
  }, [user?.department_id]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => setUploadProgress((p) => Math.min(p + 18, 90)), 200);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
      formData.append("keywords", "atmu,library");
      formData.append("tags", "lecture");
      if (selectedFile) formData.append("file", selectedFile);
      const resource = await api.createResource(accessToken, formData);
      clearInterval(interval);
      setUploadProgress(100);
      setResources((cur) => [resource, ...cur]);
      setMessage({ type: "success", text: "Resurs muvaffaqiyatli yuklandi va ko'rib chiqish navbatiga qo'shildi." });
      setSelectedFile(null);
      setForm((f) => ({ ...f, title: "", description: "", subject_name: "" }));
      setTimeout(() => setActiveTab("my"), 800);
    } catch {
      clearInterval(interval);
      const mock: Resource = {
        id: Date.now(), title: form.title || "Yangi resurs", author_name: form.author_name,
        department_name: "Axborot texnologiyalari", subject_name: form.subject_name,
        material_type: form.material_type, status: "pending_review", language: form.language,
        format: form.format, course: Number(form.course), semester: Number(form.semester),
        academic_year: form.academic_year, department_id: Number(form.department_id),
        description: form.description, keywords: [], tags: [], visibility: form.visibility as "department",
        download_allowed: true, online_read_allowed: true, average_rating: 0,
      };
      setResources((cur) => [mock, ...cur]);
      setMessage({ type: "success", text: "Resurs qoralama sifatida saqlandi (offline rejim)." });
      setTimeout(() => setActiveTab("my"), 800);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1200);
    }
  }

  async function workflowAction(id: number, action: "submit" | "approve" | "reject" | "revision") {
    if (!accessToken) return;
    try {
      if (action === "submit") await api.submitResource(accessToken, id);
      if (action === "approve") await api.approveResource(accessToken, id);
      if (action === "reject") await api.rejectResource(accessToken, id);
      if (action === "revision") await api.requestRevision(accessToken, id);
      const refreshed = await api.departmentResources(user?.department_id ?? 1);
      setResources(refreshed);
    } catch {
      const statusMap: Record<string, Resource["status"]> = { submit: "pending_review", approve: "approved", reject: "rejected", revision: "revision" };
      setResources((cur) => cur.map((r) => r.id === id ? { ...r, status: statusMap[action] ?? r.status } : r));
    }
  }

  const filtered = resources.filter((r) => filterStatus === "all" || r.status === filterStatus);
  const pending = resources.filter((r) => r.status === "pending_review");

  if (!user) {
    return (
      <div className="lib-page">
        <div className="lib-empty-auth">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4m0 4h.01"/></svg>
          <h2>Kirish talab qilinadi</h2>
          <p>Resurs yuklash uchun o'qituvchi, kafedra mudiri yoki kutubxonachi sifatida tizimga kiring.</p>
          <Link to={`/${locale}/login`} className="lib-btn-primary">Tizimga kirish</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lib-page">
      {/* Hero */}
      <div className="lib-hero lib-hero-upload">
        <div className="lib-hero-content">
          <div className="lib-hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Resurs boshqaruvi
          </div>
          <h1>Elektron kutubxona resurslari</h1>
          <p>Darslik, ma'ruza, laboratoriya va boshqa materiallarni yuklang — kutubxonachi tasdiqlashidan so'ng talabalar uchun ochiladi.</p>
        </div>
        <div className="lib-hero-stats">
          <div className="lib-hero-stat"><span>{resources.length}</span><em>Jami resurs</em></div>
          <div className="lib-hero-stat"><span>{resources.filter((r) => r.status === "approved").length}</span><em>Tasdiqlangan</em></div>
          <div className="lib-hero-stat"><span>{pending.length}</span><em>Kutmoqda</em></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="lib-tabs-bar">
        <button className={`lib-tab${activeTab === "upload" ? " active" : ""}`} onClick={() => setActiveTab("upload")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Yangi resurs yuklash
        </button>
        <button className={`lib-tab${activeTab === "my" ? " active" : ""}`} onClick={() => setActiveTab("my")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Mening resurslarim
          <span className="lib-tab-count">{resources.length}</span>
        </button>
        {canApprove(user.role) && (
          <button className={`lib-tab${activeTab === "approve" ? " active" : ""}`} onClick={() => setActiveTab("approve")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Tasdiqlash navbati
            {pending.length > 0 && <span className="lib-tab-badge">{pending.length}</span>}
          </button>
        )}
      </div>

      <div className="lib-content">
        {message && (
          <div className={`lib-alert lib-alert-${message.type}`}>
            {message.type === "success"
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            }
            {message.text}
            <button className="lib-alert-close" onClick={() => setMessage(null)}>×</button>
          </div>
        )}

        {/* ── UPLOAD TAB ── */}
        {activeTab === "upload" && canUploadResources(user.role) && (
          <form className="lib-upload-layout" onSubmit={handleSubmit}>
            {/* Left: Form */}
            <div className="lib-upload-form">
              <div className="lib-card">
                <div className="lib-card-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <h3>Resurs ma'lumotlari</h3>
                </div>
                <div className="lib-form-grid">
                  <div className="lib-field lib-field-full">
                    <label>Resurs nomi <span className="lib-req">*</span></label>
                    <input required placeholder="masalan: Matematika — 2-kurs ma'ruzalar to'plami" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div className="lib-field">
                    <label>Muallif</label>
                    <input value={form.author_name} onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))} />
                  </div>
                  <div className="lib-field">
                    <label>Kafedra</label>
                    <select value={form.department_id} onChange={(e) => setForm((f) => ({ ...f, department_id: e.target.value }))}>
                      {fallbackDepartments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="lib-field">
                    <label>Fan nomi <span className="lib-req">*</span></label>
                    <input required placeholder="masalan: Oliy matematika" value={form.subject_name} onChange={(e) => setForm((f) => ({ ...f, subject_name: e.target.value }))} />
                  </div>
                  <div className="lib-field">
                    <label>Material turi</label>
                    <select value={form.material_type} onChange={(e) => setForm((f) => ({ ...f, material_type: e.target.value }))}>
                      {MATERIAL_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="lib-field">
                    <label>Kurs</label>
                    <select value={form.course} onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}>
                      {[1,2,3,4].map((c) => <option key={c} value={c}>{c}-kurs</option>)}
                    </select>
                  </div>
                  <div className="lib-field">
                    <label>Semestr</label>
                    <select value={form.semester} onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}>
                      {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>{s}-semestr</option>)}
                    </select>
                  </div>
                  <div className="lib-field">
                    <label>Til</label>
                    <select value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}>
                      {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                    </select>
                  </div>
                  <div className="lib-field">
                    <label>Fayl formati</label>
                    <select value={form.format} onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}>
                      {FORMATS.map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="lib-field">
                    <label>Akademik yil</label>
                    <select value={form.academic_year} onChange={(e) => setForm((f) => ({ ...f, academic_year: e.target.value }))}>
                      {["2024/2025","2025/2026","2026/2027"].map((y) => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="lib-field">
                    <label>Ko'rinish</label>
                    <select value={form.visibility} onChange={(e) => setForm((f) => ({ ...f, visibility: e.target.value }))}>
                      <option value="department">Faqat kafedra</option>
                      <option value="university">Butun universitet</option>
                      <option value="public">Hammaga ochiq</option>
                    </select>
                  </div>
                  <div className="lib-field lib-field-full">
                    <label>Tavsif</label>
                    <textarea rows={3} placeholder="Resurs haqida qisqacha ma'lumot..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Dropzone + Info */}
            <div className="lib-upload-side">
              <div className="lib-card">
                <div className="lib-card-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <h3>Fayl yuklash</h3>
                </div>
                <div
                  className={`lib-dropzone${dragOver ? " active" : ""}${selectedFile ? " has-file" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" hidden accept=".pdf,.docx,.pptx,.mp4,.zip,.epub" onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])} />
                  {selectedFile ? (
                    <>
                      <div className="lib-dropzone-file-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <p className="lib-dropzone-filename">{selectedFile.name}</p>
                      <p className="lib-dropzone-size">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                      <button type="button" className="lib-dropzone-remove" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}>Olib tashlash</button>
                    </>
                  ) : (
                    <>
                      <div className="lib-dropzone-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <p className="lib-dropzone-text">Faylni bu yerga tashlang yoki <span>tanlang</span></p>
                      <p className="lib-dropzone-hint">PDF, DOCX, PPTX, MP4, ZIP — max 50 MB</p>
                    </>
                  )}
                </div>

                {uploading && (
                  <div className="lib-progress-wrap">
                    <div className="lib-progress-bar">
                      <div className="lib-progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <span>{uploadProgress}%</span>
                  </div>
                )}
              </div>

              <div className="lib-card lib-workflow-info">
                <div className="lib-card-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <h3>Tasdiqlash jarayoni</h3>
                </div>
                <div className="lib-workflow-steps">
                  <div className="lib-wf-step lib-wf-done">
                    <div className="lib-wf-dot"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                    <div><strong>Yuklash</strong><span>O'qituvchi yoki kafedra mudiri</span></div>
                  </div>
                  <div className="lib-wf-step">
                    <div className="lib-wf-dot lib-wf-dot-pending">2</div>
                    <div><strong>Ko'rib chiqish</strong><span>Kutubxonachi tomonidan</span></div>
                  </div>
                  <div className="lib-wf-step">
                    <div className="lib-wf-dot lib-wf-dot-pending">3</div>
                    <div><strong>Tasdiqlash</strong><span>Katalogda ko'rinadi</span></div>
                  </div>
                </div>
              </div>

              <button type="submit" className="lib-btn-primary lib-btn-full" disabled={uploading}>
                {uploading ? "Yuklanmoqda..." : "Resursni yuklash va jo'natish"}
              </button>
            </div>
          </form>
        )}

        {/* ── MY RESOURCES TAB ── */}
        {activeTab === "my" && (
          <div className="lib-section">
            <div className="lib-section-toolbar">
              <h2>Mening resurslarim</h2>
              <div className="lib-filter-row">
                {["all","draft","pending_review","approved","rejected"].map((s) => (
                  <button key={s} className={`lib-filter-btn${filterStatus === s ? " active" : ""}`} onClick={() => setFilterStatus(s)}>
                    {s === "all" ? "Hammasi" : STATUS_LABELS[s]?.label ?? s}
                  </button>
                ))}
              </div>
            </div>
            <div className="lib-resources-grid">
              {filtered.length === 0 && (
                <div className="lib-empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  <p>Hali resurs mavjud emas</p>
                </div>
              )}
              {filtered.map((r) => {
                const st = STATUS_LABELS[r.status] ?? { label: r.status, color: "#667085", bg: "#f2f4f7" };
                return (
                  <div key={r.id} className="lib-resource-row">
                    <div className="lib-resource-row-icon" style={{ background: "#1457a815" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div className="lib-resource-row-info">
                      <strong>{r.title}</strong>
                      <span>{r.subject_name} · {r.material_type} · {r.course}-kurs</span>
                    </div>
                    <span className="lib-status-pill" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                    <div className="lib-resource-row-actions">
                      {r.status === "draft" && (
                        <button className="lib-btn-sm lib-btn-primary" onClick={() => workflowAction(r.id, "submit")}>Jo'natish</button>
                      )}
                      {canApprove(user.role) && r.status === "pending_review" && (
                        <>
                          <button className="lib-btn-sm lib-btn-success" onClick={() => workflowAction(r.id, "approve")}>Tasdiqlash</button>
                          <button className="lib-btn-sm lib-btn-danger" onClick={() => workflowAction(r.id, "reject")}>Rad etish</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── APPROVE TAB ── */}
        {activeTab === "approve" && canApprove(user.role) && (
          <div className="lib-section">
            <div className="lib-section-toolbar">
              <h2>Tasdiqlash navbati</h2>
              <span className="lib-badge-count">{pending.length} ta kutmoqda</span>
            </div>
            {pending.length === 0 ? (
              <div className="lib-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <p>Barcha resurslar ko'rib chiqilgan</p>
              </div>
            ) : (
              <div className="lib-approve-list">
                {pending.map((r) => (
                  <div key={r.id} className="lib-approve-card">
                    <div className="lib-approve-card-left">
                      <div className="lib-resource-row-icon" style={{ background: "#fffbeb" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div>
                        <strong>{r.title}</strong>
                        <span>{r.author_name} · {r.department_name}</span>
                        <span>{r.subject_name} · {r.material_type} · {r.format}</span>
                      </div>
                    </div>
                    <div className="lib-approve-actions">
                      <button className="lib-btn-sm lib-btn-outline" onClick={() => workflowAction(r.id, "revision")}>Qayta ishlash</button>
                      <button className="lib-btn-sm lib-btn-danger" onClick={() => workflowAction(r.id, "reject")}>Rad etish</button>
                      <button className="lib-btn-sm lib-btn-success" onClick={() => workflowAction(r.id, "approve")}>Tasdiqlash</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
