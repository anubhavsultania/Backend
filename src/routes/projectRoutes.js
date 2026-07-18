import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idSchema, titleSchema } from "../validators/taskValidators.js";
import { projectController } from "../container.js";

const router = express.Router();
router.get("/", isAuthenticated, projectController.getProjects);
router.post(
  "/",
  isAuthenticated,
  validate(titleSchema, "body"),
  projectController.createProject,
);
router.delete(
  "/:id",
  isAuthenticated,
  validate(idSchema, "params"),
  projectController.deleteProject,
);
router.patch(
  "/:id",
  isAuthenticated,
  validate(idSchema, "params"),
  validate(titleSchema, "body"),
  projectController.renameProject,
);

export default router;
