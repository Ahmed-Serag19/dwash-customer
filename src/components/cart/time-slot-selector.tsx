
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { useUser } from "@/context/UserContext";
import { Loader2, Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  slotId: number;
  brandNameAr: string;
  brandNameEn: string;
  timeFrom: string;
  timeTo: string;
  date: string;
  reserved: number;
  username: string | null;
  mobile: string | null;
}

interface TimeSlotSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: number;
  onSelectSlot: (slotId: number) => void;
}

const TimeSlotSelector = ({
  isOpen,
  onClose,
  brandId,
  onSelectSlot,
}: TimeSlotSelectorProps) => {
  const { t } = useTranslation();
  const { token } = useUser();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true);
      axios
        .get(`${apiEndpoints.getSlots}?brandId=${brandId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.success) {
            setTimeSlots(response.data.content || []);
          } else {
            toast.error(t("errorFetchingSlots"));
          }
        })
        .catch((error) => {
          console.error("Error fetching slots:", error);
          toast.error(t("errorFetchingSlots"));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, brandId, token, t]);

  const handleSlotSelection = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      toast.error(t("pleaseSelectSlot"));
      return;
    }
    onSelectSlot(selectedSlot);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("selectTimeSlot")}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">{t("loadingTimeSlots")}</span>
          </div>
        ) : timeSlots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {timeSlots.map((slot) => (
              <button
                key={slot.slotId}
                onClick={() => handleSlotSelection(slot.slotId)}
                className={`flex flex-col p-4 rounded-lg border transition-all ${
                  selectedSlot === slot.slotId
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">{slot.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span dir="ltr">
                    {slot.timeFrom.slice(0, 5)} - {slot.timeTo.slice(0, 5)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t("noAvailableSlots")}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedSlot}>
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotSelector;
