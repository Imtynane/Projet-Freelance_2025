const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Algorithme SM-2 (Ebbinghaus / Anki)
function sm2(easinessFactor, interval, repetitions, quality) {
  // quality : 0-5 (0=blackout, 5=parfait)
  let newEF = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newInterval;
  let newRepetitions;

  if (quality < 3) {
    // Échec → recommencer
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newRepetitions = repetitions + 1;
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(interval * newEF);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return { newEF, newInterval, newRepetitions, nextReview };
}

// GET — tous les concepts de l'utilisateur
exports.getConcepts = async (req, res) => {
  try {
    const concepts = await prisma.concept.findMany({
      where: { userId: req.user.userId },
      orderBy: { nextReview: 'asc' },
    });
    res.json(concepts);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération concepts' });
  }
};

// POST — créer un concept
exports.createConcept = async (req, res) => {
  try {
    const { title, subject } = req.body;
    const concept = await prisma.concept.create({
      data: {
        title,
        subject: subject || null,
        userId: req.user.userId,
      },
    });
    res.json(concept);
  } catch (err) {
    res.status(500).json({ error: 'Erreur création concept' });
  }
};

// POST — réviser un concept (appliquer SM-2)
exports.reviewConcept = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { quality } = req.body; // 0-5

    const concept = await prisma.concept.findUnique({ where: { id } });
    if (!concept) return res.status(404).json({ error: 'Concept introuvable' });

    const { newEF, newInterval, newRepetitions, nextReview } = sm2(
      concept.easinessFactor,
      concept.interval,
      concept.repetitions,
      quality
    );

    const updated = await prisma.concept.update({
      where: { id },
      data: {
        easinessFactor: newEF,
        interval: newInterval,
        repetitions: newRepetitions,
        nextReview,
        lastReview: new Date(),
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur révision concept' });
  }
};

// DELETE — supprimer un concept
exports.deleteConcept = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.concept.delete({ where: { id } });
    res.json({ message: 'Concept supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression concept' });
  }
};