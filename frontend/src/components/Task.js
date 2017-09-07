/**
 * Task represents a single unit of work on a board.
 */
export default class Task {
  /**
   * Task constructor.
   * @param {Number} id ID Unique ID of object.
   * @param {Number} projectId ID of the project this task is part of.
   * @param {Number} epicId ID of the epic this task is in, or 0 otherwise.
   * @param {Number} assigneeId ID of assignee of this task.
   * @param {Number} stateId ID of state of this task.
   * @param {String} title Title of task.
   * @param {String} description Description of task.
   */
  constructor(id, projectId, epicId, assigneeId, stateId, title, description) {
    this.id = id;
    this.projectID = projectId;
    this.epicID = epicId;
    this.assigneeID = assigneeId;
    this.stateId = stateId;
    this.title = title;
    this.description = description;
  }
}
