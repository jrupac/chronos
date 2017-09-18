import {EMPTY_EPIC} from './epic';

export const ADD_TASKS = 'ADD_TASKS';

/**
 * Task represents a single unit of work on a board.
 */
class Task {
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

export const FetchTasks = () => {
  const tasks = Array.from([
    new Task(
        1, 1, EMPTY_EPIC, 0, 2, 'Sample Chronos frontend',
        'Set up sample frontend.'),
    new Task(
        2, 1, 1, 0, 1, 'Prettify the frontend',
        'Add CSS and other layout to make it look good.'),
    new Task(
        3, 1, EMPTY_EPIC, 0, 2, 'Mock up all frontend interactions',
        'Create mock entries for everything that needs to be fetched from ' +
        'the server to make it easier to create the frontend.'),
  ]);

  return {
    type: ADD_TASKS,
    tasks: tasks,
  };
};
