import React from 'react';
import ReactDOM from 'react-dom';
import MyLeagues from './My-leagues';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MyLeagues />, div);
  ReactDOM.unmountComponentAtNode(div);
});