import React from 'react';
import ReactDOM from 'react-dom';
import CreateLeague from './Create-league';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CreateLeague />, div);
  ReactDOM.unmountComponentAtNode(div);
});