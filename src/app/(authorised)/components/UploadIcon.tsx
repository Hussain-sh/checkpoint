"use client";
import { useRef, useState } from "react";
import Image from "next/image";

interface ProfilePictureProps {
	name: string;
	label: string;
}
export default function UploadIcon({ name, label }: ProfilePictureProps) {
	const [pickedImage, setPickedImage] = useState<string | null>();
	const imageInput = useRef<HTMLInputElement>(null);

	function handleImagePicked(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) {
			setPickedImage(null);
			return;
		}

		const fileReader = new FileReader();

		fileReader.onload = () => {
			const result = fileReader.result;
			if (result && typeof result === "string") {
				setPickedImage(result);
			} else {
				setPickedImage(null);
			}
		};

		fileReader.readAsDataURL(file);
	}
	function handlePickClick() {
		if (imageInput.current) {
			imageInput.current.click();
		}
	}
	return (
		<div className="flex flex-col w-full gap-3">
			<label htmlFor={name} className="font-semibold">
				{label}
			</label>
			<div className="flex items-start gap-6 mb-4">
				<div className="w-32 h-32 border border-[#a4abb9] flex items-center justify-center text-center tex-[#a4abb9] relative">
					{!pickedImage && <p className="m-0 p-4">No Image picked yet</p>}
					{pickedImage && (
						<Image
							src={pickedImage}
							alt="Image picked by the user"
							objectFit="cover"
							fill
						/>
					)}
				</div>
				<input
					type="file"
					id={name}
					name={name}
					className="hidden"
					accept="image/*"
					ref={imageInput}
					onChange={handleImagePicked}
				/>
				<button
					type="button"
					className="px-2 py-2 bg-primary rounded-sm cursor-pointer text-white"
					onClick={handlePickClick}
				>
					Pick an Image
				</button>
			</div>
		</div>
	);
}
