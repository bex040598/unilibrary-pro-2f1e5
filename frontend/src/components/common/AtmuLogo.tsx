export function AtmuLogo({
  size = 80,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  const color = dark ? "#4b77b0" : "#ffffff";
  const ring  = dark ? "rgba(75,119,176,0.55)" : "rgba(255,255,255,0.60)";
  const ring2 = dark ? "rgba(75,119,176,0.25)" : "rgba(255,255,255,0.25)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tashqi halqa */}
      <circle cx="100" cy="100" r="94" stroke={ring} strokeWidth="6" />
      {/* Ichki halqa */}
      <circle cx="100" cy="100" r="81" stroke={ring2} strokeWidth="2.5" />

      {/*
        Asl logotip:  A va M bir-biri ustiga qo'yilgan, T A ning ustunidan o'tadi,
        U pastdan ikki oyoqni birlashtiradi.

        Koordinatalar (viewBox 200×200):
          Chap oyoq pastki:   (34, 160)
          O'ng oyoq pastki:  (166, 160)
          Cho'qqi (A/T):      (100, 34)
          M markaziy V:       (100, 102)
          M chap vertikal yuqori: (34, 58)
          M o'ng vertikal yuqori:(166, 58)
          A ko'ndalang:        y=112
          U egri:              y 138..160
      */}

      {/* ── Asosiy diagonal: chap oyoq → cho'qqi ── */}
      <line x1="34"  y1="160" x2="100" y2="34"
            stroke={color} strokeWidth="13" strokeLinecap="round"/>

      {/* ── Asosiy diagonal: cho'qqi → o'ng oyoq ── */}
      <line x1="100" y1="34"  x2="166" y2="160"
            stroke={color} strokeWidth="13" strokeLinecap="round"/>

      {/* ── T: cho'qqidan o'tadigan keng gorizontal ── */}
      <line x1="48"  y1="34"  x2="152" y2="34"
            stroke={color} strokeWidth="11" strokeLinecap="round"/>

      {/* ── A ko'ndalang chizig'i ── */}
      <line x1="66"  y1="112" x2="134" y2="112"
            stroke={color} strokeWidth="10" strokeLinecap="round"/>

      {/* ── M: chap vertikal ── */}
      <line x1="34"  y1="160" x2="34"  y2="58"
            stroke={color} strokeWidth="12" strokeLinecap="round"/>

      {/* ── M: chap V qirrasi ── */}
      <line x1="34"  y1="58"  x2="100" y2="102"
            stroke={color} strokeWidth="10" strokeLinecap="round"/>

      {/* ── M: o'ng V qirrasi ── */}
      <line x1="100" y1="102" x2="166" y2="58"
            stroke={color} strokeWidth="10" strokeLinecap="round"/>

      {/* ── M: o'ng vertikal ── */}
      <line x1="166" y1="58"  x2="166" y2="160"
            stroke={color} strokeWidth="12" strokeLinecap="round"/>

      {/* ── U: pastdan egri birlashtiruvchi ── */}
      <path d="M 34 130 L 34 152 Q 34 176 100 176 Q 166 176 166 152 L 166 130"
            stroke={color} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export function AtmuBrandMark({
  size = 40,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: dark ? "rgba(75,119,176,0.10)" : "rgba(255,255,255,0.12)",
        border: `1.5px solid ${dark ? "rgba(75,119,176,0.35)" : "rgba(255,255,255,0.30)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <AtmuLogo size={size * 0.88} dark={dark} />
    </div>
  );
}
