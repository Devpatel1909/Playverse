/**
 * Standard API Response Utility
 */

class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message = 'Internal Server Error', statusCode = 500, error = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    // Include error details in development
    if (process.env.NODE_ENV === 'development' && error) {
      response.error = error.message || error;
      response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
  }

  static created(res, data = null, message = 'Created successfully') {
    return this.success(res, data, message, 201);
  }

  static updated(res, data = null, message = 'Updated successfully') {
    return this.success(res, data, message, 200);
  }

  static deleted(res, message = 'Deleted successfully') {
    return this.success(res, null, message, 200);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static badRequest(res, message = 'Bad request', error = null) {
    return this.error(res, message, 400, error);
  }

  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Access forbidden') {
    return this.error(res, message, 403);
  }

  static conflict(res, message = 'Resource conflict') {
    return this.error(res, message, 409);
  }

  static validationError(res, errors) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ApiResponse;
