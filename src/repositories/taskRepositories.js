export function moveTasksToProject(userId, oldProjectId, newProjectId) {
  return database.run(
    `
    UPDATE tasks
    SET project_id = ?
    WHERE user_id = ?
    AND project_id = ?
  `,
    [newProjectId, userId, oldprojectId],
  );
}
