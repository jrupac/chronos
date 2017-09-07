import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Chronos from './Chronos';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Chronos />, document.getElementById('root'));
registerServiceWorker();
