/**
 * @property {string} name - the name of the medication
 * @property {number} quantity - how much to take
 * @property {string} unit - pills, mL, etc.
 * @property {number} period - if period == x, cycle repeats every x days - CAP THIS OUT AT 7
 * @property {Map<number, Array<number>>} times - each day in [0, period - 1] mapped to dosage times
 * @property {string} notes - any additional notes (i.e. take with food)
 */
export type Medication = {
	name: string,
	quantity: number,
	unit: string,
	period: number,
	times: Map<number, Array<Time>>,
	notes: string,
};

export type Time = {
	hour: number, // 0-11
	minute: number, // 0-59
	isPM: boolean, // true for PM, false for AM
}

export function timeNumberToTime(time: number): Time {
	const minute = time % 100;
	let hour = Math.floor(time / 100);
	const isPM = hour >= 12;
	if (isPM) hour -= 12;
	if (hour === 0) hour = 12; // 12 AM or 12 PM
	return { hour, minute, isPM };
}

// TODO: figure out timezone stuff? not really necessary tbh

export function timeToString(time: Time) {
	return (
		(time.hour || 12).toString().padStart(2, "0") + ":" +
		time.minute.toString().padStart(2, "0") + " " +
		(time.isPM ? "PM": "AM")
	);
}