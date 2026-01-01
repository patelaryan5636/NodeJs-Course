// smtp-forward.js — Simple SMTP Mail Forward API (Single File)

const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 9500;

app.use(express.json());

// ================= SMTP CONFIG =================
// Example: Gmail SMTP (use App Password)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "your_email@gmail.com",        // sender email
    pass: "your_app_password_here"        // app password
  }
});

// ================= SEND / FORWARD MAIL =================
app.post("/forward-mail", async (req, res) => {
  const { from, to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "to, subject and message are required"
    });
  }

  try {
    const info = await transporter.sendMail({
      from: from || `"Forward Service" <your_email@gmail.com>`,
      to,
      subject,
      text: message
    });

    res.json({
      success: true,
      message: "Mail forwarded successfully",
      messageId: info.messageId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({
    status: "SMTP Forward API Live",
    time: new Date()
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`📧 SMTP Forward API running on http://localhost:${PORT}`);
});
