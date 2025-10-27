// controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 📋 Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { sessions: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
};

// ➕ Créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await prisma.user.create({ data: { name, email } });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
};

// 🔄 Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

// 🗑️ Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
