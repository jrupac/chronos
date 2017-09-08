import {combineReducers} from 'redux';
import tasks from './task';
import states from './state';

const ChronosReducer = combineReducers({
  tasks,
  states,
});

export default ChronosReducer;
