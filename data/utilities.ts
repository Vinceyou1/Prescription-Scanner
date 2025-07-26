
import { differenceInCalendarDays } from 'date-fns';
import { Time } from './types';

export default function getCycleDay(updatedAt: Date, cycleLengthInDays: number): number {
	const today = new Date();
	const elapsedDays = differenceInCalendarDays(today, updatedAt);
	console.log ("Elapsed Days:", elapsedDays);
	const cycleDay = ((elapsedDays % cycleLengthInDays) + cycleLengthInDays) % cycleLengthInDays;
	return cycleDay;
}

export function timeNumberToTime(time: number): Time {
	const minute = time % 100;
	let hour = Math.floor(time / 100);
	const isPM = hour >= 12;
	if (isPM) hour -= 12;
	if (hour === 0) hour = 12; // 12 AM or 12 PM
	return { hour, minute, isPM };
}

export function timeToString(time: Time) {
	return (
		(time.hour || 12).toString().padStart(2, "0") + ":" +
		time.minute.toString().padStart(2, "0") + " " +
		(time.isPM ? "PM" : "AM")
	);
}

