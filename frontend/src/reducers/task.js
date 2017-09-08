import {ADD_TASKS} from '../actions/task';


const tasks = (state = [], action) => {
  switch (action.type) {
  case ADD_TASKS:
    return [...state, ...action.tasks];
  default:
    return state;
  }
};

export default tasks;
