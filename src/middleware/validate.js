const allowed = ["body", "query", "params"];
export function validate(schema, location) {
  if (!allowed.includes(location)) {
    throw new Error(`Invalid validation target: ${location}`);
  }
  return (req, res, next) => {
    const content = req[location];
    const result = schema.safeParse(content);
    if (!result.success) {
      const err = new Error("Validation failed");
      err.status = 400;
      err.details = result.error.format();
      return next(err);
    }
    req.validatedData ??= {};
    req.validatedData[location] = result.data;
    next();
  };
}
