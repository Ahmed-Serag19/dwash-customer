"use client";

import { useTranslation } from "react-i18next";
import type { TimeSlot } from "@/interfaces";
import { useDateFormatter } from "@/utils/date-formatter";

interface DateSelectorProps {
  availableDates: string[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  groupedTimeSlots: { [key: string]: TimeSlot[] };
}

const DateSelector = ({
  availableDates,
  selectedDate,
  onDateSelect,
  groupedTimeSlots,
}: DateSelectorProps) => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{t("selectDate")}</h4>
      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
        {availableDates.map((date) => (
          <button
            key={date}
            onClick={() => onDateSelect(date)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
              selectedDate === date
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-green-200 hover:border-green-300 bg-white"
            }`}
          >
            {formatDate(date)}
            <div className="ml-2 text-md py-1 bg-gray-200 px-1 rounded">
              {groupedTimeSlots[date]?.filter((slot) => slot.reserved === 0)
                .length || 0}{" "}
              {t("availableSlots")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;
