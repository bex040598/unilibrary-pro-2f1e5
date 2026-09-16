import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ── shared icon ── */
function Ic({ d, size = 16, color = "currentColor" }: { d: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/* ════════════════════════════════════════════
   1. AI KITOB TAVSIYACHI
   (like Spotify Discover — based on reading profile)
════════════════════════════════════════════ */
const RECS: Record<string, { title: string; author: string; match: number; why: string; tag: string }[]> = {
  student: [
    { title: "Python: Ilmiy hisoblash", author: "VanderPlas J.", match: 97, why: "Informatika fanlarini o'qiyapsiz", tag: "Dasturlash" },
    { title: "Kuchli savollar sanati",  author: "Berger W.",      match: 93, why: "Tanqidiy fikrlash bo'yicha qiziqishingiz bor", tag: "Fikrlash" },
    { title: "Deep Learning asoslari", author: "Rashidov A.",     match: 91, why: "AI bo'limini ko'p ko'rdingiz", tag: "AI / ML" },
    { title: "Ma'lumotlar tuzilmasi",  author: "Karimov O.",      match: 88, why: "Algoritmlar bo'yicha savollar", tag: "CS" },
  ],
  teacher: [
    { title: "Ta'limda raqamli texnologiyalar", author: "Hasanov K.", match: 96, why: "Pedagogika resurslarini yukladingiz", tag: "Pedagogika" },
    { title: "Ilmiy maqola yozish san'ati",     author: "Eco U.",      match: 92, why: "Tadqiqot faoliyatingiz asosida", tag: "Metodologiya" },
    { title: "Amaliy statistika",                author: "Field A.",     match: 89, why: "Ma'lumot tahlili bo'yicha qiziqish", tag: "Statistika" },
    { title: "Zamonaviy ta'lim metodlari",       author: "Marzano R.",   match: 85, why: "O'qitish uslubingizga mos", tag: "Didaktika" },
  ],
  librarian: [
    { title: "Raqamli arxivlash standartlari", author: "Buckland M.",  match: 98, why: "Kutubxona resurslari bilan ishlaysiz", tag: "Arxiv" },
    { title: "Metadata va klassifikatsiya",    author: "Chan L.M.",     match: 94, why: "Kataloglash faoliyatingiz", tag: "Kutubxonashunoslik" },
    { title: "Ochiq kirish (Open Access)",     author: "Suber P.",      match: 90, why: "E-resurslarni boshqarasiz", tag: "OA" },
    { title: "Foydalanuvchi tajribasi (UX)",   author: "Norman D.",     match: 86, why: "Xizmat sifatini oshirish", tag: "UX" },
  ],
  admin: [
    { title: "Raqamli transformatsiya strategiyasi", author: "Rogers D.L.", match: 97, why: "Tizim boshqaruvi asosida", tag: "Strategiya" },
    { title: "Ma'lumotlar xavfsizligi",              author: "Stallings W.", match: 93, why: "Admin faoliyatingiz", tag: "Xavfsizlik" },
    { title: "Tashkilot boshqaruvi (MBA)",           author: "Drucker P.",   match: 89, why: "Boshqaruv ko'nikmalaringiz", tag: "Menejment" },
    { title: "Katta ma'lumotlar (Big Data)",         author: "Marz N.",      match: 85, why: "Statistika tahlili", tag: "Big Data" },
  ],
  department: [
    { title: "Kafedra tadqiqot metodologiyasi", author: "Creswell J.",  match: 96, why: "Kafedra resurslari asosida", tag: "Tadqiqot" },
    { title: "Ilmiy hamkorlik modellari",       author: "Etzkowitz H.", match: 91, why: "Universitet-sanoat aloqalari", tag: "Innovatsiya" },
    { title: "Akademik yozuv qo'llanmasi",      author: "APA Style",    match: 88, why: "Ilmiy nashrlar uchun", tag: "Akademik" },
    { title: "STEM ta'lim dizayni",             author: "NRC Report",   match: 84, why: "Texnik fanlar kafedrasiga mos", tag: "STEM" },
  ],
};

function BookRecommender({ role }: { role: string }) {
  const { locale = "uz" } = useParams();
  const navigate = useNavigate();
  const recs = RECS[role] ?? RECS.student;

  return (
    <div className="ai-card">
      <div className="ai-card-head">
        <div className="ai-card-icon" style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
          <Ic d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" size={20} color="#fff" />
        </div>
        <div>
          <h3 className="ai-card-title">AI Kitob Tavsiyachi</h3>
          <p className="ai-card-sub">O'qish tarixingiz asosida shaxsiy tavsiyalar</p>
        </div>
        <span className="ai-badge ai-badge-blue">AI</span>
      </div>

      <div className="ai-recs-list">
        {recs.map((r, i) => (
          <div key={i} className="ai-rec-row">
            <div className="ai-rec-rank">{i + 1}</div>
            <div className="ai-rec-body">
              <div className="ai-rec-top">
                <span className="ai-rec-title">{r.title}</span>
                <span className="ai-match-bar">
                  <span className="ai-match-fill" style={{ width: `${r.match}%` }} />
                  <em>{r.match}%</em>
                </span>
              </div>
              <div className="ai-rec-meta">
                <span className="ai-rec-author">{r.author}</span>
                <span className="ai-tag">{r.tag}</span>
              </div>
              <p className="ai-rec-why">
                <Ic d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" size={11} />
                {r.why}
              </p>
            </div>
            <button className="ai-rec-btn" onClick={() => navigate(`/${locale}/catalog?q=${encodeURIComponent(r.title)}`)}>
              Topish
            </button>
          </div>
        ))}
      </div>
      <div className="ai-card-footer">
        <Ic d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={12} color="#94a3b8" />
        <span>Model: o'qish profili + kafedra ma'lumotlari asosida</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   2. AI MATN TAHLILCHISI  (like Elicit / Consensus)
════════════════════════════════════════════ */

const DEMO_TEXT = `Sun'iy intellekt (AI) va machine learning texnologiyalari zamonaviy kutubxona xizmatlarini tubdan o'zgartirmoqda. Raqamli fondlarni boshqarish, foydalanuvchi tavsiyalari va qidiruv tizimlarida AI qo'llanilishi samaradorlikni 40% ga oshirgan. UNESCO ma'lumotlariga ko'ra, 2024-yilda jahon universitetlarining 67% i AI-asosli kutubxona tizimlarini joriy etgan.`;

const DEMO_RESULT = {
  summary: "AI va ML texnologiyalari kutubxona xizmatlarini revolutsion tarzda yaxshilayapti. Raqamli boshqaruv va qidiruv samaradorligi sezilarli o'sgan.",
  keywords: ["Sun'iy intellekt", "Machine learning", "Raqamli fond", "UNESCO", "Kutubxona tizimlari"],
  sentiment: "Ijobiy",
  lang: "O'zbek",
  readability: "Akademik (B2)",
  wordCount: 52,
};

function TextAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<typeof DEMO_RESULT | null>(null);
  const [loading, setLoading] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  function analyze() {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const wc = text.trim().split(/\s+/).length;
      const words = text.match(/[\w']{4,}/g) ?? [];
      const freq: Record<string, number> = {};
      words.forEach(w => { const k = w.toLowerCase(); freq[k] = (freq[k] ?? 0) + 1; });
      const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) =>
        w.charAt(0).toUpperCase() + w.slice(1)
      );
      setResult({
        summary: text.length > 120
          ? text.slice(0, text.lastIndexOf(" ", 120)) + "... [AI tomonidan qisqartirildi]"
          : text,
        keywords: topWords.length ? topWords : DEMO_RESULT.keywords,
        sentiment: "Neytral",
        lang: /[а-яёА-ЯЁ]/.test(text) ? "Rus" : /[a-zA-Z]/.test(text) ? "Ingliz" : "O'zbek",
        readability: wc > 100 ? "Akademik (C1)" : wc > 40 ? "Akademik (B2)" : "Oddiy (B1)",
        wordCount: wc,
      });
      setLoading(false);
    }, 1200);
  }

  function loadDemo() {
    setText(DEMO_TEXT);
    textRef.current && (textRef.current.value = DEMO_TEXT);
  }

  return (
    <div className="ai-card">
      <div className="ai-card-head">
        <div className="ai-card-icon" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
          <Ic d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" size={20} color="#fff" />
        </div>
        <div>
          <h3 className="ai-card-title">AI Matn Tahlilchisi</h3>
          <p className="ai-card-sub">Har qanday matnni tahlil qiling — xulosa, kalit so'zlar, til</p>
        </div>
        <span className="ai-badge ai-badge-green">NLP</span>
      </div>

      <div className="ai-textarea-wrap">
        <textarea
          ref={textRef}
          className="ai-textarea"
          placeholder="Ilmiy matn, annotatsiya yoki abstrakt yozing (O'zbek / Rus / Ingliz)..."
          rows={4}
          onChange={e => setText(e.target.value)}
        />
        <div className="ai-textarea-actions">
          <button className="ai-btn-ghost" onClick={loadDemo}>Demo matn</button>
          <button className="ai-btn-primary" onClick={analyze} disabled={loading || !text.trim()}>
            {loading ? (
              <><span className="ai-spin">⟳</span> Tahlil qilinmoqda...</>
            ) : (
              <><Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" size={13} /> Tahlil qilish</>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="ai-result-panel">
          <div className="ai-result-row">
            <span className="ai-result-label">Xulosa:</span>
            <p className="ai-result-summary">"{result.summary}"</p>
          </div>
          <div className="ai-result-chips-row">
            <span className="ai-result-label">Kalit so'zlar:</span>
            <div className="ai-result-chips">
              {result.keywords.map(k => <span key={k} className="ai-kw-chip">{k}</span>)}
            </div>
          </div>
          <div className="ai-result-meta-grid">
            <div className="ai-result-meta-item">
              <span className="ai-result-label">Til</span>
              <strong>{result.lang}</strong>
            </div>
            <div className="ai-result-meta-item">
              <span className="ai-result-label">Murakkablik</span>
              <strong>{result.readability}</strong>
            </div>
            <div className="ai-result-meta-item">
              <span className="ai-result-label">So'zlar</span>
              <strong>{result.wordCount} ta</strong>
            </div>
            <div className="ai-result-meta-item">
              <span className="ai-result-label">Ohang</span>
              <strong>{result.sentiment}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="ai-card-footer">
        <Ic d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={12} color="#94a3b8" />
        <span>Brauzerda ishlaydi · internet talab qilinmaydi · ma'lumotlar saqlanmaydi</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   3. AQLLI O'QUV REJALASHTIRUVCHI
   (AI Study Planner — like Notion AI × Google Calendar)
════════════════════════════════════════════ */

const GOALS = ["Imtihonga tayyorlanish", "Ilmiy maqola yozish", "Kurs ishi", "Diplom ishi", "Yangi mavzu o'rganish"];
const DAYS_OPTIONS = [7, 14, 21, 30];

type PlanItem = { day: string; task: string; duration: string; done: boolean };

function generatePlan(goal: string, days: number): PlanItem[] {
  const templates: Record<string, string[]> = {
    "Imtihonga tayyorlanish": ["Mavzular ro'yxati tuzing", "1-bo'lim: nazariy qism", "2-bo'lim: amaliy misollar", "Test savollari yechish", "Zaiflashgan mavzularni takrorlash", "Mock imtihon"],
    "Ilmiy maqola yozish": ["Maqsad va gipotezani aniqlash", "Adabiyotlar sharhini yozing", "Metodologiya bo'limini rejalashtiring", "Ma'lumot to'plash", "Tahlil va natijalar", "Xulosa va muharrirlash"],
    "Kurs ishi": ["Mavzu tanlash va tasdiqlash", "Reja tuzish", "1-bob: nazariy qism", "2-bob: amaliy tahlil", "Xulosa yozish", "Formatlash va topshirish"],
    "Diplom ishi": ["Ilmiy rahbar bilan uchrashish", "Adabiyotlar bazasini kengaytirish", "Nazariy bo'lim", "Empirik tadqiqot", "Tahlil va xulosa", "Himoyaga tayyorlanish"],
    "Yangi mavzu o'rganish": ["Umumiy ko'rinish: YouTube + Wikipedia", "Asosiy kitobni tanlash", "1-10-betlar: asoslar", "Amaliy mashqlar", "Qo'shimcha maqolalar", "Bilimni tekshirish — test"],
  };

  const tasks = templates[goal] ?? templates["Yangi mavzu o'rganish"];
  const plan: PlanItem[] = [];
  const step = Math.ceil(days / tasks.length);

  tasks.forEach((task, i) => {
    const dayNum = Math.min(i * step + 1, days);
    plan.push({
      day: `${dayNum}-kun`,
      task,
      duration: ["45 daqiqa", "1 soat", "1.5 soat", "2 soat"][i % 4],
      done: false,
    });
  });
  return plan;
}

function StudyPlanner() {
  const [goal, setGoal] = useState(GOALS[0]);
  const [days, setDays] = useState(14);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [generated, setGenerated] = useState(false);
  const [checked, setChecked] = useState<boolean[]>([]);

  function generate() {
    const p = generatePlan(goal, days);
    setPlan(p);
    setChecked(p.map(() => false));
    setGenerated(true);
  }

  function toggle(i: number) {
    setChecked(c => c.map((v, j) => j === i ? !v : v));
  }

  const done = checked.filter(Boolean).length;
  const pct = plan.length ? Math.round((done / plan.length) * 100) : 0;

  return (
    <div className="ai-card">
      <div className="ai-card-head">
        <div className="ai-card-icon" style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
          <Ic d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" size={20} color="#fff" />
        </div>
        <div>
          <h3 className="ai-card-title">AI O'quv Rejalashtiruvchi</h3>
          <p className="ai-card-sub">Maqsadingizga mos shaxsiy o'qish rejasi</p>
        </div>
        <span className="ai-badge ai-badge-orange">Beta</span>
      </div>

      <div className="ai-planner-controls">
        <div className="ai-planner-field">
          <label className="ai-planner-label">Maqsad</label>
          <div className="ai-goal-chips">
            {GOALS.map(g => (
              <button key={g} className={`ai-goal-chip ${goal === g ? "ai-goal-chip-on" : ""}`}
                onClick={() => { setGoal(g); setGenerated(false); }}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="ai-planner-field">
          <label className="ai-planner-label">Muddat</label>
          <div className="ai-days-group">
            {DAYS_OPTIONS.map(d => (
              <button key={d} className={`ai-days-btn ${days === d ? "ai-days-btn-on" : ""}`}
                onClick={() => { setDays(d); setGenerated(false); }}>
                {d} kun
              </button>
            ))}
          </div>
        </div>
        <button className="ai-btn-primary ai-planner-gen" onClick={generate}>
          <Ic d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" size={13} />
          Reja yaratish
        </button>
      </div>

      {generated && (
        <>
          <div className="ai-progress-wrap">
            <div className="ai-progress-info">
              <span>Bajarildi: <strong>{done}/{plan.length}</strong></span>
              <span className="ai-progress-pct">{pct}%</span>
            </div>
            <div className="ai-progress-track">
              <div className="ai-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="ai-plan-list">
            {plan.map((item, i) => (
              <div key={i} className={`ai-plan-row ${checked[i] ? "ai-plan-done" : ""}`}>
                <button className="ai-plan-check" onClick={() => toggle(i)}>
                  {checked[i]
                    ? <Ic d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={18} color="#10b981" />
                    : <Ic d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" size={18} color="#d1d5db" />
                  }
                </button>
                <div className="ai-plan-body">
                  <span className="ai-plan-task">{item.task}</span>
                  <span className="ai-plan-meta">{item.day} · {item.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="ai-card-footer">
        <Ic d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={12} color="#94a3b8" />
        <span>Reja brauzerda saqlanadi · PDF yuklab olish tez orada</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   EXPORT: combined AI Tools Panel
════════════════════════════════════════════ */
export function AIToolsPanel({ role }: { role: string }) {
  return (
    <div className="ai-tools-root">
      <div className="ai-tools-header">
        <div className="ai-tools-header-icon">
          <Ic d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" size={22} color="#fff" />
        </div>
        <div>
          <h2 className="ai-tools-title">AI Vositalar</h2>
          <p className="ai-tools-sub">Jahon standartlaridagi aqlli kutubxona yordamchilari</p>
        </div>
      </div>

      <div className="ai-tools-grid">
        <BookRecommender role={role} />
        <TextAnalyzer />
        <StudyPlanner />
      </div>
    </div>
  );
}
