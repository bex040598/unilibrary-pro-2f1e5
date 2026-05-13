export function StatCard({
  label,
  value,
  helper,
  accent = "blue"
}: {
  label: string;
  value: string;
  helper?: string;
  accent?: "blue" | "teal" | "gold" | "emerald";
}) {
  return (
    <article className={`stat-card stat-${accent}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      {helper ? <span>{helper}</span> : null}
    </article>
  );
}

