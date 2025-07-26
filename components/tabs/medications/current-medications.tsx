import { useEffect, useState } from "react";
import { Medication, Time, timeToString } from "@/data/types";
import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { useUser } from '@/contexts/UserContext';
import getCycleDay from "@/data/getCycleDay";

const client = generateClient<Schema>();

type MedicationData = Medication & {
	updatedAt: Date;
	id: string;
};

export default function CurrentMedications() {
	const user = useUser();
	const [loading, setLoading] = useState(true);
	const [medications, setMedications] = useState<MedicationData[]>([]);

	useEffect(() => {
		setLoading(true);
		if (!user || user.signInDetails?.loginId === undefined) {
			console.log("No user or userData found");
			return;
		}

		console.log("Fetching medications for user:", user.signInDetails?.loginId);

		const sub = client.models.medication.observeQuery({
			filter: {
				userId: {
					eq: user.signInDetails.loginId
				}
			}
		}).subscribe({
      next: ({ items }) => {
				setLoading(false);
				const meds: MedicationData[] = items.map((medication) => {
					let timesJSON = JSON.parse(medication.times as string)
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
					}
				});
				setMedications(meds);
      },
    });
		return () => sub.unsubscribe();

	}, [user]);

	return (
		<div className="h-full rounded-xl w-1/2 bg-white border-1 border-gray-300 items-center flex flex-col p-4 gap-y-4">
			<h1 className="text-center text-2xl">Current Medications</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="w-full flex flex-col gap-y-4">
					{medications.map((medication, index) => (
						<div key={index}>
							{medication.name} - {medication.quantity} {medication.unit} <br />
							Added on: {" " + medication.updatedAt.toLocaleDateString()} <br /> 
							Schedule: <br /> 
							{
								Array.of(medication.period).map((_, dayIndex) => {
									const times = medication.times.get(dayIndex) || [];
									return (
										<div key={dayIndex}>
											Day {dayIndex + 1}: {times.map(time => timeToString(time))}
										</div>
									);
								})
							}
							On cycle day: {getCycleDay(medication.updatedAt, medication.period)} <br />

						</div>
					))}
				</div>
			)}
		</div>
	)
}