export const ADD_PROJECTS = 'ADD_PROJECTS';

/**
 * Project represents a collection of tasks.
 */
class Project {
  /**
   * Constructor.
   * @param {Number} id Unique ID of object.
   * @param {String} name Name of project.
   * @param {String} description Description of project.
   * @param {Boolean} active True if project is active.
   */
  constructor(id, name, description, active) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.active = active;
  }
}

export const FetchProjects = () => {
  const projects = Array.from([
    new Project(
        1, 'Chronos', 'Project tracking creation of Chronos tracker.', true),
  ]);

  return {
    type: ADD_PROJECTS,
    projects: projects,
  };
};
