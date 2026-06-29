import * as database from "../database/database.js";
import bcrypt from "bcrypt";

export async function authenticateUser(email, password) {
  const user = await database.get(
    `SELECT * FROM users
        WHERE email = ?
        `,
    [email],
  );
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }
  return user;
}

export async function registerUserInDb(email, Password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await database.run(
      `INSERT INTO users (email, password)
             VALUES (?, ?)`,
      [email, hashedPassword],
    );
  } catch (err) {
    if (err.code == "SQLITE_CONSTRAINT") {
      const error = new Error("User already exists");
      error.status = 409;
      throw error;
    }
    throw err;
  }
}
