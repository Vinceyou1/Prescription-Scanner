/**
 * @property {string} name - the name of the medication
 * @property {number} quantity - how much to take
 * @property {string} unit - pills, mL, etc.
 * @property {number} period - if period == x, cycle repeats every x days - CAP THIS OUT AT 7
 * @property {Map<number, Array<number>>} times - each day in [0, period - 1] mapped to dosage times
 * @property {string} notes - any additional notes (i.e. take with food)
 */
export type Medication = {
  name: string;
  quantity: number;
  unit: string;
  period: number;
  times: Map<number, Array<Time>>;
  notes: string;
};

/**
 * @property {number} hour - 0-11
 * @property {number} minute - 0-59
 * @property {boolean} isPM - true for PM, false for AM
 */
export type Time = {
  hour: number;
  minute: number;
  isPM: boolean;
};
