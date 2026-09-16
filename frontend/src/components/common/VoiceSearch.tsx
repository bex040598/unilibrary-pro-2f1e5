import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

type Role = "student" | "teacher" | "librarian" | "department" | "admin";

const ROLE_HINTS: Record<string, string[]> = {
  student:    ["Kitob qidirish", "O'quv zali bron qilish", "Qarz kitoblarim", "Ilmiy maqola topish"],
  teacher:    ["Kafedra resurslari", "Ilmiy adabiyotlar", "Talabalar ro'yxati", "Kitob qidirish"],
  librarian:  ["Kitob qo'shish", "Foydalanuvchi qidirish", "Qaytarilmagan kitoblar", "Statistika"],
  department: ["Kafedra kitoblari", "Resurslar", "O'qituvchilar", "Hisobotlar"],
  admin:      ["Foydalanuvchilar", "Statistika", "Kitob boshqaruvi", "Tizim sozlamalari"],
};

const QUICK_ACTIONS: Record<string, { label: string; path: string; icon: string }[]> = {
  student: [
    { label: "Katalog",       path: "/catalog",       icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
    { label: "O'quv zali",    path: "/library/reading-room", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
    { label: "Qarzlarim",     path: "/loans",          icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" },
    { label: "E-Library",     path: "/elibrary",       icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" },
  ],
  teacher: [
    { label: "Katalog",       path: "/catalog",       icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
    { label: "Kafedralar",    path: "/kafedralar",    icon: "M22 10v6M2 10l10-5 10 5-10 5z" },
    { label: "E-Library",     path: "/elibrary",      icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" },
    { label: "Resurslar",     path: "/resources",     icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
  ],
  librarian: [
    { label: "Katalog",       path: "/catalog",       icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
    { label: "Boshqaruv",     path: "/admin",         icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" },
    { label: "Qarzlar",       path: "/loans",         icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" },
    { label: "O'quv zali",    path: "/library/reading-room", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  ],
  department: [
    { label: "Katalog",       path: "/catalog",       icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
    { label: "Kafedralar",    path: "/kafedralar",    icon: "M22 10v6M2 10l10-5 10 5-10 5z" },
    { label: "Resurslar",     path: "/resources",     icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
    { label: "E-Library",     path: "/elibrary",      icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" },
  ],
  admin: [
    { label: "Boshqaruv",     path: "/admin",         icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" },
    { label: "Katalog",       path: "/catalog",       icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
    { label: "Foydalanuvchilar", path: "/admin",      icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 1 0 7.75M16 3.13a4 4 0 0 1 0 7.75" },
    { label: "Hisobotlar",    path: "/admin",         icon: "M18 20V10M12 20V4M6 20v-6" },
  ],
};

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

type State = "idle" | "listening" | "processing" | "result" | "error" | "unsupported";

export function VoiceSearchPanel({ role }: { role: string }) {
  const { locale = "uz" } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<State>("idle");
  const [transcript, setTranscript] = useState("");
  const [dots, setDots] = useState(0);
  const recogRef = useRef<SpeechRecognition | null>(null);
  const dotsRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hints = ROLE_HINTS[role] ?? ROLE_HINTS.student;
  const actions = QUICK_ACTIONS[role] ?? QUICK_ACTIONS.student;

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setState("unsupported");
  }, []);

  useEffect(() => {
    if (state === "listening") {
      dotsRef.current = setInterval(() => setDots(d => (d + 1) % 4), 400);
    } else {
      if (dotsRef.current) clearInterval(dotsRef.current);
      setDots(0);
    }
    return () => { if (dotsRef.current) clearInterval(dotsRef.current); };
  }, [state]);

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setState("unsupported"); return; }

    const r = new SR();
    r.lang = "uz-UZ";
    r.interimResults = true;
    r.maxAlternatives = 3;
    recogRef.current = r;

    r.onstart = () => setState("listening");
    r.onresult = (e: SpeechRecognitionEvent) => {
      const t = Array.from(e.results).map(res => res[0].transcript).join(" ");
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        setState("processing");
        setTimeout(() => {
          setState("result");
          navigate(`/${locale}/catalog?q=${encodeURIComponent(t)}`);
        }, 600);
      }
    };
    r.onerror = () => setState("error");
    r.onend = () => {
      if (state === "listening") setState("idle");
    };
    r.start();
  }

  function stopListening() {
    recogRef.current?.stop();
    setState("idle");
    setTranscript("");
  }

  return (
    <div className="vs-panel">
      {/* Header */}
      <div className="vs-header">
        <div className="vs-header-left">
          <div className="vs-icon-wrap">
            <Icon d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" size={22} />
          </div>
          <div>
            <h3 className="vs-title">Ovozli qidiruv</h3>
            <p className="vs-sub">Mikrofonni bosib o'zbek tilida gapiring</p>
          </div>
        </div>
        <div className="vs-browser-note">
          <Icon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" size={13} />
          Chrome tavsiya etiladi
        </div>
      </div>

      {/* Main mic area */}
      <div className="vs-mic-area">
        {state === "unsupported" ? (
          <div className="vs-unsupported">
            <Icon d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={32} />
            <p>Brauzeringiz ovozli qidiruvni qo'llab-quvvatlamaydi</p>
            <span>Chrome yoki Edge ishlatib ko'ring</span>
          </div>
        ) : (
          <>
            {/* Mic button */}
            <button
              className={`vs-mic-btn ${state === "listening" ? "vs-mic-btn--active" : ""} ${state === "processing" ? "vs-mic-btn--processing" : ""}`}
              onClick={state === "listening" ? stopListening : startListening}
              disabled={state === "processing" || state === "result"}
            >
              {state === "listening" ? (
                <Icon d="M9 9h6v6H9zM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={28} />
              ) : state === "processing" ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                  </path>
                </svg>
              ) : (
                <Icon d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" size={28} />
              )}

              {state === "listening" && (
                <span className="vs-pulse-ring" />
              )}
            </button>

            {/* Status text */}
            <div className="vs-status">
              {state === "idle" && <span className="vs-status-hint">Bosing va gapiring</span>}
              {state === "listening" && (
                <span className="vs-status-active">
                  Tinglayapman{".".repeat(dots)}
                </span>
              )}
              {state === "processing" && <span className="vs-status-hint">Qidiryapman...</span>}
              {state === "error" && <span className="vs-status-error">Xatolik — qaytadan bosing</span>}
            </div>

            {/* Transcript live */}
            {transcript && state === "listening" && (
              <div className="vs-transcript">
                <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={14} />
                {transcript}
              </div>
            )}

            {/* Hint chips */}
            {state === "idle" && (
              <div className="vs-hints">
                {hints.map(h => (
                  <span key={h} className="vs-hint-chip">{h}</span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="vs-actions">
        <p className="vs-actions-label">Tezkor o'tish</p>
        <div className="vs-actions-grid">
          {actions.map(a => (
            <button key={a.label} className="vs-action-btn"
              onClick={() => navigate(`/${locale}${a.path}`)}>
              <Icon d={a.icon} size={16} />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
