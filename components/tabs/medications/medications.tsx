import NewMedication from "./new-medication";

import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import CurrentMedications from "./current-medications";

const client = generateClient<Schema>()

export default function Medications() {
	return (
		<div className="h-full w-full flex flex-row gap-x-4">
			<CurrentMedications />
			<NewMedication />
		</div>
	)
}