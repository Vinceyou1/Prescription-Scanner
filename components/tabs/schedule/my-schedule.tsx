import { useMedicationData } from "@/contexts/MedicationDataContext";
import ScheduleDisplay from "./schedule-display";

export default function MySchedule() {
  const [medications, medicationsLoading] = useMedicationData();

  return (
    <div className="h-full rounded-xl p-4 w-full bg-white border-1 border-gray-300 items-center flex">
      {medicationsLoading ? (
        <h1 className="max-h-full w-full text-center text-2xl">Loading...</h1>
      ) : medications.length > 0 ? (
        <div className="h-full w-full">
          <ScheduleDisplay medications={medications}/>
        </div>
      ) : (
        <h1 className="w-full text-center text-2xl">
          Head over to the medications tab to scan your first prescription!
        </h1>
      )}
    </div>
  );
}
