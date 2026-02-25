"use client";
import React, { useState, useRef, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Input from "./InputField";

type DateTimeInputProps = {
  value: Dayjs | null;
  onChange: (date: Dayjs) => void;
  placeholder?: string;
  error?: boolean;
  success?: boolean;
  hint?: string;
};

const Datepicker: React.FC<DateTimeInputProps> = ({
  value,
  onChange,
  placeholder = "Select date & time",
  error,
  success,
  hint,
}) => {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const containerRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = currentMonth.daysInMonth();
  const startDay = currentMonth.startOf("month").day();

  const weeks: (number | null)[][] = [];
  let day = 1 - startDay;
  while (day <= daysInMonth) {
    const week: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (day > 0 && day <= daysInMonth) {
        week.push(day);
      } else {
        week.push(null);
      }
      day++;
    }
    weeks.push(week);
  }

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const handleTimeChange = (field: "hour" | "minute" | "ampm", val: string) => {
    if (!value) return;
    let updated = value;
    if (field === "hour") {
      let hour = parseInt(val, 10);
      if (hour < 1) hour = 1;
      if (hour > 12) hour = 12;
      const isPM = value.hour() >= 12;
      updated = value.hour(isPM ? (hour % 12) + 12 : hour % 12);
    } else if (field === "minute") {
      updated = value.minute(parseInt(val, 10));
    } else if (field === "ampm") {
      if (val === "PM" && value.hour() < 12) updated = value.add(12, "hour");
      if (val === "AM" && value.hour() >= 12)
        updated = value.subtract(12, "hour");
    }
    onChange(updated);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input as trigger */}
      <div onClick={() => setOpen((p) => !p)}>
        <Input
          type="text"
          value={value ? value.format("D MMM, YYYY hh:mm A") : ""}
          placeholder={placeholder}
          error={error}
          success={success}
          hint={hint}
          readOnly
        />
      </div>

      {/* Popup */}
      {open && (
        <div
          className={`
            fixed inset-x-0 bottom-0 sm:absolute sm:inset-auto sm:mt-2 sm:w-[22rem]
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
            rounded-t-2xl sm:rounded-lg shadow-lg p-4 z-50
          `}
        >
          {/* Mobile Close Button */}
          <div className="flex sm:hidden justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Select Date & Time
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {currentMonth.format("MMMM YYYY")}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 text-center font-medium text-gray-500 dark:text-gray-400 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7 text-center gap-1 mb-3">
            {weeks.map((week, i) =>
              week.map((d, j) => {
                const date = d ? currentMonth.date(d) : null;
                const isSelected = value && date && date.isSame(value, "day");
                const isToday = date && date.isSame(dayjs(), "day");

                return (
                  <div key={`${i}-${j}`}>
                    {d ? (
                      <button
                        onClick={() =>
                          date &&
                          onChange(
                            value
                              ? date.hour(value.hour()).minute(value.minute())
                              : date
                          )
                        }
                        className={`w-10 h-10 rounded-full transition
                          ${
                            isSelected
                              ? "bg-brand-500 text-white"
                              : isToday
                              ? "border border-brand-400 text-brand-600"
                              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }
                        `}
                      >
                        {d}
                      </button>
                    ) : (
                      <div className="w-10 h-10" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Time Picker */}
          {value && (
            <div className="flex justify-center items-center gap-2">
              <input
                type="number"
                min={1}
                max={12}
                value={value.format("hh")}
                onChange={(e) => handleTimeChange("hour", e.target.value)}
                className="w-14 p-2 border rounded-lg text-center dark:bg-gray-800 dark:text-white"
              />
              <span className="text-gray-600 dark:text-gray-300">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={value.format("mm")}
                onChange={(e) => handleTimeChange("minute", e.target.value)}
                className="w-14 p-2 border rounded-lg text-center dark:bg-gray-800 dark:text-white"
              />
              <select
                value={value.hour() >= 12 ? "PM" : "AM"}
                onChange={(e) => handleTimeChange("ampm", e.target.value)}
                className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Datepicker;
