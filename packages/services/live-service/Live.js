// comment-rating-api.js — Comment & Rating API (Live Backend Style)

const express = require("express");
const app = express();
const PORT = 9100;

app.use(express.json());

// ---------------- In-Memory DB ----------------
let users = [
  { id: 1, name: "Doha" },
  { id: 2, name: "Alex" }
];

let comments = [];
let ratings = [];
let commentId = 1;

/*
 Comment Model
 {
   id,
   userId,
   postId,
   text,
   createdAt
 }

 Rating Model
 {
   userId,
   postId,
   stars (1-5)
 }
*/

// ---------------- COMMENT APIs ----------------

// Add comment
app.post("/api/v1/posts/:postId/comments", (req, res) => {
  const { userId, text } = req.body;
  const { postId } = req.params;

  if (!userId || !text)
    return res.status(400).json({ message: "userId & text required" });

  const comment = {
    id: commentId++,
    userId,
    postId,
    text,
    createdAt: new Date()
  };

  comments.push(comment);

  res.status(201).json({
    success: true,
    message: "Comment added",
    data: comment
  });
});

// Get comments for post
app.get("/api/v1/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;

  const data = comments.filter(c => c.postId == postId);

  res.json({
    success: true,
    total: data.length,
    data
  });
});

// Update comment
app.put("/api/v1/comments/:id", (req, res) => {
  const { text } = req.body;
  const comment = comments.find(c => c.id == req.params.id);

  if (!comment)
    return res.status(404).json({ message: "Comment not found" });

  comment.text = text || comment.text;

  res.json({
    success: true,
    message: "Comment updated",
    data: comment
  });
});

// Delete comment
app.delete("/api/v1/comments/:id", (req, res) => {
  const index = comments.findIndex(c => c.id == req.params.id);

  if (index === -1)
    return res.status(404).json({ message: "Comment not found" });

  comments.splice(index, 1);

  res.json({
    success: true,
    message: "Comment deleted"
  });
});

// ---------------- RATING APIs ----------------

// Rate a post
app.post("/api/v1/posts/:postId/rate", (req, res) => {
  const { userId, stars } = req.body;
  const { postId } = req.params;

  if (!userId || !stars || stars < 1 || stars > 5)
    return res.status(400).json({ message: "Stars must be 1–5" });

  const exists = ratings.find(
    r => r.userId == userId && r.postId == postId
  );

  if (exists) {
    exists.stars = stars; // update rating
  } else {
    ratings.push({ userId, postId, stars });
  }

  res.json({
    success: true,
    message: "Rating saved"
  });
});

// Get rating stats
app.get("/api/v1/posts/:postId/rating", (req, res) => {
  const { postId } = req.params;

  const postRatings = ratings.filter(r => r.postId == postId);

  const avg =
    postRatings.reduce((sum, r) => sum + r.stars, 0) /
    (postRatings.length || 1);

  res.json({
    success: true,
    totalRatings: postRatings.length,
    averageRating: avg.toFixed(1)
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`⭐ Comment & Rating API running on http://localhost:${PORT}`);
});
