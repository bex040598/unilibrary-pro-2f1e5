import { useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";
import { secureContextRequired, getCameraErrorMessage } from "../../lib/camera";
import { useAuth } from "../../lib/auth";

/* ── Phase type ─────────────────────────────────────────── */
type Phase =
  | "intro"       // consent + start
  | "scanning"    // camera live + face oval
  | "liveness"    // look left/right/blink
  | "capturing"   // auto-capture countdown
  | "processing"  // uploading
  | "success"
  | "error"
  | "verify";     // verification mode

type LivenessStep = { label: string; done: boolean };

/* ── Oval SVG overlay ───────────────────────────────────── */
function FaceOval({
  phase, progress, livenessDone,
}: { phase: Phase; progress: number; livenessDone: number }) {
  const isGood = phase === "capturing" || phase === "processing" || phase === "success";
  const color  = phase === "success" ? "#22c55e"
               : phase === "error"   ? "#ef4444"
               : isGood              ? "#22c55e"
               : "#ffffff";
  const dash   = 2 * Math.PI * 90; // circumference of r=90
  const filled = (progress / 100) * dash;

  return (
    <svg
      viewBox="0 0 240 300"
      className="fid-oval-svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <defs>
        {/* Mask: show video only inside oval */}
        <mask id="face-mask">
          <rect width="240" height="300" fill="black" />
          <ellipse cx="120" cy="145" rx="88" ry="110" fill="white" />
        </mask>
        <radialGradient id="oval-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dark overlay outside oval */}
      <rect width="240" height="300" fill="rgba(0,0,0,0.62)" mask="url(#face-mask)" style={{ mask: "none" }} />
      <ellipse cx="120" cy="145" rx="88" ry="110" fill="rgba(0,0,0,0)" stroke="rgba(0,0,0,0.62)" strokeWidth="200" clipPath="none" />

      {/* Glow inside oval */}
      {isGood && (
        <ellipse cx="120" cy="145" rx="88" ry="110" fill="url(#oval-glow)" />
      )}

      {/* Background oval track */}
      <ellipse cx="120" cy="145" rx="88" ry="110"
        fill="none"
        stroke={color}
        strokeOpacity="0.22"
        strokeWidth="2.5"
      />

      {/* Progress ring (approximate with circle transform) */}
      {progress > 0 && (
        <ellipse cx="120" cy="145" rx="88" ry="110"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeOpacity="0.9"
          strokeDasharray={`${(progress / 100) * 628} 628`}
          strokeDashoffset="157"
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.3s ease", filter: `drop-shadow(0 0 6px ${color})` }}
        />
      )}

      {/* Corner brackets (Apple-style) */}
      {[
        { x: 32,  y: 40,  r: "0",   d: "M0 20 L0 0 L20 0"   },
        { x: 188, y: 40,  r: "90",  d: "M0 20 L0 0 L20 0"   },
        { x: 188, y: 250, r: "180", d: "M0 20 L0 0 L20 0"   },
        { x: 32,  y: 250, r: "270", d: "M0 20 L0 0 L20 0"   },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x},${b.y}) rotate(${b.r} 10 10)`}>
          <path d={b.d} fill="none" stroke={color} strokeWidth="3"
            strokeLinecap="round" strokeOpacity="0.9"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        </g>
      ))}

      {/* Scan line */}
      {phase === "scanning" && (
        <ellipse cx="120" cy="145" rx="86" ry="108"
          fill="none"
          stroke="rgba(255,255,255,0.0)"
          clipPath="none"
        />
      )}
    </svg>
  );
}

/* ── Liveness dots ──────────────────────────────────────── */
function LivenessDots({ steps, current }: { steps: LivenessStep[]; current: number }) {
  return (
    <div className="fid-liveness-dots">
      {steps.map((s, i) => (
        <div key={i} className={`fid-ldot ${s.done ? "done" : i === current ? "active" : ""}`}>
          {s.done
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            : <span>{i + 1}</span>}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export function FaceCapture() {
  const { accessToken, refreshProfile } = useAuth();
  const videoRef  = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const [stream,    setStream]    = useState<MediaStream | null>(null);
  const [phase,     setPhase]     = useState<Phase>("intro");
  const [consent,   setConsent]   = useState(false);
  const [mode,      setMode]      = useState<"register" | "verify">("register");
  const [progress,  setProgress]  = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg,  setErrorMsg]  = useState("");
  const [scanLine,  setScanLine]  = useState(0);

  const LIVENESS_STEPS: LivenessStep[] = [
    { label: "Tik qarang",      done: false },
    { label: "O'ngga burining", done: false },
    { label: "Chapga burining", done: false },
    { label: "Ko'zingizni yuming", done: false },
  ];
  const [lSteps,   setLSteps]   = useState<LivenessStep[]>(LIVENESS_STEPS);
  const [lCurrent, setLCurrent] = useState(0);

  /* cleanup */
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(t => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stream]);

  /* scan line animation */
  useEffect(() => {
    if (phase !== "scanning" && phase !== "liveness" && phase !== "capturing") return;
    const t = setInterval(() => setScanLine(p => (p + 2) % 100), 16);
    return () => clearInterval(t);
  }, [phase]);

  /* ── Camera ── */
  async function openCamera() {
    if (!secureContextRequired()) {
      setErrorMsg("Kamera uchun HTTPS yoki localhost talab qilinadi.");
      setPhase("error");
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setPhase("scanning");
      setProgress(0);
      // Auto-advance to liveness after 2s
      setTimeout(() => startLiveness(), 2000);
    } catch (e) {
      setErrorMsg(getCameraErrorMessage(e));
      setPhase("error");
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
  }

  /* ── Liveness simulation ── */
  function startLiveness() {
    setPhase("liveness");
    setLSteps(LIVENESS_STEPS.map(s => ({ ...s, done: false })));
    setLCurrent(0);
    let step = 0;
    const t = setInterval(() => {
      step++;
      setLCurrent(step);
      setLSteps(prev => prev.map((s, i) => ({ ...s, done: i < step })));
      setProgress(Math.round((step / LIVENESS_STEPS.length) * 70));
      if (step >= LIVENESS_STEPS.length) {
        clearInterval(t);
        startCapture();
      }
    }, 1000);
    timerRef.current = t;
  }

  /* ── Auto-capture ── */
  function startCapture() {
    setPhase("capturing");
    let cnt = 0;
    const t = setInterval(() => {
      cnt += 10;
      setProgress(70 + cnt * 0.3);
      if (cnt >= 100) {
        clearInterval(t);
        captureAndUpload();
      }
    }, 80);
    timerRef.current = t;
  }

  async function captureAndUpload() {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    canvasRef.current.width  = videoRef.current.videoWidth  || 640;
    canvasRef.current.height = videoRef.current.videoHeight || 480;
    ctx.drawImage(videoRef.current, 0, 0);
    setPhase("processing");
    setProgress(100);

    canvasRef.current.toBlob(async blob => {
      if (!blob || !accessToken) {
        setErrorMsg("Rasm yaratib bo'lmadi.");
        setPhase("error");
        return;
      }
      const fd = new FormData();
      fd.append("image", blob, "face-capture.jpg");
      fd.append("consent", String(consent));
      fd.append("liveness_check", "completed");
      try {
        if (mode === "register") {
          const r = await api.faceRegister(accessToken, fd);
          setStatusMsg(r.message ?? "Face ID muvaffaqiyatli faollashtirildi!");
          await refreshProfile();
        } else {
          const r = await api.faceVerify(accessToken, fd);
          setStatusMsg(r.data?.verified ? "Yuz muvaffaqiyatli tasdiqlandi!" : r.data?.message ?? "Tasdiqlash amalga oshmadi.");
        }
        stopCamera();
        setPhase("success");
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : "Face ID so'rovi bajarilmadi.");
        stopCamera();
        setPhase("error");
      }
    }, "image/jpeg", 0.93);
  }

  function reset() {
    stopCamera();
    setPhase("intro");
    setProgress(0);
    setScanLine(0);
    setLSteps(LIVENESS_STEPS.map(s => ({ ...s, done: false })));
    setLCurrent(0);
    setStatusMsg("");
    setErrorMsg("");
  }

  /* ── Phase labels ── */
  const phaseLabel: Record<Phase, string> = {
    intro:      "",
    scanning:   "Yuzingizni doira ichiga joylashtiring",
    liveness:   lSteps[lCurrent]?.label ?? "Kutib turing…",
    capturing:  "Ajoyib! Surat olinmoqda…",
    processing: "Tahlil qilinmoqda…",
    success:    "",
    error:      "",
    verify:     "Yuzingizni tasdiqlang",
  };

  const showCamera = ["scanning","liveness","capturing","processing"].includes(phase);

  return (
    <section className="fid-root">

      {/* ── INTRO ─────────────────────────────────────────── */}
      {phase === "intro" && (
        <div className="fid-intro">
          <div className="fid-intro-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h2 className="fid-intro-title">Face ID orqali kirish</h2>
          <p className="fid-intro-desc">
            Yuzingiz saqlanmaydi — faqat shifrlangan biometrik vektor serverda xavfsiz yoziladi.
            Istalgan vaqt o'chirishingiz mumkin.
          </p>

          <div className="fid-intro-steps">
            {[
              { icon: "M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z", text: "Kamera ochiladi" },
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", text: "Liveness tekshiruvi" },
              { icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14", text: "Yuz tasdiqlanadi" },
            ].map((s,i) => (
              <div key={i} className="fid-intro-step">
                <div className="fid-intro-step-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon}/>
                  </svg>
                </div>
                <span>{s.text}</span>
              </div>
            ))}
          </div>

          <div className="fid-mode-toggle">
            <button
              className={`fid-mode-btn ${mode==="register"?"fid-mode-on":""}`}
              onClick={()=>setMode("register")}>
              Ro'yxatdan o'tish
            </button>
            <button
              className={`fid-mode-btn ${mode==="verify"?"fid-mode-on":""}`}
              onClick={()=>setMode("verify")}>
              Tasdiqlash
            </button>
          </div>

          <label className="fid-consent">
            <div className={`fid-checkbox ${consent?"fid-checkbox-on":""}`} onClick={()=>setConsent(c=>!c)}>
              {consent && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </div>
            <span>Biometrik ma'lumotlarni qayta ishlashga rozilik beraman. Istalgan vaqt bekor qilish mumkin.</span>
          </label>

          <button
            className="fid-start-btn"
            disabled={!consent}
            onClick={openCamera}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
            </svg>
            {mode === "register" ? "Kamerani yoqish va boshlash" : "Yuzni tasdiqlash"}
          </button>

          {!consent && (
            <p className="fid-intro-notice">Davom etish uchun rozilik belgisini qo'ying</p>
          )}
        </div>
      )}

      {/* ── CAMERA PHASES ─────────────────────────────────── */}
      {showCamera && (
        <div className="fid-scanner">

          {/* Camera feed */}
          <div className="fid-viewport">
            <video ref={videoRef} autoPlay playsInline muted className="fid-video" />
            <canvas ref={canvasRef} style={{ display:"none" }} />

            {/* Dim overlay with oval cutout */}
            <FaceOval phase={phase} progress={progress} livenessDone={lCurrent} />

            {/* Scan line */}
            {(phase === "scanning" || phase === "liveness") && (
              <div className="fid-scanline" style={{ top: `${20 + scanLine * 0.6}%` }} />
            )}

            {/* Corner particles on success */}
            {phase === "capturing" && (
              <div className="fid-capture-flash" />
            )}
          </div>

          {/* Status area */}
          <div className="fid-status-area">
            {/* Liveness dots */}
            {phase === "liveness" && (
              <LivenessDots steps={lSteps} current={lCurrent} />
            )}

            <p className={`fid-phase-label ${phase==="capturing"?"fid-label-green":""}`}>
              {phaseLabel[phase]}
            </p>

            {/* Progress bar */}
            <div className="fid-progress-track">
              <div className="fid-progress-fill" style={{
                width: `${progress}%`,
                background: phase === "processing" || phase === "capturing"
                  ? "linear-gradient(90deg,#22c55e,#16a34a)"
                  : "linear-gradient(90deg,#3b82f6,#6366f1)",
              }}/>
            </div>

            {/* Processing spinner */}
            {phase === "processing" && (
              <div className="fid-processing">
                <div className="fid-spinner" />
                <span>Biometrik ma'lumotlar tahlil qilinmoqda…</span>
              </div>
            )}

            {/* Cancel */}
            {phase !== "processing" && (
              <button className="fid-cancel-btn" onClick={reset}>
                Bekor qilish
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── SUCCESS ──────────────────────────────────────── */}
      {phase === "success" && (
        <div className="fid-result fid-result-success">
          <div className="fid-result-ring fid-ring-success">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h3 className="fid-result-title">
            {mode === "register" ? "Face ID faollashtirildi!" : "Yuz tasdiqlandi!"}
          </h3>
          <p className="fid-result-desc">{statusMsg}</p>
          <div className="fid-result-meta">
            <span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Shifrlangan embedding saqlanadi
            </span>
            <span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Yuz rasmi saqlanmadi
            </span>
          </div>
          <div className="fid-result-actions">
            <button className="fid-result-ghost" onClick={reset}>
              Boshqatdan sozlash
            </button>
            {mode === "register" && (
              <button className="fid-result-primary" onClick={() => { reset(); setMode("verify"); }}>
                Tasdiqlashni sinash
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── ERROR ────────────────────────────────────────── */}
      {phase === "error" && (
        <div className="fid-result fid-result-error">
          <div className="fid-result-ring fid-ring-error">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h3 className="fid-result-title">Xatolik yuz berdi</h3>
          <p className="fid-result-desc">{errorMsg}</p>
          <div className="fid-result-actions">
            <button className="fid-result-primary" onClick={reset}>Qayta urinish</button>
          </div>
        </div>
      )}
    </section>
  );
}
