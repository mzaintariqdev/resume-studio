// DAY 5 — Upgraded Results Screen
// New: download button, keyword highlighting, word count, toast notifications, better UI
import { useState } from "react";

function CopyButton({ text, onCopy }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} style={{
      fontSize: 12, padding: "5px 12px",
      background: copied ? "rgba(34,197,94,0.1)" : "var(--bg3)",
      border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "var(--border)"}`,
      borderRadius: 6, color: copied ? "var(--green)" : "var(--text2)",
      display: "flex", alignItems: "center", gap: 5,
    }}>
      {copied ? "✓ Copied!" : "⎘ Copy"}
    </button>
  );
}

function DownloadButton({ text, filename, onDownload }) {
  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    onDownload(`Downloaded ${filename}`);
  }
  return (
    <button onClick={download} style={{
      fontSize: 12, padding: "5px 12px",
      background: "rgba(108,99,255,0.1)",
      border: "1px solid rgba(108,99,255,0.3)",
      borderRadius: 6, color: "var(--accent2)",
      display: "flex", alignItems: "center", gap: 5,
    }}>
      ↓ Download
    </button>
  );
}

function ScoreRing({ score, label, color }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 8px" }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
          <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - score / 100)}
            strokeLinecap="round" transform="rotate(-90 40 40)"
            style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color }}>
          {score}%
        </div>
      </div>
      <p style={{ fontSize: 12, color: "var(--text2)" }}>{label}</p>
    </div>
  );
}

// Highlights missing keywords in the resume text in red
function HighlightedText({ text, keywords }) {
  if (!keywords || keywords.length === 0) {
    return <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{text}</pre>;
  }

  const parts = [];
  let remaining = text;
  let lastIndex = 0;
  const lowerText = text.toLowerCase();

  // Find all keyword positions
  const matches = [];
  keywords.forEach((kw) => {
    const lowerKw = kw.toLowerCase();
    let idx = lowerText.indexOf(lowerKw);
    while (idx !== -1) {
      matches.push({ start: idx, end: idx + kw.length, kw });
      idx = lowerText.indexOf(lowerKw, idx + 1);
    }
  });

  // Sort by position
  matches.sort((a, b) => a.start - b.start);

  let cursor = 0;
  matches.forEach(({ start, end, kw }) => {
    if (start < cursor) return;
    if (start > cursor) parts.push(<span key={cursor}>{text.slice(cursor, start)}</span>);
    parts.push(
      <span key={start} style={{ background: "rgba(34,197,94,0.15)", color: "var(--green)", borderRadius: 3, padding: "0 2px", fontWeight: 500 }}>
        {text.slice(start, end)}
      </span>
    );
    cursor = end;
  });

  if (cursor < text.length) parts.push(<span key={cursor}>{text.slice(cursor)}</span>);

  return (
    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
      {parts}
    </pre>
  );
}

function wordCount(text) {
  return text?.trim().split(/\s+/).filter(Boolean).length || 0;
}

function readTime(text) {
  const words = wordCount(text);
  return Math.ceil(words / 200);
}

export default function ResultsScreen({ results, onReset, onToast }) {
  const [activeTab, setActiveTab] = useState("resume");
  const [showHighlights, setShowHighlights] = useState(true);

  const {
    optimizedResume, coverLetter, matchScore, atsScore,
    verdict, strengths, gaps, missingKeywords
  } = results;

  const scoreColor = matchScore >= 75 ? "var(--green)" : matchScore >= 50 ? "var(--orange)" : "var(--red)";
  const activeText = activeTab === "resume" ? optimizedResume : coverLetter;
  const activeFile = activeTab === "resume" ? "optimized-resume.txt" : "cover-letter.txt";

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Score section */}
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", marginBottom: "1.25rem" }}>
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: "1rem", color: "var(--accent2)" }}>✦ AI Analysis Complete</p>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <ScoreRing score={matchScore} label="Job Match" color={scoreColor} />
          <ScoreRing score={atsScore} label="ATS Score" color="var(--accent)" />
          <div style={{ flex: 1, minWidth: 180 }}>
            <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6 }}>{verdict}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {missingKeywords?.slice(0, 5).map((kw) => (
                <span key={kw} style={{ fontSize: 11, padding: "2px 8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, color: "var(--red)" }}>
                  missing: {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: "1rem" }}>
          <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ fontSize: 11, color: "var(--green)", fontWeight: 600, marginBottom: 6 }}>✓ STRENGTHS</p>
            {strengths?.map((s) => <p key={s} style={{ fontSize: 12, color: "var(--text2)", padding: "2px 0" }}>• {s}</p>)}
          </div>
          <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ fontSize: 11, color: "var(--red)", fontWeight: 600, marginBottom: 6 }}>⚠ GAPS</p>
            {gaps?.map((g) => <p key={g} style={{ fontSize: 12, color: "var(--text2)", padding: "2px 0" }}>• {g}</p>)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1rem", background: "var(--bg2)", padding: 4, borderRadius: 8, border: "1px solid var(--border)" }}>
        {[
          { key: "resume", label: "📄 Optimized Resume" },
          { key: "cover", label: "✉️ Cover Letter" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            flex: 1, padding: "8px", borderRadius: 6, fontWeight: 500, fontSize: 13,
            background: activeTab === tab.key ? "var(--accent)" : "none",
            color: activeTab === tab.key ? "#fff" : "var(--text2)",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content card */}
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <p style={{ fontWeight: 600, fontSize: 13 }}>
              {activeTab === "resume" ? "ATS-Optimized Resume" : "Personalized Cover Letter"}
            </p>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              {wordCount(activeText)} words · {readTime(activeText)} min read
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {activeTab === "resume" && (
              <button onClick={() => setShowHighlights(!showHighlights)} style={{
                fontSize: 11, padding: "4px 10px", background: showHighlights ? "rgba(34,197,94,0.1)" : "var(--bg3)",
                border: `1px solid ${showHighlights ? "rgba(34,197,94,0.3)" : "var(--border)"}`,
                borderRadius: 6, color: showHighlights ? "var(--green)" : "var(--text3)",
              }}>
                {showHighlights ? "✓ Keywords on" : "Keywords off"}
              </button>
            )}
            <CopyButton text={activeText} onCopy={onToast} />
            <DownloadButton text={activeText} filename={activeFile} onDownload={onToast} />
          </div>
        </div>

        {/* Text content with keyword highlighting */}
        <div style={{ background: "var(--bg)", borderRadius: 8, padding: "1rem", maxHeight: 400, overflowY: "auto" }}>
          {activeTab === "resume" && showHighlights
            ? <HighlightedText text={optimizedResume} keywords={strengths?.flatMap(s => s.split(" ").filter(w => w.length > 4))} />
            : <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{activeText}</pre>
          }
        </div>
      </div>

      {/* Reset */}
      <button onClick={onReset} style={{
        width: "100%", marginTop: "1rem", padding: "12px",
        background: "var(--bg2)", border: "1px solid var(--border)",
        borderRadius: 8, color: "var(--text2)", fontWeight: 500, fontSize: 14,
      }}>
        ← Start Over with a New Resume
      </button>
    </div>
  );
}