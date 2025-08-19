require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const bookmarksRoutes = require('./routes/bookmarks');
const chatRoutes = require('./routes/chat');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: ['https://tripletaichatbot.store/'], credentials: true }));
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'myusers',
  waitForConnections: true,
  connectionLimit: 10,
});

app.set('db', pool);

app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/chat', chatRoutes);

app.get('/healthz', (_req, res) => {
  res.send('<h1>Welcome to tripletaichatbot.store</h1>');
});

app.get('/', (_req, res) => {
  res.send('<h1>Welcome to tripletaichatbot.store</h1>');
});

// 404 핸들러
app.use('/api', (req, res) => res.status(404).json({ message: 'not_found', path: req.originalUrl }));

app.listen(port, async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL OK');
  } catch (e) {
    console.error('❌ MySQL 실패:', e.message);
  }
  console.log(`✅ http://localhost:${port}`);
});
