const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Vérifier que le header existe
  if (!authHeader) {
    return res.status(401).json({ error: "Accès refusé. Token manquant." });
  }

  // 2️⃣ Vérifier le format "Bearer TOKEN"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Format du token invalide." });
  }

  const token = parts[1];

  // 3️⃣ Vérifier et décoder le token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attacher l'utilisateur décodé à la requête
    req.user = decoded;

    next(); // ✅ une seule fois
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré." });
  }
};
