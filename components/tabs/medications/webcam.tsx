import * as Dialog from "@radix-ui/react-dialog";
import Webcam from "react-webcam"
import dialogStyles from "../../dialog.module.css";
import { useRef, useState } from "react";
import Image from "next/image";


const videoConstraints = {
	width: 1280,
	height: 720,
	facingMode: "user"
};

export default function MedicationWebcam({ 
	processing,
	setImageSrc
} : {
	processing: boolean,
	setImageSrc: (src: string | null) => void
}) {
	const [open, setOpen] = useState(false);
	const webcamRef = useRef<Webcam | null>(null);
	const [imageSrcTemp, setImageSrcTemp] = useState<string | null>(null);
	function capture() {
		console.log(imageSrcTemp);
		if (imageSrcTemp) {
			console.log("here!")
			setOpen(false);
			setImageSrc(imageSrcTemp);
			return;
		}
		if (!webcamRef.current) return;
		setImageSrcTemp(webcamRef.current.getScreenshot());
	}

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild disabled={processing}>
				<button className="w-1/2 rounded-md bg-blue-200 text-blue-800 p-2 hover:bg-blue-300 transition-colors">
					{
						processing ? "Processing..." : "Take Picture"
					}
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className={dialogStyles.Overlay} />
				<Dialog.Content className={dialogStyles.Content + " flex-col gap-y-4"}>
					{/* Errors for accessibility issues otherwise */}
					<Dialog.Title className="text-2xl">
						Take a Picture
					</Dialog.Title>
					{
						imageSrcTemp ? (
							<div className="flex flex-col items-center">
							<Image src={imageSrcTemp}
								width={0}
								height={0}
								style={{ width: '100%', height: 'auto', marginBottom: 16}} // optional 
								alt={""} />
								<button
									className="w-full rounded-sm bg-blue-200 text-blue-800 p-2 hover:bg-blue-300 transition-colors"
									onClick={() => setImageSrcTemp(null)}
								>
									Take Another Picture
								</button>
							</div>
						) :
							<Webcam
								audio={false}
								height={720}
								ref={webcamRef}
								screenshotFormat="image/jpeg"
								width={1280}
								videoConstraints={videoConstraints}
							/>
					}
					{/* TODO: extract this blue button to separate component */}
					<button className="w-full rounded-sm bg-blue-200 text-blue-800 p-2 hover:bg-blue-300 transition-colors" onClick={capture}>
						{imageSrcTemp ? "Use Picture" : "Take Picture"}
					</button>

				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}