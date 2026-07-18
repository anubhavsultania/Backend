import { describe, test, expect, beforeEach, vi } from "vitest";
import { createProjectService } from "../../src/services/projectServices.js";

describe("ProjectService.deleteProjectById", () => {
  let database;
  let projectRepositories;
  let taskRepositories;
  let service;
  beforeEach(() => {
    database = {
      beginTransaction: vi.fn().mockResolvedValue(),
      commitTransaction: vi.fn().mockResolvedValue(),
      rollbackTransaction: vi.fn().mockResolvedValue(),
    };

    projectRepositories = {
      getProjectById: vi.fn(),
      getInboxProject: vi.fn(),
      deleteProject: vi.fn().mockResolvedValue(),
    };

    taskRepositories = {
      moveTasksToProject: vi.fn().mockResolvedValue(),
    };

    service = createProjectService({
      database,
      projectRepositories,
      taskRepositories,
    });
  });

  test("deletes a normal project successfully", async () => {
    projectRepositories.getProjectById.mockResolvedValue({
      id: 2,
      type: "NORMAL",
    });

    projectRepositories.getInboxProject.mockResolvedValue({
      id: 10,
    });

    await service.deleteProjectById(1, 2);
    expect(database.beginTransaction).toHaveBeenCalledTimes(1);
    expect(projectRepositories.getProjectById).toHaveBeenCalledWith(1, 2);
    expect(projectRepositories.getInboxProject).toHaveBeenCalledWith(1);
    expect(taskRepositories.moveTasksToProject).toHaveBeenCalledWith(1, 2, 10);
    expect(projectRepositories.deleteProject).toHaveBeenCalledWith(1, 2);

    expect(projectRepositories.deleteProject).toHaveBeenCalledTimes(1);
    expect(database.commitTransaction).toHaveBeenCalledTimes(1);
    expect(database.rollbackTransaction).not.toHaveBeenCalled();
  });

  test("throws when project does not exist", async () => {
    projectRepositories.getProjectById.mockResolvedValue(null);
    await expect(service.deleteProjectById(1, 2)).rejects.toThrow(
      "Project not found",
    );
    expect(database.rollbackTransaction).toHaveBeenCalledTimes(1);
    expect(projectRepositories.deleteProject).not.toHaveBeenCalled();
  });

  test("does not allow deleting Inbox project", async () => {
    projectRepositories.getProjectById.mockResolvedValue({
      id: 2,
      type: "INBOX",
    });
    await expect(service.deleteProjectById(1, 2)).rejects.toThrow(
      "Default project cannot be deleted.",
    );
    expect(database.rollbackTransaction).toHaveBeenCalledTimes(1);
    expect(projectRepositories.deleteProject).not.toHaveBeenCalled();
  });
  test("throws if Inbox project is missing", async () => {
    projectRepositories.getProjectById.mockResolvedValue({
      id: 2,
      type: "NORMAL",
    });
    projectRepositories.getInboxProject.mockResolvedValue(null);
    await expect(service.deleteProjectById(1, 2)).rejects.toThrow(
      "Inbox project is missing.",
    );
    expect(database.rollbackTransaction).toHaveBeenCalledTimes(1);

    expect(projectRepositories.deleteProject).not.toHaveBeenCalled();
  });

  test("rolls back if moving tasks fails", async () => {
    projectRepositories.getProjectById.mockResolvedValue({
      id: 2,
      type: "NORMAL",
    });

    projectRepositories.getInboxProject.mockResolvedValue({
      id: 5,
    });

    taskRepositories.moveTasksToProject.mockRejectedValue(
      new Error("DB Failed"),
    );

    await expect(service.deleteProjectById(1, 2)).rejects.toThrow("DB Failed");

    expect(database.rollbackTransaction).toHaveBeenCalledTimes(1);

    expect(projectRepositories.deleteProject).not.toHaveBeenCalled();
  });
});
