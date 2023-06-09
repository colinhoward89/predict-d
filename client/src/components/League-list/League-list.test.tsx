import React from 'react';
import ReactDOM from 'react-dom';
import LeagueList from './League-list';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LeagueList />, div);
  ReactDOM.unmountComponentAtNode(div);
});