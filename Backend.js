// app.js — single-file Node.js + Express example
// Requires Node 14+ (Node 18+ recommended)

const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_prod';

// --- middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

// --- in-memory "database" ---
const users = [
  // demo user: username: demo / password: demo123
  { id: 1, username: 'demo', passwordHash: hashPassword('demo123'), name: 'Demo User' }
];

function hashPassword(password) {
  // simple hash for demo only — use bcrypt in real apps
  return crypto.createHash('sha256').update(password).digest('hex');
}

// --- helpers ---
function generateToken(user) {
  // expires in 1 hour
  return jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
}

function authenticateToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });

  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = payload; // { sub, username, iat, exp }
    next();
  });
}

// --- file upload setup (multer) ---
const upload = multer({
  storage: multer.memoryStorage(), // store in memory — for demo only
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// --- routes ---
// health / info
app.get('/', (req, res) => {
  res.type('json').send({
    name: 'Single-file Node App',
    version: '1.0.0',
    routes: [
      'GET  /',
      'GET  /api/time',
      'POST /api/echo',
      'POST /auth/login',
      'GET  /api/profile  (protected)',
      'POST /api/upload'
    ]
  });
});

// returns server time
app.get('/api/time', (req, res) => {
  res.json({ serverTime: new Date().toISOString() });
});

// echo endpoint for testing
app.post('/api/echo', (req, res) => {
  res.json({ youSent: req.body });
});

// login (returns JWT)
// POST body: { username, password }
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const pwHash = hashPassword(password);
  if (pwHash !== user.passwordHash) return res.status(401).json({ error: 'invalid credentials' });

  const token = generateToken(user);
  res.json({ token, expiresIn: 3600 });
});

// protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.sub);
  if (!user) return res.status(404).json({ error: 'user not found' });

  res.json({ id: user.id, username: user.username, name: user.name });
});

// file upload example (multipart/form-data, field name "file")
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
  // file is in memory in req.file.buffer
  // For demo we return file info (don't store large files in memory in production)
  res.json({
    filename: req.file.originalname,
    mime: req.file.mimetype,
    size: req.file.size
  });
});

// add new user (demo only) — create user quickly without persistence
// POST /auth/register { username, password, name }
app.post('/auth/register', (req, res) => {
  const { username, password, name } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  if (users.some(u => u.username === username)) return res.status(409).json({ error: 'username already exists' });

  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id, username, passwordHash: hashPassword(password), name: name || username };
  users.push(newUser);
  res.status(201).json({ id: newUser.id, username: newUser.username });
});

// --- error handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'internal server error' });
});

// --- start ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}  (PID ${process.pid})`);
  console.log('Demo credentials: username=demo  password=demo123');
});
