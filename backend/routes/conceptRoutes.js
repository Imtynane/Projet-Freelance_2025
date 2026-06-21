const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getConcepts,
  createConcept,
  reviewConcept,
  deleteConcept,
} = require('../controllers/conceptController');

router.get('/', auth, getConcepts);
router.post('/', auth, createConcept);
router.post('/:id/review', auth, reviewConcept);
router.delete('/:id', auth, deleteConcept);

module.exports = router;