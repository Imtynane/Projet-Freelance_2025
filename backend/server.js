require('dotenv').config();
// server.js
const express = require('express');
const cors = require('cors');

// Importer les routes
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const conceptRoutes = require('./routes/conceptRoutes');
const ficheRoutes = require('./routes/fiches'); // ← importer les routes fiches

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);
app.use('/concepts', conceptRoutes);
app.use('/fiches', ficheRoutes); // ← utiliser les routes fiches
app.get('/', (req, res) => {
  res.send('🚀 ITMIA API is running...');
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

