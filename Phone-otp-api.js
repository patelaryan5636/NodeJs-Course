// phone-otp-api.js — OTP Based Phone Login (Single File Backend)

const express = require("express");
const app = express();
const PORT = 9500;

app.use(express.json());

// ---------------- In-Memory DB ----------------
let otpStore = [];
let users = [];

/*
OTP Model
{
  phone: string,
  otp: string,
  expiresAt: Date
}
*/

// ---------------- Helpers ----------------
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------- SEND OTP ----------------
app.post("/api/send-otp", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number required"
    });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

  // Remove old OTPs for same phone
  otpStore = otpStore.filter(o => o.phone !== phone);

  otpStore.push({ phone, otp, expiresAt });

  // 🔴 Simulating SMS sending
  console.log(`📲 OTP for ${phone}: ${otp}`);

  res.json({
    success: true,
    message: "OTP sent successfully"
  });
});

// ---------------- VERIFY OTP ----------------
app.post("/api/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  const record = otpStore.find(o => o.phone === phone);

  if (!record) {
    return res.status(400).json({
      success: false,
      message: "OTP not found"
    });
  }

  if (new Date() > record.expiresAt) {
    return res.status(400).json({
      success: false,
      message: "OTP expired"
    });
  }

  if (record.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP"
    });
  }

  // OTP verified → login/register user
  let user = users.find(u => u.phone === phone);
  if (!user) {
    user = {
      id: users.length + 1,
      phone,
      createdAt: new Date()
    };
    users.push(user);
  }

  // Remove OTP after successful verification
  otpStore = otpStore.filter(o => o.phone !== phone);

  res.json({
    success: true,
    message: "OTP verified successfully",
    user
  });
});

// ---------------- GET USERS (Demo) ----------------
app.get("/api/users", (req, res) => {
  res.json(users);
});

// ---------------- SERVER ----------------
app.listen(PORT, () => {
  console.log(`📞 Phone OTP API running on http://localhost:${PORT}`);
});
