require('dotenv').config();
// server.js
const express = require('express');
const cors = require('cors');

// Importer les routes
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('🚀 StudyMate API is running...');
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
