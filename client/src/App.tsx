import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Home from './components/Home/Home';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isRegisterSelected, setIsRegisterSelected] = useState(false);

  const handleButtonClick = () => {
    setIsRegisterSelected(!isRegisterSelected);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? (<Home />) : (
              <div>
                <button onClick={handleButtonClick}>
                  {isRegisterSelected ? 'Login' : 'Register'}
                </button>
                {isRegisterSelected ? <Register /> : <Login />}
              </div>
            )
          }
        />
        <Route path="/login" element={!isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/register" element={!isAuthenticated ? (
              <Register />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;