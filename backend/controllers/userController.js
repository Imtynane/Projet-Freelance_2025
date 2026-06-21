const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET — profil complet
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, chronotype: true, niveau: true, objectif: true, chargeMax: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération profil' });
  }
};

// PUT — mettre à jour le profil cognitif
exports.updateProfile = async (req, res) => {
  try {
    const { chronotype, niveau, objectif, chargeMax } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { chronotype, niveau, objectif, chargeMax: Number(chargeMax) },
      select: { id: true, name: true, email: true, chronotype: true, niveau: true, objectif: true, chargeMax: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur mise à jour profil' });
  }
};