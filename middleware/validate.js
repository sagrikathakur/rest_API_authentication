/**
 * Helper middleware factory to parse and validate requests against a Zod schema
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
  }

  // Only replace/merge request properties if they were parsed by the schema
  if (result.data.body !== undefined) {
    req.body = result.data.body;
  }
  if (result.data.params !== undefined) {
    req.params = { ...req.params, ...result.data.params };
  }
  if (result.data.query !== undefined) {
    req.query = { ...req.query, ...result.data.query };
  }

  next();
};
