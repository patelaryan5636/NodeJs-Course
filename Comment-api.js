// comment-api.js — Live Comment System API (Single File)

const express = require("express");
const app = express();
const PORT = 10000;

app.use(express.json());

// ---------------- In-Memory Data ----------------
let comments = [];
let commentId = 1;

/*
 Comment Model
 {
   id: number,
   postId: number,
   user: string,
   message: string,
   parentId: number | null,
   likes: number,
   createdAt: Date
 }
*/

// ---------------- CREATE COMMENT ----------------
app.post("/api/v1/comments", (req, res) => {
  const { postId, user, message, parentId } = req.body;

  if (!postId || !user || !message) {
    return res.status(400).json({
      success: false,
      message: "postId, user, message required"
    });
  }

  const comment = {
    id: commentId++,
    postId,
    user,
    message,
    parentId: parentId || null,
    likes: 0,
    createdAt: new Date()
  };

  comments.push(comment);

  res.status(201).json({
    success: true,
    data: comment
  });
});

// ---------------- GET COMMENTS BY POST ----------------
app.get("/api/v1/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;

  const postComments = comments.filter(
    c => c.postId == postId && c.parentId === null
  );

  res.json({
    success: true,
    total: postComments.length,
    data: postComments
  });
});

// ---------------- GET REPLIES ----------------
app.get("/api/v1/comments/:id/replies", (req, res) => {
  const replies = comments.filter(c => c.parentId == req.params.id);

  res.json({
    success: true,
    total: replies.length,
    data: replies
  });
});

// ---------------- UPDATE COMMENT ----------------
app.put("/api/v1/comments/:id", (req, res) => {
  const comment = comments.find(c => c.id == req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found"
    });
  }

  const { message } = req.body;
  if (message) comment.message = message;

  res.json({
    success: true,
    message: "Comment updated",
    data: comment
  });
});

// ---------------- DELETE COMMENT ----------------
app.delete("/api/v1/comments/:id", (req, res) => {
  const index = comments.findIndex(c => c.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Comment not found"
    });
  }

  comments.splice(index, 1);

  res.json({
    success: true,
    message: "Comment deleted"
  });
});

// ---------------- LIKE COMMENT ----------------
app.post("/api/v1/comments/:id/like", (req, res) => {
  const comment = comments.find(c => c.id == req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found"
    });
  }

  comment.likes++;

  res.json({
    success: true,
    message: "Comment liked",
    likes: comment.likes
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`💬 Comment API running at http://localhost:${PORT}`);
});
