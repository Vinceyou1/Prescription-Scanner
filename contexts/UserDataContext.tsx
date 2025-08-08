import React, { createContext, useContext, useEffect, useState } from "react";

import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuth } from "./AuthContext";

const UserDataContext = createContext<Schema["user"]["type"] | null>(null);

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = useAuth();
  const client = generateClient<Schema>();
  const [userData, setUserData] = useState<Schema["user"]["type"] | null>(null);
  useEffect(() => {
    setUserData(null);
    if (!auth || !auth.signInDetails?.loginId) {
      return;
    }

    let sub = client.models.user
      .observeQuery({
        filter: {
          id: {
            eq: auth.signInDetails.loginId,
          },
        },
      })
      .subscribe({
        next: async ({ items }) => {
          if (items.length > 0) {
            setUserData(items[0]);
          } else {
            setUserData(null);
            if (auth.signInDetails?.loginId) {
              await client.models.user
                .create({
                  id: auth.signInDetails.loginId,
                })
            }
          }
        },
      });

    return () => sub.unsubscribe();
  }, [auth]);

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
