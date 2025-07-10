import NewMedication from "./add-new";

export default function Medications() {
	return (
		<div className="h-full w-full flex flex-row gap-x-4">
			<div className="h-full rounded-xl w-1/2 bg-white border-1 border-gray-300 items-center flex flex-col"></div>
			<NewMedication />
		</div>
	)
}