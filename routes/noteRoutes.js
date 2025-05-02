const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getSuggestedTags
} = require('../controllers/noteController');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all notes with pagination
router.get('/', getNotes);

// Search notes
router.get('/search', searchNotes);

// Get AI-suggested tags
router.post('/suggest-tags', getSuggestedTags);

// Get, update, and delete a specific note
router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

// Create a new note
router.post('/', createNote);

module.exports = router;