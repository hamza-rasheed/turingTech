import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { callType } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function capitalizeWords(text: string): string {
	if (!text) return "";
	return text
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export const convertToMinutes = (totalSeconds: number) => {
	const duration = moment.duration(totalSeconds, "seconds");
	const minutes = Math.floor(duration.asMinutes());
	const seconds = duration.seconds();
	return `${minutes} minutes and ${seconds} seconds`;
};

export const filterColors: { [key in callType]: string } = {
	voicemail: "text-blueColor",
	answered: "text-greenColor",
	missed: "text-redShade",
};
