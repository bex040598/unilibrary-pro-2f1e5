/**
 * ATMU rasmiy logotipi — aylana ichida A·T·M·U monogramma
 * Asl logotipga mos: ikki halqa, ko'k-kulrang, harflar o'zaro bog'liq
 */
export function AtmuLogo({
  size = 80,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  const stroke = dark ? "#4b77b0" : "#ffffff";
  const strokeSoft = dark ? "rgba(75,119,176,0.45)" : "rgba(255,255,255,0.45)";
  const fill = dark ? "rgba(75,119,176,0.06)" : "rgba(255,255,255,0.06)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tashqi halqa */}
      <circle cx="100" cy="100" r="93" stroke={stroke} strokeWidth="5" opacity="0.55" />
      {/* Ichki halqa */}
      <circle cx="100" cy="100" r="80" stroke={stroke} strokeWidth="2" opacity="0.30" />
      {/* Fon */}
      <circle cx="100" cy="100" r="78" fill={fill} />

      {/* ── A harfi ── */}
      {/* Sol diagonal */}
      <line x1="42" y1="158" x2="100" y2="42" stroke={stroke} strokeWidth="11" strokeLinecap="round" />
      {/* O'ng diagonal */}
      <line x1="100" y1="42" x2="158" y2="158" stroke={stroke} strokeWidth="11" strokeLinecap="round" />
      {/* A ko'ndalang chizig'i */}
      <line x1="68" y1="115" x2="132" y2="115" stroke={stroke} strokeWidth="9" strokeLinecap="round" />

      {/* ── T harfi: A ning uchidan o'tadigan keng ustun ── */}
      <line x1="52" y1="42" x2="148" y2="42" stroke={stroke} strokeWidth="9" strokeLinecap="round" />

      {/* ── M harfi: A ning tashqi ustunlari + ichki V ── */}
      {/* Chap vertikal */}
      <line x1="42" y1="158" x2="42" y2="68" stroke={stroke} strokeWidth="10" strokeLinecap="round" />
      {/* Chap V qirrasi */}
      <line x1="42" y1="68" x2="100" y2="108" stroke={stroke} strokeWidth="9" strokeLinecap="round" />
      {/* O'ng V qirrasi */}
      <line x1="100" y1="108" x2="158" y2="68" stroke={stroke} strokeWidth="9" strokeLinecap="round" />
      {/* O'ng vertikal */}
      <line x1="158" y1="68" x2="158" y2="158" stroke={stroke} strokeWidth="10" strokeLinecap="round" />

      {/* ── U harfi: A ning pastki ikki oyog'ini birlashtiruvchi egri ── */}
      <path
        d="M 42 118 L 42 148 Q 42 172 100 172 Q 158 172 158 148 L 158 118"
        stroke={stroke}
        strokeWidth="9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Header va footer uchun kichik logotip bloki
 */
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
        border: `2px solid ${dark ? "rgba(75,119,176,0.35)" : "rgba(255,255,255,0.30)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <AtmuLogo size={size * 0.85} dark={dark} />
    </div>
  );
}
