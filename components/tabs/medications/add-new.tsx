import { useCallback, useEffect, useState } from "react";
import MedicationWebcam from "./webcam";
import Upload from "./upload";
import Tesseract from "tesseract.js";
import { Medication, Time, timeNumberToTime, timeToString } from "@/data/types";
import MedicationForm from "./medication-form";
import { useUser } from '@/contexts/UserContext';

export default function NewMedication() {
	const user = useUser();
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [medication, setMedication] = useState<Medication>({
		name: "",
		quantity: 1,
		unit: "",
		period: 1,
		times: new Map<number, Array<Time>>(),
		notes: ""
	});
	const generateSummary = useCallback(async (image: string) => {
		if (!image) {
			alert("Please upload an image first.");
			return;
		}
		const { data: { text: ocrOutput } } = await Tesseract.recognize(
			image,
			'eng',
		);
		console.log("OCR Output:", ocrOutput);

		try {
			console.log("-".repeat(53));
			const response = await fetch("https://st7wy4wuh5.execute-api.us-east-1.amazonaws.com/prod/call-bedrock", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: ocrOutput
				})
			});
			console.log(response);
			console.log('Body:', response.body);
			const stream = response.body as ReadableStream;
			const reader = stream.getReader();
			let result = '';

			while (true) {
				const { done, value } = await reader.read();

				if (done) {
					break; // Stream has ended
				}

				// 'value' is a Uint8Array (chunk of data). Convert it to a string.
				result += new TextDecoder().decode(value);
			}
			const parsedResult = JSON.parse(JSON.parse(result).body.output.message.content[0].text);
			const medication: Medication = {
				name: parsedResult.name || "",
				quantity: parsedResult.quantity || 0,
				unit: parsedResult.unit || "",
				period: parsedResult.period || 0,
				times: new Map<number, Array<Time>>(),
				notes: parsedResult.notes || ""
			};
			for(const [day, times] of Object.entries(parsedResult.times || {})) {
				const convertedTimes = times as Array<number>;
				medication.times.set(Number(day), convertedTimes.map(time => {
					return timeNumberToTime(time);
				}));
			}
			console.log("Parsed Result:", parsedResult);
			console.log("Medication Object:", medication);

			setImageSrc(null); // Clear the image after processing
			setMedication(medication); // Update the medication state
		} catch (err) {
			setImageSrc(null); // Clear the image after processing
			console.log(err);
		}
		// console.log("Generated result:", result);
  }, []);

	useEffect(() => {
		if (imageSrc) {	
			generateSummary(imageSrc);
		}
	}, [imageSrc, generateSummary]);

	return (
		<div className="h-full rounded-xl w-1/2 bg-white border-1 border-gray-300 items-center flex flex-col p-4 gap-y-4">
			<h1 className="text-center text-2xl">Add New Medication</h1>
			<div className="w-full flex flex-row gap-x-4">
				<MedicationWebcam setImageSrc={setImageSrc} processing={imageSrc != null} />
				<Upload setImageSrc={setImageSrc} processing={imageSrc != null} />
			</div>
			<MedicationForm medication={medication} setMedication={setMedication}/>
			{/* For Testing */}
			{/* <div>
				Name: {medication.name}<br />
				Quantity: {medication.quantity}<br />
				Unit: {medication.unit}<br />
				Period: {medication.period}<br />
				Times: {Array.from(medication.times.entries()).map(([day, times]) => (
					<div key={day}>
						Day {day}: {times.map(time => timeToString(time)).join(", ")}
					</div>
				))}<br />
				Notes: {medication.notes}	
			</div> */}
		</div>
	)
}