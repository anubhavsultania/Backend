export function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

export function unauthorized(message = "Unauthorized") {
  const err = new Error(message);
  err.status = 401;
  return err;
}

export function forbidden(message = "Forbidden") {
  const err = new Error(message);
  err.status = 403;
  return err;
}

export function notFound(message) {
  const err = new Error(message);
  err.status = 404;
  return err;
}

export function conflict(message) {
  const err = new Error(message);
  err.status = 409;
  return err;
}

export function translateDatabaseError(err, entity) {
  if (err.code !== "SQLITE_CONSTRAINT") {
    throw err;
  }

  if (err.message.includes("UNIQUE")) {
    const error = new Error(`${entity} already exists`);
    error.status = 409;
    throw error;
  }

  if (err.message.includes("NOT NULL")) {
    const error = new Error(`${entity} is required`);
    error.status = 400;
    throw error;
  }

  if (err.message.includes("FOREIGN KEY")) {
    const error = new Error("Invalid reference");
    error.status = 400;
    throw error;
  }

  throw err;
}
