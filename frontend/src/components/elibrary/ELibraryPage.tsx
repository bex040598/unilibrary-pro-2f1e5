import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { resources as allResources } from "../../data/mock";

/* ─── Mock ma'lumotlar ─── */
const studentActivity = [
  { id:1, studentName:"Bobur Toshmatov",  studentId:"AT-2301", action:"O'qidi",      resourceTitle:"Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari", date:"2026-06-30 14:22", pages:18 },
  { id:2, studentName:"Malika Yusupova",  studentId:"AT-2302", action:"Yuklab oldi", resourceTitle:"Kiberxavfsizlik bo'yicha o'zbekcha darslik",       date:"2026-06-30 11:05", pages:null },
  { id:3, studentName:"Jasur Abdullayev", studentId:"AT-2304", action:"O'qidi",      resourceTitle:"Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari", date:"2026-06-29 16:48", pages:32 },
  { id:4, studentName:"Zilola Rahimova",  studentId:"AT-2305", action:"Yuklab oldi", resourceTitle:"Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari", date:"2026-06-29 09:14", pages:null },
  { id:5, studentName:"Sherzod Mirzayev", studentId:"AT-2307", action:"O'qidi",      resourceTitle:"Kiberxavfsizlik bo'yicha o'zbekcha darslik",       date:"2026-06-28 13:30", pages:7 },
];

const studentReadHistory = [
  { id:1, title:"Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari", author:"Aziza Yuldasheva", type:"Laboratoriya ishi", date:"2026-06-30", pages:18, totalPages:48, progress:38 },
  { id:2, title:"Kiberxavfsizlik bo'yicha o'zbekcha darslik",      author:"Jasur Qodirov",    type:"Darslik",          date:"2026-06-28", pages:32, totalPages:210, progress:15 },
  { id:3, title:"Mikroiqtisodiyot bo'yicha case study to'plami",   author:"Nodira Mamatqulova",type:"O'quv qo'llanma", date:"2026-06-25", pages:60, totalPages:90, progress:67 },
];

const typeColor: Record<string,string> = {
  "Darslik":"#1457a8","Laboratoriya ishi":"#0e9f6e",
  "O'quv qo'llanma":"#d6a84f","Maqola":"#7c3aed",
  "Video dars":"#dc2626","Test":"#0891b2",
};

const pendingResources  = allResources.filter(r => r.status === "pending_review");
const approvedResources = allResources.filter(r => r.status === "approved");

/* ─── AI Chat ─── */
interface ChatMsg { id:number; role:"user"|"ai"; text:string; time:string; sources?:{title:string;type:string}[] }

