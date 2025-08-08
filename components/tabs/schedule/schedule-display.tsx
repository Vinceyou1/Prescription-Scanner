import { MedicationData } from "@/contexts/MedicationDataContext";
import { Medication, Time } from "@/data/types";
import { getCycleDay, timeToString } from "@/data/utilities";
import React from "react";

{
  /* 
	Want to display a schedule of medications to take on the current day.
	Also should function as a sort of dashboard that shows misses and percentages of medications taken.
*/
}

type MedicationTime = Omit<MedicationData, "times"> & {
  time: Time;
	index: number;
};

export default function ScheduleDisplay({
  medications,
}: {
  medications: MedicationData[];
}) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [dayIndex, setDayIndex] = React.useState(new Date().getDay());

	const getCycleDayWithOffset = (updatedAt: Date, cycleLength: number) => {
		let cycleDay = getCycleDay(updatedAt, cycleLength);
		const indexOffset = dayIndex - new Date().getDay();
		cycleDay += indexOffset;
		while (cycleDay < 0) {
			cycleDay += cycleLength;
		}
		cycleDay %= cycleLength;
		return cycleDay;
	};

  const medicationsForToday: MedicationTime[] = medications
    .filter((medication) => {
      let cycleDay = getCycleDayWithOffset(medication.updatedAt, medication.period);
      const times = medication.times.get(cycleDay);
      console.log("Cycle Day:", cycleDay, "Times:", times);
      return times !== undefined && times.length > 0;
    })
    .map((medication) => {
      const cycleDay = getCycleDayWithOffset(medication.updatedAt, medication.period);
      const times = medication.times.get(cycleDay);
      return times!.map((time, index) => {
        return { ...medication, time, index };
      });
    })
    .flat().sort((a, b) => {
			if(a.time.isPM != b.time.isPM) {
				return a.time.isPM ? 1 : -1;
			}
			if (a.time.hour !== b.time.hour) {
				return a.time.hour - b.time.hour;
			}
			return a.time.minute - b.time.minute;
		});

  return (
    <div className="w-full h-full flex flex-row gap-x-4">
      <div className="flex-1 flex flex-col gap-y-4 h-full">
        {medicationsForToday.length === 0 ? (
          <div className="text-gray-500">
            No medications scheduled for today
          </div>
        ) : (
          medicationsForToday.map((medication) => (
            <div
              key={medication.id + medication.index}
              className="p-4 rounded-lg flex flex-col justify-between bg-gray-100"
            >
              <p>
                {medication.name} - {medication.quantity} {medication.unit}
              </p>
              <div className="text-sm mt-1 text-gray-500">
                {timeToString(medication.time)}
                <p className="mt-1">Notes: {medication.notes || "None"}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="w-1/10 flex flex-col justify-between items-stretch gap-y-8">
        {daysOfWeek.map((day, idx) => (
          <button
            key={day}
            type="button"
            onClick={() => setDayIndex(idx)}
            className={`
							flex-grow py-2 rounded-lg mx-1 transition-colors text-xl
							${idx === new Date().getDay() ? "border-2 border-gray-300" : ""}
							${idx === dayIndex ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-800"}
							${idx === new Date().getDay() ? "shadow-lg" : ""}
						`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
