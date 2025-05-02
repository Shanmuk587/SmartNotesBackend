/**
 * Standardized API response format
 */
class ApiResponse {
    /**
     * Success response
     * @param {Object} res - Express response object
     * @param {string} message - Success message
     * @param {any} data - Response data
     * @param {number} statusCode - HTTP status code (default: 200)
     */
    static success(res, message, data = null, statusCode = 200) {
      return res.status(statusCode).json({
        success: true,
        message,
        data
      });
    }
  
    /**
     * Error response
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code (default: 400)
     */
    static error(res, message, statusCode = 400) {
      return res.status(statusCode).json({
        success: false,
        message
      });
    }
  
    /**
     * Response with pagination info
     * @param {Object} res - Express response object
     * @param {string} message - Success message
     * @param {any} data - Response data
     * @param {Object} pagination - Pagination information
     * @param {number} statusCode - HTTP status code (default: 200)
     */
    static paginated(res, message, data, pagination, statusCode = 200) {
      return res.status(statusCode).json({
        success: true,
        message,
        data,
        pagination
      });
    }
  }
  
  module.exports = ApiResponse;