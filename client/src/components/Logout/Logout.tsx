import React from 'react';
import { logout } from './../../Util/ApiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../AuthContext';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { handleGetUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    handleGetUser(''); // Reset currentUser to null
    navigate('/'); // Navigate to the homepage or any desired route after logout
  };

  return (
    <div>
      <h2>Are you sure you want to log out?</h2>
      <button type="button" onClick={() => navigate('/leagues')}>
        No
      </button>
      <button type="button" onClick={handleLogout}>
        Yes
      </button>
    </div>
  );
};

export default Logout;
