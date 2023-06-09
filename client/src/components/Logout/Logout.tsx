import React from 'react';
import { logout } from './../../Util/ApiService';
import { useNavigate } from 'react-router-dom';

interface LogoutProps {
  setIsAuthenticated?: (value: boolean) => void;
}

const Logout: React.FC<LogoutProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    handleAuth();
  };

  const handleAuth = () => {
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
    navigate('/');
  };

  return (
    <div>
      <h2>Are you sure you want to log out?</h2>
      <button
        type="button"
        onClick={() => {
          navigate(`/`);
        }}
      >
        No
      </button>
      <button type="button" onClick={() => handleClick()}>
        Yes
      </button>
    </div>
  );
};

export default Logout;
