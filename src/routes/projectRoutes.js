import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idSchema, titleSchema } from "../validators/taskValidators.js";
import {
  createProject,
  deleteProject,
  getProjects,
  renameProject,
} from "../controllers/projectController.js";

const router = express.Router();
router.get("/", isAuthenticated, getProjects);
router.post("/", isAuthenticated, validate(titleSchema, "body"), createProject);
router.delete(
  "/:id",
  isAuthenticated,
  validate(idSchema, "params"),
  deleteProject,
);
router.patch(
  "/:id",
  isAuthenticated,
  validate(idSchema, "params"),
  validate(titleSchema, "body"),
  renameProject,
);
