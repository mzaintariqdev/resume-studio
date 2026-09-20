// DAY 1 — Backend Entry Point (Groq Version)
// Run: npm install && npm run dev
// Test: http://localhost:4000/health
//       http://localhost:4000/api/test-groq

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import uploadRoute from "./routes/upload.js";
import analyzeRoute from "./routes/analyze.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:5175" }));
app.use(express.json({ limit: "10mb" }));

// ── Routes (added in Day 2 & 3) ────────────────────────────────
app.use("/api/upload", uploadRoute);
app.use("/api/analyze", analyzeRoute);

// ── Health check ───────────────────────────────────────────────
app.get("/health", (_, res) => {
  res.json({ status: "ok", message: "Resume Studio backend running!" });
});

// ── DAY 1 TEST: Your very first Groq/LLM API call ─────────────
// Open http://localhost:4000/api/test-groq in browser to see it work
app.get("/api/test-groq", async (_, res) => {
  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b", // free, fast, very capable model
      max_tokens: 200,
        reasoning_effort: "low",                   // how long the reply can be
      messages: [
        {
          role: "system",               // system = Claude's "job description"
          content: "You are a helpful assistant for a resume writing app called Resume Studio."
        },
        {
          role: "user",                 // user = what the person typed
          content: "Say hello and in 2 sentences explain what you help with in this app."
        }
      ]
    });

    // This is always where the AI text lives in Groq responses
    const aiReply = response.choices[0].message.content;

    res.json({
      success: true,
      ai_says: aiReply,
      model: response.model,
      tokens_used: response.usage
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      tip: "Check that GROQ_API_KEY is set in your .env file"
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running  → http://localhost:${PORT}`);
  console.log(`🧪 Test Groq API  → http://localhost:${PORT}/api/test-groq`);
});
