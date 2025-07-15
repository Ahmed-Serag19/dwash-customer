import { useTranslation } from "react-i18next";

// Arabic numerals mapping
const arabicNumerals: { [key: string]: string } = {
  "0": "٠",
  "1": "١",
  "2": "٢",
  "3": "٣",
  "4": "٤",
  "5": "٥",
  "6": "٦",
  "7": "٧",
  "8": "٨",
  "9": "٩",
};

// Convert English numbers to Arabic
const toArabicNumerals = (str: string): string => {
  return str.replace(/[0-9]/g, (digit) => arabicNumerals[digit] || digit);
};

// Convert 24-hour time to 12-hour format
const convertTo12Hour = (time24: string): { time: string; period: string } => {
  const [hours, minutes] = time24.split(":");
  const hour24 = Number.parseInt(hours, 10);

  let hour12 = hour24;
  let period = "AM";

  if (hour24 === 0) {
    hour12 = 12;
    period = "AM";
  } else if (hour24 === 12) {
    hour12 = 12;
    period = "PM";
  } else if (hour24 > 12) {
    hour12 = hour24 - 12;
    period = "PM";
  }

  return {
    time: `${hour12}:${minutes}`,
    period,
  };
};

export const formatTimeSlot = (
  timeFrom: string,
  timeTo: string,
  language: string
): string => {
  const fromConverted = convertTo12Hour(timeFrom.slice(0, 5));
  const toConverted = convertTo12Hour(timeTo.slice(0, 5));

  if (language === "ar") {
    const fromTimeArabic = toArabicNumerals(fromConverted.time);
    // const toTimeArabic = toArabicNumerals(toConverted.time);
    const fromPeriodArabic = fromConverted.period === "AM" ? "ص" : "م";
    // const toPeriodArabic = toConverted.period === "AM" ? "ص" : "م";

    // return `الساعة ${fromTimeArabic} ${fromPeriodArabic} - الى ${toTimeArabic} ${toPeriodArabic}`;
    return `الساعة ${fromTimeArabic} ${fromPeriodArabic} `;
  } else {
    return `From ${fromConverted.time} ${fromConverted.period} - to ${toConverted.time} ${toConverted.period}`;
  }
};

export const useTimeFormatter = () => {
  const { i18n } = useTranslation();

  return (timeFrom: string, timeTo: string) => {
    return formatTimeSlot(timeFrom, timeTo, i18n.language);
  };
};
