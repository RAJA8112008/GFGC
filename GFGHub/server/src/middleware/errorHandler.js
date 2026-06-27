const errorHandler = (err, req, res, next) => {
  // Log detailed error information, including stack trace and request context
  console.error("🛑 Error occurred in", req.method, req.originalUrl);
  console.error(err.stack || err);

  // Determine appropriate HTTP status code
  const status = err.statusCode || err.status || 500;

  // Send a consistent JSON error response
  res.status(status).json({
    success: false,
    // Prefer explicit message, fallback to generic
    message: err.message || "Internal Server Error",
    // Include stack only in development for security reasons
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorHandler;