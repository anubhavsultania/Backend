// container.js

import * as database from "./database/database.js";

import * as projectRepositories from "./repositories/projectRepositories.js";
import * as taskRepositories from "./repositories/taskRepositories.js";

import { createProjectService } from "./services/projectServices.js";

export const projectService = createProjectService({
  database,
  projectRepositories,
  taskRepositories,
});
