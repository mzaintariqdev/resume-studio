// DAY 5 — App with toast notifications + fade transitions
import { useState } from "react";
import UploadStep from "./components/UploadStep.jsx";
import JobStep from "./components/JobStep.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ResultsScreen from "./components/ResultsScreen.jsx";
import Header from "./components/Header.jsx";
import { useToast, ToastContainer } from "./components/Toast.jsx";

export default function App() {
  const [step, setStep] = useState("upload");
  const [resumeText, setResumeText] = useState("");
  const [resumeFilename, setResumeFilename] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [userName, setUserName] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const { toasts, showToast } = useToast();

  function handleUploadDone(text, filename) {
    setResumeText(text);
    setResumeFilename(filename);
    showToast(`Resume loaded — ${filename}`);
    setStep("job");
  }

  async function handleAnalyze() {
    setError("");
    setStep("loading");

    // Sanitize inputs before sending
    const sanitize = (str) => (str || "")
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

    try {
      const res = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: sanitize(resumeText),
          jobDescription: sanitize(jobDescription),
          userName: sanitize(userName),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setResults(data);
      setStep("results");
      showToast("Analysis complete!");
    } catch (err) {
      setError(err.message);
      setStep("job");
      showToast(err.message, "error");
    }
  }

  function handleReset() {
    setStep("upload");
    setResumeText(""); setResumeFilename("");
    setJobDescription(""); setUserName("");
    setResults(null); setError("");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header step={step} onReset={handleReset} />

      <main style={{ flex: 1, maxWidth: 820, margin: "0 auto", width: "100%", padding: "2rem 1rem" }}>
        {step === "upload" && <UploadStep onDone={handleUploadDone} />}
        {step === "job" && (
          <JobStep
            filename={resumeFilename}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            userName={userName}
            setUserName={setUserName}
            onAnalyze={handleAnalyze}
            onBack={() => setStep("upload")}
            error={error}
          />
        )}
        {step === "loading" && <LoadingScreen />}
        {step === "results" && results && (
          <ResultsScreen results={results} onReset={handleReset} onToast={showToast} />
        )}
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}