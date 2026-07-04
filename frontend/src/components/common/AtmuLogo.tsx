export function AtmuLogo({
  size = 80,
}: {
  size?: number;
  dark?: boolean;
}) {
  return (
    <img
      src="/atmu-logo.jpg"
      alt="ATMU logotipi"
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
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <img
        src="/atmu-logo.jpg"
        alt="ATMU logotipi"
        width={size}
        height={size}
        style={{ objectFit: "contain", display: "block" }}
      />
    </div>
  );
}
