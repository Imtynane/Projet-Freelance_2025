const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Récupérer tous les événements
router.get('/', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { datetime: "asc" },
        });
        res.json(events);
    } catch (err) {
        res.status(500).json({error: "Erreur lors de la récupération des évènements"});
    }
});

// Créer un nouvel événement
router.post("/", async (req, res) => {
  try {
    const { title, professor, location, datetime, duration, notes } = req.body;
    const newEvent = await prisma.event.create({
      data: { title, professor, location, datetime: new Date(datetime), duration, notes },
    });
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création de l'événement" });
  }
});

// Mettre à jour un événement
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, professor, location, datetime, duration, notes } = req.body;
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { title, professor, location, datetime: new Date(datetime), duration, notes },
    });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'événement" });
  }
});

// Supprimer un événement
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    res.json({ message: "Événement supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'événement" });
  }
});

module.exports = router;