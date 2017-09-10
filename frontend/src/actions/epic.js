export const ADD_EPICS = 'ADD_EPICS';

/**
 * Epic represents a collection of related tasks.
 */
class Epic {
  /**
   * Constructor.
   * @param {Number} id Unique ID of object.
   * @param {Number} projectID Name of project.
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

export const EMPTY_EPIC = 0;

export const FetchEpics = () => {
  const epics = Array.from([
    new Epic(
        1, 0, 'Chronos Frontend UI', true),
  ]);

  return {
    type: ADD_EPICS,
    epics: epics,
  };
};
