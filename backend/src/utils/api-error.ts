class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
      Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(message: string = "Bad request"): ApiError {
    return new ApiError(400, message)
  }

  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError(401, message);
  }

  static conflict(message: string = "Conflict"): ApiError {
    return new ApiError(409, message);
  }

  static forbidden(message: string = "forbidden"): ApiError {
    return new ApiError(403, message);
  }

  static notfound(message: string = "notfound"): ApiError {
    return new ApiError(404, message);
  }
}
export default ApiError;
