import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import TimeSlotDisplay from "@/components/cart/time-slot-display";
import TimeSlotSelectorModal from "@/components/cart/time-slot-selector-modal";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Lock } from "lucide-react";
import { toast } from "react-toastify";

interface CartTimeSlotSectionProps {
  brandId: number;
}

const CartTimeSlotSection = ({ brandId }: CartTimeSlotSectionProps) => {
  const { t } = useTranslation();
  const {
    selectedSlotId,
    timeSlotDetails,
    loadingTimeSlot,
    selectTimeSlot,
    isSlotLocked,
  } = useCart();
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  const handleTimeSlotSelection = async (slotId: number) => {
    setIsTimeSlotModalOpen(false);
  };

  const handleLockTimeSlot = async () => {
    if (!selectedSlotId) {
      toast.error(t("pleaseSelectTimeSlot"));
      return;
    }

    setIsLocking(true);
    try {
      const success = await selectTimeSlot(selectedSlotId);
      if (success) {
        toast.success(t("timeSlotLocked"));
      }
    } catch (error) {
      console.error("Error locking time slot:", error);
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t("timeSlot")}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsTimeSlotModalOpen(true)}
          className="flex items-center gap-1"
        >
          {selectedSlotId ? t("changeTimeSlot") : t("selectTimeSlot")}
          {!selectedSlotId && <Plus className="h-4 w-4" />}
        </Button>
      </div>

      {selectedSlotId && timeSlotDetails ? (
        <div className="p-4 bg-primary/5 rounded-lg">
          <div className="flex flex-col space-y-4">
            <TimeSlotDisplay
              timeSlotDetails={timeSlotDetails}
              loading={loadingTimeSlot}
            />

            <div className="flex justify-end">
              <Button
                variant="default"
                size="sm"
                onClick={handleLockTimeSlot}
                disabled={isLocking || isSlotLocked}
                className="flex items-center gap-1"
              >
                {isLocking ? (
                  <>
                    <span className="animate-spin mr-1">⟳</span>
                    {t("loading")}
                  </>
                ) : isSlotLocked ? (
                  <>
                    <Lock className="h-4 w-4 mr-1" />
                    {t("slotLocked")}
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-1" />
                    {t("lockTimeSlot")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
          {t("noTimeSlotSelected")}
        </div>
      )}

      {/* Time Slot Selector Modal */}
      <TimeSlotSelectorModal
        isOpen={isTimeSlotModalOpen}
        onClose={() => setIsTimeSlotModalOpen(false)}
        brandId={brandId}
        onSelectSlot={handleTimeSlotSelection}
        initialSelectedSlot={selectedSlotId}
      />
    </div>
  );
};

export default CartTimeSlotSection;
