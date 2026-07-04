export function AtmuLogo({
  size = 80,
}: {
  size?: number;
  dark?: boolean;
}) {
  return (
    <img
      src="/atmu-logo.png"
      alt="ATMU"
      width={size}
      height={size}
      style={{
        objectFit: "contain",
        display: "block",
        borderRadius: "50%",
        border: "none",
        outline: "none",
        background: "transparent",
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
      src="/atmu-logo.png"
      alt="ATMU"
      width={size}
      height={size}
      style={{
        objectFit: "contain",
        display: "block",
        borderRadius: "50%",
        border: "none",
        outline: "none",
        background: "transparent",
        flexShrink: 0,
      }}
    />
  );
}
