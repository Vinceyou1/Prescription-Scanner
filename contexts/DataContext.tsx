"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, getCurrentUser } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';

import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { useUser } from './UserContext';

const DataContext = createContext<Schema['user']['type'] | null>(null);

export const DataProvider = ({ children } : { children: React.ReactNode; }) => {
  const user = useUser();
  const client = generateClient<Schema>();
  const [userData, setUserData] = useState<Schema['user']['type'] | null>(null);

  async function getUserData(user: AuthUser) {
    if(!user || !user.signInDetails?.loginId) {
      return;
    }

    let userData = await client.models.user.get({
      id: user.signInDetails.loginId
    });
    
    if(!userData.data) {
      await client.models.user.create({
        id: user.signInDetails.loginId,
      }).finally(() => { console.log("User created") });
      // await client.models.user.list().then((data) => {
      // 	console.log("All users:", data)});
      userData = await client.models.user.get({
        id: user.signInDetails.loginId
      });
    }

    if (userData.data) {
      setUserData(userData.data);
    }
  }

  useEffect(() => {
    if (user) { 
      getUserData(user);
    }
  }, [user]);

  return (
    <DataContext.Provider value={userData}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
