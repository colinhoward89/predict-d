import React, { createContext, useState, useEffect, useContext } from 'react';

const initialAuthContextValue: AuthContextValue = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const AuthContext = createContext<AuthContextValue>(initialAuthContextValue);

export const AuthProvider =({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const isAuthenticated = !!currentUser;

  const authContextValue: AuthContextValue = {
    isAuthenticated,
    isLoading,
    user: currentUser,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
