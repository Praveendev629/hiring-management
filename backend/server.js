const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/candidates',   require('./routes/candidates'));
app.use('/api/interviewers', require('./routes/interviewers'));
app.use('/api/assessments',  require('./routes/assessments'));
app.use('/api/interviews',   require('./routes/interviews'));
app.use('/api/reports',      require('./routes/reports'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// 404 fallback
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀  Hiring API running on port ${PORT}`);
  console.log(`   ENV  → ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health → /api/health\n`);
});
