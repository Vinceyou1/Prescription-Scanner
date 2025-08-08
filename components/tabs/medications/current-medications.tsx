import { timeToString } from "@/data/utilities";
import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { useMedicationData } from "@/contexts/MedicationDataContext";

const client = generateClient<Schema>();

export default function CurrentMedications() {
	const [medications, medicationsLoading] = useMedicationData();

	async function deleteMedication(medicationId: string) {
		await client.models.medication.delete({
			id: medicationId
		});
	}

	return (
		<div className="h-full rounded-xl w-1/2 bg-white border-1 border-gray-300 items-center flex flex-col p-4 gap-y-4">
			<h1 className="text-center text-2xl">Current Medications</h1>
			{medicationsLoading ? (
				<p>Loading...</p>
			) : (
				<div className="w-full flex flex-col gap-y-4 overflow-y-auto">
					{medications.map((medication, index) => (
						<div key={index} className="p-4 rounded-lg flex flex-row items-center justify-between gap-2 bg-gray-100">
							<div className="flex flex-col">
								<p className="text-lg">
									{medication.name} - {medication.quantity} {medication.unit}
								</p>
								<div className="text-base mt-1 text-gray-500">
									{
										Array.from(medication.times.entries()).map(([day, times]) => (
											<p key={medication.id + day}>
												Day {day + 1}: {times.map(time => timeToString(time)).join(", ")}
											</p>
										))
									}
									<p className="mt-1">
										Notes: {medication.notes || "None"}
									</p>
								</div>
							</div>
							<button onClick={() => deleteMedication(medication.id)} className="text-red-500 hover:text-red-700 text-base">
								Delete
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}