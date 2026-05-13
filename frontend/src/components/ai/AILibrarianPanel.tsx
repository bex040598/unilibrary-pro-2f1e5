import { useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { EmptyState } from "../common/EmptyState";
import { Badge } from "../common/Badge";
import type { AIAnswer } from "../../types";

const suggestions = [
  "Menga 2-kurs ma'lumotlar bazasi bo'yicha materiallar kerak",
  "Axborot texnologiyalari kafedrasida laboratoriya ishlari bormi?",
  "Kiberxavfsizlik bo'yicha o'zbekcha kitoblar top",
  "Diplom ishim uchun adabiyotlar tavsiya qil"
];

export function AILibrarianPanel({ compact = false }: { compact?: boolean }) {
  const { accessToken } = useAuth();
  const [query, setQuery] = useState(suggestions[0]);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<AIAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.aiChat(accessToken ?? undefined, { query, locale: "uz" });
      setAnswer(response);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "AI so'rovini bajarib bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={`ai-panel ${compact ? "compact" : ""}`}>
      <div className="ai-panel-header">
        <div>
          <p className="section-eyebrow">AI librarian</p>
          <h3>AI kutubxonachi katalog va kafedra resurslari bilan bog'langan</h3>
        </div>
        <Badge label="4 til" tone="info" />
      </div>
      <div className="ai-prompt-box">
        <textarea value={query} onChange={(event) => setQuery(event.target.value)} rows={compact ? 3 : 5} />
        <div className="suggestion-row">
          {suggestions.slice(0, compact ? 2 : suggestions.length).map((item) => (
            <button type="button" key={item} className="chip-button" onClick={() => setQuery(item)}>
              {item}
            </button>
          ))}
        </div>
        <button type="button" className="primary-button" onClick={handleAsk} disabled={loading}>
          {loading ? "AI qidirmoqda..." : "AI javobini olish"}
        </button>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      {answer ? (
        <div className="ai-answer">
          <p>{answer.answer}</p>
          <div className="source-grid">
            {answer.sources.map((source) => (
              <article key={source.id} className="source-card">
                <div className="source-topline">
                  <Badge label={source.department} tone="info" />
                  <span>{source.format}</span>
                </div>
                <h4>{source.title}</h4>
                <p>{source.author}</p>
                <span>{source.subject}</span>
                <small>{source.citation}</small>
                <div className="resource-actions">
                  <button type="button" className="ghost-button">Ochish</button>
                  <button type="button" className="ghost-button">Yuklab olish</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="AI source cards tayyor"
          description="So'rov yuboring, tizim katalog va kafedra resurslaridan manbalarni topib source cards ko'rsatadi."
        />
      )}
    </section>
  );
}

