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
  const { t } = useTranslation();
  const formatTimeSlot = useTimeFormatter();
  const { formatDate } = useDateFormatter();

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
        <span dir="ltr">
          {formatTimeSlot(timeSlotDetails.timeFrom, timeSlotDetails.timeTo)}
        </span>
      </div>
    </div>
  );
};

export default TimeSlotDisplay;
