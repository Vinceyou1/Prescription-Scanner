import CurrentMedications from "./current-medications";
import NewMedication from "./new-medication";

export default function Medications() {
	return (
		<div className="h-full w-full flex flex-row gap-x-4">
			<CurrentMedications />
			<NewMedication />
		</div>
	)
}