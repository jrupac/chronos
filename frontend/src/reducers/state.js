import {ADD_STATES} from '../actions/state';

const initialState = new Map();

let lastCol = 0;

const states = (state = initialState, action) => {
  switch (action.type) {
  case ADD_STATES:
    let newStates = [
      ...state,
      ...action.states.map((e) => {
        e['col'] = lastCol++;
        return [e.id, e];
      })];

    return new Map(newStates);
  default:
    return state;
  }
};

export default states;
