// comment-rating-api.js — Comment & Rating Backend API (Single File)

const express = require("express");
const app = express();
const PORT = 10000;

app.use(express.json());

// ---------------- In-Memory DB ----------------
let comments = [];
let ratings = [];
let commentId = 1;

/*
Comment Model
{
  id: Number,
  userId: Number,
  postId: Number,
  text: String,
  createdAt: Date
}

Rating Model
{
  userId: Number,
  postId: Number,
  stars: Number (1–5)
}
*/

// ---------------- COMMENTS API ----------------

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

  const postComments = comments.filter(c => c.postId == postId);

  res.json({
    total: postComments.length,
    data: postComments
  });
});

// Update comment
app.put("/api/v1/comments/:id", (req, res) => {
  const comment = comments.find(c => c.id == req.params.id);
  if (!comment)
    return res.status(404).json({ message: "Comment not found" });

  comment.text = req.body.text || comment.text;

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

// ---------------- RATING API ----------------

// Add or update rating
app.post("/api/v1/posts/:postId/rate", (req, res) => {
  const { userId, stars } = req.body;
  const { postId } = req.params;

  if (!userId || stars < 1 || stars > 5)
    return res.status(400).json({ message: "Stars must be between 1 and 5" });

  let rating = ratings.find(
    r => r.userId == userId && r.postId == postId
  );

  if (rating) {
    rating.stars = stars;
  } else {
    ratings.push({ userId, postId, stars });
  }

  res.json({
    success: true,
    message: "Rating saved",
    averageRating: getAverage(postId)
  });
});

// Get rating stats
app.get("/api/v1/posts/:postId/ratings", (req, res) => {
  const { postId } = req.params;

  const postRatings = ratings.filter(r => r.postId == postId);

  res.json({
    totalRatings: postRatings.length,
    averageRating: getAverage(postId)
  });
});

// ---------------- Helper ----------------
function getAverage(postId) {
  const postRatings = ratings.filter(r => r.postId == postId);
  if (!postRatings.length) return 0;

  const sum = postRatings.reduce((a, b) => a + b.stars, 0);
  return (sum / postRatings.length).toFixed(1);
}

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`💬 Comment & Rating API running at http://localhost:${PORT}`);
});
