import Image from "next/image";

export default function About() {
	return (
		<div className="flex flex-col justify-between w-full h-full px-8 pt-24">
			<div className="flex flex-row w-full">
				<p
					className="text-xl w-1/2"
				>
					This is a project made by <a
						className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-blue-600"
						href="https://github.com/Vinceyou1/Prescription-Scanner"
						
					>
						Vinceyou1.
					</a>
					<br/>
					It uses AI to scan your prescription labels <br />
					and automatically create a medication schedule. <br />
				</p>
				<div className="flex flex-col w-1/2 gap-y-4">
					<p className="text-right text-xl">Test it out with this example label:</p>
					<Image
						width={400}
						height={0}
						src="/labels/druglabel.jpg"
						alt=""
						className="ml-auto"
					/>
				</div>
			</div>
			<p className="mt-8 text-center text-sm">
				Built with React/Next.js, Tailwind CSS, Tesseract OCR, and AWS Bedrock.
			</p>
		</div>
	)
}