import { useRef } from "react";

export default function Upload({
  processing,
  setImageSrc,
}: {
  processing: boolean;
  setImageSrc: (src: string | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-1/2">
      <button
        onClick={handleClick}
        disabled={processing}
        className="w-full rounded-sm bg-blue-200 text-blue-800 p-2 hover:bg-blue-300 transition-colors"
      >
        {processing ? "Processing..." : "Upload Image"}
      </button>

      <input
        className="hidden"
        id="upload"
        type="file"
        name="upload"
        accept="image/*"
        ref={fileInputRef} // Reference to the file input element
        // Event handler to capture file selection and update the state

        onChange={(event) => {
          const file = event.target.files?.[0]; // Get the first file from the FileList
          if (!file) return;

          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            setImageSrc(base64String); // final setter like your webcam code
          };
          reader.readAsDataURL(file); // 🔥 This converts the image to a base64 data URL
          (document.getElementById("upload") as HTMLInputElement).value = ""; // Reset the input value to allow re-uploading the same file
        }}
      />
    </div>
  );
}
