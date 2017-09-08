import {ADD_STATES} from '../actions/state';

const states = (state = {}, action) => {
  switch (action.type) {
  case ADD_STATES:
    let lastCol = state.lastCol || 0;
    let newStates = [
      ...states.states || 0,
      ...action.states.map((e) => {
        e['col'] = lastCol++;
        return [e.id, e];
      })];

    return {
      states: new Map(newStates),
      lastCol: lastCol,
    };
  default:
    return state;
  }
};

export default states;
