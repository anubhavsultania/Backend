import db from "../db.js";

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
}

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
}

export function beginTransaction() {
  return new Promise((resolve, reject) => {
    db.run("BEGIN TRANSACTION", (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

export function commitTransaction() {
  return new Promise((resolve, reject) => {
    db.run("COMMIT", (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

export function rollbackTransaction() {
  return new Promise((resolve, reject) => {
    db.run("ROLLBACK", (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}
