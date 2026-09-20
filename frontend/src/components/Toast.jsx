// Toast notification component — shows "Copied!" popups
import { useState, useEffect } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = "success") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }

  return { toasts, showToast };
}

export function ToastContainer({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
          background: t.type === "success" ? "#22c55e" : t.type === "error" ? "#ef4444" : "#6c63ff",
          color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          animation: "slideIn 0.2s ease",
        }}>
          {t.type === "success" ? "✓ " : "⚠ "}{t.message}
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}