import React, { FC, useContext, useState } from 'react';
import styles from './League-list.module.css';
import { AuthContext } from './../../AuthContext';
import { useNavigate } from 'react-router-dom';
import MyLeagues from '../My-leagues/My-leagues';
import CreateLeague from '../Create-league/Create-league';
import JoinLeague from '../Join-league/Join-league';

interface LeagueListProps {}

const LeagueList: FC<LeagueListProps> = () => {
  const { currentUser, isAuthenticated, handleGetUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('MyLeagues');

  const handleNavigation = (component: string) => {
    if (isAuthenticated) {
      setActiveComponent(component);
    } else {
      navigate('/');
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'MyLeagues':
        return <MyLeagues />;
      case 'CreateLeague':
        return <CreateLeague />;
      case 'JoinLeague':
        return <JoinLeague />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => handleNavigation('MyLeagues')}>My Leagues</button>
        <button onClick={() => handleNavigation('CreateLeague')}>Create League</button>
        <button onClick={() => handleNavigation('JoinLeague')}>Join League</button>
      </div>
      {renderComponent()}
    </div>
  );
};

export default LeagueList;
