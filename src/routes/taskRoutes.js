import express from "express";

import { isAuthenticated } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

import * as taskControllers from "../controllers/taskController.js";

import {
  idSchema,
  titleSchema,
  createTaskSchema,
  moveTaskSchema,
  completeTaskSchema,
  getTasksSchema,
} from "../validators/taskValidators.js";

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  validate(getTasksSchema, "query"),
  taskControllers.getTasks,
);

router.get(
  "/:id",
  isAuthenticated,
  validate(idSchema, "params"),
  taskControllers.getTask,
);

router.post(
  "/",
  isAuthenticated,
  validate(createTaskSchema, "body"),
  taskControllers.createTask,
);

router.patch(
  "/:id",
  isAuthenticated,
  validate(idSchema, "params"),
  validate(titleSchema, "body"),
  taskControllers.renameTask,
);

router.delete(
  "/:id",
  isAuthenticated,
  validate(idSchema, "params"),
  taskControllers.deleteTask,
);

router.patch(
  "/:id/complete",
  isAuthenticated,
  validate(idSchema, "params"),
  validate(completeTaskSchema, "body"),
  taskControllers.completeTask,
);

router.patch(
  "/:id/project",
  isAuthenticated,
  validate(idSchema, "params"),
  validate(moveTaskSchema, "body"),
  taskControllers.moveTask,
);

export default router;
