import fs from "fs";
import { beforeAll } from "vitest";

beforeAll(async () => {
  if (fs.existsSync("./database/users-test.db")) {
    fs.unlinkSync("./database/users-test.db");
  }

  const { migrate } = await import("../src/scripts/migration");
});
