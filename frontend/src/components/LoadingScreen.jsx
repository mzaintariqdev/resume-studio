// DAY 4 — Loading state while AI is working
import { useState, useEffect } from "react";

const messages = [
  "Reading your resume...",
  "Analyzing the job description...",
  "Matching your skills to the role...",
  "Rewriting resume for ATS...",
  "Writing your cover letter...",
  "Calculating match score...",
  "Almost done...",
];

export default function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
      {/* Spinner */}
      <div style={{
        width: 60, height: 60, borderRadius: "50%",
        border: "3px solid var(--border)",
        borderTop: "3px solid var(--accent)",
        margin: "0 auto 2rem",
        animation: "spin 1s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>AI is working...</h2>
      <p style={{ color: "var(--accent)", fontSize: 15, minHeight: 24, transition: "all 0.3s" }}>
        {messages[msgIdx]}
      </p>
      <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 16 }}>
        Running 3 AI tasks in parallel — usually takes 10–15 seconds
      </p>
    </div>
  );
}