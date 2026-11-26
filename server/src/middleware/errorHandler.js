export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const defaultStatusCode =
    error.name === "ValidationError" || error.name === "CastError"
      ? 400
      : error.code === 11000
        ? 409
        : 500;
  const requestedStatusCode = error.statusCode || error.status || defaultStatusCode;
  const statusCode =
    Number.isInteger(requestedStatusCode) && requestedStatusCode >= 400 && requestedStatusCode < 600
      ? requestedStatusCode
      : 500;
  if (statusCode >= 500) console.error(error);
  res.status(statusCode).json({
    message: statusCode >= 500 ? "Internal server error" : error.message,
  });
}
