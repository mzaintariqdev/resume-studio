// DAY 5 — Upgraded Upload Step with animations and better UX
import { useState, useRef } from "react";

export default function UploadStep({ onDone }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef();

  async function handleFile(file) {
    if (!file) return;
    if (file.type !== "application/pdf") return setError("Please upload a PDF file — other formats not supported yet.");
    if (file.size > 5 * 1024 * 1024) return setError("File too large. Max size is 5MB.");

    setError("");
    setLoading(true);
    setProgress("Reading your PDF...");

    try {
      const form = new FormData();
      form.append("resume", file);

      setProgress("Extracting text from PDF...");
      const res = await fetch("http://localhost:4000/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setProgress(`✓ Found ${data.pages} page${data.pages > 1 ? "s" : ""} — ${Math.round(data.text.length / 5)} words extracted`);
      await new Promise((r) => setTimeout(r, 800)); // brief pause so user sees success
      onDone(data.text, data.filename);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setProgress("");
    }
  }

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem", paddingTop: "1rem" }}>
        <div style={{ fontSize: 44, marginBottom: 12, color: "var(--accent)" }}>✦</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, background: "linear-gradient(135deg, #f1f5f9, var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          AI Resume Optimizer
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 15, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
          Upload your resume, paste a job description, and get an ATS-optimized
          resume + personalized cover letter in under 15 seconds.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: `2px dashed ${dragging ? "var(--accent)" : loading ? "var(--green)" : "var(--border)"}`,
          borderRadius: "var(--radius)", padding: "3rem 2rem", textAlign: "center",
          cursor: loading ? "default" : "pointer",
          background: dragging ? "rgba(108,99,255,0.06)" : "var(--bg2)",
          transition: "all 0.25s",
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])} />

        {loading ? (
          <div>
            <div style={{ fontSize: 32, marginBottom: 10 }}>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
            </div>
            <p style={{ color: "var(--green)", fontWeight: 500, fontSize: 14 }}>{progress}</p>
          </div>
        ) : dragging ? (
          <div>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📥</div>
            <p style={{ color: "var(--accent2)", fontWeight: 600 }}>Drop it!</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 38, marginBottom: 10 }}>📄</div>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Drop your resume PDF here</p>
            <p style={{ color: "var(--text2)", fontSize: 13 }}>or <span style={{ color: "var(--accent2)", textDecoration: "underline" }}>click to browse</span> — PDF only, max 5MB</p>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {error && (
        <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, color: "var(--red)", fontSize: 13, display: "flex", gap: 8 }}>
          <span>⚠</span><span>{error}</span>
        </div>
      )}

      {/* How it works */}
      <div style={{ marginTop: "2rem" }}>
        <p style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>How it works</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[
            { icon: "📤", title: "1. Upload PDF", desc: "Your existing resume — we never invent experience" },
            { icon: "🤖", title: "2. AI rewrites", desc: "Matched to the job keywords & ATS requirements" },
            { icon: "🎯", title: "3. Download", desc: "Optimized resume + cover letter, ready to send" },
          ].map((item) => (
            <div key={item.title} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.title}</p>
              <p style={{ color: "var(--text2)", fontSize: 11, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}