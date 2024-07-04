"use client";
import { useState, useEffect } from "react";
export default function CurrentDate() {
	const [currentDate, setCurrentDate] = useState("");
	useEffect(() => {
		const today = new Date();
		const dateString = today.toLocaleDateString("en-IN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
		setCurrentDate(dateString);
	}, []);
	return <div className="text-sm">{currentDate}</div>;
}
