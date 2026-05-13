import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { useI18n } from "../../lib/i18n";

export function LoginPage() {
  const { locale = "uz" } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("student@atmu.uz");
  const [password, setPassword] = useState("Student123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const user = await login(email, password);
      navigate(`/${locale}/dashboard/${user.role}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Kirish amalga oshmadi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel">
        <BadgeRow />
        <h1>{t("common.login")}</h1>
        <p>Demo loginlar bilan ATMU Smart UniLibrary ekotizimiga kiring.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            Parol
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Kirish..." : t("common.login")}
          </button>
        </form>
        <div className="auth-footnote">
          <span>admin@atmu.uz / Admin123!</span>
          <span>teacher@atmu.uz / Teacher123!</span>
          <span>librarian@atmu.uz / Librarian123!</span>
        </div>
        <p>
          Akkaunt yo‘qmi? <Link to={`/${locale}/register`}>{t("common.register")}</Link>
        </p>
      </section>
    </div>
  );
}

function BadgeRow() {
  return (
    <div className="top-badges">
      <span className="badge badge-info">JWT auth</span>
      <span className="badge badge-success">Auto profile sync</span>
      <span className="badge badge-warning">Role redirect</span>
    </div>
  );
}

