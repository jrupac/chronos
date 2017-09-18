import {ADD_PROJECTS} from '../actions/project';

const initialState = new Map();

const projects = (state = initialState, action) => {
  switch (action.type) {
  case ADD_PROJECTS:
    let newProjects = [
      ...state,
      ...action.projects.map((e) => {
        return [e.id, e];
      })];

    return new Map(newProjects);
  default:
    return state;
  }
};

export default projects;
