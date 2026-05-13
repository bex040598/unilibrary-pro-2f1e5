import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";

const steps = [
  "Rol tanlash",
  "Shaxsiy ma'lumotlar",
  "Akademik ma'lumotlar",
  "Xavfsizlik",
  "Face ID ixtiyoriy",
  "Profilni yakunlash"
];

export function RegisterPage() {
  const { locale = "uz" } = useParams();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    role: "student",
    full_name: "Yangi Foydalanuvchi",
    email: "newstudent@atmu.uz",
    password: "Student123!",
    phone: "+998901234567",
    department_id: "1",
    faculty_id: "1",
    course: "2",
    semester: "4",
    student_id: "ST-24001",
    teacher_title: "",
    consent_face_id: false
  });

  const canAdvance = useMemo(() => {
    if (step === 0) return Boolean(form.role);
    if (step === 1) return Boolean(form.full_name && form.email);
    if (step === 2) return Boolean(form.department_id && form.faculty_id);
    if (step === 3) return Boolean(form.password.length >= 8);
    return true;
  }, [form, step]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (step < steps.length - 1) {
      setStep((value) => value + 1);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await register({
        ...form,
        department_id: Number(form.department_id),
        faculty_id: Number(form.faculty_id),
        course: Number(form.course),
        semester: Number(form.semester)
      });
      navigate(`/${locale}/dashboard/${user.role}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ro'yxatdan o'tish muvaffaqiyatsiz tugadi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-layout">
      <section className="stepper-panel">
        <div className="stepper-header">
          <h1>Professional onboarding stepper</h1>
          <p>Registerdan keyin user avtomatik login bo'ladi va rolga mos dashboardga yo'naltiriladi.</p>
        </div>
        <div className="stepper-track">
          {steps.map((item, index) => (
            <div key={item} className={`step-chip ${index === step ? "active" : index < step ? "complete" : ""}`}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
        <form className="form-stack" onSubmit={handleSubmit}>
          {step === 0 ? (
            <div className="role-grid">
              {["student", "teacher", "librarian", "department", "admin"].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`role-card ${form.role === role ? "selected" : ""}`}
                  onClick={() => setForm((current) => ({ ...current, role }))}
                >
                  <strong>{role}</strong>
                  <span>ATMU Smart UniLibrary access profile</span>
                </button>
              ))}
            </div>
          ) : null}

          {step === 1 ? (
            <>
              <label>
                F.I.Sh
                <input value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} />
              </label>
              <label>
                Email
                <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
              </label>
              <label>
                Telefon
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
              </label>
            </>
          ) : null}

          {step === 2 ? (
            <div className="grid-two">
              <label>
                Fakultet
                <select value={form.faculty_id} onChange={(event) => setForm((current) => ({ ...current, faculty_id: event.target.value }))}>
                  <option value="1">Raqamli texnologiyalar fakulteti</option>
                  <option value="2">Ijtimoiy fanlar fakulteti</option>
                </select>
              </label>
              <label>
                Kafedra
                <select value={form.department_id} onChange={(event) => setForm((current) => ({ ...current, department_id: event.target.value }))}>
                  <option value="1">Axborot texnologiyalari kafedrasi</option>
                  <option value="2">Iqtisodiyot kafedrasi</option>
                  <option value="3">Matematika kafedrasi</option>
                  <option value="4">Filologiya kafedrasi</option>
                  <option value="5">Tarix kafedrasi</option>
                  <option value="6">Pedagogika kafedrasi</option>
                </select>
              </label>
              <label>
                Kurs
                <input value={form.course} onChange={(event) => setForm((current) => ({ ...current, course: event.target.value }))} />
              </label>
              <label>
                Semestr
                <input value={form.semester} onChange={(event) => setForm((current) => ({ ...current, semester: event.target.value }))} />
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <>
              <label>
                Parol
                <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
              </label>
              <label>
                Student ID
                <input value={form.student_id} onChange={(event) => setForm((current) => ({ ...current, student_id: event.target.value }))} />
              </label>
            </>
          ) : null}

          {step === 4 ? (
            <label className="consent-row">
              <input
                type="checkbox"
                checked={form.consent_face_id}
                onChange={(event) => setForm((current) => ({ ...current, consent_face_id: event.target.checked }))}
              />
              Men Face ID ixtiyoriy ekanligini va parol/OTP fallback mavjudligini tushunaman.
            </label>
          ) : null}

          {step === 5 ? (
            <div className="summary-card">
              <h3>Profil yakunlandi</h3>
              <p>{form.full_name} foydalanuvchisi {form.role} roli bilan ATMU Smart UniLibrary ga ulanadi.</p>
              <ul className="feature-list">
                <li>Auto login</li>
                <li>`/auth/me` sync</li>
                <li>Role-based dashboard redirect</li>
                <li>Header avatar dropdown</li>
              </ul>
            </div>
          ) : null}

          {error ? <p className="error-text">{error}</p> : null}

          <div className="button-row">
            {step > 0 ? (
              <button type="button" className="ghost-button" onClick={() => setStep((value) => value - 1)}>
                Orqaga
              </button>
            ) : null}
            <button type="submit" className="primary-button" disabled={!canAdvance || loading}>
              {step === steps.length - 1 ? (loading ? "Yakunlanmoqda..." : "Ro'yxatdan o'tish") : "Davom etish"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
