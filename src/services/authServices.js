import * as database from "../database/database.js";
import bcrypt from "bcrypt";
import { createDefaultProject } from "./projectServices.js";

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

export async function registerUserInDb(email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await database.beginTransaction();
    const { lastID: userId } = await database.run(
      `INSERT INTO users (email, password)
             VALUES (?, ?)`,
      [email, hashedPassword],
    );
    await createDefaultProject(userId);
    await database.commitTransaction();
  } catch (err) {
    try {
      await database.rollbackTransaction();
    } catch (error) {
      console.error(`Rollback Failed: ${error.message}`);
    }
    if (err.code === "SQLITE_CONSTRAINT") {
      const error = new Error("User already exists");
      error.status = 409;
      throw error;
    }
    throw err;
  }
}
