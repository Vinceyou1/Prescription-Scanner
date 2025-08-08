import React, { createContext, useContext, useEffect, useState } from "react";

import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Medication, Time } from "@/data/types";
import { useAuth } from "./AuthContext";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export type MedicationData = Medication & {
  updatedAt: Date;
  id: string;
};

const MedicationContext = createContext<[MedicationData[], boolean]>([
  [],
  true,
]);

export const MedicationDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = useAuth();
  const [medications, setMedications] = useState<MedicationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!auth || auth.signInDetails?.loginId === undefined) return;

    const sub = client.models.medication
      .observeQuery({
        filter: {
          userId: {
            eq: auth.signInDetails.loginId,
          },
        },
      })
      .subscribe({
        next: ({ items }) => {
          console.log("Fetched medications:", items);
          setLoading(false);
          const meds: MedicationData[] = items.map((medication) => {
            let timesJSON = JSON.parse(medication.times as string);
            let timesMap: Map<number, Array<Time>> = new Map();
            Object.entries(timesJSON).forEach(([key, value]) => {
              timesMap.set(Number(key), value as Time[]);
            });
            return {
              name: medication.name,
              quantity: medication.quantity,
              unit: medication.unit || "",
              period: medication.period,
              times: timesMap,
              notes: medication.notes || "",
              updatedAt: new Date(medication.updatedAt),
              id: medication.id,
            };
          });
          setMedications(meds);
        },
        error: (error) => {
          console.error("Error fetching medications:", error);
          setMedications([]);
        },
        complete: () => {
          console.log("Medication data fetch complete");
          setLoading(false);
        },
      });
    return () => sub.unsubscribe();
  }, [auth]);

  return (
    <MedicationContext.Provider value={[medications, loading]}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedicationData = () => useContext(MedicationContext);
