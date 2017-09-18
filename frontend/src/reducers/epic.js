import {ADD_EPICS} from '../actions/epic';

const initialState = [];

const epics = (state = initialState, action) => {
  switch (action.type) {
  case ADD_EPICS:
    return [...state, ...action.epics];
  default:
    return state;
  }
};

export default epics;
