import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../lib/auth";

/* ── Types ─────────────────────────────────────────────── */
type RoomStatus = "available"|"limited"|"almost_full"|"full"|"maintenance";
type Building   = "A"|"B";

interface Room {
  id: string; code: string; building: Building;
  floor: string; capacity: number; occupied: number;
  status: RoomStatus; type: string; features: string[];
  color: string; tourDesc: string;
}

const STATUS_META: Record<RoomStatus,{label:string;color:string;bg:string;ring:string}> = {
  available:   {label:"Bo'sh",         color:"#16a34a", bg:"#f0fdf4", ring:"#bbf7d0"},
  limited:     {label:"Cheklangan",    color:"#ca8a04", bg:"#fefce8", ring:"#fef08a"},
  almost_full: {label:"Deyarli to'la", color:"#ea580c", bg:"#fff7ed", ring:"#fed7aa"},
  full:        {label:"To'la",         color:"#dc2626", bg:"#fef2f2", ring:"#fecaca"},
  maintenance: {label:"Texnik xizmat", color:"#94a3b8", bg:"#f8fafc", ring:"#e2e8f0"},
};

const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

/* ── Room data: A-bino + B-bino ───────────────────────── */
const ROOMS: Room[] = [
  // A-bino  1-qavat
  {id:"A-A1",  code:"A1",  building:"A", floor:"1-qavat", capacity:4,  occupied:1, status:"available",   type:"Individual", features:["Wi-Fi","Monitor"],       color:"#6366f1", tourDesc:"Tinch o'qish uchun individual kabinet. Tabiiy yorug'lik, qulay stol va monitor."},
  {id:"A-A2",  code:"A2",  building:"A", floor:"1-qavat", capacity:6,  occupied:4, status:"limited",     type:"Individual", features:["Wi-Fi","Printer"],       color:"#0891b2", tourDesc:"Kichik guruh uchun o'quv xona. Printer va tezkor internet."},
  {id:"A-A3",  code:"A3",  building:"A", floor:"1-qavat", capacity:4,  occupied:3, status:"limited",     type:"Individual", features:["Wi-Fi"],                 color:"#059669", tourDesc:"Sokin muhitda yozish va o'qish uchun mo'ljallangan xona."},
  {id:"A-A4",  code:"A4",  building:"A", floor:"1-qavat", capacity:4,  occupied:1, status:"available",   type:"Individual", features:["Wi-Fi","Quvvat"],        color:"#d97706", tourDesc:"Quvvat rozetkalar va simsiz internet. Noutbuk bilan ishlash uchun."},
  {id:"A-A5",  code:"A5",  building:"A", floor:"1-qavat", capacity:8,  occupied:7, status:"almost_full", type:"Guruh",      features:["Wi-Fi","Proyektor"],     color:"#7c3aed", tourDesc:"Guruh ishlash va prezentatsiya uchun proyektor bilan jihozlangan."},
  {id:"A-A6",  code:"A6",  building:"A", floor:"1-qavat", capacity:8,  occupied:5, status:"limited",     type:"Guruh",      features:["Wi-Fi","Monitor"],       color:"#0284c7", tourDesc:"Katta guruh xonasi. Markaziy monitor va aylana stol joylashuvi."},
  {id:"A-A7",  code:"A7",  building:"A", floor:"1-qavat", capacity:6,  occupied:2, status:"available",   type:"Individual", features:["Wi-Fi"],                 color:"#16a34a", tourDesc:"Sokin o'quv xona. Minimal dizayn, maksimal konsentratsiya."},
  {id:"A-A8",  code:"A8",  building:"A", floor:"1-qavat", capacity:4,  occupied:4, status:"full",        type:"Individual", features:["Wi-Fi","Printer"],       color:"#dc2626", tourDesc:"Hozir to'la. Keyingi mavjud joy uchun navbat oling."},
  // A-bino  2-qavat
  {id:"A-A9",  code:"A9",  building:"A", floor:"2-qavat", capacity:6,  occupied:2, status:"available",   type:"Guruh",      features:["Wi-Fi","Monitor"],       color:"#6366f1", tourDesc:"2-qavatdagi guruh xonasi. Panorama darcha, ko'p sonli o'rindiqlar."},
  {id:"A-A10", code:"A10", building:"A", floor:"2-qavat", capacity:10, occupied:9, status:"almost_full", type:"Konferens",  features:["Wi-Fi","Proyektor","Ekran"], color:"#d97706", tourDesc:"Konferens zali. 10 kishi, katta ekran, video qo'ng'iroq imkoniyati."},
  {id:"A-A11", code:"A11", building:"A", floor:"2-qavat", capacity:6,  occupied:2, status:"available",   type:"Individual", features:["Wi-Fi"],                 color:"#7c3aed", tourDesc:"Yuqori qavat — tinch va jim muhit. Tabiiy yorug'lik ko'p."},
  {id:"A-A12", code:"A12", building:"A", floor:"2-qavat", capacity:6,  occupied:1, status:"available",   type:"Individual", features:["Wi-Fi","Quvvat"],        color:"#059669", tourDesc:"Quvvat paneli va Wi-Fi. Uzoq sessiya uchun ideal."},
  {id:"A-A13", code:"A13", building:"A", floor:"2-qavat", capacity:8,  occupied:2, status:"available",   type:"Guruh",      features:["Wi-Fi","Monitor"],       color:"#0891b2", tourDesc:"Katta guruh xonasi. Monitor bilan birgalikda ishlash."},
  {id:"A-A14", code:"A14", building:"A", floor:"2-qavat", capacity:8,  occupied:4, status:"limited",     type:"Guruh",      features:["Wi-Fi","Printer"],       color:"#6366f1", tourDesc:"Printer va skaner bilan jihozlangan guruh xonasi."},
  {id:"A-A15", code:"A15", building:"A", floor:"2-qavat", capacity:10, occupied:3, status:"available",   type:"Konferens",  features:["Wi-Fi","Proyektor"],     color:"#059669", tourDesc:"Katta konferens zali. 10 kishilik stol, proyektor."},
  {id:"A-A16", code:"A16", building:"A", floor:"2-qavat", capacity:6,  occupied:0, status:"maintenance", type:"Individual", features:["Wi-Fi"],                 color:"#94a3b8", tourDesc:"Hozir texnik xizmat olib borilmoqda."},
  // B-bino  1-qavat
  {id:"B-B1",  code:"B1",  building:"B", floor:"1-qavat", capacity:4,  occupied:0, status:"available",   type:"Individual", features:["Wi-Fi","Klimat"],        color:"#6366f1", tourDesc:"B-bino kutubxonasining kirish qismida. Klimat nazorat, qulay muhit."},
  {id:"B-B2",  code:"B2",  building:"B", floor:"1-qavat", capacity:6,  occupied:2, status:"available",   type:"Guruh",      features:["Wi-Fi","Monitor"],       color:"#0891b2", tourDesc:"B-bino guruh xonasi. Markaziy monitor, aylana stol."},
  {id:"B-B3",  code:"B3",  building:"B", floor:"1-qavat", capacity:4,  occupied:3, status:"limited",     type:"Individual", features:["Wi-Fi"],                 color:"#d97706", tourDesc:"Sokin o'quv uchun individual kabinet."},
  {id:"B-B4",  code:"B4",  building:"B", floor:"1-qavat", capacity:8,  occupied:6, status:"almost_full", type:"Guruh",      features:["Wi-Fi","Proyektor"],     color:"#7c3aed", tourDesc:"Guruh va seminar uchun proyektor xonasi."},
  {id:"B-B5",  code:"B5",  building:"B", floor:"1-qavat", capacity:4,  occupied:1, status:"available",   type:"Individual", features:["Wi-Fi","Printer"],       color:"#059669", tourDesc:"Printer va tezkor internet. Hujjat ishlash uchun."},
  {id:"B-B6",  code:"B6",  building:"B", floor:"1-qavat", capacity:6,  occupied:3, status:"limited",     type:"Individual", features:["Wi-Fi","Klimat"],        color:"#dc2626", tourDesc:"Klimat boshqaruvli qulay xona."},
  {id:"B-B7",  code:"B7",  building:"B", floor:"1-qavat", capacity:8,  occupied:2, status:"available",   type:"Guruh",      features:["Wi-Fi","Ekran"],         color:"#0891b2", tourDesc:"Katta ekranli guruh xonasi. Ko'rgazma va taqdimot uchun."},
  {id:"B-B8",  code:"B8",  building:"B", floor:"1-qavat", capacity:4,  occupied:4, status:"full",        type:"Individual", features:["Wi-Fi"],                 color:"#94a3b8", tourDesc:"Hozir to'la."},
  // B-bino  2-qavat
  {id:"B-B9",  code:"B9",  building:"B", floor:"2-qavat", capacity:10, occupied:3, status:"available",   type:"Konferens",  features:["Wi-Fi","Proyektor","Ekran"], color:"#6366f1", tourDesc:"B-bino asosiy konferens zali. 10 kishi, to'liq A/V jihozlar."},
  {id:"B-B10", code:"B10", building:"B", floor:"2-qavat", capacity:6,  occupied:4, status:"limited",     type:"Guruh",      features:["Wi-Fi","Monitor"],       color:"#d97706", tourDesc:"Monitor va yozuv doskasi bilan guruh xonasi."},
  {id:"B-B11", code:"B11", building:"B", floor:"2-qavat", capacity:4,  occupied:0, status:"available",   type:"Individual", features:["Wi-Fi","Klimat"],        color:"#059669", tourDesc:"Yuqori qavatda tinch individual kabinet."},
  {id:"B-B12", code:"B12", building:"B", floor:"2-qavat", capacity:6,  occupied:2, status:"available",   type:"Individual", features:["Wi-Fi","Quvvat"],        color:"#7c3aed", tourDesc:"Quvvat paneli va sokin muhit."},
  {id:"B-B13", code:"B13", building:"B", floor:"2-qavat", capacity:8,  occupied:5, status:"limited",     type:"Guruh",      features:["Wi-Fi","Proyektor"],     color:"#0284c7", tourDesc:"Katta guruh xonasi, proyektor bilan."},
  {id:"B-B14", code:"B14", building:"B", floor:"2-qavat", capacity:4,  occupied:1, status:"available",   type:"Individual", features:["Wi-Fi"],                 color:"#16a34a", tourDesc:"Yuqori qavat — eng tinch xona."},
  {id:"B-B15", code:"B15", building:"B", floor:"2-qavat", capacity:6,  occupied:2, status:"available",   type:"Guruh",      features:["Wi-Fi","Monitor","Printer"], color:"#d97706", tourDesc:"Guruh xonasi. Printer, monitor va sokin muhit."},
  {id:"B-B16", code:"B16", building:"B", floor:"2-qavat", capacity:4,  occupied:0, status:"maintenance", type:"Individual", features:["Wi-Fi"],                 color:"#94a3b8", tourDesc:"Texnik xizmat davom etmoqda."},
];

