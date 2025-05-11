import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import type { TimeSlot } from "@/interfaces";

// Custom hook to manage cart selection state
export const useCartSelection = () => {
  const { cart, token } = useUser();

  // State for selected item and time slot
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [timeSlotDetails, setTimeSlotDetails] = useState<TimeSlot | null>(null);
  const [loadingTimeSlot, setLoadingTimeSlot] = useState(false);

  // Get the selected item
  const selectedItem = cart?.find(
    (item) => item.invoiceId === selectedInvoiceId
  );

  // Handle item selection for checkout
  const handleSelectItem = (invoiceId: number) => {
    if (selectedInvoiceId === invoiceId) {
      // Deselect if already selected
      setSelectedInvoiceId(null);
      setSelectedSlotId(null);
    } else {
      // Select new item
      setSelectedInvoiceId(invoiceId);
    }
  };

  // Set time slot for the selected item
  const setTimeSlot = (slotId: number) => {
    setSelectedSlotId(slotId);
  };

  // Fetch time slot details when selectedSlotId changes
  useEffect(() => {
    if (selectedSlotId && token && selectedItem?.brandId) {
      setLoadingTimeSlot(true);
      axios
        .get(`${apiEndpoints.getSlots}?brandId=${selectedItem.brandId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.success) {
            const slots = response.data.content || [];
            const selectedSlot = slots.find(
              (slot: TimeSlot) => slot.slotId === selectedSlotId
            );
            if (selectedSlot) {
              setTimeSlotDetails(selectedSlot);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching time slot details:", error);
        })
        .finally(() => {
          setLoadingTimeSlot(false);
        });
    } else {
      setTimeSlotDetails(null);
    }
  }, [selectedSlotId, token, selectedItem]);

  return {
    selectedInvoiceId,
    selectedSlotId,
    selectedItem,
    timeSlotDetails,
    loadingTimeSlot,
    handleSelectItem,
    setTimeSlot,
  };
};
