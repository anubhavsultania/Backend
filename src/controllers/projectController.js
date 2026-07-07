import {
  createNewProject,
  deleteProjectWithID,
  getProjectsByUserId,
  renameProjectWithId,
} from "../services/projectServices";

export async function getProjects(req, res, next) {
  try {
    const userId = req.session.userId;
    const result = await getProjectsByUserId(userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function createProject(req, res, next) {
  try {
    const userId = req.session.userId;
    const { title } = req.validatedData.body;
    await createNewProject(userId, title);
    return res.status(201).json({ message: "Project is created" });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const userId = req.session.userId;
    const projectId = req.validatedData.params.id;
    await deleteProjectWithID(userId, projectId);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function renameProject(req, res, next) {
  try {
    const userId = req.session.userId;
    const projectId = req.validatedData.params.id;
    const { title } = req.validatedData.body;
    await renameProjectWithId(userId, projectId, title);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
