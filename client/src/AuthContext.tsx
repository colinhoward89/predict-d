import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUser } from './Util/ApiService';

const initialAuthContextValue: AuthContextValue = {
  currentUser: null,
  isAuthenticated: false,
  handleGetUser: async () => {},
};

export const AuthContext = createContext<AuthContextValue>(initialAuthContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  console.log(currentUser)

  // Checks if user exists in the database
  const handleGetUser = async (email: string) => {
    if (email) {
      const receivedUser = await getUser(email);
      if (receivedUser) {
        setCurrentUser({
          email: receivedUser[0].email,
          team: receivedUser[0].team,
          image: receivedUser[0].image ? receivedUser[0].image : null,
          id: receivedUser[0]._id,
        });
      } else {
        setCurrentUser(null); // Set currentUser to null if receivedUser is not found
        console.log(currentUser);
      }
    } else {
      setCurrentUser(null); // Set currentUser to null if email is empty
      console.log(currentUser);
    }
  };
  

  const isAuthenticated = !!currentUser;

  const authContextValue: AuthContextValue = {
    currentUser,
    isAuthenticated,
    handleGetUser,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
