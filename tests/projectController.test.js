// When we dont implement DI in our controller then
//this is  how we will write unit test (Tough isn't it) ?
// import { describe, test, expect, vi } from "vitest";

// vi.mock("../src/container.js", () => ({
//   projectService: {
//     getProjectsByUserId: vi.fn(),
//   },
// }));

// import { projectService } from "../src/container.js";
// import { getProjects } from "../src/controllers/projectController.js";

// projectService.getProjectsByUserId.mockResolvedValue([
//   { id: 1, name: "Inbox" },
// ]);

// const req = {
//   session: {
//     userId: 5,
//   },
// };

// const res = {
//   status: vi.fn().mockReturnThis(),
//   json: vi.fn(),
// };

// const next = vi.fn();

// await getProjects(req, res, next);
// expect(projectService.getProjectsByUserId)
//   .toHaveBeenCalledWith(5);

// expect(res.status)
//   .toHaveBeenCalledWith(200);

// expect(res.json)
//   .toHaveBeenCalledWith([
//     { id: 1, name: "Inbox" },
//   ]);

// expect(next).not.toHaveBeenCalled();

// With DI

import { describe, beforeEach, expect, vi, test } from "vitest";
import { createProjectController } from "../src/controllers/projectController.js";
import session from "express-session";

describe("ProjectController", () => {
  let req;
  let res;
  let next;
  let controller;
  let projectService;
  describe("getProjects", () => {
    beforeEach(() => {
      req = {
        session: {
          userId: 1,
        },
      };
      res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      next = vi.fn();
      projectService = {
        getProjectsByUserId: vi.fn(),
      };
      controller = createProjectController({ projectService });
    });
    test("returns all projects for the logged-in user", async () => {
      projectService.getProjectsByUserId.mockResolvedValue({
        id: 2,
        name: "Inbox",
      });
      await controller.getProjects(req, res, next);
      expect(projectService.getProjectsByUserId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 2, name: "Inbox" });
      expect(next).not.toHaveBeenCalled();
    });
    test("calls next when service throws", async () => {
      projectService.getProjectsByUserId.mockRejectedValue(new Error());
      await controller.getProjects(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("createProject", () => {
    beforeEach(() => {
      req = {
        session: {
          userId: 1,
        },
        validatedData: {
          body: {
            title: "Inbox",
          },
        },
      };

      res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      next = vi.fn();

      projectService = {
        createNewProject: vi.fn(),
      };

      controller = createProjectController({ projectService });
    });

    test("creates a new project", async () => {
      req.validatedData.body.title = "My Project";

      projectService.createNewProject.mockResolvedValue({
        lastID: 15,
      });

      await controller.createProject(req, res, next);

      expect(projectService.createNewProject).toHaveBeenCalledWith(
        1,
        "My Project",
      );

      expect(projectService.createNewProject).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        id: 15,
        name: "My Project",
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("calls next when service throws", async () => {
      req.validatedData.body.title = "My Project";

      const error = new Error("Database Error");

      projectService.createNewProject.mockRejectedValue(error);

      await controller.createProject(req, res, next);

      expect(projectService.createNewProject).toHaveBeenCalledWith(
        1,
        "My Project",
      );

      expect(next).toHaveBeenCalledWith(error);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("ProjectController.renameProjectById", () => {
    beforeEach(() => {
      req = {
        session: {
          userId: 1,
        },
        validatedData: {
          params: {
            id: 2,
          },
          body: {
            title: "My new Project",
          },
        },
      };
      res = {
        sendStatus: vi.fn(),
      };
      next = vi.fn();
      projectService = {
        renameProjectById: vi.fn(),
      };
      controller = createProjectController({ projectService });
    });
    test("rename a project", async () => {
      projectService.renameProjectById.mockResolvedValue();
      await controller.renameProject(req, res, next);
      expect(projectService.renameProjectById).toHaveBeenCalledWith(
        1,
        2,
        "My new Project",
      );
      expect(res.sendStatus).toHaveBeenCalledWith(204);
      expect(next).not.toHaveBeenCalled();
    });
    test("calls next when service throws", async () => {
      const error = new Error("Internal server error");
      projectService.renameProjectById.mockRejectedValue(error);
      await controller.renameProject(req, res, next);
      expect(projectService.renameProjectById).toHaveBeenCalledWith(
        1,
        2,
        "My new Project",
      );
      expect(res.sendStatus).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
