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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { TimeSlot } from "@/interfaces";
import { useCart } from "@/context/CartContext";

interface TimeSlotSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: number;
  onSelectSlot: (slotId: number) => void;
  initialSelectedSlot?: number | null;
}

const TimeSlotSelectorModal = ({
  isOpen,
  onClose,
  brandId,
  onSelectSlot,
  initialSelectedSlot,
}: TimeSlotSelectorModalProps) => {
  const { t } = useTranslation();
  const { token } = useUser();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(
    initialSelectedSlot || null
  );
  const [loading, setLoading] = useState(true);
  const { saveTimeSlotInfo } = useCart();

  useEffect(() => {
    if (isOpen && token && brandId) {
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

  // Reset selected slot when modal opens with initialSelectedSlot
  useEffect(() => {
    if (isOpen) {
      if (initialSelectedSlot) {
        setSelectedSlot(initialSelectedSlot);
      }
    }
  }, [isOpen, initialSelectedSlot]);

  const handleSlotSelection = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const handleConfirm = async () => {
    if (!selectedSlot) {
      toast.error(t("pleaseSelectSlot"));
      return;
    }

    // Find the selected time slot details
    const selectedTimeSlot = timeSlots.find(
      (slot) => slot.slotId === selectedSlot
    );

    if (!selectedTimeSlot) {
      toast.error(t("timeSlotNotFound"));
      return;
    }

    // Save the time slot info without locking it
    saveTimeSlotInfo(selectedTimeSlot);

    // Call the onSelectSlot callback
    onSelectSlot(selectedSlot);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("selectTimeSlot")}</DialogTitle>
          <DialogDescription>{t("choosePreferredTimeSlot")}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">{t("loading")}</span>
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
                disabled={slot.reserved === 1}
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
                {slot.reserved === 1 && (
                  <div className="mt-2 text-xs text-red-500 font-medium">
                    {t("slotReserved")}
                  </div>
                )}
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

export default TimeSlotSelectorModal;
