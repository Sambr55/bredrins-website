const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;
const CONTENT_FILE = path.join(__dirname, 'content.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// CORS - allow frontend origins
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://bredrins.eu',
    'https://www.bredrins.eu',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Serve uploaded images statically
app.use('/images/uploads', express.static(UPLOADS_DIR));

// Basic auth middleware for write endpoints
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth check (for admin login validation)
app.post('/api/auth-check', basicAuth, (req, res) => {
  res.json({ authenticated: true });
});

// GET content (public)
app.get('/api/content', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read content' });
  }
});

// PUT content (auth required)
app.put('/api/content', basicAuth, (req, res) => {
  try {
    // Backup before saving
    const backup = CONTENT_FILE.replace('.json', `.backup-${Date.now()}.json`);
    if (fs.existsSync(CONTENT_FILE)) {
      fs.copyFileSync(CONTENT_FILE, backup);
    }
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// Upload image (auth required)
app.post('/api/upload', basicAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/images/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`Bredrins CMS API running on port ${PORT}`);
});
