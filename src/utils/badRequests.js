export function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
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
