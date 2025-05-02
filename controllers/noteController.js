const Note = require('../models/Note');
const ApiResponse = require('../utils/apiResponse');
const aiService = require('../services/aiService');

/**
 * Get all notes with pagination
 * @route GET /api/notes
 * @access Private
 */
exports.getNotes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Find notes for current user with pagination
    const notes = await Note.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Note.countDocuments({ userId: req.user.id });
    
    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };
    
    return ApiResponse.paginated(
      res, 
      'Notes retrieved successfully', 
      notes, 
      pagination
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single note by ID
 * @route GET /api/notes/:id
 * @access Private
 */
exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!note) {
      return ApiResponse.error(res, 'Note not found', 404);
    }
    
    return ApiResponse.success(res, 'Note retrieved successfully', note);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new note
 * @route POST /api/notes
 * @access Private
 */
exports.createNote = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    
    // Generate summary using Gemini API
    let summary = '';
    try {
      summary = await aiService.generateSummary(content);
    } catch (aiError) {
      console.error('Error generating summary:', aiError);
      // Continue without summary if AI service fails
    }
  
    
    // Create new note
    const note = await Note.create({
      userId: req.user.id,
      title,
      content,
      summary,
      tags: tags || [],
    });
    
    return ApiResponse.success(
      res, 
      'Note created successfully', 
      note, 
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing note
 * @route PUT /api/notes/:id
 * @access Private
 */
exports.updateNote = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    
    // Find note by ID
    let note = await Note.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!note) {
      return ApiResponse.error(res, 'Note not found', 404);
    }
    
    // Generate new summary if content changed
    if (content && content !== note.content) {
      try {
        note.summary = await aiService.generateSummary(content);
        
        // Generate new suggested tags if content changed
        note.suggestedTags = await aiService.suggestTags(content);
      } catch (aiError) {
        console.error('Error in AI service during update:', aiError);
        // Continue without updating AI-generated fields if service fails
      }
    }
    
    // Update note fields
    note.title = title || note.title;
    note.content = content || note.content;
    note.tags = tags || note.tags;
    note.updatedAt = Date.now();
    
    // Save the updated note
    await note.save();
    
    return ApiResponse.success(res, 'Note updated successfully', note);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a note
 * @route DELETE /api/notes/:id
 * @access Private
 */
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!note) {
      return ApiResponse.error(res, 'Note not found', 404);
    }
    
    await note.deleteOne();
    
    return ApiResponse.success(res, 'Note deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Search notes by content or tags
 * @route GET /api/notes/search
 * @access Private
 */
exports.searchNotes = async (req, res, next) => {
  try {
    const { query, tags } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build search query
    const searchQuery = { userId: req.user.id };
    
    // Add text search if query provided
    if (query) {
      searchQuery.$text = { $search: query };
    }
    
    // Add tags filter if provided
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      searchQuery.tags = { $in: tagArray };
    }
    
    // Execute search with pagination
    const notes = await Note.find(searchQuery)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Note.countDocuments(searchQuery);
    
    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };
    
    return ApiResponse.paginated(
      res, 
      'Search results retrieved successfully', 
      notes, 
      pagination
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get AI-suggested tags based on content
 * @route POST /api/notes/suggest-tags
 * @access Private
 */
exports.getSuggestedTags = async (req, res, next) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return ApiResponse.error(res, 'Content is required', 400);
    }
    
    // Generate suggested tags using Gemini API
    const suggestedTags = await aiService.suggestTags(content);
    
    return ApiResponse.success(res, 'Tags suggested successfully', { suggestedTags });
  } catch (error) {
    next(error);
  }
};