
import { differenceInCalendarDays } from 'date-fns';

export default function getCycleDay(updatedAt: Date, cycleLengthInDays: number): number {
	const today = new Date();
	const elapsedDays = differenceInCalendarDays(today, updatedAt);
	console.log ("Elapsed Days:", elapsedDays);
	const cycleDay = ((elapsedDays % cycleLengthInDays) + cycleLengthInDays) % cycleLengthInDays;
	return cycleDay;
}