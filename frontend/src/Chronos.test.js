import React from 'react';
import ReactDOM from 'react-dom';
import Chronos from './Chronos';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Chronos />, div);
});
