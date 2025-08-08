import * as Form from "@radix-ui/react-form";
import styles from "./styles.module.css";
import { Medication, Time } from "@/data/types";
import { FaRegTrashCan } from "react-icons/fa6";

import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useUserData } from "@/contexts/UserDataContext";

const client = generateClient<Schema>();

export default function MedicationForm({
  medication,
  setMedication,
}: {
  medication: Medication;
  setMedication: (medication: Medication) => void;
}) {
  const userData = useUserData();

  return (
    <Form.Root
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Submitted medication:", medication);
        client.models.medication
          .create({
            ...medication,
            times: JSON.stringify(Object.fromEntries(medication.times)), // Convert Map to object for storage
            userId: userData?.id || "",
          })
          .then(() => {
            console.log("Medication created successfully");
            setMedication({
              name: "",
              quantity: 1,
              unit: "",
              period: 1,
              times: new Map<number, Array<Time>>(),
              notes: "",
            });
          })
          .catch((error) => {
            console.error("Error creating medication:", error);
            alert("Failed to create medication. Please try again.");
          });
        // Here you would typically handle the submission, e.g., send to an API
      }}
    >
      <Form.Field className={styles.Field} name="name">
        <div className="flex flex-row items-center justify-between">
          <Form.Label className={styles.Label}>Name</Form.Label>
          <Form.Message className={styles.Message} match="valueMissing">
            Please enter a medication name
          </Form.Message>
        </div>
        <Form.Control
          value={medication.name}
          onChange={(e) =>
            setMedication({ ...medication, name: e.target.value })
          }
          required
          className={styles.Input}
        />
      </Form.Field>
      <Form.Field className={styles.Field} name="quantity">
        <div className="flex flex-row items-center justify-between">
          <Form.Label className={styles.Label}>Quantity</Form.Label>
          <Form.Message className={styles.Message} match="valueMissing">
            Please enter a quantity
          </Form.Message>
          <Form.Message className={styles.Message} match="rangeUnderflow">
            Please enter a positive quantity
          </Form.Message>
        </div>
        <Form.Control
          value={medication.quantity}
          onChange={(e) =>
            setMedication({ ...medication, quantity: Number(e.target.value) })
          }
          type="number"
          min="1"
          className={styles.Input}
          required
        />
      </Form.Field>
      <Form.Field className={styles.Field} name="unit">
        <div className="flex flex-row items-center justify-between">
          <Form.Label className={styles.Label}>Unit</Form.Label>
        </div>
        <Form.Control
          value={medication.unit}
          onChange={(e) =>
            setMedication({ ...medication, unit: e.target.value })
          }
          className={styles.Input}
          placeholder="e.g., pills, grams, etc. (optional)"
        />
      </Form.Field>
      <Form.Field className={styles.Field} name="period">
        <div className="flex flex-row items-center justify-between">
          <Form.Label className={styles.Label}>Cycle Length</Form.Label>
          <Form.Message className={styles.Message} match="valueMissing">
            Please enter a cycle length
          </Form.Message>
          <Form.Message className={styles.Message} match="rangeUnderflow">
            Please enter a positive cycle length
          </Form.Message>
          <Form.Message className={styles.Message} match="rangeOverflow">
            Cycle length cannot exceed 14 days
          </Form.Message>
        </div>
        <Form.Control
          value={medication.period}
          onChange={(e) => {
            const periodValue = Number(e.target.value);
            setMedication({ ...medication, period: periodValue });
            if (periodValue < 1 || periodValue > 14) {
              return; // Ignore invalid values
            }
            // remove days past period length
            const toDelete: number[] = [];
            medication.times.forEach((times, day) => {
              if (day >= periodValue) {
                toDelete.push(day);
              }
            });
            toDelete.forEach((day) => medication.times.delete(day));
          }}
          type="number"
          min="1"
          max="14" // Assuming a maximum of 14 days for the cycle
          className={styles.Input}
          required
        />
      </Form.Field>
      <Form.Field className={styles.Field} name="times">
        <div className="flex flex-row items-center justify-between mb-2">
          <Form.Label className={styles.Label}>Times (Alarms)</Form.Label>
          <span className="text-sm text-gray-500">Set plan for each day</span>
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({
            length: Math.min(Math.max(medication.period, 0), 14),
          }).map((_, dayIdx) => (
            <div key={dayIdx} className="border border-gray-300 rounded p-2">
              <div className="flex flex-row items-center justify-between mb-2 ">
                <span>Day {dayIdx + 1}</span>
                <button
                  type="button"
                  className="text-blue-500 text-sm hover:text-blue-700"
                  onClick={() => {
                    const timesForDay = [
                      ...(medication.times.get(dayIdx) ?? []),
                    ];
                    timesForDay.push({
                      hour: 0, // Default to 12 for 0 hour
                      minute: 0,
                      isPM: false, // Default to AM
                    });
                    const newTimes = new Map(medication.times);
                    newTimes.set(dayIdx, timesForDay);
                    setMedication({ ...medication, times: newTimes });
                  }}
                >
                  + Add Time
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {!medication.times.has(dayIdx) && (
                  <div className="text-gray-500 text-sm">
                    No alarms set for this day.
                  </div>
                )}
                {(medication.times.get(dayIdx) ?? []).map((time, alarmIdx) => (
                  <span
                    key={alarmIdx}
                    className="flex flex-row gap-2 border border-gray-300 items-center p-2 rounded"
                    style={{ minWidth: "fit-content" }}
                  >
                    {/* Hour Select */}
                    <Form.Field name={`hour-${dayIdx}-${alarmIdx}`}>
                      <Form.Control asChild>
                        <select
                          className="appearance-none bg-gray-200 text-base px-4 py-2 rounded-sm"
                          defaultValue={time.hour || 12}
                          onChange={(e) => {
                            const newTime: Time = {
                              hour: Number(e.target.value),
                              minute: time.minute,
                              isPM: time.isPM,
                            };
                            const timesForDay = [
                              ...(medication.times.get(dayIdx) ?? []),
                            ];
                            timesForDay[alarmIdx] = newTime;
                            const newTimes = new Map(medication.times);
                            newTimes.set(dayIdx, timesForDay);
                            setMedication({
                              ...medication,
                              times: newTimes,
                            });
                          }}
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {(i + 1).toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </Form.Control>
                    </Form.Field>
                    {/* Minute Select */}
                    <Form.Field name={`minute-${dayIdx}-${alarmIdx}`}>
                      <Form.Control asChild>
                        <select
                          className="appearance-none bg-gray-200 text-base px-4 py-2 rounded-sm"
                          defaultValue={time.minute}
                          onChange={(e) => {
                            const newTime: Time = {
                              hour: time.hour,
                              minute: Number(e.target.value),
                              isPM: time.isPM,
                            };
                            const timesForDay = [
                              ...(medication.times.get(dayIdx) ?? []),
                            ];
                            timesForDay[alarmIdx] = newTime;
                            const newTimes = new Map(medication.times);
                            newTimes.set(dayIdx, timesForDay);
                            setMedication({
                              ...medication,
                              times: newTimes,
                            });
                          }}
                        >
                          {[0, 15, 30, 45].map((min) => (
                            <option key={min} value={min}>
                              {min.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </Form.Control>
                    </Form.Field>
                    {/* AM/PM Select */}
                    <Form.Field name={`ampm-${dayIdx}-${alarmIdx}`}>
                      <Form.Control asChild>
                        <select
                          className="appearance-none bg-gray-200 text-base px-4 py-2 rounded-sm"
                          defaultValue={time.isPM ? "PM" : "AM"}
                          onChange={(e) => {
                            const newTime: Time = {
                              hour: time.hour,
                              minute: time.minute,
                              isPM: e.target.value === "PM",
                            };
                            const timesForDay = [
                              ...(medication.times.get(dayIdx) ?? []),
                            ];
                            timesForDay[alarmIdx] = newTime;
                            const newTimes = new Map(medication.times);
                            newTimes.set(dayIdx, timesForDay);
                            setMedication({
                              ...medication,
                              times: newTimes,
                            });
                          }}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </Form.Control>
                    </Form.Field>
                    {/* Delete Button */}
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => {
                        const timesForDay = [
                          ...(medication.times.get(dayIdx) ?? []),
                        ];
                        timesForDay.splice(alarmIdx, 1);
                        const newTimes = new Map(medication.times);
                        newTimes.set(dayIdx, timesForDay);
                        if (timesForDay.length === 0) {
                          newTimes.delete(dayIdx);
                        }
                        setMedication({ ...medication, times: newTimes });
                      }}
                      title="Delete alarm"
                    >
                      <FaRegTrashCan className="w-5 h-5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Form.Field>
      <Form.Field className={styles.Field} name="notes">
        <div className="flex flex-row items-center justify-between">
          <Form.Label className={styles.Label}>Notes</Form.Label>
        </div>
        <Form.Control asChild>
          <textarea
            value={medication.notes}
            onChange={(e) => {
              setMedication({ ...medication, notes: e.target.value });
            }}
            className={styles.Textarea}
          />
        </Form.Control>
      </Form.Field>
      <Form.Submit asChild>
        <button className="mt-2 w-full rounded-md bg-blue-200 text-blue-800 p-2 hover:bg-blue-300 transition-colors">
          Add Medication Schedule
        </button>
      </Form.Submit>
    </Form.Root>
  );
}
