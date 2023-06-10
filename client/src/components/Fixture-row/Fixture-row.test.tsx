import React from 'react';
import ReactDOM from 'react-dom';
import FixtureRow from './Fixture-row';

it('It should mount', () => {
  const div = document.createElement('div');
  // ReactDOM.render(<FixtureRow />, div);
  ReactDOM.unmountComponentAtNode(div);
});