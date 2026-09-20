// DAY 3 — AI Analysis with Groq (THE CORE BRAIN)
// Runs 3 AI tasks in parallel: rewrite resume, write cover letter, score match

import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

function getClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

// Helper: send one prompt to Groq and get text back
async function ask(systemPrompt, userMessage) {
  const client = getClient();
  
  // Clean the text to remove any characters that break JSON
  const cleanMessage = userMessage
    .replace(/[\u0000-\u001F\u007F]/g, " ")  // remove control characters
    .replace(/\\/g, "\\\\")                   // escape backslashes
    .trim();

  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-20b",
    max_tokens: 2000,
    reasoning_effort: "low",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: cleanMessage }
    ]
  });
  return response.choices[0].message.content;
}
// POST /api/analyze
// Body: { resumeText, jobDescription, userName }
// Returns: { optimizedResume, coverLetter, matchScore, gaps, strengths, missingKeywords }
router.post("/", async (req, res) => {
  let { resumeText, jobDescription, userName } = req.body;

  // Sanitize inputs — strip control characters, normalize whitespace
  const sanitize = (str) => (str || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  resumeText = sanitize(resumeText);
  jobDescription = sanitize(jobDescription);
  userName = sanitize(userName);

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: "Resume text and job description are required" });
  }

  try {
    console.log("🤖 Sending to Groq (3 parallel AI calls)...");

    // Run all 3 AI tasks at the same time (parallel = faster)
    const [optimizedResume, coverLetter, analysisRaw] = await Promise.all([

      // TASK 1: Rewrite resume to match job description
      ask(
        `You are an expert resume writer. Rewrite the user's resume to maximize their interview chances 
for the specific job. Rules: NEVER invent experience they don't have. Keep same jobs and dates. 
Reorder bullet points so most relevant appear first. Use keywords from the job description naturally 
to help pass ATS systems. Strengthen weak bullets. Return plain text only, no markdown.`,
        `CURRENT RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nRewrite the resume to best match this job.`
      ),

      // TASK 2: Write a personalized cover letter
      ask(
        `You are an expert cover letter writer. Write a professional, genuine cover letter — NOT generic.
3 paragraphs: strong opening hook, why they're the right fit with 2-3 specific examples, call to action.
Never use "I am writing to express my interest" or similar clichés. Sound human and confident.`,
        `USER NAME: ${userName || "[Your Name]"}
RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nWrite the cover letter.`
      ),

      // TASK 3: Score the match and find gaps — returns JSON
      ask(
        `You are a hiring manager. Analyze how well a resume matches a job description.
Return ONLY this JSON, no extra text, no markdown:
{
  "matchScore": <0-100>,
  "verdict": "<one sentence>",
  "strengths": ["<item>", "<item>", "<item>"],
  "gaps": ["<item>", "<item>", "<item>"],
  "missingKeywords": ["<word>", "<word>", "<word>"],
  "atsScore": <0-100>
}`,
        `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`
      ),
    ]);

    // Safely parse the JSON analysis
    let analysis;
    try {
      const jsonMatch = analysisRaw.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisRaw);
    } catch {
      analysis = {
        matchScore: 70, verdict: "Good overall match",
        strengths: ["Relevant experience found"], gaps: ["Some skill gaps detected"],
        missingKeywords: [], atsScore: 65
      };
    }

    console.log(`✅ Done! Match score: ${analysis.matchScore}%`);

    res.json({
      optimizedResume,
      coverLetter,
      matchScore: analysis.matchScore,
      atsScore: analysis.atsScore,
      verdict: analysis.verdict,
      strengths: analysis.strengths || [],
      gaps: analysis.gaps || [],
      missingKeywords: analysis.missingKeywords || []
    });

  } catch (err) {
    console.error("Groq error:", err.message);
    if (err.message?.includes("API key") || err.status === 401) {
      return res.status(401).json({ error: "Invalid GROQ_API_KEY. Check your .env file." });
    }
    res.status(500).json({ error: "AI analysis failed. Please try again." });
  }
});

export default router;
