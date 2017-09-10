import {ADD_STATES} from '../actions/state';

const initialState = {
  states: new Map(),
  lastCol: 0,
};

const states = (state = initialState, action) => {
  switch (action.type) {
  case ADD_STATES:
    let lastCol = state.lastCol;
    let newStates = [
      ...state.states,
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
