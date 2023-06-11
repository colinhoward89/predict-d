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
    <nav className={styles.Navbar}>
      <ul className={styles.NavbarMain}>
        <li>
          <button
            className={styles.NavbarLink}
            onClick={() => handleNavigation('/leagues')}
          >
            Leagues
          </button>
        </li>
        <li>
          <button
            className={styles.NavbarLink}
            onClick={() => handleNavigation('/predictions')}
          >
            Predictions
          </button>
        </li>
        <li>
          <button
            className={styles.NavbarLink}
            onClick={() => handleNavigation('/logout')}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
