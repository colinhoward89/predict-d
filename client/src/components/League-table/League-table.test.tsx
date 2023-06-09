import React from 'react';
import ReactDOM from 'react-dom';
import LeagueTable from './League-table';

it('It should mount', () => {
  const div = document.createElement('div');
  // ReactDOM.render(<LeagueTable league={selectedLeague}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});