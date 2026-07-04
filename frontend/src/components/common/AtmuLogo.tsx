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
      style={{ objectFit: "contain", display: "block" }}
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
      style={{ objectFit: "contain", display: "block", flexShrink: 0 }}
    />
  );
}
