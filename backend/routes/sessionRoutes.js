// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/authMiddleware');

// Middleware d’authentification pour toutes les routes de session
router.use(auth);

// Routes principales
router.get('/', sessionController.getAllSessions);
router.post('/', sessionController.createSession);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);

module.exports = router;