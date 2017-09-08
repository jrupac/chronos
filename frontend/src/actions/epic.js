/**
 * Epic represents a collection of related tasks.
 */
class Epic {
  /**
   * Constructor.
   * @param {Number} id Unique ID of object.
   * @param {String} projectID Name of project.
   * @param {String} name Name of epic.
   * @param {boolean} active True if epic should be shown.
   */
  constructor(id, projectID, name, active) {
    this.id = id;
    this.projectID = projectID;
    this.name = name;
    this.active = active;
  }
}
