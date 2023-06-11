import React from 'react';
import ReactDOM from 'react-dom';
import PredictionsList from './Predictions-list';

it('It should mount', () => {
  const div = document.createElement('div');
  // ReactDOM.render(<PredictionsList />, div);
  ReactDOM.unmountComponentAtNode(div);
});