const AI_RESPONSES: {k:string[]; a:string; sources?:{title:string;type:string}[]}[] = [
  {
    k:["salom","assalomu alaykum","hello","hi"],
    a:"Assalomu alaykum! Men ATMU Smart UniLibrary AI yordamchisiman.\n\nQuyidagi masalalarda yordam bera olaman:\n— Kitob va resurs qidirish va tavsiya\n— Ilmiy mavzular bo'yicha tushuntirish\n— Iqtibos (citation) tayyorlash\n— O'quv rejasi bo'yicha maslahat\n— Ma'lumotlar bazasi bo'yicha yordam\n\nNima haqida bilmoqchisiz?",
  },
  {
    k:["ma'lumotlar bazasi","database","sql","postgresql"],
    a:"**Ma'lumotlar bazasi** bo'yicha ATMU kutubxonasida quyidagi resurslar mavjud:\n\n**Asosiy adabiyotlar:**\n— Coronel C. — *Database Systems* (10-nashr) — 847 bet\n— Ramakrishnan R. — *Database Management Systems* — inglizcha\n— Aziza Yuldasheva — *Ma'lumotlar bazasi: 2-kurs laboratoriya ishlari* — o'zbekcha\n\n**Mavzular:** SQL so'rovlar, normalizatsiya, ER-diagramma, tranzaksiyalar, indekslar\n\n**Maslahat:** 2-kurs talabalar uchun avval Yuldasheva laboratoriya ishlaridan boshlash tavsiya etiladi.",
    sources:[{title:"Ma'lumotlar bazasi laboratoriya ishlari",type:"Laboratoriya ishi"},{title:"Database Systems — Coronel",type:"Darslik"}],
  },
  {
    k:["dasturlash","python","java","c++","programming"],
    a:"**Dasturlash** bo'yicha kutubxonamizda:\n\n**Python:**\n— Lutz M. — *Learning Python* — 1600 bet (inglizcha)\n— Mirzayev F. — *Python asoslari* — o'zbekcha, 2024-yil\n\n**Java:**\n— Eckel B. — *Thinking in Java* (4-nashr)\n— Oracle rasmiy hujjatlari (onlayn)\n\n**Algoritmlar:**\n— Cormen T. — *Introduction to Algorithms* — fundamental kitob\n\nQaysi til bo'yicha batafsil ma'lumot kerak?",
    sources:[{title:"Python asoslari — Mirzayev",type:"Darslik"},{title:"Introduction to Algorithms",type:"Darslik"}],
  },
  {
    k:["kitob","qidirish","search","topish","mavjud"],
    a:"**Kitob qidirish bo'yicha:**\n\nKutubxonada jami **157 270** ta nashr mavjud:\n— 42 000+ elektron kitob (PDF/EPUB)\n— 12 500+ ilmiy maqola\n— 3 200+ dissertatsiya\n— 90 000+ qog'oz nashr\n\n**Qidiruv usullari:**\n1. Elektron katalog — muallif, nom, kafedra bo'yicha\n2. AI qidiruv — menda so'rang, tavsiya beraman\n3. Kafedra bazasi — yo'nalish bo'yicha\n\nQaysi sohada kitob qidirmoqdasiz?",
  },
  {
    k:["iqtibos","citation","adabiyotlar","bibliografiya","reference"],
    a:"**Iqtibos (Citation) formatlari:**\n\n**APA 7-nashr:**\nMuallif, I. (Yil). *Kitob nomi*. Nashriyot.\nMisol: Yuldasheva, A. (2024). *Ma'lumotlar bazasi asoslari*. ATMU nashriyoti.\n\n**IEEE:**\n[1] I. Muallif, \"Maqola nomi,\" *Jurnal*, vol. X, pp. Y-Z, Yil.\n\n**GOST:**\nMuallif I.O. Kitob nomi. — Shahar: Nashriyot, Yil. — Betlar soni b.\n\nQaysi manba uchun iqtibos kerak? To'liq formatlab beraman.",
  },
  {
    k:["sun'iy intellekt","ai","artificial intelligence","machine learning","ml"],
    a:"**Sun'iy intellekt va Machine Learning:**\n\nATMU kutubxonasida:\n\n**Asosiy adabiyotlar:**\n— Russell S., Norvig P. — *Artificial Intelligence: A Modern Approach* (4-nashr)\n— Goodfellow I. — *Deep Learning* — MIT Press (bepul onlayn)\n— Rashidov A. — *ML asoslari o'zbek tilida* (2025)\n\n**Online resurslar:**\n— Coursera — Andrew Ng Machine Learning kursi\n— Fast.ai — amaliy deep learning\n\nATMU da 47 ta AI/ML yo'nalishidagi dissertatsiya mavjud.\n\nQaysi yo'nalish qiziqtiradi?",
    sources:[{title:"AI: A Modern Approach",type:"Darslik"},{title:"ML asoslari — Rashidov",type:"Darslik"}],
  },
  {
    k:["kiberxavfsizlik","security","xavfsizlik","cybersecurity"],
    a:"**Kiberxavfsizlik** bo'yicha:\n\n**Kutubxonadagi resurslar:**\n— Stallings W. — *Cryptography and Network Security* (7-nashr)\n— Raximov Sh. — *Kiberxavfsizlik asoslari* — o'zbekcha (2023)\n\n**Asosiy mavzular:**\n— Kriptografiya va shifrlash algoritmlari\n— Tarmoq xavfsizligi (firewall, VPN, IDS)\n— Penetrasion testlash\n— Ma'lumotlarni himoya qilish (GDPR, ISO 27001)\n\nQaysi bo'lim bo'yicha chuqurroq ma'lumot kerak?",
    sources:[{title:"Kiberxavfsizlik asoslari — Raximov",type:"Darslik"}],
  },
  {
    k:["referat","kurs ishi","diplom","loyiha","yozish"],
    a:"**Referat va kurs ishi yozish bo'yicha:**\n\n**Tuzilma:**\n1. Mundarija\n2. Kirish — dolzarblik, maqsad, vazifalar (1-2 bet)\n3. Asosiy qism (2-4 bob)\n4. Xulosa (1-2 bet)\n5. Adabiyotlar ro'yxati\n6. Ilovalar\n\n**Adabiyot topish:**\n— ATMU katalog — asosiy adabiyotlar\n— Google Scholar — ilmiy maqolalar\n— ResearchGate — to'liq matnlar\n\n**Plagiat tekshirish:**\n— Antiplagiat.uz, Turnitin\n\nMavzuingiz nima? Adabiyot tavsiya qilib beraman.",
  },
  {
    k:["iqtisodiyot","economics","moliya","finance","buxgalteriya"],
    a:"**Iqtisodiyot va Moliya** bo'yicha:\n\n**Asosiy adabiyotlar:**\n— Mankiw N.G. — *Principles of Economics* (8-nashr)\n— Samuelson P. — *Iqtisodiyot* (o'zbek tarjimasi)\n— Umarov F.R. — *Iqtisodiyot nazariyasi* — ATMU nashri (2022)\n\n**Moliya:**\n— Brealey R. — *Principles of Corporate Finance*\n— O'zbekiston Moliya vazirligi statistik to'plamlari\n\n**Buxgalteriya:**\n— BNMS — O'zbekiston buxgalteriya standartlari\n\nQaysi yo'nalish: makro yoki mikroiqtisodiyot?",
    sources:[{title:"Iqtisodiyot nazariyasi — Umarov",type:"Darslik"}],
  },
];

