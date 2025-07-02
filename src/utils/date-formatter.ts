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

// Arabic month names
const arabicMonths = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

// Arabic day names
const arabicDays = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export const formatDate = (dateString: string, language: string): string => {
  const date = new Date(dateString);

  if (language === "ar") {
    const dayName = arabicDays[date.getDay()];
    const day = toArabicNumerals(date.getDate().toString());
    const month = arabicMonths[date.getMonth()];

    return `${dayName} ${day} ${month}`;
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
};

export const formatDateLong = (
  dateString: string,
  language: string
): string => {
  const date = new Date(dateString);

  if (language === "ar") {
    const dayName = arabicDays[date.getDay()];
    const day = toArabicNumerals(date.getDate().toString());
    const month = arabicMonths[date.getMonth()];
    const year = toArabicNumerals(date.getFullYear().toString());

    return `${dayName} ${day} ${month} ${year}`;
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

export const useDateFormatter = () => {
  const { i18n } = useTranslation();

  return {
    formatDate: (dateString: string) => formatDate(dateString, i18n.language),
    formatDateLong: (dateString: string) =>
      formatDateLong(dateString, i18n.language),
  };
};
