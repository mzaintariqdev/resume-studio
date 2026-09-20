// DAY 2 — PDF Upload & Text Extraction
// Accepts a PDF file, reads it, returns the raw text

import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),        // keep file in RAM, no disk needed
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  },
});

// POST /api/upload
// Body: multipart/form-data, field name = "resume"
// Returns: { text, pages, filename }
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const data = await pdfParse(req.file.buffer);

    if (!data.text || data.text.trim().length < 50) {
      return res.status(400).json({
        error: "Could not extract text. Make sure your PDF is text-based, not a scanned image."
      });
    }

    res.json({
      text: data.text.trim(),
      pages: data.numpages,
      filename: req.file.originalname
    });

  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to read PDF" });
  }
});

export default router;