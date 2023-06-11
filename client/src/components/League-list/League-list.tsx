import { FC, useContext, useState } from 'react';
import styles from './League-list.module.css';
import { AuthContext } from './../../AuthContext';
import { useNavigate } from 'react-router-dom';
import MyLeagues from '../My-leagues/My-leagues';
import CreateLeague from '../Create-league/Create-league';
import JoinLeague from '../Join-league/Join-league';

const LeagueList: FC<LeagueListProps> = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('MyLeagues');

  const handleNavigation = (component: string) => {
    if (isAuthenticated) {
      setActiveComponent(component);
    } else {
      navigate('/');
    }
  };

  // When you join a league it will take you back to the My Leagues tab
  const onHandleJoinLeague = () => {
    setActiveComponent('MyLeagues');
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'MyLeagues':
        return <MyLeagues />;
      case 'CreateLeague':
        return <CreateLeague onJoinLeague={onHandleJoinLeague}/>;
      case 'JoinLeague':
        return <JoinLeague onJoinLeague={onHandleJoinLeague} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.LeagueListContainer}>
      <nav>
        <div className={styles.ButtonContainer}>
          <button
            onClick={() => handleNavigation('MyLeagues')}
            className={activeComponent === 'MyLeagues' ? styles.ActiveButton : ''}
            aria-label="My Leagues"
            aria-pressed={activeComponent === 'MyLeagues'}
            tabIndex={0}
          >
            My Leagues
          </button>
          <button
            onClick={() => handleNavigation('CreateLeague')}
            className={activeComponent === 'CreateLeague' ? styles.ActiveButton : ''}
            aria-label="Create League"
            aria-pressed={activeComponent === 'CreateLeague'}
            tabIndex={0}
          >
            Create League
          </button>
          <button
            onClick={() => handleNavigation('JoinLeague')}
            className={activeComponent === 'JoinLeague' ? styles.ActiveButton : ''}
            aria-label="Join League"
            aria-pressed={activeComponent === 'JoinLeague'}
            tabIndex={0}
          >
            Join League
          </button>
        </div>
      </nav>
      <div className={styles.Content}>
        {renderComponent()}
      </div>
    </div>
  );
};

export default LeagueList;
