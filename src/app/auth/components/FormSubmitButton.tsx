"use client";
interface FormSubmitButtonProps {
	buttonText: string;
	isSubmitting: boolean;
}

export default function FormSubmitButton({
	buttonText,
	isSubmitting,
}: FormSubmitButtonProps) {
	return (
		<button
			disabled={isSubmitting}
			type="submit"
			className="w-full py-2 bg-primary text-white text-sm font-medium text-center rounded-full"
		>
			{isSubmitting ? "Submitting..." : buttonText}
		</button>
	);
}
