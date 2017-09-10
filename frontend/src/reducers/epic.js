import {ADD_EPICS} from '../actions/epic';
import {ADD_TASKS} from '../actions/task';

const initialState = [];

const epics = (state = initialState, action) => {
  switch (action.type) {
  case ADD_TASKS:
    return state;
  case ADD_EPICS:
    return [...state, ...action.epics];
  default:
    return state;
  }
};

export default epics;
