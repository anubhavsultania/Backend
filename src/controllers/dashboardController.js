import { rootDir } from "../utils/path.js";
import path from "path";

export function getDashboardHtml(req, res) {
  res.sendFile(path.join(rootDir, "../public", "dashboard.html"));
}
