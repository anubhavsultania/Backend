import sqlite3 from "sqlite3";

const DB_PATH =
  process.env.NODE_ENV === "test"
    ? "./database/users-test.db"
    : "./database/users.db";

const db = new sqlite3.Database(DB_PATH);

export default db;
