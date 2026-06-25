/**
 * Error-handling middleware for invalid/empty JSON request bodies
 */
export const handleJsonSyntaxError = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON format. Please check your request body.",
    });
  }
  next(err);
};

/**
 * Global unhandled error handler
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    message: "An unexpected error occurred on the server.",
  });
};
