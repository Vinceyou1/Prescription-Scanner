// import { assert } from "console";

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
	times: Map<number, Array<number>>,
	notes: string,
};

export function timeToNumber(hour: number, minute: number) {
	// assert(hour >= 0);
	// assert(hour <= 23);
	// assert(minute >= 0);
	// assert(minute <= 59);
	return hour * 100 + minute
}

export function timeNumberToString(time: number) {
	let minute = time % 100;
	var hour = time / 100;
	let isPM = hour >= 12;
	if(isPM) hour -= 12;
	if(hour === 0) hour = 12; // 12 AM or 12 PM
	return (
		(hour < 10 ? "0" + hour : hour ) + ":" +
		(minute < 10 ? "0" + minute : minute ) + " " +
		(isPM ? "PM": "AM")
	);
}