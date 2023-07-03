import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../AuthContext';

const Navbar: FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigation = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className={styles.Navbar} role="navigation">
      <div className={styles.NavbarLogo}>
        <img className={styles.Logo} src="predictd.png" alt="Predict'd Logo" />
      </div>
      <ul className={styles.NavbarMain} role="menu">
        <li>
          <button
            className={styles.NavbarLink}
            onClick={() => handleNavigation('/leagues')}
            aria-label="Navigate to Leagues"
            tabIndex={0}
          >
            Leagues
          </button>
        </li>
        <li>
          <button
            className={styles.NavbarLink}
            onClick={() => handleNavigation('/predictions')}
            aria-label="Navigate to Predictions"
          >
            Predictions
          </button>
        </li>
      </ul>
      <button
        className={styles.NavbarLink}
        onClick={() => handleNavigation('/logout')}
        aria-label="Log out"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
