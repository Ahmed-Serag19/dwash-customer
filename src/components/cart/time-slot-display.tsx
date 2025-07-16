import { useTranslation } from "react-i18next";
import { Calendar, Clock, Loader2 } from "lucide-react";
import type { TimeSlot } from "@/interfaces";
import { useTimeFormatter } from "@/utils/time-formatter";
import { useDateFormatter } from "@/utils/date-formatter";

interface TimeSlotDisplayProps {
  timeSlotDetails: TimeSlot | null;
  loading: boolean;
}

const TimeSlotDisplay = ({
  timeSlotDetails,
  loading,
}: TimeSlotDisplayProps) => {
  const { t, i18n } = useTranslation();
  const formatTimeSlot = useTimeFormatter();
  const { formatDate } = useDateFormatter();

  // Helper: Format hour only, with :00, and Arabic support
  const formatHourOnly = (timeFrom: string) => {
    const [hourStr] = timeFrom.split(":");
    let hour = parseInt(hourStr, 10);
    let period = "AM";
    if (hour === 0) {
      hour = 12;
      period = "AM";
    } else if (hour === 12) {
      period = "PM";
    } else if (hour > 12) {
      hour = hour - 12;
      period = "PM";
    }
    if (i18n.language === "ar") {
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
      const toArabicNumerals = (str: string): string =>
        str.replace(/[0-9]/g, (digit) => arabicNumerals[digit] || digit);
      const hourArabic = toArabicNumerals(hour.toString());
      const periodArabic = period === "AM" ? "ص" : "م";
      return `الساعة ${hourArabic}:٠٠ ${periodArabic}`;
    }
    return `${hour}:00 ${period}`;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm text-gray-500">{t("loading")}</span>
      </div>
    );
  }

  if (!timeSlotDetails) {
    return <p className="text-sm text-gray-500">{t("noTimeSlotSelected")}</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" />
        <span className="font-medium">{formatDate(timeSlotDetails.date)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <span dir="ltr">{formatHourOnly(timeSlotDetails.timeFrom)}</span>
      </div>
    </div>
  );
};

export default TimeSlotDisplay;
