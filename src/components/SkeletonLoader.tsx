export default function SkeletonLoader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "8px",
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: "100px", borderRadius: "20px" }}
          />
        ))}
      </div>
      {/* Habit rows */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: "64px", borderRadius: "16px" }}
        />
      ))}
    </div>
  );
}
