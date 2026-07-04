export function AtmuLogo({
  size = 80,
}: {
  size?: number;
  dark?: boolean;
}) {
  return (
    <img
      src="/atmu-logo.jpg"
      alt="ATMU"
      width={size}
      height={size}
      style={{
        objectFit: "contain",
        display: "block",
        mixBlendMode: "screen",
        filter: "brightness(1.15) contrast(1.05)",
      }}
    />
  );
}

export function AtmuBrandMark({
  size = 40,
  dark: _dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  return (
    <img
      src="/atmu-logo.jpg"
      alt="ATMU"
      width={size}
      height={size}
      style={{
        objectFit: "contain",
        display: "block",
        mixBlendMode: "screen",
        filter: "brightness(1.15) contrast(1.05)",
        flexShrink: 0,
      }}
    />
  );
}
