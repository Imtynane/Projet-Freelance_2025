// controllers/sessionController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🧩 Récupérer toutes les sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: { user: true }, // Inclut les infos de l’utilisateur lié
    });
    res.json(sessions);
  } catch (error) {
    console.error("Erreur getAllSessions:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des sessions" });
  }
};

// ➕ Créer une session
exports.createSession = async (req, res) => {
  try {
    const { title, duration, userId } = req.body;
    const newSession = await prisma.session.create({
      data: {
        title,
        duration: Number(duration),
        userId: Number(userId),
      },
    });
    res.json(newSession);
  } catch (error) {
    console.error("Erreur createSession:", error);
    res.status(500).json({ error: "Erreur lors de la création de la session" });
  }
};

// 🔄 Mettre à jour une session
exports.updateSession = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, duration } = req.body;
    const updated = await prisma.session.update({
      where: { id },
      data: { title, duration: Number(duration) },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

// 🗑️ Supprimer une session
exports.deleteSession = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.session.delete({ where: { id } });
    res.json({ message: "Session supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
