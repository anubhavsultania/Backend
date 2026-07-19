import fs from "fs";

export default async function () {
  const dbPath = "./database/users-test.db";

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
  const { migrate } = await import("../src/scripts/testMigration.js");

  await migrate(true);
}
