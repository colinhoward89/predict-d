import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Logout from './components/Logout/Logout';
import LeagueList from './components/League-list/League-list';
import PredictionsList from './components/Predictions-list/Predictions-list';

function App() {
  const { currentUser, isAuthenticated, handleGetUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      handleGetUser(currentUser.email);
    }
  }, [isAuthenticated, currentUser]);

  console.log("from App", currentUser, isAuthenticated)

  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/leagues" element={<LeagueList />} />
        <Route path="/predictions" element={<PredictionsList />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
