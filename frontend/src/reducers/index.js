import {combineReducers} from 'redux';
import epics from './epic';
import states from './state';
import tasks from './task';

const ChronosReducer = combineReducers({
  epics,
  states,
  tasks,
});

export default ChronosReducer;
