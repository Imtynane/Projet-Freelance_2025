// server.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importer les routes
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/events', eventRoutes);

// 🔁 Mise à jour d’un événement existant
app.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, professor, location, datetime, duration, notes } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        professor,
        location,
        datetime: new Date(datetime),
        duration: Number(duration),
        notes,
      },
    });

    res.json(updatedEvent);
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    res.status(500).json({ error: "Impossible de modifier l'événement" });
  }
});



app.get('/', (req, res) => {
  res.send('🚀 StudyMate API is running...');
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
