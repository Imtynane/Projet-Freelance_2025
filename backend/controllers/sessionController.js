// controllers/sessionController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🧩 Récupérer toutes les sessions
exports.getAllSessions = async (req, res) => {
  console.log("USER AUTH:", req.user);

  try {
    const sessions = await prisma.session.findMany({
      where: {
        userId: req.user.userId, // ✅ CORRECTION ICI
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur récupération sessions" });
  }
};


// ➕ Créer une session
exports.createSession = async (req, res) => {
  try {
    const { title, duration } = req.body;
    const session = await prisma.session.create({
      data: {
        title,
        duration: Number(duration),
        userId: req.user.userId,
      },
    });
    res.json(session);
  } catch (error) {
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