const QUICK_PROMPTS = [
  "Dasturlash bo'yicha kitob tavsiya qiling",
  "Ma'lumotlar bazasi resurslari",
  "Kurs ishi yozish bo'yicha yordam",
  "AI va Machine Learning haqida",
  "APA iqtibos formati",
  "Kiberxavfsizlik adabiyotlari",
];

function getAIResponse(userMsg: string): { text: string; sources?: {title:string;type:string}[] } {
  const lower = userMsg.toLowerCase();
  for (const resp of AI_RESPONSES) {
    if (resp.k.some(k => lower.includes(k))) {
      return { text: resp.a, sources: resp.sources };
    }
  }
  return {
    text: `**"${userMsg}"** bo'yicha qidiruv natijasi:\n\nKutubxona katalogida shu mavzuga oid materiallar topildi. Aniqroq ma'lumot uchun:\n\n1. **Elektron katalog**ga o'ting\n2. Mavzuni aniqlashtiring — masalan: kafedra, kurs, til\n3. Kutubxonachi bilan bog'laning: library@atmu.uz\n\n**Maslahat:** "Ma'lumotlar bazasi", "Dasturlash", "Iqtisodiyot" kabi kalit so'zlar bilan so'rang — aniq javob beraman.`,
  };
}

/* ─── AI Chat Component ─── */
function AIChat() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      id: 0, role:"ai", time: new Date().toLocaleTimeString("uz",{hour:"2-digit",minute:"2-digit"}),
      text:"Assalomu alaykum! Men **ATMU Smart UniLibrary** sun'iy intellekt yordamchisiman.\n\nQuyidagi masalalarda yordam bera olaman:\n— Kitob va resurs qidirish va tavsiya\n— Ilmiy mavzular bo'yicha tushuntirish\n— Iqtibos (citation) tayyorlash\n— O'quv rejasi bo'yicha maslahat\n\nSavolingizni yozing yoki quyidagi mavzulardan birini tanlang:",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const now = new Date().toLocaleTimeString("uz",{hour:"2-digit",minute:"2-digit"});
    const userMsg: ChatMsg = { id: Date.now(), role:"user", text: text.trim(), time: now };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const resp = getAIResponse(text);
      setMsgs(prev => [...prev, { id: Date.now()+1, role:"ai", text: resp.text, sources: resp.sources, time: new Date().toLocaleTimeString("uz",{hour:"2-digit",minute:"2-digit"}) }]);
      setLoading(false);
    }, 900 + Math.random()*600);
  };

  const renderText = (t: string) =>
    t.split("\n").map((line, i) => {
      const html = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.+?)`/g, "<code>$1</code>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>");
      return <p key={i} className="ai-msg-line" dangerouslySetInnerHTML={{ __html: html }} />;
    });

  return (
    <div className="ai-chat-root">
      {/* Sarlavha */}
      <div className="ai-chat-header">
        <div className="ai-chat-avatar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            <circle cx="9" cy="13" r="1" fill="currentColor"/>
            <circle cx="15" cy="13" r="1" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <div className="ai-chat-name">ATMU AI Kutubxonachi</div>
          <div className="ai-chat-status"><span className="ai-dot"/> Onlayn · 157 270 ta manba</div>
        </div>
        <div className="ai-chat-badge">Beta</div>
      </div>

      {/* Xabarlar */}
      <div className="ai-chat-msgs">
        {msgs.map(m => (
          <div key={m.id} className={`ai-msg ai-msg-${m.role}`}>
            {m.role === "ai" && (
              <div className="ai-msg-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                  <circle cx="9" cy="13" r="1" fill="currentColor"/>
                  <circle cx="15" cy="13" r="1" fill="currentColor"/>
                </svg>
              </div>
            )}
            <div className="ai-msg-bubble">
              <div className="ai-msg-body">{renderText(m.text)}</div>
              {m.sources && m.sources.length > 0 && (
                <div className="ai-msg-sources">
                  <div className="ai-sources-title">Tegishli resurslar:</div>
                  {m.sources.map((s,i) => (
                    <div key={i} className="ai-source-item">
                      <span className="ai-source-type">{s.type}</span>
                      <span>{s.title}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="ai-msg-time">{m.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="ai-msg ai-msg-ai">
            <div className="ai-msg-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              </svg>
            </div>
            <div className="ai-msg-bubble ai-typing">
              <span/><span/><span/>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Tezkor savollar */}
      {msgs.length < 3 && (
        <div className="ai-quick-prompts">
          {QUICK_PROMPTS.map((p,i) => (
            <button key={i} className="ai-quick-btn" onClick={() => send(p)}>{p}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="ai-chat-input-wrap">
        <input
          className="ai-chat-input"
          placeholder="Savol yozing... (masalan: Python bo'yicha kitob toping)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
          disabled={loading}
        />
        <button className="ai-send-btn" onClick={() => send(input)} disabled={loading || !input.trim()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── ResourceCard ─── */
function ResourceCard({ r, showStatus, onRead }: { r: typeof allResources[0]; showStatus?: boolean; onRead?: () => void }) {
  const color = typeColor[r.material_type] ?? "#667085";
  return (
    <div className="elib-resource-card">
      <div className="elib-resource-cover" style={{ background: color }}><span>{r.title[0]}</span></div>
      <div className="elib-resource-info">
        <div className="elib-resource-topline">
          <span className="elib-type-badge" style={{ background:`${color}18`, color }}>{r.material_type}</span>
          {showStatus && (
            <span className={`elib-status-badge elib-status-${r.status}`}>
              {r.status==="approved"?"Tasdiqlangan":r.status==="pending_review"?"Ko'rib chiqilmoqda":"Rad etildi"}
            </span>
          )}
        </div>
        <h3 className="elib-resource-title">{r.title}</h3>
        <p className="elib-resource-meta">{r.author_name} · {r.subject_name} · {r.course}-kurs</p>
        <div className="elib-resource-stats">
          <span>{r.views_count} ko'rish</span><span>{r.downloads_count} yuklab</span><span>{r.average_rating} baho</span>
        </div>
        <div className="elib-resource-actions">
          {r.online_read_allowed && <button type="button" className="elib-btn elib-btn-primary" onClick={onRead}>O'qish</button>}
          {r.download_allowed && <button type="button" className="elib-btn elib-btn-ghost">Yuklab olish</button>}
        </div>
      </div>
    </div>
  );
}

/* ─── TEACHER VIEW ─── */
function TeacherELibrary({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<"resources"|"activity"|"upload"|"ai">("resources");
  const myResources = allResources.slice(0, 4);
  return (
    <div className="elib-page">
      <div className="elib-hero elib-hero-teacher">
        <div className="elib-hero-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <p className="elib-hero-role">O'qituvchi E-Library Profili</p>
          <h1 className="elib-hero-name">Aziza Yuldasheva</h1>
          <p className="elib-hero-dept">Axborot texnologiyalari kafedrasi · Dots.</p>
        </div>
        <div className="elib-hero-stats">
          <div className="elib-hero-stat"><strong>{myResources.length}</strong><span>Materiallar</span></div>
          <div className="elib-hero-stat"><strong>3.2k</strong><span>Ko'rishlar</span></div>
          <div className="elib-hero-stat"><strong>1.8k</strong><span>Yuklashlar</span></div>
          <div className="elib-hero-stat"><strong>47</strong><span>Faol talabalar</span></div>
        </div>
      </div>
      <div className="elib-tabs">
        {([["resources","Materiallarim"],["activity","Talabalar faolligi"],["upload","Material yuklash"],["ai","AI Yordamchi"]] as const).map(([t,lb])=>(
          <button key={t} type="button" className={`elib-tab${activeTab===t?" active":""}`} onClick={()=>setActiveTab(t)}>{lb}</button>
        ))}
      </div>
      {activeTab==="resources" && (
        <div className="elib-content">
          <div className="elib-section-header"><h2>Mening materiallarim ({myResources.length})</h2><Link to={`/${locale}/resources/upload`} className="elib-btn elib-btn-primary">+ Yangi</Link></div>
          <div className="elib-resources-grid">{myResources.map(r=><ResourceCard key={r.id} r={r} showStatus/>)}</div>
        </div>
      )}
      {activeTab==="activity" && (
        <div className="elib-content">
          <div className="elib-section-header"><h2>Talabalar faolligi</h2></div>
          <div className="elib-activity-summary">
            {[["47","Faol talabalar"],["1 230","Jami ko'rishlar"],["742","Jami yuklashlar"],["12","Bu hafta yangi"]].map(([v,l])=>(
              <div key={l} className="elib-activity-stat"><div><strong>{v}</strong><span>{l}</span></div></div>
            ))}
          </div>
          <div className="elib-table-wrap">
            <table className="elib-table">
              <thead><tr><th>Talaba</th><th>ID</th><th>Material</th><th>Harakat</th><th>Sana</th><th>Sahifalar</th></tr></thead>
              <tbody>{studentActivity.map(item=>(
                <tr key={item.id}>
                  <td><div className="elib-student-cell"><div className="elib-avatar">{item.studentName.split(" ").map(n=>n[0]).join("")}</div>{item.studentName}</div></td>
                  <td><span className="elib-id-badge">{item.studentId}</span></td>
                  <td className="elib-resource-cell">{item.resourceTitle}</td>
                  <td><span className={`elib-action-badge ${item.action==="O'qidi"?"read":"download"}`}>{item.action}</span></td>
                  <td className="elib-date-cell">{item.date}</td>
                  <td>{item.pages!=null?`${item.pages} bet`:"—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab==="upload" && (
        <div className="elib-content">
          <div className="elib-section-header"><h2>Yangi material yuklash</h2></div>
          <form className="elib-upload-form" onSubmit={e=>e.preventDefault()}>
            <div className="elib-form-row">
              <div className="elib-form-group"><label>Material nomi</label><input type="text" placeholder="Masalan: Ma'lumotlar bazasi 3-kurs laboratoriyalari"/></div>
              <div className="elib-form-group"><label>Material turi</label><select><option>Darslik</option><option>O'quv qo'llanma</option><option>Laboratoriya ishi</option><option>Ma'ruza matni</option><option>Test savollari</option><option>Video dars</option><option>Ilmiy maqola</option></select></div>
            </div>
            <div className="elib-form-row">
              <div className="elib-form-group"><label>Fan nomi</label><input type="text" placeholder="Masalan: Ma'lumotlar bazasi"/></div>
              <div className="elib-form-group"><label>Kurs / Semestr</label><div style={{display:"flex",gap:8}}><select style={{flex:1}}>{[1,2,3,4].map(s=><option key={s}>{s}-kurs</option>)}</select><select style={{flex:1}}>{[1,2,3,4,5,6,7,8].map(s=><option key={s}>{s}-semestr</option>)}</select></div></div>
            </div>
            <div className="elib-form-group"><label>Tavsif</label><textarea rows={3} placeholder="Material haqida qisqacha ma'lumot..."/></div>
            <div className="elib-dropzone">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              <p>Faylni shu yerga tashlang yoki <strong>tanlang</strong></p>
              <span>PDF, DOCX, PPTX, MP4 · Maks 100 MB</span>
            </div>
            <div className="elib-form-actions">
              <button type="submit" className="elib-btn elib-btn-primary elib-btn-lg">Yuklash</button>
              <button type="button" className="elib-btn elib-btn-ghost elib-btn-lg">Bekor qilish</button>
            </div>
          </form>
        </div>
      )}
      {activeTab==="ai" && <div className="elib-content elib-ai-wrap"><AIChat/></div>}
    </div>
  );
}

/* ─── STUDENT VIEW ─── */
function StudentELibrary({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<"ai"|"browse"|"history"|"loans">("ai");
  const [query, setQuery] = useState("");
  const [readingResource, setReadingResource] = useState<typeof allResources[0]|null>(null);
  const filtered = allResources.filter(r=>r.status==="approved"&&(query===""||`${r.title} ${r.subject_name} ${r.author_name}`.toLowerCase().includes(query.toLowerCase())));

  if (readingResource) return (
    <div className="elib-reader">
      <div className="elib-reader-header">
        <button type="button" className="elib-btn elib-btn-ghost" onClick={()=>setReadingResource(null)}>← Orqaga</button>
        <h2>{readingResource.title}</h2><span>{readingResource.author_name}</span>
      </div>
      <div className="elib-reader-body">
        <div className="elib-reader-sidebar">
          <div className="elib-reader-info">
            <div className="elib-reader-cover" style={{background:typeColor[readingResource.material_type]??"#1457a8"}}><span>{readingResource.title[0]}</span></div>
            <h3>{readingResource.title}</h3><p>{readingResource.author_name}</p><p>{readingResource.subject_name} · {readingResource.course}-kurs</p>
          </div>
          <div className="elib-reader-desc"><h4>Tavsif</h4><p>{readingResource.description}</p></div>
          <div className="elib-reader-tags">{readingResource.tags.map(t=><span key={t} className="elib-tag">{t}</span>)}</div>
        </div>
        <div className="elib-reader-content">
          <div className="elib-pdf-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1457a8" strokeWidth="1"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <p>Hujjat ko'rish paneli</p>
            <p className="elib-pdf-note">Haqiqiy tizimda PDF/EPUB onlayn o'quvchi ko'rsatiladi</p>
            {readingResource.download_allowed && <button type="button" className="elib-btn elib-btn-primary">PDF yuklab olish</button>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="elib-page">
      <div className="elib-hero elib-hero-student">
        <div className="elib-hero-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        <div>
          <p className="elib-hero-role">Talaba E-Library Profili</p>
          <h1 className="elib-hero-name">Bobur Toshmatov</h1>
          <p className="elib-hero-dept">Axborot texnologiyalari · AT-2301 · 2-kurs</p>
        </div>
        <div className="elib-hero-stats">
          <div className="elib-hero-stat"><strong>{filtered.length}</strong><span>Mavjud materiallar</span></div>
          <div className="elib-hero-stat"><strong>{studentReadHistory.length}</strong><span>O'qilganlar</span></div>
          <div className="elib-hero-stat"><strong>2</strong><span>Olingan kitoblar</span></div>
        </div>
      </div>
      <div className="elib-tabs">
        {([["ai","AI Yordamchi"],["browse","Materiallar"],["history","O'qish tarixi"],["loans","Kitoblarim"]] as const).map(([t,lb])=>(
          <button key={t} type="button" className={`elib-tab${activeTab===t?" active":""}`} onClick={()=>setActiveTab(t)}>{lb}</button>
        ))}
      </div>
      {activeTab==="ai"      && <div className="elib-content elib-ai-wrap"><AIChat/></div>}
      {activeTab==="browse"  && (
        <div className="elib-content">
          <div className="elib-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Material nomi, muallif yoki fan..." value={query} onChange={e=>setQuery(e.target.value)}/>
          </div>
          <div className="elib-resources-grid">{filtered.map(r=><ResourceCard key={r.id} r={r} onRead={()=>setReadingResource(r)}/>)}</div>
        </div>
      )}
      {activeTab==="history" && (
        <div className="elib-content">
          <h2 className="elib-content-title">O'qish tarixi</h2>
          <div className="elib-history-list">{studentReadHistory.map(item=>(
            <div key={item.id} className="elib-history-item">
              <div className="elib-history-cover" style={{background:typeColor[item.type]??"#1457a8"}}><span>{item.title[0]}</span></div>
              <div className="elib-history-info">
                <h3>{item.title}</h3><p>{item.author} · {item.type}</p>
                <div className="elib-progress-bar"><div className="elib-progress-fill" style={{width:`${item.progress}%`}}/></div>
                <span className="elib-progress-label">{item.progress}% o'qildi · {item.pages}/{item.totalPages} bet</span>
              </div>
              <div className="elib-history-meta"><span>{item.date}</span><button type="button" className="elib-btn elib-btn-primary">Davom ettirish</button></div>
            </div>
          ))}</div>
        </div>
      )}
      {activeTab==="loans"   && (
        <div className="elib-content">
          <h2 className="elib-content-title">Mening kitoblarim</h2>
          <div className="elib-loans-list">
            {[{t:"Advanced Database Systems",a:"Carlos Coronel · AT-DB-204",d:"2026-07-14",s:"approved",sl:"Faol",bg:"#1457a8"},
              {t:"Kiberxavfsizlik asoslari",a:"Shavkat Raximov · AT-SEC-118",d:"2026-07-03 (2 kun)",s:"pending_review",sl:"Yaqinlashmoqda",bg:"#0e9f6e"}].map(b=>(
              <div key={b.t} className="elib-loan-item">
                <div className="elib-loan-cover" style={{background:b.bg}}>{b.t[0]}</div>
                <div className="elib-loan-info"><h3>{b.t}</h3><p>{b.a}</p><span className={`elib-loan-due${b.s==="pending_review"?" elib-loan-due-warning":""}`}>Qaytarish: {b.d}</span></div>
                <div className="elib-loan-status"><span className={`elib-status-badge elib-status-${b.s}`}>{b.sl}</span><button type="button" className="elib-btn elib-btn-ghost">Muddatni uzaytirish</button></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── LIBRARIAN VIEW ─── */
function LibrarianELibrary({ locale: _locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<"pending"|"all"|"activity"|"ai">("pending");
  return (
    <div className="elib-page">
      <div className="elib-hero elib-hero-librarian">
        <div className="elib-hero-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </div>
        <div>
          <p className="elib-hero-role">Kutubxonachi Boshqaruv Paneli</p>
          <h1 className="elib-hero-name">Mohira Xudoyberdiyeva</h1>
          <p className="elib-hero-dept">Bosh kutubxonachi · ATMU Markaziy kutubxonasi</p>
        </div>
        <div className="elib-hero-stats">
          <div className="elib-hero-stat"><strong>{allResources.length}</strong><span>Jami materiallar</span></div>
          <div className="elib-hero-stat elib-stat-warn"><strong>{pendingResources.length}</strong><span>Ko'rib chiqilmoqda</span></div>
          <div className="elib-hero-stat"><strong>{approvedResources.length}</strong><span>Tasdiqlangan</span></div>
          <div className="elib-hero-stat"><strong>89</strong><span>Faol abonementlar</span></div>
        </div>
      </div>
      <div className="elib-tabs">
        {([["pending",`Ko'rib chiqish (${pendingResources.length})`],["all","Barcha materiallar"],["activity","Umumiy faollik"],["ai","AI Yordamchi"]] as const).map(([t,lb])=>(
          <button key={t} type="button" className={`elib-tab${activeTab===t?" active":""}`} onClick={()=>setActiveTab(t as any)}>{lb}</button>
        ))}
      </div>
      {activeTab==="pending" && (
        <div className="elib-content">
          <div className="elib-section-header"><h2>Ko'rib chiqilishi kerak ({pendingResources.length})</h2></div>
          {pendingResources.length===0 ? (
            <div className="elib-empty"><span style={{fontSize:48}}>✅</span><p>Hamma material ko'rib chiqilgan!</p></div>
          ) : (
            <div className="elib-review-list">{pendingResources.map(r=>(
              <div key={r.id} className="elib-review-item">
                <div className="elib-review-info">
                  <span className="elib-type-badge" style={{background:`${typeColor[r.material_type]??"#667085"}18`,color:typeColor[r.material_type]??"#667085"}}>{r.material_type}</span>
                  <h3>{r.title}</h3><p>{r.author_name} · {r.department_name}</p><p className="elib-review-desc">{r.description}</p>
                </div>
                <div className="elib-review-actions">
                  <button type="button" className="elib-btn elib-btn-success">✓ Tasdiqlash</button>
                  <button type="button" className="elib-btn elib-btn-danger">✕ Rad etish</button>
                </div>
              </div>
            ))}</div>
          )}
        </div>
      )}
      {activeTab==="all" && (
        <div className="elib-content">
          <div className="elib-section-header"><h2>Barcha materiallar ({allResources.length})</h2></div>
          <div className="elib-table-wrap">
            <table className="elib-table">
              <thead><tr><th>Material</th><th>Muallif</th><th>Kafedra</th><th>Tur</th><th>Ko'rishlar</th><th>Holat</th></tr></thead>
              <tbody>{allResources.map(r=>(
                <tr key={r.id}>
                  <td>{r.title}</td><td>{r.author_name}</td><td>{r.department_name}</td>
                  <td><span className="elib-type-badge" style={{background:`${typeColor[r.material_type]??"#667085"}18`,color:typeColor[r.material_type]??"#667085"}}>{r.material_type}</span></td>
                  <td>{r.views_count}</td>
                  <td><span className={`elib-status-badge elib-status-${r.status}`}>{r.status==="approved"?"Tasdiqlangan":r.status==="pending_review"?"Kutilmoqda":"Rad etildi"}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab==="activity" && (
        <div className="elib-content">
          <div className="elib-activity-summary">
            {[["89","Faol talabalar"],["5 234","Jami ko'rishlar"],["2 108","Jami yuklashlar"],["5","Muddati o'tgan"]].map(([v,l])=>(
              <div key={l} className="elib-activity-stat"><div><strong>{v}</strong><span>{l}</span></div></div>
            ))}
          </div>
          <div className="elib-table-wrap">
            <table className="elib-table">
              <thead><tr><th>Talaba</th><th>ID</th><th>Material</th><th>Harakat</th><th>Sana</th></tr></thead>
              <tbody>{studentActivity.map(item=>(
                <tr key={item.id}>
                  <td><div className="elib-student-cell"><div className="elib-avatar">{item.studentName.split(" ").map(n=>n[0]).join("")}</div>{item.studentName}</div></td>
                  <td><span className="elib-id-badge">{item.studentId}</span></td>
                  <td className="elib-resource-cell">{item.resourceTitle}</td>
                  <td><span className={`elib-action-badge ${item.action==="O'qidi"?"read":"download"}`}>{item.action}</span></td>
                  <td className="elib-date-cell">{item.date}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab==="ai" && <div className="elib-content elib-ai-wrap"><AIChat/></div>}
    </div>
  );
}

/* ─── MAIN ─── */
export function ELibraryPage() {
  const { locale = "uz", elibraryRole } = useParams();
  const { user } = useAuth();
  const role = elibraryRole ?? user?.role ?? "student";

  return (
    <div style={{ minHeight:"100vh", background:"#f5f7fa" }}>
      {role==="teacher"   && <TeacherELibrary  locale={locale}/>}
      {role==="student"   && <StudentELibrary  locale={locale}/>}
      {role==="librarian" && <LibrarianELibrary locale={locale}/>}
      {!["teacher","student","librarian"].includes(role) && (
        <div className="elib-page">
          <div className="elib-role-select">
            <h2>E-Library profilini tanlang</h2>
            <div className="elib-role-cards">
              <Link to={`/${locale}/elibrary/student`}   className="elib-role-card">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <h3>Talaba</h3><p>AI yordamchi va materiallar</p>
              </Link>
              <Link to={`/${locale}/elibrary/teacher`}   className="elib-role-card">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <h3>O'qituvchi</h3><p>Material yuklash va monitoring</p>
              </Link>
              <Link to={`/${locale}/elibrary/librarian`} className="elib-role-card">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <h3>Kutubxonachi</h3><p>Barcha materiallar boshqaruvi</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
