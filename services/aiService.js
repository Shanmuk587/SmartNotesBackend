/**
 * Generate a summary of the note content using Gemini API
 * @param {string} content - The note content to summarize
 * @returns {Promise<string>} - The generated summary
 */
// summaryController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
// Initialize Gemini client
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * POST /api/summarize
 * @desc Generate a summary from the input content
 * @param req.body.content - The text to summarize
 */
exports.generateSummary = async (content) => {

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: "Content must be a non-empty string." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    Please generate a concise summary (maximum 2-3 sentences) of the following note content:

    ${content}

    Provide only the summary without any additional text or explanation.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    return summary
  } catch (error) {
    console.error('Gemini summary generation failed:', error);
    return
  }
};



/**
 * Generate suggested tags based on note content using Gemini API
 * @param {string} content - The note content to analyze
 * @returns {Promise<string[]>} - Array of suggested tags
 */
exports.suggestTags = async (content) => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Use a prompt that instructs Gemini to generate relevant tags
    const prompt = `
    Please analyze the following note content and suggest 3-5 relevant tags that categorize the main topics.
    Return only a JSON array of tags without any additional text or explanation.
    
    Note Content:
    ${content}
    
    Expected format:
    ["tag1", "tag2", "tag3"]
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    // Parse the JSON array from the response
    try {
      const tags = JSON.parse(response);
      console.log(tags)
      return Array.isArray(tags) ? tags : [];
    } catch (jsonError) {
      // If JSON parsing fails, extract tags using regex
      const matches = response.match(/"([^"]+)"/g);
      return matches ? matches.map(match => match.replace(/"/g, '')) : [];
    }
  } catch (error) {
    console.error('Error suggesting tags:', error);
    throw new Error('Failed to suggest tags');
  }
};