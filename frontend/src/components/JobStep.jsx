// DAY 4 — Step 2: Enter job description + name, then trigger AI
export default function JobStep({ filename, jobDescription, setJobDescription, userName, setUserName, onAnalyze, onBack, error }) {
const ready = jobDescription.replace(/\s/g, "").length > 30;

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", color: "var(--text2)", fontSize: 14, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 6 }}>
        ← Back
      </button>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>✅</span>
        <div>
          <p style={{ fontWeight: 600, fontSize: 14 }}>Resume uploaded</p>
          <p style={{ color: "var(--text2)", fontSize: 12 }}>{filename}</p>
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: "1.5rem" }}>
        Now paste the job description
      </h2>

      {/* Name field */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 6 }}>Your name (for the cover letter)</label>
        <input
          value={userName} onChange={(e) => setUserName(e.target.value)}
          placeholder="e.g. John Doe"
          style={{ width: "100%", padding: "10px 14px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 14 }}
        />
      </div>

      {/* Job description */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 6 }}>
          Job description <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <textarea
          value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here — the more detail, the better the AI can tailor your resume..."
          rows={10}
          style={{ width: "100%", padding: "12px 14px", background: "var(--bg2)", border: `1px solid ${ready ? "var(--accent)" : "var(--border)"}`, borderRadius: 8, color: "var(--text)", fontSize: 14, lineHeight: 1.6 }}
        />
        <p style={{ fontSize: 12, color: jobDescription.length > 50 ? "var(--green)" : "var(--text3)", marginTop: 4 }}>
          {jobDescription.length < 50 ? `${50 - jobDescription.length} more characters needed` : "✓ Good length — AI will analyze this"}
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: "1rem", padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "var(--red)", fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={onAnalyze} disabled={!ready}
        style={{ width: "100%", padding: "14px", background: ready ? "var(--accent)" : "var(--border)", color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 15 }}
      >
        ✦ Analyze with AI — Generate Resume + Cover Letter
      </button>
      <p style={{ textAlign: "center", color: "var(--text3)", fontSize: 12, marginTop: 8 }}>Takes 10–15 seconds • Powered by Groq + Llama 3</p>
    </div>
  );
}