import {combineReducers} from 'redux';
import epics from './epic';
import projects from './project';
import states from './state';
import tasks from './task';

const ChronosReducer = combineReducers({
  epics,
  projects,
  states,
  tasks,
});

export default ChronosReducer;
