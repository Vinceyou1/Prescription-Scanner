import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, getCurrentUser } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';

const AuthContext = createContext<AuthUser | null>(null);

export const AuthProvider = ({ children } : { children: React.ReactNode; }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();

    const unsubscribe = Hub.listen('auth', ({ payload: { event } }) => {
      if (event === 'signedIn' || event === 'signedOut') {
        fetchUser();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
