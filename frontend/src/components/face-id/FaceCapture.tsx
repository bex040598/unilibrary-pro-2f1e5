import { useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";
import { secureContextRequired, getCameraErrorMessage } from "../../lib/camera";
import { useAuth } from "../../lib/auth";

export function FaceCapture() {
  const { accessToken, refreshProfile } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("Face ID ixtiyoriy. Embedding shifrlangan ko‘rinishda saqlanadi.");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  async function startCamera() {
    if (!secureContextRequired()) {
      setError("Kamera uchun HTTPS yoki localhost talab qilinadi.");
      return;
    }

    try {
      setError(null);
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      setStream(nextStream);
      if (videoRef.current) {
        videoRef.current.srcObject = nextStream;
      }
    } catch (cameraError) {
      setError(getCameraErrorMessage(cameraError));
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  function captureFrame() {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
    setPreview(dataUrl);
  }

  async function uploadFace(path: "register" | "verify") {
    if (!accessToken || !canvasRef.current) return;
    if (!consent && path === "register") {
      setError("Biometrik rozilikni tasdiqlang.");
      return;
    }

    setUploading(true);
    setError(null);

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        setError("Rasm yaratib bo‘lmadi.");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", blob, "face-capture.jpg");
      formData.append("consent", String(consent));
      formData.append("liveness_check", "placeholder");

      try {
        if (path === "register") {
          const response = await api.faceRegister(accessToken, formData);
          setStatus(response.message ?? "Face ID muvaffaqiyatli faollashtirildi.");
          await refreshProfile();
        } else {
          const response = await api.faceVerify(accessToken, formData);
          setStatus(response.data.verified ? "Yuz tasdiqlandi." : response.data.message);
        }
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Face ID so‘rovi bajarilmadi.");
      } finally {
        setUploading(false);
      }
    }, "image/jpeg", 0.92);
  }

  return (
    <section className="face-panel">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">Face ID</p>
          <h3>Kamera ruxsati, real preview va multipart yuklash</h3>
          <p className="section-description">
            Yuz rasmi saqlanmaydi, faqat shifrlangan embedding va liveness placeholder metadata yoziladi.
          </p>
        </div>
      </div>
      <div className="face-grid">
        <div className="camera-stage">
          <video ref={videoRef} autoPlay playsInline muted />
          <canvas ref={canvasRef} hidden />
          {preview ? <img src={preview} alt="Captured face preview" className="face-preview" /> : null}
        </div>
        <div className="face-actions">
          <label className="consent-row">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            Biometrik rozilikni tasdiqlayman va parol/OTP fallback mavjudligini bilaman.
          </label>
          <div className="button-row">
            <button type="button" className="primary-button" onClick={startCamera}>Kamerani yoqish</button>
            <button type="button" className="ghost-button" onClick={stopCamera}>Kamerani to‘xtatish</button>
            <button type="button" className="ghost-button" onClick={captureFrame}>Capture image</button>
          </div>
          <div className="button-row">
            <button type="button" className="primary-button" onClick={() => uploadFace("register")} disabled={uploading}>
              {uploading ? "Yuborilmoqda..." : "Face ID ni ro‘yxatdan o‘tkazish"}
            </button>
            <button type="button" className="ghost-button" onClick={() => uploadFace("verify")} disabled={uploading}>
              Verify
            </button>
          </div>
          <p>{status}</p>
          {error ? <p className="error-text">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
