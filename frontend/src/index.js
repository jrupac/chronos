import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
// CSS needed RGL and Semantic UI
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import '../node_modules/semantic-ui-css/semantic.min.css';
import {FetchEpics} from './actions/epic';
import {FetchProjects} from './actions/project';
import {FetchStates} from './actions/state';
import {FetchTasks} from './actions/task';
import Chronos from './containers/chronos';

import './index.css';
import ChronosReducer from './reducers';
import registerServiceWorker from './registerServiceWorker';

let store = createStore(ChronosReducer);

// Load initial data
store.dispatch(FetchProjects());
store.dispatch(FetchEpics());
store.dispatch(FetchStates());
store.dispatch(FetchTasks());

render(
    <Provider store={store}>
      <Chronos/>
    </Provider>,
    document.getElementById('root'));

registerServiceWorker();
