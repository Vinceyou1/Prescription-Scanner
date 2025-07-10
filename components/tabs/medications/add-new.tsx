import { useState } from "react";
import MedicationWebcam from "./webcam";
import Upload from "./upload";
import Image from "next/image";

export default function NewMedication() {

	const [imageSrc, setImageSrc] = useState<string | null>(null);

	return (
		<div className="h-full rounded-xl w-1/2 bg-white border-1 border-gray-300 items-center flex flex-col p-4 gap-y-4">
			<h1 className="text-center text-2xl">Add New Medication</h1>
			<div className="w-full flex flex-row gap-x-4">
				<MedicationWebcam setImageSrc={setImageSrc} disabled={imageSrc != null} />
				<Upload setImageSrc={setImageSrc} disabled={imageSrc != null} />

			</div>
			{imageSrc &&
				<Image src={imageSrc}
					width={0}
					height={0}
					// sizes="100vw"
					style={{ width: '100%', height: 'auto' }} // optional 
					alt={""} />
			}
		</div>
	)
}