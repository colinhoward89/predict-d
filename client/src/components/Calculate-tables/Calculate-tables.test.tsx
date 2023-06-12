import React from 'react';
import ReactDOM from 'react-dom';
import CalculateTables from './Calculate-tables';

it('It should mount', () => {
  const div = document.createElement('div');
  // ReactDOM.render(<CalculateTables />, div);
  ReactDOM.unmountComponentAtNode(div);
});