export const ADD_STATES = 'ADD_STATES';

/**
 * State represents a work stage for a task.
 */
 class State {
  /**
   * Constructor.
   * @param {Number} id Unique ID of object.
   * @param {String} state Name of state.
   */
  constructor(id, state) {
    this.id = id;
    this.state = state;
    this.col = 0;
  }
}

export const FetchStates = () => {
  const states = Array.from([
    new State(1, 'Unstarted'),
    new State(2, 'In Progress'),
    new State(3, 'Blocked'),
    new State(4, 'Done'),
  ]);

  return {
    type: ADD_STATES,
    states: states,
  };
};
