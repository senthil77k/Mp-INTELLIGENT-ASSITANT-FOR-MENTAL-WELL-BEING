import Sentiment from "sentiment";
const sentiment = new Sentiment();

import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let moodLogs = [];

const activities = [
  { id: 1, type: "breathing", title: "4-7-8 Breathing Exercise", duration: "5 min" },
  { id: 2, type: "journaling", title: "Mindful Tea Break", duration: "10 min" },
  { id: 3, type: "audio", title: "Calm Background Music", duration: "10 min" },
  { id: 4, type: "audio", title: "Guided Meditation", duration: "15 min" },
  { id: 5, type: "audio", title: "Body Scan Meditation", duration: "15 min" },
];

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "AI-Wellness backend running" });
});

app.get("/api/activities", (req, res) => {
  res.json(activities);
});

app.get("/api/moods", (req, res) => {
  res.json(moodLogs);
});

app.post("/api/moods", (req, res) => {
  const entry = {
    id: moodLogs.length + 1,
    mood: req.body.mood,
    sentiment: req.body.sentiment,
    activity: req.body.activity || null,
    timestamp: new Date().toISOString(),
  };
  moodLogs.push(entry);
  res.status(201).json(entry);
});


// 🔥 FIXED SENTIMENT ROUTE
app.post("/api/analyze", (req, res) => {
  const { text } = req.body;
  const result = sentiment.analyze(text);
  let sentimentLabel = "neutral";

  const negativeKeywords = [
    "sad", "scared", "anxious", "panic", "terrified", "worried",
    "hopeless", "nervous", "angry", "tired", "lonely", "depressed",
    "frustrated", "overwhelmed", "stressed"
  ];

  const positiveKeywords = [
    "happy", "excited", "grateful", "proud", "confident",
    "motivated", "calm", "relaxed", "joyful", "energized"
  ];

  const textLower = text.toLowerCase();

  if (negativeKeywords.some(word => textLower.includes(word))) {
    sentimentLabel = "negative";
  } else if (positiveKeywords.some(word => textLower.includes(word))) {
    sentimentLabel = "positive";
  } else {
    sentimentLabel =
      result.score > 1 ? "positive" :
      result.score < 0 ? "negative" :
      "neutral";
  }

  res.json({
    sentiment: sentimentLabel,
    sentimentScore: result.score,
    confidence: Math.abs(result.score) + 1
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
