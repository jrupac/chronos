/**
 * Board represents a collection of tasks and projects.
 */
export default class Board {
  /**
   * Constructor.
   * @param {Number} id Unique ID of object.
   * @param {String} state Name of state.
   */
  constructor(id, state) {
    this.id = id;
    this.state = state;
  }
}
