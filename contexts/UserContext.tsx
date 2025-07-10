"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, getCurrentUser } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';

const UserContext = createContext<AuthUser | null>(null);

export const UserProvider = ({ children } : { children: React.ReactNode; }) => {
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
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
