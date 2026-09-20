export default function Header({ step, onReset }) {
  const steps = [
    { key: "upload", label: "Upload Resume" },
    { key: "job", label: "Job Description" },
    { key: "loading", label: "AI Analysis" },
    { key: "results", label: "Results" },
  ];
  const currentIdx = steps.findIndex((s) => s.key === step);

  return (
    <header style={{
      background: "rgba(26,29,39,0.95)", borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100, padding: "0 1.5rem",
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <button onClick={onReset} style={{ background: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Resume Studio</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {steps.map((s, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, opacity: done || active ? 1 : 0.35 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: done ? "var(--green)" : active ? "var(--accent)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: active ? "var(--text)" : "var(--text2)", fontWeight: active ? 600 : 400 }}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div style={{ width: 16, height: 1, background: "var(--border)" }} />}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}