/* ── Synthesise a library-style equirectangular panorama ── */
function buildPanorama(color: string, roomType: string): string {
  const W = 2048, H = 1024;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  /* Sky / ceiling */
  const ceil = ctx.createLinearGradient(0,0,0,H*0.3);
  ceil.addColorStop(0,   "#1e293b");
  ceil.addColorStop(0.5, "#1e293bcc");
  ceil.addColorStop(1,   "#27364700");
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 0, W, H);

  /* Floor */
  const floor = ctx.createLinearGradient(0, H*0.55, 0, H);
  floor.addColorStop(0,   "#c9a96e");
  floor.addColorStop(0.4, "#b8935a");
  floor.addColorStop(1,   "#8B6914");
  ctx.fillStyle = floor;
  ctx.fillRect(0, H*0.55, W, H*0.45);

  /* Wood floor planks */
  ctx.strokeStyle = "#a0784444";
  ctx.lineWidth = 1;
  for(let y = H*0.57; y < H; y += 18) {
    const perspective = (y - H*0.55) / (H*0.45);
    ctx.globalAlpha = 0.25 + perspective * 0.3;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  /* Back wall */
  const wall = ctx.createLinearGradient(0, 0, 0, H*0.6);
  wall.addColorStop(0,   "#334155");
  wall.addColorStop(0.4, "#475569");
  wall.addColorStop(1,   "#64748b");
  ctx.fillStyle = wall;
  ctx.fillRect(0, H*0.15, W, H*0.42);

  /* Ceiling panel */
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, W, H*0.17);

  /* Ceiling lights */
  for(let x = 200; x < W; x += 320) {
    const lg = ctx.createRadialGradient(x, H*0.14, 2, x, H*0.14, 90);
    lg.addColorStop(0,   "rgba(255,245,200,0.9)");
    lg.addColorStop(0.3, "rgba(255,240,180,0.4)");
    lg.addColorStop(1,   "rgba(255,240,180,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(x-90, H*0.0, 180, H*0.18);
    ctx.fillStyle = "#fff9e6";
    ctx.fillRect(x-24, H*0.12, 48, 8);
    ctx.fillStyle = "rgba(255,250,220,0.7)";
    ctx.fillRect(x-16, H*0.12, 32, 14);
  }

  /* Bookshelves on left half */
  for(let bx = 0; bx < W/2; bx += 110) {
    ctx.fillStyle = "#78350f";
    ctx.fillRect(bx, H*0.18, 100, H*0.37);
    // shelves
    for(let shelf = 0; shelf < 5; shelf++) {
      const sy = H*0.21 + shelf * (H*0.068);
      ctx.fillStyle = "#92400e";
      ctx.fillRect(bx, sy, 100, 4);
      // books
      let bkx = bx + 4;
      while(bkx < bx + 96) {
        const bw = 8 + Math.floor(Math.sin(bkx * 0.3 + shelf) * 4);
        const bh = 28 + Math.floor(Math.cos(bkx * 0.2) * 10);
        const hue = (bkx * 17 + shelf * 40) % 360;
        ctx.fillStyle = `hsl(${hue},55%,38%)`;
        ctx.fillRect(bkx, sy + 4, bw - 1, bh);
        ctx.fillStyle = `hsl(${hue},40%,70%)`;
        ctx.fillRect(bkx + 1, sy + 5, bw - 3, 4);
        bkx += bw;
      }
    }
    ctx.fillStyle = "#451a03";
    ctx.fillRect(bx, H*0.18, 5, H*0.37);
    ctx.fillRect(bx+95, H*0.18, 5, H*0.37);
  }

  /* Windows on right half */
  for(let wx = W/2+60; wx < W; wx += 260) {
    // window frame
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(wx, H*0.19, 160, H*0.3);
    // sky view through window
    const sky = ctx.createLinearGradient(wx, H*0.21, wx, H*0.46);
    sky.addColorStop(0, "#bfdbfe");
    sky.addColorStop(0.6, "#93c5fd");
    sky.addColorStop(1, "#60a5fa");
    ctx.fillStyle = sky;
    ctx.fillRect(wx+6, H*0.21, 148, H*0.26);
    // window panes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(wx+80, H*0.21); ctx.lineTo(wx+80, H*0.47); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wx+6, H*0.34); ctx.lineTo(wx+154, H*0.34); ctx.stroke();
    // light spill on floor
    const spill = ctx.createLinearGradient(wx+30, H*0.55, wx+110, H*0.9);
    spill.addColorStop(0, "rgba(147,197,253,0.15)");
    spill.addColorStop(1, "rgba(147,197,253,0)");
    ctx.fillStyle = spill;
    ctx.fillRect(wx, H*0.55, 160, H*0.45);
  }

  /* Desks in center – based on roomType */
  if(roomType === "Konferens") {
    // large oval conference table
    ctx.fillStyle = "#92400e";
    ctx.beginPath(); ctx.ellipse(W/2, H*0.56, 260, 40, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#78350f";
    ctx.beginPath(); ctx.ellipse(W/2, H*0.545, 260, 40, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#a16207cc";
    ctx.beginPath(); ctx.ellipse(W/2, H*0.54, 248, 30, 0, 0, Math.PI*2); ctx.fill();
    // chairs
    for(let i=0; i<10; i++) {
      const angle = (i/10)*Math.PI*2;
      const cx = W/2 + Math.cos(angle)*290;
      const cy = H*0.555 + Math.sin(angle)*60;
      ctx.fillStyle = "#1e293bcc";
      ctx.beginPath(); ctx.ellipse(cx, cy, 22, 14, angle, 0, Math.PI*2); ctx.fill();
    }
  } else if(roomType === "Guruh") {
    // round table
    ctx.fillStyle = "#92400e";
    ctx.beginPath(); ctx.ellipse(W/2, H*0.565, 140, 28, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#a16207";
    ctx.beginPath(); ctx.ellipse(W/2, H*0.55, 140, 28, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ca8a04aa";
    ctx.beginPath(); ctx.ellipse(W/2, H*0.545, 128, 20, 0, 0, Math.PI*2); ctx.fill();
    for(let i=0; i<6; i++) {
      const angle = (i/6)*Math.PI*2;
      const cx = W/2 + Math.cos(angle)*168;
      const cy = H*0.56 + Math.sin(angle)*38;
      ctx.fillStyle = "#334155bb";
      ctx.beginPath(); ctx.ellipse(cx, cy, 18, 12, angle, 0, Math.PI*2); ctx.fill();
    }
  } else {
    // individual desks in rows
    for(let row=0; row<2; row++) {
      for(let col=0; col<6; col++) {
        const dx = W*0.18 + col * (W*0.11);
        const dy = H*(0.54 + row*0.07);
        ctx.fillStyle = "#92400e";
        ctx.fillRect(dx, dy, 90, 30);
        ctx.fillStyle = "#b45309";
        ctx.fillRect(dx, dy-2, 90, 8);
        // laptop on desk
        if((row+col)%3 !== 0) {
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(dx+15, dy-14, 50, 14);
          ctx.fillStyle = color+"88";
          ctx.fillRect(dx+17, dy-12, 46, 10);
        }
        // chair
        ctx.fillStyle = "#33415588";
        ctx.fillRect(dx+10, dy+34, 60, 28);
      }
    }
  }

  /* Colour accent overlay reflecting room colour */
  const accent = ctx.createLinearGradient(0, H*0.15, 0, H*0.57);
  accent.addColorStop(0, color+"08");
  accent.addColorStop(0.5, color+"05");
  accent.addColorStop(1, color+"00");
  ctx.fillStyle = accent;
  ctx.fillRect(0, H*0.15, W, H*0.42);

  /* Vignette */
  const vig = ctx.createRadialGradient(W/2,H/2,H*0.15, W/2,H/2,W*0.7);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  return c.toDataURL("image/jpeg", 0.82);
}

/* ── 360° Viewer ─────────────────────────────────────── */
interface TourProps { room: Room; allRooms: Room[]; onClose: ()=>void; onGoto: (id:string)=>void; }

function VirtualTour({ room, allRooms, onClose, onGoto }: TourProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  // neighbours in same building
  const siblings = allRooms.filter(r => r.building === room.building && r.id !== room.id && r.status !== "maintenance");

  useEffect(() => {
    const pannellum = (window as any).pannellum;
    if (!pannellum || !divRef.current) return;

    const panorama = buildPanorama(room.color, room.type);

    // Build hotspots pointing to adjacent rooms
    const hotSpots = siblings.slice(0, 4).map((r, i) => ({
      pitch: -5,
      yaw: -80 + i * 55,
      type: "info",
      text: `${r.code} — ${r.type}`,
      clickHandlerFunc: () => onGoto(r.id),
      cssClass: "pnlm-hotspot-custom",
    }));

    viewerRef.current = pannellum.viewer(divRef.current, {
      type: "equirectangular",
      panorama,
      autoLoad: true,
      autoRotate: -2,
      autoRotateInactivityDelay: 3000,
      showControls: false,
      compass: false,
      hotSpots,
      strings: { loadingLabel: "Panorama yuklanmoqda…" },
      hfov: 110,
      minHfov: 60,
      maxHfov: 140,
    });

    return () => { try { viewerRef.current?.destroy(); } catch(_){} };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id]);

  const meta = STATUS_META[room.status];

  return (
    <div className="vt-shell">
      {/* Top bar */}
      <div className="vt-topbar">
        <div className="vt-topbar-left">
          <span className="vt-badge" style={{background:room.color}}>{room.building}-bino · {room.code}</span>
          <div>
            <div className="vt-room-name">{room.type} xonasi · {room.floor}</div>
            <div className="vt-room-desc">{room.tourDesc}</div>
          </div>
        </div>
        <div className="vt-topbar-right">
          <span className="vt-status-pill" style={{color:meta.color,background:meta.bg,border:`1px solid ${meta.ring}`}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:meta.color,display:"inline-block"}}/>
            {meta.label} · {room.capacity - room.occupied}/{room.capacity} o'rin
          </span>
          <div className="vt-feats">
            {room.features.map(f=><span key={f} className="vt-feat">{f}</span>)}
          </div>
        </div>
        <button className="vt-close" onClick={onClose} title="Yopish">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Pannellum container */}
      <div className="vt-viewer" ref={divRef}/>

      {/* Controls hint */}
      <div className="vt-hint">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        Sichqoncha bilan aylantirib ko'ring · Scroll — zoom
      </div>

      {/* Bottom nav — adjacent rooms */}
      {siblings.length > 0 && (
        <div className="vt-nav-strip">
          <span className="vt-nav-label">Qo'shni xonalar:</span>
          {siblings.slice(0,6).map(r=>{
            const m = STATUS_META[r.status];
            return (
              <button key={r.id} className="vt-nav-room" onClick={()=>onGoto(r.id)}>
                <span style={{width:7,height:7,borderRadius:"50%",background:m.color,display:"inline-block",flexShrink:0}}/>
                {r.code}
                <span style={{fontSize:9,opacity:.7}}>{r.floor.split("-")[0]}q</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Placeholder notice */}
      <div className="vt-placeholder-notice">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Bu sintetik panorama. Haqiqiy 360° foto olingandan so'ng avtomatik almashtiradi.
      </div>
    </div>
  );
}

/* ── Room card ─────────────────────────────────────────── */
const ROOM_ART = [
  (c:string)=>(
    <svg width="100%" height="100%" viewBox="0 0 200 110" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="110" fill={c+"12"}/>
      <rect x="0" y="78" width="200" height="32" fill={c+"0a"}/>
      {[0,40,80,120,160].map(x=>(
        <g key={x}><rect x={x+2} y="8" width="34" height="44" rx="2" fill={c+"30"}/>
        {[0,1,2,3,4].map(r=><rect key={r} x={x+5} y={13+r*8} width={18+Math.sin(x*r)*6} height="5" rx="1" fill={c+"70"}/>)}
        </g>
      ))}
      <rect x="20" y="60" width="160" height="14" rx="3" fill={c} opacity=".45"/>
      {[30,70,110,150].map(cx=><rect key={cx} x={cx} y="52" width="18" height="11" rx="2" fill="#fff" opacity=".6"/>)}
    </svg>
  ),
  (c:string)=>(
    <svg width="100%" height="100%" viewBox="0 0 200 110" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="110" fill={c+"10"}/>
      <ellipse cx="100" cy="72" rx="54" ry="22" fill={c+"45"}/>
      <ellipse cx="100" cy="68" rx="54" ry="22" fill={c+"60"}/>
      <ellipse cx="100" cy="66" rx="46" ry="16" fill={c+"18"}/>
      {[100,134,148,116,84,52,66].map((cx,i)=><ellipse key={i} cx={cx} cy={i<4?50:86} rx="11" ry="7" fill="#fff" opacity=".6"/>)}
      <rect x="62" y="6" width="76" height="22" rx="3" fill="#1e293b" opacity=".5"/>
    </svg>
  ),
  (c:string)=>(
    <svg width="100%" height="100%" viewBox="0 0 200 110" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="110" fill={c+"0e"}/>
      <rect x="10" y="8" width="180" height="28" rx="3" fill={c+"35"} stroke={c+"50"} strokeWidth="1.5"/>
      {[0,1,2].map(row=>[0,1,2,3,4].map(col=>(
        <g key={`${row}${col}`}>
          <rect x={18+col*36} y={44+row*20} width="28" height="14" rx="2" fill="#fff" stroke={c+"25"} strokeWidth="1" opacity=".8"/>
          <rect x={22+col*36} y={47+row*20} width="20" height="7" rx="1" fill={c+"20"}/>
        </g>
      )))}
    </svg>
  ),
  (c:string)=>(
    <svg width="100%" height="100%" viewBox="0 0 200 110" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="110" fill={c+"10"}/>
      <rect x="0" y="0" width="200" height="36" fill={c+"22"}/>
      {[0,1,2,3,4,5].map(s=>(
        <g key={s}>
          <rect x={4+s*33} y="3" width="28" height="30" rx="2" fill={c+"38"}/>
          {[0,1,2,3].map(b=><rect key={b} x={6+s*33} y={5+b*7} width={14+Math.sin(s+b)*5} height="5" rx="1" fill={c+"72"}/>)}
        </g>
      ))}
      {[30,100,170].map((x,i)=>(
        <g key={i}>
          <rect x={x-30} y="46" width="60" height="38" rx="5" fill="#fff" stroke={c+"25"} strokeWidth="1.5"/>
          <rect x={x-24} y="52" width="48" height="20" rx="2" fill={c+"15"}/>
        </g>
      ))}
    </svg>
  ),
];

function roomArtIdx(room: Room) {
  if(room.type==="Konferens") return 2;
  if(room.type==="Guruh") return 1;
  const n = parseInt(room.code.replace(/[AB]/,""));
  return n%2===0 ? 3 : 0;
}

/* ── Occupancy ring ───────────────────────────────────── */
function OccRing({pct,size=64}:{pct:number;size?:number}) {
  const r=size*0.37, c2=size/2, circ=2*Math.PI*r;
  const col = pct>80?"#ef4444":pct>55?"#f97316":"#22c55e";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
      <circle cx={c2} cy={c2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={size*0.08}/>
      <circle cx={c2} cy={c2} r={r} fill="none" stroke={col} strokeWidth={size*0.08}
        strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"/>
    </svg>
  );
}

/* ── Sparkline ─────────────────────────────────────────── */
function Spark() {
  const pts=[10,18,30,55,72,84,80,74,66,58,42,26];
  const W=200,H=44,max=Math.max(...pts);
  const path=pts.map((v,i)=>`${i===0?"M":"L"}${(i/(pts.length-1))*W},${H-((v/max)*(H-4))+2}`).join(" ");
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs><linearGradient id="rrs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity=".22"/><stop offset="100%" stopColor="#6366f1" stopOpacity="0"/></linearGradient></defs>
      <path d={`${path} L${W},${H} L0,${H} Z`} fill="url(#rrs)"/>
      <path d={path} fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════ */
export function ReadingRoomPage() {
  const { user } = useAuth();

  const [building,     setBuilding]     = useState<Building>("A");
  const [filterFloor,  setFilterFloor]  = useState("Barchasi");
  const [filterType,   setFilterType]   = useState("Barchasi");
  const [filterStatus, setFilterStatus] = useState<RoomStatus|"all">("all");
  const [selected,     setSelected]     = useState<Room|null>(null);
  const [tourRoom,     setTourRoom]     = useState<Room|null>(null);
  const [step,         setStep]         = useState<1|2|3>(1);
  const [success,      setSuccess]      = useState(false);
  const [form, setForm] = useState({date:new Date().toISOString().slice(0,10),start:"10:00",end:"12:00"});

  const buildingRooms = ROOMS.filter(r=>r.building===building);

  const totalSeats    = buildingRooms.reduce((s,r)=>s+r.capacity,0);
  const totalOccupied = buildingRooms.reduce((s,r)=>s+r.occupied,0);
  const livePct       = Math.round((totalOccupied/totalSeats)*100);

  const filtered = useMemo(()=>buildingRooms.filter(r=>{
    if(filterFloor!=="Barchasi" && r.floor!==filterFloor) return false;
    if(filterType !=="Barchasi" && r.type !==filterType)  return false;
    if(filterStatus!=="all" && r.status!==filterStatus)   return false;
    return true;
  }),[buildingRooms, filterFloor,filterType,filterStatus]);

  function openRoom(room:Room){ if(room.status==="maintenance"||room.status==="full") return; setSelected(room);setStep(1);setSuccess(false); }
  function openTour(room:Room,e:React.MouseEvent){ e.stopPropagation(); setTourRoom(room); }

  function handleBook(e:FormEvent){ e.preventDefault(); setStep(2); setTimeout(()=>{ setSuccess(true);setStep(3); },900); }

  const floors = [...new Set(buildingRooms.map(r=>r.floor))];

  if(tourRoom) return (
    <VirtualTour
      room={tourRoom}
      allRooms={ROOMS}
      onClose={()=>setTourRoom(null)}
      onGoto={id=>{ const r=ROOMS.find(x=>x.id===id); if(r) setTourRoom(r); }}
    />
  );

  return (
    <div className="rr2-page">
      {/* ── HEADER ─────────────────────────── */}
      <div className="rr2-header">
        <div className="rr2-header-left">
          <div className="rr2-breadcrumb">
            <span>ATMU</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>O'quv zallari</span>
          </div>
          <h1 className="rr2-title">O'quv zallari</h1>
          <p className="rr2-subtitle">2 ta bino · 32 ta xona · 08:00–20:00</p>

          {/* Building tabs */}
          <div className="rr2-bldg-tabs">
            {(["A","B"] as Building[]).map(b=>(
              <button key={b} className={`rr2-bldg-tab${building===b?" on":""}`}
                onClick={()=>{ setBuilding(b);setFilterFloor("Barchasi");setFilterType("Barchasi");setFilterStatus("all"); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>
                </svg>
                {b}-bino
                <span className="rr2-bldg-count">
                  {ROOMS.filter(r=>r.building===b&&r.status==="available").length} bo'sh
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rr2-header-stats">
          <div className="rr2-stat-card">
            <div style={{position:"relative",width:64,height:64,flexShrink:0}}>
              <OccRing pct={livePct}/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                <span style={{fontSize:14,fontWeight:900,color:"#0f172a",lineHeight:1}}>{livePct}%</span>
                <span style={{fontSize:8,color:"#64748b",fontWeight:600,letterSpacing:.5}}>BAND</span>
              </div>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:800,color:"#0f172a"}}>{building}-bino jonli bandlik</div>
              <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{totalOccupied}/{totalSeats} o'rin</div>
              <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                {([["#22c55e",buildingRooms.filter(r=>r.status==="available").length,"bo'sh"],
                   ["#eab308",buildingRooms.filter(r=>r.status==="limited").length,"cheklangan"],
                   ["#ef4444",buildingRooms.filter(r=>r.status==="full").length,"to'la"]] as [string,number,string][]).map(([c,n,l])=>(
                  <span key={l} style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"#475569"}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:c,display:"inline-block"}}/>
                    <b style={{color:"#0f172a"}}>{n}</b> {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Virtual tour teaser button */}
          <button className="rr2-tour-teaser" onClick={()=>{
            const first = buildingRooms.find(r=>r.status==="available");
            if(first) setTourRoom(first);
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" opacity=".5"/>
            </svg>
            <div>
              <div style={{fontWeight:800,fontSize:13}}>360° Virtual sayohat</div>
              <div style={{fontSize:10,opacity:.7,marginTop:1}}>Kutubxona ichini ko'ring</div>
            </div>
          </button>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────── */}
      <div className="rr2-body">
        {/* Left — grid */}
        <div className="rr2-grid-col">
          {/* Filter chips */}
          <div className="rr2-chips">
            <div className="rr2-chips-group">
              {floors.map(f=>(
                <button key={f} className={`rr2-chip${filterFloor===f?" on":""}`}
                  onClick={()=>setFilterFloor(filterFloor===f?"Barchasi":f)}>
                  {f}
                </button>
              ))}
            </div>
            <div className="rr2-chips-sep"/>
            <div className="rr2-chips-group">
              {(["all","available","limited","almost_full","full","maintenance"] as const).map(s=>{
                const meta = s==="all"?null:STATUS_META[s];
                const count = s==="all"?filtered.length:buildingRooms.filter(r=>r.status===s).length;
                return (
                  <button key={s} className={`rr2-chip${filterStatus===s?" on":""}`}
                    onClick={()=>setFilterStatus(s)}>
                    {meta && <span style={{width:7,height:7,borderRadius:"50%",background:meta.color,display:"inline-block"}}/>}
                    {s==="all"?"Barchasi":meta!.label}
                    <span className={`rr2-chip-count${filterStatus===s?" on":""}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          <div className="rr2-grid">
            {filtered.length===0 && <div className="rr2-empty">Filtrga mos xona topilmadi</div>}
            {filtered.map(room=>{
              const meta = STATUS_META[room.status];
              const free = room.capacity-room.occupied;
              const pct  = Math.round((room.occupied/room.capacity)*100);
              const ok   = room.status!=="maintenance"&&room.status!=="full";
              const Art  = ROOM_ART[roomArtIdx(room)];
              return (
                <div key={room.id}
                  className={`rr2-card${!ok?" rr2-card--disabled":""}${selected?.id===room.id?" rr2-card--active":""}`}
                  onClick={()=>ok&&openRoom(room)} tabIndex={ok?0:-1}
                  onKeyDown={e=>e.key==="Enter"&&ok&&openRoom(room)}>

                  <div className="rr2-card-art" style={{background:room.color+"14"}}>
                    {Art(room.color)}

                    {/* 360° tour button overlay */}
                    {ok && (
                      <button className="rr2-tour-btn" onClick={e=>openTour(room,e)} title="360° ko'rish">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        360°
                      </button>
                    )}

                    <div className="rr2-art-status" style={{background:meta.bg,color:meta.color,border:`1px solid ${meta.ring}`}}>
                      <span style={{width:6,height:6,borderRadius:"50%",background:meta.color,display:"inline-block",flexShrink:0}}/>
                      {meta.label}
                    </div>
                    <div className="rr2-art-code" style={{background:room.color}}>{room.code}</div>
                    {!ok && <div className="rr2-art-dim"><span>{meta.label}</span></div>}
                  </div>

                  <div className="rr2-card-info">
                    <div className="rr2-card-row">
                      <span className="rr2-card-type" style={{color:room.color}}>{room.type}</span>
                      <span className="rr2-card-floor">{room.floor}</span>
                    </div>
                    <div className="rr2-card-seats">
                      <b style={{color:"#0f172a"}}>{free}</b>/{room.capacity} bo'sh o'rin
                    </div>
                    <div className="rr2-bar">
                      <div className="rr2-bar-fill" style={{width:`${pct}%`,background:meta.color}}/>
                    </div>
                    <div className="rr2-feats">
                      {room.features.slice(0,3).map(f=><span key={f} className="rr2-feat">{f}</span>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — sidebar */}
        <aside className="rr2-side">
          <div className="rr2-side-section">
            <p className="rr2-side-label">Filtrlar</p>
            <div className="rr2-side-filters">
              <div className="rr2-field">
                <label>Qavat</label>
                <select value={filterFloor} onChange={e=>setFilterFloor(e.target.value)}>
                  <option>Barchasi</option>
                  {floors.map(f=><option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="rr2-field">
                <label>Zal turi</label>
                <select value={filterType} onChange={e=>setFilterType(e.target.value)}>
                  <option>Barchasi</option><option>Individual</option><option>Guruh</option><option>Konferens</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rr2-side-divider"/>

          <div className="rr2-side-section">
            <p className="rr2-side-label">Bugungi foydalanish</p>
            <Spark/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              <span style={{fontSize:9,color:"#94a3b8"}}>08:00</span>
              <span style={{fontSize:9,color:"#94a3b8"}}>14:00</span>
              <span style={{fontSize:9,color:"#94a3b8"}}>20:00</span>
            </div>
            <div style={{marginTop:8,display:"flex",alignItems:"baseline",gap:4}}>
              <span style={{fontSize:24,fontWeight:900,color:"#6366f1"}}>68%</span>
              <span style={{fontSize:10,color:"#94a3b8"}}>o'rtacha</span>
            </div>
          </div>

          <div className="rr2-side-divider"/>

          <div className="rr2-side-section">
            <p className="rr2-side-label">Holat</p>
            <div className="rr2-status-list">
              {(Object.entries(STATUS_META) as [RoomStatus,typeof STATUS_META[RoomStatus]][]).map(([k,v])=>{
                const n = buildingRooms.filter(r=>r.status===k).length;
                return (
                  <div key={k} className="rr2-status-row" onClick={()=>setFilterStatus(filterStatus===k?"all":k)}
                    style={{cursor:"pointer",opacity:filterStatus!=="all"&&filterStatus!==k?.45:1,transition:"opacity .15s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:10,height:10,borderRadius:3,background:v.color,display:"block",flexShrink:0}}/>
                      <span style={{fontSize:12,color:"#334155",fontWeight:500}}>{v.label}</span>
                    </div>
                    <span style={{fontSize:13,fontWeight:800,color:v.color}}>{n}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rr2-side-divider"/>

          {/* Virtual tour CTA */}
          <div className="rr2-side-section" style={{paddingBottom:14}}>
            <button className="rr2-tour-cta" onClick={()=>{
              const first = buildingRooms.find(r=>r.status==="available");
              if(first) setTourRoom(first);
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" opacity=".6"/>
              </svg>
              360° Virtual sayohat
            </button>
            <button className="rr2-cta" style={{marginTop:8}} onClick={()=>{
              const first = filtered.find(r=>r.status==="available");
              if(first) openRoom(first);
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Zal bron qilish
            </button>
          </div>

          <p className="rr2-help">Savol bormi? <a href="#">Bog'laning</a></p>
        </aside>
      </div>

      {/* ── BOOKING MODAL ────────────────────── */}
      {selected && (
        <>
          <div className="rr2-backdrop" onClick={()=>setSelected(null)}/>
          <div className="rr2-modal">
            <button className="rr2-modal-x" onClick={()=>setSelected(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="rr2-modal-art" style={{background:selected.color+"18"}}>
              {ROOM_ART[roomArtIdx(selected)](selected.color)}
              <div className="rr2-modal-art-info">
                <span className="rr2-modal-code" style={{background:selected.color}}>{selected.building}-bino · {selected.code}</span>
                <div>
                  <div style={{fontWeight:800,fontSize:17,color:"#fff",textShadow:"0 1px 8px #0006"}}>{selected.type} xonasi</div>
                  <div style={{fontSize:11,color:"#ffffffcc",marginTop:2}}>{selected.floor} · {selected.capacity} o'rin</div>
                </div>
              </div>
            </div>
            <div className="rr2-modal-body">
              <div className="rr2-modal-feats">
                {selected.features.map(f=><span key={f} className="rr2-feat">{f}</span>)}
                <span className="rr2-feat">{selected.capacity-selected.occupied}/{selected.capacity} bo'sh</span>
              </div>
              {!success?(
                <form onSubmit={handleBook}>
                  <p className="rr2-modal-section">Vaqtni tanlang</p>
                  <div className="rr2-form-grid">
                    <div className="rr2-field"><label>Sana</label><input type="date" value={form.date} min={new Date().toISOString().slice(0,10)} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
                    <div className="rr2-field"><label>Boshlanish</label><select value={form.start} onChange={e=>setForm(f=>({...f,start:e.target.value}))}>{TIME_SLOTS.map(t=><option key={t}>{t}</option>)}</select></div>
                    <div className="rr2-field"><label>Tugash</label><select value={form.end} onChange={e=>setForm(f=>({...f,end:e.target.value}))}>{TIME_SLOTS.map(t=><option key={t}>{t}</option>)}</select></div>
                  </div>
                  <div className="rr2-summary">
                    {([ ["Bino",`${selected.building}-bino`],["Xona",selected.code],["Qavat",selected.floor],["Sana",form.date],["Vaqt",`${form.start}–${form.end}`],...(user?[["Foydalanuvchi",user.full_name]]:[]) ] as [string,string][]).map(([k,v])=>(
                      <div key={k} className="rr2-summary-row"><span>{k}</span><b>{v}</b></div>
                    ))}
                  </div>
                  <div className="rr2-modal-actions">
                    <button type="button" className="rr2-ghost" onClick={()=>setSelected(null)}>Bekor</button>
                    <button type="submit" className="rr2-submit" disabled={step===2}>{step===2?"Saqlanmoqda…":"Bronni tasdiqlash"}</button>
                  </div>
                </form>
              ):(
                <div className="rr2-success">
                  <div className="rr2-success-ring">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3>Bron tasdiqlandi!</h3>
                  <p>{selected.building}-bino · {selected.code} · {form.date} · {form.start}–{form.end}</p>
                  <div className="rr2-qr">
                    <svg width="80" height="80" viewBox="0 0 88 88">
                      <rect width="88" height="88" fill="#fff" rx="6"/>
                      <rect x="8" y="8" width="24" height="24" rx="3" fill="#1e293b"/>
                      <rect x="12" y="12" width="16" height="16" rx="1" fill="#fff"/>
                      <rect x="15" y="15" width="10" height="10" fill="#1e293b"/>
                      <rect x="56" y="8" width="24" height="24" rx="3" fill="#1e293b"/>
                      <rect x="60" y="12" width="16" height="16" rx="1" fill="#fff"/>
                      <rect x="63" y="15" width="10" height="10" fill="#1e293b"/>
                      <rect x="8" y="56" width="24" height="24" rx="3" fill="#1e293b"/>
                      <rect x="12" y="60" width="16" height="16" rx="1" fill="#fff"/>
                      <rect x="15" y="63" width="10" height="10" fill="#1e293b"/>
                      {[40,52,66,40,54,68].map((x,i)=><rect key={i} x={x} y={38+i*6} width={i%2===0?12:7} height={4} rx={1} fill="#1e293b"/>)}
                    </svg>
                    <p>Kirish uchun skanerlang</p>
                    <code>#{Date.now().toString().slice(-7)}</code>
                  </div>
                  <div className="rr2-modal-actions">
                    <button className="rr2-ghost" onClick={()=>setSelected(null)}>Yopish</button>
                    <button className="rr2-submit" onClick={()=>{setSuccess(false);setStep(1);}}>Yangi bron</button>
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
