export function AtmuLogo({
  size = 80,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  if (dark) {
    // To'q fonda: oq doira ichida logotip (JPEG oq fonni yashiradi)
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        <img
          src="/atmu-logo.jpg"
          alt="ATMU"
          width={size * 0.92}
          height={size * 0.92}
          style={{ objectFit: "contain", display: "block" }}
        />
      </div>
    );
  }

  // Oq fonda: to'g'ridan-to'g'ri logotip
  return (
    <img
      src="/atmu-logo.jpg"
      alt="ATMU"
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block", borderRadius: "50%" }}
    />
  );
}

export function AtmuBrandMark({
  size = 40,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  return <AtmuLogo size={size} dark={dark} />;
}
