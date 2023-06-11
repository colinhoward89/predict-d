import React from 'react';
import { logout } from './../../Util/ApiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../AuthContext';
import styles from './Logout.module.css';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { handleGetUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    handleGetUser(''); // Reset currentUser to null
    navigate('/'); // Navigate to the homepage after logout
  };

  return (
    <div className={styles.Logout} aria-label="Logout">
      <div className={styles.ButtonsContainer}>
        <button
          type="button"
          id="remainButton"
          onClick={() => navigate('/leagues')}
          role="button"
          className={`${styles.Button} ${styles.RemainButton}`}
        >
          Remain
        </button>
        <button
          type="button"
          id="leaveButton"
          onClick={handleLogout}
          role="button"
          className={`${styles.Button} ${styles.LeaveButton}`}
        >
          Leave
        </button>
      </div>
    </div>
  );
};

export default Logout;