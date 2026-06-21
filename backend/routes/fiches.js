// ══════════════════════════════════════════════════════════════════════════════
// backend/routes/fiches.js (version CommonJS)
// Confirmé : req.user = { userId, name, email, iat, exp } (token JWT décodé)
// ══════════════════════════════════════════════════════════════════════════════

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/authMiddleware');
const { askAI, buildCoachSystemPrompt, buildRevisionSheetPrompt } = require('../services/geminiService');

const router = express.Router();
const prisma = new PrismaClient();

// ── GET /fiches — liste des fiches de l'utilisateur ───────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const fiches = await prisma.fiche.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(fiches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des fiches.' });
  }
});

// ── POST /fiches — créer une fiche (cours ou exercice) ────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { title, subject, type, content } = req.body;
    if (!title || !subject || !type || !content) {
      return res.status(400).json({ error: "Champs manquants (title, subject, type, content)." });
    }
    if (type !== 'cours' && type !== 'exercice') {
      return res.status(400).json({ error: "type doit être 'cours' ou 'exercice'." });
    }
    const fiche = await prisma.fiche.create({
      data: { title, subject, type, content, userId: req.user.userId },
    });
    res.json(fiche);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la fiche.' });
  }
});

// ── DELETE /fiches/:id ──────────────────────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.fiche.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression de la fiche.' });
  }
});

// ── POST /fiches/:id/coach — demander de l'aide au Coach Socratique ──────────
// body: { message: string, history: Array<{role, content}> }
router.post('/:id/coach', auth, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'message requis.' });

    const fiche = await prisma.fiche.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!fiche) return res.status(404).json({ error: 'Fiche non trouvée.' });
    if (fiche.userId !== req.user.userId) return res.status(403).json({ error: 'Accès refusé.' });

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    const systemPrompt = buildCoachSystemPrompt({
      niveau: user?.niveau,
      subject: fiche.subject,
      ficheTitle: fiche.title,
      ficheContent: fiche.content,
      ficheType: fiche.type,
    });

    const conversation = [
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ];

    const reply = await askAI(systemPrompt, conversation);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'appel au coach IA." });
  }
});

// ── POST /fiches/revision-sheet — générer une fiche de révision ──────────────
// body: { subject: string }
router.post('/revision-sheet', auth, async (req, res) => {
  try {
    const { subject } = req.body;
    if (!subject) return res.status(400).json({ error: 'subject requis.' });

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    const fiches = await prisma.fiche.findMany({
      where: { userId: req.user.userId, subject, type: 'cours' },
    });

    if (fiches.length === 0) {
      return res.status(400).json({ error: 'Aucune fiche de cours trouvée pour cette matière.' });
    }

    const prompt = buildRevisionSheetPrompt({ subject, niveau: user?.niveau, fiches });
    const sheet = await askAI(prompt, [{ role: 'user', content: 'Génère la fiche de révision.' }], 800);

    res.json({ sheet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la génération de la fiche de révision.' });
  }
});

module.exports = router;