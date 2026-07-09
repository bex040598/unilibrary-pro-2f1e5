import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../../lib/auth";

/* ── Types ──────────────────────────────────────────────── */
type RoomStatus = "available" | "limited" | "full";

interface StudyRoom {
  id: string;
  name: string;
  subtitle: string;
  style: "classic" | "nordic";
  floor: string;
  capacity: number;
  occupied: number;
  status: RoomStatus;
  area: string;       // sq meters
  description: string;
  ambience: string;
  features: { icon: string; label: string; desc: string }[];
  amenities: string[];
  color: string;
  accent: string;
  openHours: string;
  inspiration: string; // which real library inspired it
}

const TIME_SLOTS = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00","19:00",
];

const ROOMS: StudyRoom[] = [
  {
    id: "amber",
    name: "Amber Study",
    subtitle: "Klassik individual kabinet",
    style: "classic",
    floor: "1-qavat · A-bino",
    capacity: 1,
    occupied: 0,
    status: "available",
    area: "12 m²",
    description:
      "Qorong'u yog'och panellar, charm kreslolar va shiftgacha kitob javonlari bilan bezatilgan klassik kabinet. Oxford Bodleian va Harvard Widener kutubxonalaridan ilhom olingan.",
    ambience: "Sokin · Issiq · Akademik",
    features: [
      { icon: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", label: "Tabiiy yorug'lik", desc: "Janubga qaragan katta deraza" },
      { icon: "M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", label: "Yashil banker chirog'i", desc: "Ko'z uchun qulay issiq yorug'lik" },
      { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "Kitob javonlari", desc: "1 200 dan ortiq klassik nashr" },
      { icon: "M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0z", label: "Tezkor Wi-Fi", desc: "300 Mbps simli + simsiz" },
      { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", label: "Quvvat paneli", desc: "USB-C, USB-A, 220V rozetkalar" },
      { icon: "M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316z", label: "Monitor", desc: "27\" 4K IPS displey" },
    ],
    amenities: ["Soundproof", "Klimat nazorat", "Safe (qulf)", "Printer kirish", "Locker", "Choy/kofe"],
    color: "#78350f",
    accent: "#d97706",
    openHours: "08:00 – 22:00",
    inspiration: "Oxford Bodleian · Harvard Widener",
  },
  {
    id: "nordic",
    name: "Nordic Light",
    subtitle: "Zamonaviy Skandinaviya kabineti",
    style: "nordic",
    floor: "2-qavat · A-bino",
    capacity: 1,
    occupied: 1,
    status: "limited",
    area: "14 m²",
    description:
      "Oq qayin yog'ochi, shiftgacha deraza va minimalist yondashuv. Helsinki Oodi va Kopengagen Qirollik kutubxonalaridan ilhom olingan. Yorug'lik va tinchlikning uyg'unligi.",
    ambience: "Minimalist · Yorug' · Ijodiy",
    features: [
      { icon: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", label: "Panorama deraza", desc: "Shiftgacha oyna, shaharga ko'rinish" },
      { icon: "M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", label: "Indirect LED", desc: "Harorat boshqaruvli smart aplik" },
      { icon: "M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18", label: "Standing desk", desc: "Elektr balandlik boshqaruvi" },
      { icon: "M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0z", label: "Wi-Fi 6", desc: "500 Mbps simli + Wi-Fi 6E" },
      { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", label: "Quvvat paneli", desc: "USB-C PD 100W, Wireless charger" },
      { icon: "M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15z", label: "Havo tozalagich", desc: "HEPA filtrl Dyson Pure" },
    ],
    amenities: ["Soundproof++", "Smart klimat", "Noise-cancelling zona", "Dual monitor", "Locker", "Infused water"],
    color: "#0c4a6e",
    accent: "#0891b2",
    openHours: "07:00 – 23:00",
    inspiration: "Helsinki Oodi · Copenhagen Black Diamond",
  },
];

/* ════════════════════════════════════════════════════════════
   PANORAMA  GENERATORS  (Canvas → equirectangular JPEG)
════════════════════════════════════════════════════════════ */

function buildClassicPanorama(): string {
  const W = 3072, H = 1536;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;

  /* ── background wall (dark walnut) ── */
  ctx.fillStyle = "#1c0f06";
  ctx.fillRect(0, 0, W, H);

  /* ── ceiling (coffered, dark) ── */
  const ceilGrad = ctx.createLinearGradient(0, 0, 0, H * 0.22);
  ceilGrad.addColorStop(0, "#0d0600");
  ceilGrad.addColorStop(1, "#1c0f0688");
  ctx.fillStyle = ceilGrad;
  ctx.fillRect(0, 0, W, H * 0.22);

  /* coffered ceiling panels */
  for (let cx = 0; cx < W; cx += 200) {
    for (let cy = 0; cy < H * 0.2; cy += 60) {
      ctx.strokeStyle = "#3d1f0840";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx + 4, cy + 4, 192, 52);
    }
  }

  /* ── warm ceiling light glow ── */
  for (let lx = 300; lx < W; lx += 420) {
    const lg = ctx.createRadialGradient(lx, H * 0.18, 5, lx, H * 0.18, 200);
    lg.addColorStop(0, "rgba(255,200,80,0.55)");
    lg.addColorStop(0.4, "rgba(255,180,50,0.15)");
    lg.addColorStop(1, "rgba(255,160,30,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(lx - 200, 0, 400, H * 0.55);

    /* chandelier body */
    ctx.fillStyle = "#8B6914";
    ctx.fillRect(lx - 6, H * 0.05, 12, 60);
    ctx.beginPath();
    ctx.ellipse(lx, H * 0.14, 50, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#b8860b";
    ctx.fill();
    ctx.fillStyle = "rgba(255,230,100,0.7)";
    ctx.beginPath();
    ctx.ellipse(lx, H * 0.145, 44, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ── floor (persian rug + wood) ── */
  const floorGrad = ctx.createLinearGradient(0, H * 0.62, 0, H);
  floorGrad.addColorStop(0, "#5c2d0d");
  floorGrad.addColorStop(0.4, "#7c3b14");
  floorGrad.addColorStop(1, "#3d1a06");
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, H * 0.62, W, H * 0.38);

  /* wood floor planks */
  for (let py = H * 0.63; py < H; py += 30) {
    ctx.strokeStyle = "#3d1a0660";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
  }

  /* persian rug in center */
  const rugW = W * 0.35, rugH = H * 0.22;
  const rugX = W / 2 - rugW / 2, rugY = H * 0.66;
  ctx.fillStyle = "#7f1d1d";
  ctx.fillRect(rugX, rugY, rugW, rugH);
  ctx.fillStyle = "#991b1b";
  ctx.fillRect(rugX + 12, rugY + 12, rugW - 24, rugH - 24);
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2;
  ctx.strokeRect(rugX + 20, rugY + 20, rugW - 40, rugH - 40);
  /* rug pattern */
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#fbbf2440" : "#92400e40";
    ctx.beginPath();
    ctx.arc(rugX + rugW / 2, rugY + rugH / 2, 20 + i * 18, 0, Math.PI * 2);
    ctx.stroke();
  }

  /* ── bookshelf wall (left panorama) ── */
  const shelfColors = ["#92400e","#78350f","#451a03","#57230e","#6b2f0f"];
  const bookColors  = ["#1e3a5f","#7f1d1d","#14532d","#1a1a2e","#4a1942","#2d3748","#744210","#1c4532","#3b0764","#083344"];

  for (let sx = 0; sx < W * 0.38; sx += 160) {
    /* shelf frame */
    ctx.fillStyle = "#3d1a06";
    ctx.fillRect(sx, H * 0.22, 158, H * 0.41);
    ctx.fillStyle = "#2d1205";
    ctx.fillRect(sx, H * 0.22, 6, H * 0.41);
    ctx.fillRect(sx + 152, H * 0.22, 6, H * 0.41);

    for (let row = 0; row < 6; row++) {
      const shelfY = H * 0.24 + row * (H * 0.066);
      /* shelf plank */
      ctx.fillStyle = shelfColors[row % shelfColors.length];
      ctx.fillRect(sx, shelfY + H * 0.058, 158, 5);

      /* books on shelf */
      let bx = sx + 5;
      while (bx < sx + 150) {
        const bw  = 9 + Math.floor(Math.sin(bx * 0.4 + row * 1.7) * 5);
        const bh  = 30 + Math.floor(Math.cos(bx * 0.25 + row) * 14);
        const col = bookColors[(bx + row * 3) % bookColors.length];
        ctx.fillStyle = col;
        ctx.fillRect(bx, shelfY + H * 0.058 - bh, bw - 1, bh);
        /* spine highlight */
        ctx.fillStyle = col + "99";
        ctx.fillRect(bx, shelfY + H * 0.058 - bh, 2, bh);
        /* title strip */
        ctx.fillStyle = "rgba(255,220,150,0.25)";
        ctx.fillRect(bx + 1, shelfY + H * 0.058 - bh + 4, bw - 3, 5);
        bx += bw;
      }
    }
  }

  /* ── right side: bookshelf continuation ── */
  for (let sx = W * 0.62; sx < W; sx += 160) {
    ctx.fillStyle = "#3d1a06";
    ctx.fillRect(sx, H * 0.22, 158, H * 0.41);
    ctx.fillStyle = "#2d1205";
    ctx.fillRect(sx, H * 0.22, 6, H * 0.41);
    ctx.fillRect(sx + 152, H * 0.22, 6, H * 0.41);

    for (let row = 0; row < 6; row++) {
      const shelfY = H * 0.24 + row * (H * 0.066);
      ctx.fillStyle = shelfColors[(row+2) % shelfColors.length];
      ctx.fillRect(sx, shelfY + H * 0.058, 158, 5);
      let bx = sx + 5;
      while (bx < sx + 150) {
        const bw  = 9 + Math.floor(Math.cos(bx * 0.35 + row * 2) * 5);
        const bh  = 28 + Math.floor(Math.sin(bx * 0.28 + row) * 13);
        const col = bookColors[(bx * 2 + row * 5 + 4) % bookColors.length];
        ctx.fillStyle = col;
        ctx.fillRect(bx, shelfY + H * 0.058 - bh, bw - 1, bh);
        ctx.fillStyle = col + "aa";
        ctx.fillRect(bx, shelfY + H * 0.058 - bh, 2, bh);
        ctx.fillStyle = "rgba(255,220,150,0.2)";
        ctx.fillRect(bx + 1, shelfY + H * 0.058 - bh + 4, bw - 3, 5);
        bx += bw;
      }
    }
  }

  /* ── centre: Georgian window ── */
  const winX = W * 0.38, winW = W * 0.24, winY = H * 0.21, winH = H * 0.38;
  /* window reveal */
  ctx.fillStyle = "#2d1205";
  ctx.fillRect(winX - 20, winY - 10, winW + 40, winH + 20);
  /* sky gradient */
  const skyG = ctx.createLinearGradient(winX, winY, winX, winY + winH);
  skyG.addColorStop(0, "#fef9c3");
  skyG.addColorStop(0.3, "#fde68a");
  skyG.addColorStop(0.7, "#93c5fd");
  skyG.addColorStop(1, "#60a5fa");
  ctx.fillStyle = skyG;
  ctx.fillRect(winX, winY, winW, winH);

  /* campus trees silhouette through window */
  for (let tx = winX + 30; tx < winX + winW - 30; tx += 80) {
    ctx.fillStyle = "#166534aa";
    ctx.beginPath();
    ctx.arc(tx, winY + winH * 0.65, 30 + Math.sin(tx) * 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#14532d";
    ctx.fillRect(tx - 5, winY + winH * 0.7, 10, winH * 0.3);
  }

  /* window panes (Georgian grid) */
  ctx.strokeStyle = "#1c0f06";
  ctx.lineWidth = 5;
  /* vertical dividers */
  ctx.beginPath(); ctx.moveTo(winX + winW / 3, winY); ctx.lineTo(winX + winW / 3, winY + winH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(winX + winW * 2 / 3, winY); ctx.lineTo(winX + winW * 2 / 3, winY + winH); ctx.stroke();
  /* horizontal dividers */
  for (let d = 1; d < 4; d++) {
    ctx.beginPath(); ctx.moveTo(winX, winY + winH * d / 4); ctx.lineTo(winX + winW, winY + winH * d / 4); ctx.stroke();
  }
  /* window frame */
  ctx.lineWidth = 10;
  ctx.strokeRect(winX, winY, winW, winH);

  /* light spill from window onto floor */
  const spill = ctx.createLinearGradient(winX + winW / 2, winY + winH, winX + winW / 2, H);
  spill.addColorStop(0, "rgba(254,240,138,0.22)");
  spill.addColorStop(1, "rgba(254,240,138,0)");
  ctx.fillStyle = spill;
  ctx.beginPath();
  ctx.moveTo(winX, winY + winH);
  ctx.lineTo(winX - 80, H);
  ctx.lineTo(winX + winW + 80, H);
  ctx.lineTo(winX + winW, winY + winH);
  ctx.closePath();
  ctx.fill();

  /* ── writing desk (front, bottom centre) ── */
  const deskY = H * 0.6;
  /* desk surface */
  const deskSurf = ctx.createLinearGradient(0, deskY, 0, deskY + H * 0.08);
  deskSurf.addColorStop(0, "#92400e");
  deskSurf.addColorStop(1, "#78350f");
  ctx.fillStyle = deskSurf;
  ctx.fillRect(W * 0.25, deskY, W * 0.5, H * 0.08);
  /* desk leather top */
  ctx.fillStyle = "#166534";
  ctx.fillRect(W * 0.28, deskY + 4, W * 0.44, H * 0.055);
  /* gold border on leather */
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 2;
  ctx.strokeRect(W * 0.28 + 6, deskY + 10, W * 0.44 - 12, H * 0.055 - 12);

  /* banker's lamp */
  const lampX = W * 0.55;
  ctx.fillStyle = "#b45309";
  ctx.fillRect(lampX - 4, deskY - H * 0.12, 8, H * 0.12);
  ctx.fillStyle = "#065f46";
  ctx.beginPath();
  ctx.moveTo(lampX - 50, deskY - H * 0.02);
  ctx.lineTo(lampX + 50, deskY - H * 0.02);
  ctx.lineTo(lampX + 35, deskY - H * 0.11);
  ctx.lineTo(lampX - 35, deskY - H * 0.11);
  ctx.closePath();
  ctx.fill();
  /* lamp glow */
  const lampGlow = ctx.createRadialGradient(lampX, deskY - H * 0.03, 5, lampX, deskY - H * 0.03, 180);
  lampGlow.addColorStop(0, "rgba(255,230,100,0.5)");
  lampGlow.addColorStop(1, "rgba(255,200,60,0)");
  ctx.fillStyle = lampGlow;
  ctx.fillRect(lampX - 180, deskY - H * 0.15, 360, H * 0.25);

  /* open book on desk */
  ctx.fillStyle = "#fef9c3";
  ctx.beginPath();
  ctx.ellipse(W * 0.44, deskY + H * 0.03, 90, 40, -0.15, 0, Math.PI * 2);
  ctx.fill();
  /* book pages lines */
  ctx.strokeStyle = "#d4b896";
  ctx.lineWidth = 1;
  for (let li = 0; li < 7; li++) {
    ctx.beginPath();
    ctx.moveTo(W * 0.37, deskY + H * 0.015 + li * 6);
    ctx.lineTo(W * 0.455, deskY + H * 0.015 + li * 6);
    ctx.stroke();
  }
  /* pen */
  ctx.fillStyle = "#1c0f06";
  ctx.save();
  ctx.translate(W * 0.47, deskY + H * 0.06);
  ctx.rotate(-0.3);
  ctx.fillRect(-2, -60, 4, 60);
  ctx.restore();

  /* leather chair back visible */
  ctx.fillStyle = "#7f1d1d";
  ctx.beginPath();
  ctx.roundRect(W * 0.42, deskY + H * 0.09, W * 0.16, H * 0.22, 8);
  ctx.fill();
  ctx.fillStyle = "#991b1b";
  ctx.fillRect(W * 0.43, deskY + H * 0.1, W * 0.14, H * 0.2);
  /* button tufting on chair */
  for (let bi = 0; bi < 3; bi++) {
    for (let bj = 0; bj < 2; bj++) {
      ctx.fillStyle = "#7f1d1d";
      ctx.beginPath();
      ctx.arc(W * 0.455 + bj * W * 0.06, deskY + H * 0.135 + bi * H * 0.06, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ── wainscoting / dado rail ── */
  ctx.fillStyle = "#3d1a06";
  ctx.fillRect(0, H * 0.57, W, 8);
  ctx.fillStyle = "#2d1205";
  ctx.fillRect(0, H * 0.575, W, 3);

  /* ── vignette ── */
  const vig = ctx.createRadialGradient(W/2, H/2, H*0.1, W/2, H/2, W*0.65);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.65)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  return cv.toDataURL("image/jpeg", 0.88);
}

function buildNordicPanorama(): string {
  const W = 3072, H = 1536;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;

  /* ── sky (through panoramic window) ── */
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65);
  sky.addColorStop(0, "#e0f2fe");
  sky.addColorStop(0.5, "#bae6fd");
  sky.addColorStop(1, "#7dd3fc");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H * 0.65);

  /* subtle cloud wisps */
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  for (let cx = 100; cx < W; cx += 400) {
    ctx.beginPath();
    ctx.ellipse(cx, H * 0.12, 140 + Math.sin(cx) * 40, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 80, H * 0.1, 90, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /* cityscape / campus on horizon */
  ctx.fillStyle = "#cbd5e1";
  for (let bx = 0; bx < W; bx += 120) {
    const bh = 40 + Math.floor(Math.sin(bx * 0.05) * 25);
    ctx.fillRect(bx, H * 0.52 - bh, 110, bh);
  }
  ctx.fillStyle = "#94a3b8";
  for (let bx = 50; bx < W; bx += 200) {
    const bh = 25 + Math.floor(Math.cos(bx * 0.04) * 15);
    ctx.fillRect(bx, H * 0.52 - bh, 140, bh);
  }

  /* ── white birch wall (left + right) ── */
  const birch = ctx.createLinearGradient(0, H * 0.22, 0, H * 0.62);
  birch.addColorStop(0, "#f8fafc");
  birch.addColorStop(1, "#e2e8f0");
  ctx.fillStyle = birch;
  ctx.fillRect(0, H * 0.22, W * 0.25, H * 0.42);
  ctx.fillRect(W * 0.75, H * 0.22, W * 0.25, H * 0.42);

  /* birch wood grain */
  ctx.strokeStyle = "#cbd5e160";
  ctx.lineWidth = 1;
  for (let gx = 0; gx < W * 0.25; gx += 28) {
    ctx.beginPath(); ctx.moveTo(gx, H * 0.22); ctx.lineTo(gx, H * 0.64); ctx.stroke();
  }
  for (let gx = W * 0.75; gx < W; gx += 28) {
    ctx.beginPath(); ctx.moveTo(gx, H * 0.22); ctx.lineTo(gx, H * 0.64); ctx.stroke();
  }

  /* ── panoramic window (centre) ── */
  const winX = W * 0.25, winW = W * 0.5, winY = H * 0.0, winH = H * 0.62;
  /* thin aluminium frame */
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(winX - 6, winY, 6, winH);
  ctx.fillRect(winX + winW, winY, 6, winH);
  /* vertical mullions */
  const mullionCount = 6;
  for (let m = 1; m < mullionCount; m++) {
    ctx.fillStyle = "#94a3b840";
    ctx.fillRect(winX + (winW / mullionCount) * m - 2, winY, 3, winH);
  }
  /* horizontal rail at mid */
  ctx.fillStyle = "#94a3b870";
  ctx.fillRect(winX, winY + winH * 0.5, winW, 4);

  /* ── floor (light oak parquet) ── */
  const floorG = ctx.createLinearGradient(0, H * 0.62, 0, H);
  floorG.addColorStop(0, "#d4b896");
  floorG.addColorStop(0.5, "#c4a882");
  floorG.addColorStop(1, "#b8955c");
  ctx.fillStyle = floorG;
  ctx.fillRect(0, H * 0.62, W, H * 0.38);

  /* parquet pattern */
  ctx.strokeStyle = "#c4a88240";
  ctx.lineWidth = 1;
  for (let px = 0; px < W; px += 60) {
    ctx.beginPath(); ctx.moveTo(px, H * 0.62); ctx.lineTo(px, H); ctx.stroke();
  }
  for (let py = H * 0.63; py < H; py += 24) {
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
  }

  /* ── ceiling (white with indirect LED strip) ── */
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, W, H * 0.22);
  /* ceiling recess / coffer */
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(W * 0.1, H * 0.02, W * 0.8, H * 0.16);
  /* LED strip glow */
  const ledGlow = ctx.createLinearGradient(0, H * 0.18, 0, H * 0.45);
  ledGlow.addColorStop(0, "rgba(186,230,253,0.45)");
  ledGlow.addColorStop(1, "rgba(186,230,253,0)");
  ctx.fillStyle = ledGlow;
  ctx.fillRect(0, H * 0.17, W, H * 0.3);
  /* LED strip line */
  ctx.fillStyle = "#bae6fd";
  ctx.fillRect(0, H * 0.196, W, 3);
  ctx.fillStyle = "#e0f2fecc";
  ctx.fillRect(0, H * 0.19, W, 8);

  /* ── left wall: floating birch shelves ── */
  for (let sh = 0; sh < 4; sh++) {
    const sy = H * 0.26 + sh * H * 0.085;
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(10, sy, W * 0.22, 6);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(10, sy + 6, W * 0.22, 2);
    /* minimal book collection (few books, lots of space — Scandinavian) */
    const starts = [20, 60, 110, 160];
    starts.forEach((bx, bi) => {
      const bw = 14 + bi * 3;
      const bh = 28 + bi * 5;
      const cols = ["#0c4a6e","#164e63","#0f766e","#1e3a5f","#f8fafc"];
      ctx.fillStyle = cols[bi % cols.length];
      ctx.fillRect(bx, sy - bh, bw, bh);
    });
    /* decorative object: small plant pot */
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.roundRect(W * 0.17, sy - 28, 18, 26, 3);
    ctx.fill();
    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.arc(W * 0.178, sy - 30, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ── right wall: pin-board / art panel ── */
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(W * 0.77, H * 0.27, W * 0.2, H * 0.28);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.strokeRect(W * 0.77, H * 0.27, W * 0.2, H * 0.28);
  /* abstract art on panel */
  const artColors = ["#0c4a6e","#0891b2","#06b6d4","#67e8f9","#e0f2fe"];
  for (let ai = 0; ai < 5; ai++) {
    ctx.fillStyle = artColors[ai];
    ctx.fillRect(W * 0.78 + ai * W * 0.036, H * 0.3, W * 0.032, H * (0.05 + ai * 0.03));
  }
  /* small calendar / sticky notes */
  ctx.fillStyle = "#fef9c3";
  ctx.fillRect(W * 0.82, H * 0.42, 60, 70);
  ctx.fillStyle = "#fde68a";
  ctx.fillRect(W * 0.84, H * 0.44, 50, 60);
  ctx.strokeStyle = "#d97706aa";
  ctx.lineWidth = 1;
  for (let li = 0; li < 5; li++) {
    ctx.beginPath(); ctx.moveTo(W * 0.845, H * 0.47 + li * 9); ctx.lineTo(W * 0.84 + 44, H * 0.47 + li * 9); ctx.stroke();
  }

  /* ── standing desk (centre front) ── */
  const deskY = H * 0.6;
  /* desk legs (thin, white) */
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(W * 0.36, deskY + H * 0.06, 6, H * 0.25);
  ctx.fillRect(W * 0.63, deskY + H * 0.06, 6, H * 0.25);
  /* desk surface */
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(W * 0.34, deskY, W * 0.32, H * 0.065);
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(W * 0.34, deskY + H * 0.06, W * 0.32, 4);

  /* dual monitors */
  for (let m = 0; m < 2; m++) {
    const mx = W * (0.41 + m * 0.1);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(mx - 46, deskY - H * 0.12, 92, 66);
    const screenG = ctx.createLinearGradient(mx - 44, deskY - H * 0.115, mx + 44, deskY - H * 0.115);
    screenG.addColorStop(0, "#0c4a6e");
    screenG.addColorStop(1, "#0891b2");
    ctx.fillStyle = screenG;
    ctx.fillRect(mx - 44, deskY - H * 0.115, 88, 60);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(mx - 4, deskY - H * 0.04, 8, 16);
    ctx.fillRect(mx - 18, deskY - H * 0.025, 36, 5);
    /* screen glow */
    const sgl = ctx.createRadialGradient(mx, deskY - H * 0.09, 5, mx, deskY - H * 0.09, 80);
    sgl.addColorStop(0, "rgba(8,145,178,0.18)");
    sgl.addColorStop(1, "rgba(8,145,178,0)");
    ctx.fillStyle = sgl;
    ctx.fillRect(mx - 80, deskY - H * 0.18, 160, H * 0.22);
  }

  /* keyboard + mouse */
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(W * 0.43, deskY + 5, 120, 28);
  ctx.fillRect(W * 0.565, deskY + 8, 22, 22);
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  for (let ki = 0; ki < 5; ki++) {
    for (let kj = 0; kj < 10; kj++) {
      ctx.strokeRect(W * 0.432 + kj * 11, deskY + 7 + ki * 4, 9, 3);
    }
  }

  /* ── Eames-style chair ── */
  ctx.fillStyle = "#0c4a6e";
  ctx.beginPath();
  ctx.ellipse(W * 0.5, deskY + H * 0.12, 70, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0369a1";
  ctx.beginPath();
  ctx.ellipse(W * 0.5, deskY + H * 0.11, 68, 36, 0, 0, Math.PI * 2);
  ctx.fill();
  /* chair back */
  ctx.fillStyle = "#0c4a6e";
  ctx.beginPath();
  ctx.roundRect(W * 0.47, deskY + H * 0.03, W * 0.06, H * 0.1, 12);
  ctx.fill();
  /* chrome stem */
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(W * 0.498, deskY + H * 0.12, 4, H * 0.12);

  /* ── plant (monstera in corner) ── */
  ctx.fillStyle = "#d97706";
  ctx.beginPath();
  ctx.roundRect(W * 0.1, H * 0.68, 44, 50, 4);
  ctx.fill();
  ctx.fillStyle = "#16a34a";
  for (let li = 0; li < 5; li++) {
    const angle = -0.8 + li * 0.4;
    const len   = 55 + li * 15;
    ctx.save();
    ctx.translate(W * 0.122, H * 0.68);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -len * 0.6, 22, len, angle * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = li % 2 === 0 ? "#15803d" : "#16a34a";
    ctx.fill();
    ctx.restore();
  }

  /* ── subtle reflection on floor ── */
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(W * 0.3, H * 0.62, W * 0.4, H * 0.15);

  /* ── vignette (soft) ── */
  const vig = ctx.createRadialGradient(W/2, H*0.45, H*0.2, W/2, H*0.45, W*0.65);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  return cv.toDataURL("image/jpeg", 0.88);
}

/* ── localStorage media helpers ─────────────────────────── */
function getRoomMedia(roomId: string, slot: "panorama" | "card"): string | null {
  try { return localStorage.getItem(`atmu_room_${roomId}_${slot}`); } catch { return null; }
}

/* ── 360° Viewer ────────────────────────────────────────── */
interface TourProps { room: StudyRoom; onClose: ()=>void; }

function VirtualTour({ room, onClose }: TourProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pannellum = (window as any).pannellum;
    if (!pannellum || !divRef.current) return;

    const customPano = getRoomMedia(room.id, "panorama");
    const panorama = customPano ?? (room.style === "classic" ? buildClassicPanorama() : buildNordicPanorama());
    setLoading(false);

    viewerRef.current = pannellum.viewer(divRef.current, {
      type: "equirectangular",
      panorama,
      autoLoad: true,
      autoRotate: -1.2,
      autoRotateInactivityDelay: 2500,
      showControls: false,
      compass: false,
      hfov: 100,
      minHfov: 50,
      maxHfov: 130,
      pitch: -5,
      strings: { loadingLabel: "Panorama yuklanmoqda…" },
    });
    return () => { try { viewerRef.current?.destroy(); } catch(_){} };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id]);

  return (
    <div className="vt-shell">
      {/* Header */}
      <div className="vt-topbar">
        <div className="vt-topbar-left">
          <span className="vt-badge" style={{background: room.color}}>
            {room.name}
          </span>
          <div>
            <div className="vt-room-name">{room.subtitle} · {room.floor}</div>
            <div className="vt-room-desc">{room.ambience}</div>
          </div>
        </div>
        <div className="vt-topbar-right">
          <span style={{fontSize:10,color:"#ffffffaa",fontStyle:"italic"}}>
            Ilhom: {room.inspiration}
          </span>
          <div className="vt-feats">
            {room.amenities.slice(0,4).map(a=>(
              <span key={a} className="vt-feat">{a}</span>
            ))}
          </div>
        </div>
        <button className="vt-close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#0f172a",zIndex:5,flexDirection:"column",gap:14}}>
          <div className="vt-spinner"/>
          <span style={{color:"#94a3b8",fontSize:13}}>Panorama yaratilmoqda…</span>
        </div>
      )}

      {/* Pannellum */}
      <div className="vt-viewer" ref={divRef}/>

      {/* Controls */}
      <div className="vt-controls">
        <button className="vt-ctrl-btn" onClick={()=>viewerRef.current?.setPitch(viewerRef.current.getPitch()+15)} title="Yuqori">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m18 15-6-6-6 6"/></svg>
        </button>
        <button className="vt-ctrl-btn" onClick={()=>viewerRef.current?.setPitch(viewerRef.current.getPitch()-15)} title="Pastga">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <button className="vt-ctrl-btn" onClick={()=>viewerRef.current?.setYaw(viewerRef.current.getYaw()-30)} title="Chap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button className="vt-ctrl-btn" onClick={()=>viewerRef.current?.setYaw(viewerRef.current.getYaw()+30)} title="O'ng">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        <div className="vt-ctrl-divider"/>
        <button className="vt-ctrl-btn" onClick={()=>viewerRef.current?.setHfov(Math.max(50,viewerRef.current.getHfov()-20))} title="Zoom in">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
        <button className="vt-ctrl-btn" onClick={()=>viewerRef.current?.setHfov(Math.min(130,viewerRef.current.getHfov()+20))} title="Zoom out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
      </div>

      <div className="vt-hint">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        Sichqon bilan aylantirib ko'ring · Scroll = zoom
      </div>

      <div className="vt-placeholder-notice">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Sintetik panorama · Haqiqiy 360° foto bilan almashtiriladi
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
export function ReadingRoomPage() {
  const { user }    = useAuth();
  const [tourRoom,  setTourRoom]  = useState<StudyRoom|null>(null);
  const [bookRoom,  setBookRoom]  = useState<StudyRoom|null>(null);
  const [step,      setStep]      = useState<1|2|3>(1);
  const [success,   setSuccess]   = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    start: "10:00", end: "12:00",
  });

  function handleBook(e: FormEvent) {
    e.preventDefault();
    setStep(2);
    setTimeout(() => { setSuccess(true); setStep(3); }, 900);
  }

  if (tourRoom) return <VirtualTour room={tourRoom} onClose={() => setTourRoom(null)}/>;

  return (
    <div className="sr2-page">
      {/* ── Page header ── */}
      <div className="sr2-header">
        <div>
          <div className="sr2-breadcrumb">
            <span>ATMU</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>O'quv zallari</span>
          </div>
          <h1 className="sr2-title">Individual kabinetlar</h1>
          <p className="sr2-subtitle">
            Jahon standartlaridagi ikkita maxsus individual o'quv kabineti — sokin, jihozlangan va
            betakror atmosfera.
          </p>
        </div>
        <div className="sr2-header-meta">
          <div className="sr2-meta-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            08:00 – 22:00
          </div>
          <div className="sr2-meta-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            A-bino · 1 va 2-qavat
          </div>
          <div className="sr2-meta-pill green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            1 ta bo'sh
          </div>
        </div>
      </div>

      {/* ── Room cards ── */}
      <div className="sr2-rooms">
        {ROOMS.map(room => {
          const free     = room.capacity - room.occupied;
          const statusMap = {
            available: { label:"Bo'sh", color:"#16a34a", bg:"#f0fdf4", ring:"#bbf7d0" },
            limited:   { label:"Band",  color:"#ca8a04", bg:"#fefce8", ring:"#fef08a" },
            full:      { label:"To'la", color:"#dc2626", bg:"#fef2f2", ring:"#fecaca" },
          };
          const st = statusMap[room.status];
          const isClassic = room.style === "classic";

          const customCard = getRoomMedia(room.id, "card");

          return (
            <article key={room.id} className={`sr2-room ${isClassic ? "sr2-room--classic" : "sr2-room--nordic"}`}>

              {/* ── ILLUSTRATION PANEL ── */}
              <div className="sr2-room-visual" style={{background: isClassic ? "#1c0f06" : "#e0f2fe"}}>
                {customCard
                  ? <img src={customCard} alt={room.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
                  : isClassic ? <ClassicIllustration/> : <NordicIllustration/>
                }

                {/* Overlay info */}
                <div className="sr2-visual-overlay">
                  <div className="sr2-visual-top">
                    <span className="sr2-room-badge" style={{background: room.color}}>
                      {room.name}
                    </span>
                    <span className="sr2-status-pill" style={{color:st.color, background:st.bg, border:`1px solid ${st.ring}`}}>
                      <span style={{width:7,height:7,borderRadius:"50%",background:st.color,display:"inline-block"}}/>
                      {st.label} · {free}/{room.capacity}
                    </span>
                  </div>

                  <div className="sr2-visual-bottom">
                    <div className="sr2-insp-tag">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {room.inspiration}
                    </div>
                    <button className="sr2-tour-btn" onClick={() => setTourRoom(room)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" opacity=".5"/>
                      </svg>
                      360° Virtual sayohat
                    </button>
                  </div>
                </div>
              </div>

              {/* ── INFO PANEL ── */}
              <div className="sr2-room-info">
                <div className="sr2-room-head">
                  <div>
                    <h2 className="sr2-room-title" style={{color: room.color}}>{room.name}</h2>
                    <p className="sr2-room-sub">{room.subtitle}</p>
                  </div>
                  <div className="sr2-room-meta-chips">
                    <span className="sr2-meta-chip">{room.floor}</span>
                    <span className="sr2-meta-chip">{room.area}</span>
                    <span className="sr2-meta-chip">{room.openHours}</span>
                  </div>
                </div>

                <p className="sr2-room-desc">{room.description}</p>

                {/* Features grid */}
                <div className="sr2-features-grid">
                  {room.features.map(f => (
                    <div key={f.label} className="sr2-feature">
                      <div className="sr2-feature-icon" style={{color: room.accent, borderColor: room.accent+"30", background: room.accent+"0d"}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d={f.icon}/>
                        </svg>
                      </div>
                      <div>
                        <div className="sr2-feature-label">{f.label}</div>
                        <div className="sr2-feature-desc">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Amenities */}
                <div className="sr2-amenities">
                  <p className="sr2-amenity-label">Qo'shimcha imkoniyatlar</p>
                  <div className="sr2-amenity-list">
                    {room.amenities.map(a => (
                      <span key={a} className="sr2-amenity" style={{borderColor: room.accent+"40", color: room.color}}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="sr2-cta-row">
                  <button className="sr2-ghost-btn" onClick={() => setTourRoom(room)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    Xonani ko'rish
                  </button>
                  <button
                    className="sr2-book-btn"
                    style={{background: room.status === "full" ? "#94a3b8" : `linear-gradient(135deg, ${room.color}, ${room.accent})`}}
                    disabled={room.status === "full"}
                    onClick={() => { setBookRoom(room); setStep(1); setSuccess(false); }}
                  >
                    {room.status === "full" ? "Bo'sh o'rin yo'q" : "Bron qilish"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── BOOKING MODAL ── */}
      {bookRoom && (
        <>
          <div className="rr2-backdrop" onClick={() => setBookRoom(null)}/>
          <div className="rr2-modal">
            <button className="rr2-modal-x" onClick={() => setBookRoom(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="rr2-modal-art" style={{background: bookRoom.style==="classic"?"#1c0f06":"#e0f2fe", height:140}}>
              {bookRoom.style==="classic" ? <ClassicIllustration/> : <NordicIllustration/>}
              <div className="rr2-modal-art-info">
                <span className="rr2-modal-code" style={{background: bookRoom.color}}>{bookRoom.name}</span>
                <div>
                  <div style={{fontWeight:800,fontSize:16,color:"#fff",textShadow:"0 1px 8px #0008"}}>{bookRoom.subtitle}</div>
                  <div style={{fontSize:11,color:"#ffffffcc",marginTop:2}}>{bookRoom.floor} · {bookRoom.area}</div>
                </div>
              </div>
            </div>
            <div className="rr2-modal-body">
              {!success ? (
                <form onSubmit={handleBook}>
                  <p className="rr2-modal-section">Vaqtni tanlang</p>
                  <div className="rr2-form-grid">
                    <div className="rr2-field">
                      <label>Sana</label>
                      <input type="date" value={form.date} min={new Date().toISOString().slice(0,10)}
                        onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
                    </div>
                    <div className="rr2-field">
                      <label>Boshlanish</label>
                      <select value={form.start} onChange={e=>setForm(f=>({...f,start:e.target.value}))}>
                        {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="rr2-field">
                      <label>Tugash</label>
                      <select value={form.end} onChange={e=>setForm(f=>({...f,end:e.target.value}))}>
                        {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="rr2-summary">
                    {([["Kabinet",bookRoom.name],["Qavat",bookRoom.floor],["Sana",form.date],["Vaqt",`${form.start}–${form.end}`],...(user?[["Foydalanuvchi",user.full_name]]:[])] as [string,string][]).map(([k,v])=>(
                      <div key={k} className="rr2-summary-row"><span>{k}</span><b>{v}</b></div>
                    ))}
                  </div>
                  <div className="rr2-modal-actions">
                    <button type="button" className="rr2-ghost" onClick={()=>setBookRoom(null)}>Bekor</button>
                    <button type="submit" className="rr2-submit" style={{background:`linear-gradient(135deg,${bookRoom.color},${bookRoom.accent})`}} disabled={step===2}>
                      {step===2?"Saqlanmoqda…":"Bronni tasdiqlash"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rr2-success">
                  <div className="rr2-success-ring" style={{borderColor:bookRoom.accent}}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={bookRoom.accent} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3>Bron tasdiqlandi!</h3>
                  <p>{bookRoom.name} · {form.date} · {form.start}–{form.end}</p>
                  <div className="rr2-qr">
                    <svg width="80" height="80" viewBox="0 0 88 88">
                      <rect width="88" height="88" fill="#fff" rx="6"/>
                      <rect x="8" y="8" width="24" height="24" rx="3" fill={bookRoom.color}/>
                      <rect x="12" y="12" width="16" height="16" rx="1" fill="#fff"/>
                      <rect x="15" y="15" width="10" height="10" fill={bookRoom.color}/>
                      <rect x="56" y="8" width="24" height="24" rx="3" fill={bookRoom.color}/>
                      <rect x="60" y="12" width="16" height="16" rx="1" fill="#fff"/>
                      <rect x="63" y="15" width="10" height="10" fill={bookRoom.color}/>
                      <rect x="8" y="56" width="24" height="24" rx="3" fill={bookRoom.color}/>
                      <rect x="12" y="60" width="16" height="16" rx="1" fill="#fff"/>
                      <rect x="15" y="63" width="10" height="10" fill={bookRoom.color}/>
                      {[40,54,66,40,56,70].map((x,i)=><rect key={i} x={x} y={38+i*6} width={i%2===0?12:7} height={4} rx={1} fill={bookRoom.color}/>)}
                    </svg>
                    <p>Kirish uchun skanerlang</p>
                    <code>#{Date.now().toString().slice(-7)}</code>
                  </div>
                  <div className="rr2-modal-actions">
                    <button className="rr2-ghost" onClick={()=>setBookRoom(null)}>Yopish</button>
                    <button className="rr2-submit" style={{background:`linear-gradient(135deg,${bookRoom.color},${bookRoom.accent})`}}
                      onClick={()=>{setSuccess(false);setStep(1);}}>Yangi bron</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Static SVG illustrations ─────────────────────────── */
function ClassicIllustration() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice">
      {/* Dark background */}
      <rect width="800" height="460" fill="#1c0f06"/>
      {/* Ceiling */}
      <rect width="800" height="90" fill="#0d0600"/>
      {/* Chandelier */}
      <rect x="393" y="20" width="14" height="45" fill="#8B6914"/>
      <ellipse cx="400" cy="65" rx="52" ry="12" fill="#b8860b"/>
      <ellipse cx="400" cy="67" rx="46" ry="8" fill="#fde68a" opacity=".8"/>
      {/* Lamp glow */}
      <radialGradient id="lg1" cx="50%" cy="60%" r="60%"><stop offset="0%" stopColor="#fde68a" stopOpacity=".5"/><stop offset="100%" stopColor="#fde68a" stopOpacity="0"/></radialGradient>
      <rect x="200" y="60" width="400" height="300" fill="url(#lg1)"/>
      {/* Left bookshelves */}
      <rect x="0" y="88" width="220" height="280" fill="#3d1a06"/>
      {[0,1,2,3,4].map(r=>(
        <g key={r}>
          <rect x="4" y={100+r*52} width="212" height="4" fill="#92400e"/>
          {Array.from({length:14},(_,i)=>{
            const bw=10+Math.sin(i*r+1)*3; const bh=24+Math.cos(i+r)*10;
            const cols=["#1e3a5f","#7f1d1d","#14532d","#1a1a2e","#4a1942","#744210"];
            return <rect key={i} x={8+i*15} y={100+r*52-bh} width={bw} height={bh} fill={cols[(i+r)%6]} rx="1"/>;
          })}
        </g>
      ))}
      {/* Right bookshelves */}
      <rect x="580" y="88" width="220" height="280" fill="#3d1a06"/>
      {[0,1,2,3,4].map(r=>(
        <g key={r}>
          <rect x="584" y={100+r*52} width="212" height="4" fill="#92400e"/>
          {Array.from({length:14},(_,i)=>{
            const bw=10+Math.cos(i*r+2)*3; const bh=24+Math.sin(i+r+1)*10;
            const cols=["#083344","#1c4532","#3b0764","#744210","#1e3a5f","#7f1d1d"];
            return <rect key={i} x={588+i*15} y={100+r*52-bh} width={bw} height={bh} fill={cols[(i*2+r)%6]} rx="1"/>;
          })}
        </g>
      ))}
      {/* Georgian window */}
      <rect x="238" y="95" width="324" height="210" fill="#2d1205"/>
      <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fef9c3"/><stop offset="60%" stopColor="#93c5fd"/><stop offset="100%" stopColor="#60a5fa"/></linearGradient>
      <rect x="246" y="103" width="308" height="194" fill="url(#sky1)"/>
      {/* Trees through window */}
      {[280,340,400,460].map((tx,i)=>(
        <g key={i}><ellipse cx={tx} cy="240" rx="28" ry="24" fill="#166534aa"/><rect x={tx-4} y="250" width="8" height="47" fill="#14532d"/></g>
      ))}
      {/* Window panes */}
      <line x1="400" y1="103" x2="400" y2="297" stroke="#1c0f06" strokeWidth="5"/>
      <line x1="354" y1="103" x2="354" y2="297" stroke="#1c0f06" strokeWidth="3"/>
      <line x1="446" y1="103" x2="446" y2="297" stroke="#1c0f06" strokeWidth="3"/>
      {[155,207,255].map(y=><line key={y} x1="246" y1={y} x2="554" y2={y} stroke="#1c0f06" strokeWidth="3"/>)}
      <rect x="238" y="95" width="324" height="210" fill="none" stroke="#1c0f06" strokeWidth="8"/>
      {/* Floor */}
      <rect x="0" y="370" width="800" height="90" fill="#5c2d0d"/>
      {[0,1,2,3,4,5,6,7,8].map(i=><line key={i} x1="0" y1={374+i*10} x2="800" y2={374+i*10} stroke="#3d1a0640" strokeWidth="1.5"/>)}
      {/* Persian rug */}
      <rect x="250" y="375" width="300" height="70" fill="#7f1d1d" rx="4"/>
      <rect x="262" y="383" width="276" height="54" fill="#991b1b" rx="2"/>
      <rect x="272" y="390" width="256" height="40" fill="none" stroke="#fbbf24" strokeWidth="2" rx="1"/>
      {/* Desk */}
      <rect x="260" y="338" width="280" height="35" fill="#92400e" rx="3"/>
      <rect x="260" y="338" width="280" height="10" fill="#166534"/>
      {/* Banker's lamp */}
      <rect x="465" y="290" width="6" height="50" fill="#b45309"/>
      <polygon points="435,338 495,338 488,300 442,300" fill="#065f46"/>
      <ellipse cx="468" cy="298" rx="5" ry="5" fill="#fde68a" opacity=".9"/>
      <radialGradient id="lg2" cx="50%" cy="100%" r="80%"><stop offset="0%" stopColor="#fde68a" stopOpacity=".5"/><stop offset="100%" stopColor="#fde68a" stopOpacity="0"/></radialGradient>
      <ellipse cx="468" cy="340" rx="100" ry="60" fill="url(#lg2)"/>
      {/* Chair */}
      <rect x="350" y="373" width="100" height="80" fill="#7f1d1d" rx="6"/>
      <rect x="358" y="380" width="84" height="65" fill="#991b1b" rx="4"/>
      {/* Wainscoting */}
      <rect x="0" y="330" width="800" height="8" fill="#3d1a06"/>
      {/* Vignette */}
      <radialGradient id="vig1" cx="50%" cy="50%" r="70%"><stop offset="30%" stopColor="transparent"/><stop offset="100%" stopColor="#0000009a"/></radialGradient>
      <rect width="800" height="460" fill="url(#vig1)"/>
    </svg>
  );
}

function NordicIllustration() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice">
      {/* Sky */}
      <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e0f2fe"/><stop offset="60%" stopColor="#bae6fd"/><stop offset="100%" stopColor="#7dd3fc"/></linearGradient>
      <rect width="800" height="460" fill="url(#nsky)"/>
      {/* Clouds */}
      {[120,380,620].map((cx,i)=><ellipse key={i} cx={cx} cy={50+i*12} rx={100+i*20} ry="20" fill="white" opacity=".55"/>)}
      {/* City skyline */}
      {Array.from({length:20},(_,i)=>{
        const bh=30+Math.sin(i*0.8)*25;
        return <rect key={i} x={i*42} y={240-bh} width="38" height={bh} fill="#cbd5e1cc"/>;
      })}
      {/* White ceiling */}
      <rect x="0" y="0" width="800" height="88" fill="#f8fafc"/>
      <rect x="0" y="82" width="800" height="6" fill="#bae6fd" opacity=".8"/>
      {/* LED glow */}
      <linearGradient id="nled" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bae6fd" stopOpacity=".35"/><stop offset="100%" stopColor="#bae6fd" stopOpacity="0"/></linearGradient>
      <rect x="0" y="82" width="800" height="150" fill="url(#nled)"/>
      {/* Panoramic window frame */}
      <rect x="200" y="0" width="400" height="252" fill="none" stroke="#94a3b8" strokeWidth="4"/>
      {[280,360,440].map(x=><line key={x} x1={x} y1="0" x2={x} y2="252" stroke="#94a3b860" strokeWidth="2"/>)}
      <line x1="200" y1="126" x2="600" y2="126" stroke="#94a3b870" strokeWidth="3"/>
      {/* Left white wall */}
      <rect x="0" y="88" width="200" height="172" fill="#f1f5f9"/>
      {/* Left shelves */}
      {[0,1,2,3].map(r=>(
        <g key={r}>
          <rect x="10" y={105+r*40} width="180" height="4" fill="#e2e8f0"/>
          {[20,46,72,100,130,158].map((bx,i)=>{
            const bw=14+i*2; const bh=22+i*4;
            const cols=["#0c4a6e","#0f766e","#1e3a5f","#f8fafc","#164e63"];
            return <rect key={i} x={bx} y={101+r*40-bh} width={bw} height={bh} fill={cols[i%5]} rx="1"/>;
          })}
        </g>
      ))}
      {/* Right white wall */}
      <rect x="600" y="88" width="200" height="172" fill="#f1f5f9"/>
      {/* Right art panel */}
      <rect x="618" y="105" width="164" height="120" fill="#e2e8f0" rx="3"/>
      {["#0c4a6e","#0891b2","#06b6d4","#67e8f9","#e0f2fe"].map((col,i)=>(
        <rect key={i} x={622+i*30} y={115} width="26" height={28+i*16} fill={col} rx="2"/>
      ))}
      {/* Floor (oak) */}
      <rect x="0" y="252" width="800" height="208" fill="#d4b896"/>
      {Array.from({length:10},(_,i)=><line key={i} x1="0" y1={258+i*20} x2="800" y2={258+i*20} stroke="#c4a88240" strokeWidth="1.2"/>)}
      {Array.from({length:15},(_,i)=><line key={i} x1={i*56} y1="252" x2={i*56} y2="460" stroke="#c4a88240" strokeWidth="1"/>)}
      {/* Standing desk */}
      <rect x="240" y="248" width="320" height="26" fill="#f8fafc" rx="2"/>
      <rect x="240" y="274" width="6" height="120" fill="#94a3b8" rx="2"/>
      <rect x="554" y="274" width="6" height="120" fill="#94a3b8" rx="2"/>
      {/* Dual monitors */}
      {[310,430].map((mx,i)=>(
        <g key={i}>
          <rect x={mx-44} y="198" width="88" height="56" fill="#0f172a" rx="3"/>
          <linearGradient id={`nsc${i}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#0891b2"/></linearGradient>
          <rect x={mx-42} y="200" width="84" height="50" fill={`url(#nsc${i})`} rx="1"/>
          <rect x={mx-5} y="254" width="10" height="16" fill="#0f172a"/>
          <rect x={mx-18} y="268" width="36" height="5" fill="#94a3b8"/>
        </g>
      ))}
      {/* Keyboard */}
      <rect x="330" y="253" width="140" height="22" fill="#e2e8f0" rx="3"/>
      {/* Mouse */}
      <rect x="478" y="255" width="24" height="18" fill="#e2e8f0" rx="6"/>
      {/* Eames-style chair */}
      <ellipse cx="400" cy="310" rx="64" ry="30" fill="#0c4a6e"/>
      <ellipse cx="400" cy="305" rx="62" ry="28" fill="#0369a1"/>
      <rect x="378" y="278" width="44" height="34" fill="#0c4a6e" rx="10"/>
      <rect x="398" y="308" width="5" height="50" fill="#94a3b8" rx="2"/>
      {/* Plant */}
      <rect x="88" y="314" width="36" height="42" fill="#d97706" rx="3"/>
      {[0,1,2,3,4].map(i=><ellipse key={i} cx={106+Math.sin(i)*14} cy={310-i*16} rx={18-i} ry={10+i} fill={i%2?"#16a34a":"#15803d"} transform={`rotate(${-20+i*10} ${106+Math.sin(i)*14} ${310-i*16})`}/>)}
      {/* Monitor glow */}
      <radialGradient id="nglow" cx="50%" cy="80%" r="50%"><stop offset="0%" stopColor="#0891b2" stopOpacity=".15"/><stop offset="100%" stopColor="#0891b2" stopOpacity="0"/></radialGradient>
      <rect x="250" y="180" width="300" height="140" fill="url(#nglow)"/>
      {/* Vignette */}
      <radialGradient id="nvig" cx="50%" cy="50%" r="70%"><stop offset="30%" stopColor="transparent"/><stop offset="100%" stopColor="#00000055"/></radialGradient>
      <rect width="800" height="460" fill="url(#nvig)"/>
    </svg>
  );
}
