import ApiError from "../utils/ApiError.js";

export function requireBodyFields(...fields) {
  return function validateBody(req, _res, next) {
    const missing = fields.filter((field) => req.body?.[field] == null);
    if (missing.length) return next(new ApiError(400, `Missing required fields: ${missing.join(", ")}`));
    next();
  };
}
