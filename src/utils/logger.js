import { run } from "../database/database.js";
export async function runStep(msg, sql, params = []) {
  console.log(`▶ ${msg} ...`);

  try {
    const result = await run(sql, params);
    console.log(`✔ ${msg}`);
    return result;
  } catch (err) {
    console.error(`✖ ${msg}`);
    console.error(sql); // Optional: prints the SQL that failed
    throw err;
  }
}
