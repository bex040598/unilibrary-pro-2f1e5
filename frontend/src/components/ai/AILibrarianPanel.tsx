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

export function AILibrarianPanel({
  compact = false,
  landing = false
}: {
  compact?: boolean;
  landing?: boolean;
}) {
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
    <section className={`ai-panel ${compact ? "compact" : ""} ${landing ? "landing" : ""}`}>
      <div className="ai-panel-header">
        <div className="ai-panel-intro">
          {landing ? <div className="ai-avatar">AI</div> : null}
          <div>
          <p className="section-eyebrow">AI librarian</p>
            <h3>{landing ? "Sizga qanday yordam bera olaman?" : "AI kutubxonachi katalog va kafedra resurslari bilan bog'langan"}</h3>
            <p className="ai-intro-copy">
              {landing
                ? "Kitob topish, kafedra resurslarini izlash, citation yaratish, reading room bo'sh joylarini ko'rish yoki diplom ishingiz uchun adabiyot tavsiyasi so'rashingiz mumkin."
                : "Katalog, kafedra resurslari, kitoblar va AI source cards bitta oqimda ishlaydi."}
            </p>
          </div>
        </div>
        <Badge label="4 til" tone="info" />
      </div>
      {landing ? (
        <div className="ai-capability-row">
          <span>Kitob tavsiyasi</span>
          <span>Kafedra resurs qidiruvi</span>
          <span>APA/MLA citation</span>
          <span>Reading room signal</span>
        </div>
      ) : null}
      <div className="ai-prompt-box">
        <div className="ai-prompt-headline">
          <strong>{landing ? "Savolingizni yozing" : "AI so'rov oynasi"}</strong>
          <span>{landing ? "Masalan: “Menga 2-kurs ma'lumotlar bazasi bo'yicha materiallar kerak”" : "AI katalog va department resources ichidan eng mos manbalarni topadi."}</span>
        </div>
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          rows={landing ? 3 : compact ? 3 : 5}
          placeholder="Menga qanday yordam kerakligini yozing..."
        />
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
          title={landing ? "AI yordamchi tayyor" : "AI source cards tayyor"}
          description={landing
            ? "Savol yuboring, tizim katalog va kafedra resurslaridan eng mos manbalarni topib, source cards va tavsiyalarni shu yerning o'zida ko'rsatadi."
            : "So'rov yuboring, tizim katalog va kafedra resurslaridan manbalarni topib source cards ko'rsatadi."}
        />
      )}
    </section>
  );
}
