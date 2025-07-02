"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { TimeSlot } from "@/interfaces";
import { useCart } from "@/context/CartContext";
import ViewModeToggle from "./time-slot/view-mode-toggle";
import DateSelector from "./time-slot/date-selector";
import { useTimeFormatter } from "@/utils/time-formatter";

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
  const [viewMode, setViewMode] = useState<"all" | "byDate">("byDate");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { saveTimeSlotInfo } = useCart();

  const formatTimeSlot = useTimeFormatter();

  // Group time slots by date
  const groupedTimeSlots = useMemo(() => {
    const groups: { [key: string]: TimeSlot[] } = {};
    timeSlots.forEach((slot) => {
      if (!groups[slot.date]) {
        groups[slot.date] = [];
      }
      groups[slot.date].push(slot);
    });

    Object.keys(groups).forEach((date) => {
      groups[date].sort((a, b) => a.timeFrom.localeCompare(b.timeFrom));
    });

    return groups;
  }, [timeSlots]);

  const availableDates = useMemo(() => {
    return Object.keys(groupedTimeSlots)
      .filter((date) =>
        groupedTimeSlots[date].some((slot) => slot.reserved === 0)
      )
      .sort();
  }, [groupedTimeSlots]);

  const displayTimeSlots = useMemo(() => {
    if (viewMode === "all") {
      return timeSlots;
    } else if (selectedDate && groupedTimeSlots[selectedDate]) {
      return groupedTimeSlots[selectedDate];
    }
    return [];
  }, [viewMode, selectedDate, timeSlots, groupedTimeSlots]);

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

  useEffect(() => {
    if (isOpen) {
      if (initialSelectedSlot) {
        setSelectedSlot(initialSelectedSlot);
        const initialSlot = timeSlots.find(
          (slot) => slot.slotId === initialSelectedSlot
        );
        if (initialSlot) {
          setSelectedDate(initialSlot.date);
        }
      } else if (availableDates.length > 0 && viewMode === "byDate") {
        setSelectedDate(availableDates[0]);
      }
    }
  }, [isOpen, initialSelectedSlot, timeSlots, availableDates, viewMode]);

  useEffect(() => {
    if (viewMode === "byDate" && !selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, [viewMode, selectedDate, availableDates]);

  const handleSlotSelection = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleConfirm = async () => {
    if (!selectedSlot) {
      toast.error(t("pleaseSelectSlot"));
      return;
    }

    const selectedTimeSlot = timeSlots.find(
      (slot) => slot.slotId === selectedSlot
    );

    if (!selectedTimeSlot) {
      toast.error(t("timeSlotNotFound"));
      return;
    }

    saveTimeSlotInfo(selectedTimeSlot);
    onSelectSlot(selectedSlot);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
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
          <>
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <div className="flex-1 overflow-auto min-h-0">
              {viewMode === "byDate" ? (
                <div className="h-full flex flex-col">
                  <DateSelector
                    availableDates={availableDates}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelection}
                    groupedTimeSlots={groupedTimeSlots}
                  />

                  <div className="flex-1 overflow-y-auto mt-4">
                    {selectedDate && displayTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                        {displayTimeSlots.map((slot) => (
                          <button
                            key={slot.slotId}
                            onClick={() => handleSlotSelection(slot.slotId)}
                            className={`flex flex-col p-4 rounded-lg border transition-all ${
                              selectedSlot === slot.slotId
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : slot.reserved === 1
                                ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            disabled={slot.reserved === 1}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span dir="ltr">
                                {formatTimeSlot(slot.timeFrom, slot.timeTo)}
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
                        <p className="text-gray-500">
                          {t("selectDateToViewSlots")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    {displayTimeSlots.map((slot) => (
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
                            {formatTimeSlot(slot.timeFrom, slot.timeTo)}
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
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t("noAvailableSlots")}</p>
          </div>
        )}

        {/* Fixed Footer - Properly positioned at bottom */}
        <div className="border-t pt-4 mt-4 flex justify-between items-center bg-white">
          <div className="text-sm text-gray-600">
            {selectedSlot ? (
              <span className="text-green-600 font-medium">
                ✓ {t("timeSlotSelected")}
              </span>
            ) : (
              <span>{t("pleaseSelectTimeSlot")}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedSlot}>
              {t("confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotSelectorModal;
