import { useEffect, useState } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { useTranslation } from "react-i18next";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

export interface TimeSlot {
  slotId: number;
  date: string;
  timeFrom: string;
  timeTo: string;
}

interface TimeSlotModalProps {
  brandId: number;
  setSelectedSlotId: (slotId: number) => void;
  onClose: () => void;
}

const TimeSlotModal = ({
  brandId,
  setSelectedSlotId,
  onClose,
}: TimeSlotModalProps) => {
  const { t } = useTranslation();
  const { token } = useUser();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null); // ✅ Track selected slot

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${apiEndpoints.getSlots}?brandId=${brandId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.success) {
          setSlots(response.data.content);
        }
      })
      .catch((error) => {
        console.error("Error fetching slots:", error);
      });
  }, [brandId, token]);

  const handleSlotSelection = (slotId: number) => {
    setSelectedSlot(slotId); // ✅ Updates the local selection
  };

  const confirmSelection = () => {
    if (!selectedSlot) {
      toast.error(t("pleaseSelectSlot"));
      return;
    }
    setSelectedSlotId(selectedSlot); // ✅ Pass selected slot to parent component
    toast.success(t("slotSelected"));
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-lg w-[90vw] h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-center">
          {t("selectTimeSlot")}
        </h2>

        {/* Time Slot List */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {slots.length ? (
            slots.map((slot) => (
              <button
                key={slot.slotId}
                onClick={() => handleSlotSelection(slot.slotId)}
                className={`block w-full p-3 my-2 rounded-lg border text-center transition-all ${
                  selectedSlot === slot.slotId
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 hover:bg-gray-200"
                }`}
              >
                <span className="font-bold">{slot.date}</span>
                <br />
                <span dir="ltr">
                  {slot.timeFrom.slice(0, 5)} - {slot.timeTo.slice(0, 5)}
                </span>
              </button>
            ))
          ) : (
            <p className="text-center text-gray-600">{t("noAvailableSlots")}</p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 px-6 py-2 text-white rounded-lg"
          >
            {t("cancel")}
          </button>
          <button
            onClick={confirmSelection}
            className="bg-primary px-6 py-2 text-white rounded-lg"
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotModal;
