import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';

import Chronos from './Chronos';
import './Chronos.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Chronos/>, document.getElementById('root'));
registerServiceWorker();
