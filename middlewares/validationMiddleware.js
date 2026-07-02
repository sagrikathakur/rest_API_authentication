/**
 * Reusable middleware to validate request bodies using Zod schemas
 * @param {import("zod").ZodSchema} schema - Zod validation schema
 */
export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Format error messages nicely
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: formattedErrors,
    });
  }

  // Set cleaned/parsed data to req.body (e.g. trimmed name, lowercase email)
  req.body = result.data;
  next();
};
