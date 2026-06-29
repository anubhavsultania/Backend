import { rootDir } from "../utils/path.js";
import path from "path";

export function getDashboardHtml(req, res) {
  console.log(rootDir);
  res.sendFile(path.join(rootDir, "../public", "dashboard.html"));
}
