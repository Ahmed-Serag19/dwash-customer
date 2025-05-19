"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { useTranslation } from "react-i18next";
import type { TimeSlot } from "@/interfaces";

interface CartItem {
  invoiceId: number;
  brandId: number;
  itemDto: {
    itemId: number;
    itemNameAr: string;
    itemNameEn: string;
    itemPrice: number;
    serviceTypeAr: string;
    serviceTypeEn: string;
    itemExtraDtos?: {
      itemExtraId: number;
      itemExtraNameAr: string;
      itemExtraNameEn: string;
      itemExtraPrice: number;
    }[];
  };
}

interface CartContextType {
  successDeletedCartItem: number;
  selectedInvoiceId: number | null;
  selectedSlotId: number | null;
  selectedAddressId: number | null;
  selectedCarId: number | null;
  timeSlotDetails: TimeSlot | null;
  discountCode: string;
  discountAmount: number;
  discountType: string | null;
  loadingTimeSlot: boolean;
  isSlotLocked: boolean;
  selectionConfirmed: boolean;
  selectedItem: CartItem | undefined;
  selectItem: (invoiceId: number) => void;
  selectTimeSlot: (slotId: number) => Promise<boolean>;
  saveTimeSlotInfo: (slotInfo: TimeSlot) => void;
  clearTimeSlot: () => void;
  selectAddressAndCar: (addressId: number, carId: number) => void;
  setDiscountCode: (code: string) => void;
  applyDiscount: () => Promise<void>;
  confirmSelection: () => void;
  resetSelection: () => void;
  lockTimeSlot: (slotId: number) => Promise<boolean>;
  processPayment: () => Promise<void>;
  isProcessingPayment: boolean;
  addToCart: (serviceId: number, extraServices: number[]) => Promise<boolean>;
  setSuccessDeletedCartItem: (invoiceId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const { token, cart, getCart } = useUser();
  //State for the deleted cart item after success payment
  const [successDeletedCartItem, setSuccessDeletedCartItem] = useState(0);
  // State for selected item
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [timeSlotDetails, setTimeSlotDetails] = useState<TimeSlot | null>(null);
  const [loadingTimeSlot, setLoadingTimeSlot] = useState(false);
  const [isSlotLocked, setIsSlotLocked] = useState(false);
  const [selectionConfirmed, setSelectionConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Discount state
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string | null>(null);

  // Get the selected item
  const selectedItem = cart?.find(
    (item) => item.invoiceId === selectedInvoiceId
  );

  // Save time slot info without locking it
  const saveTimeSlotInfo = (slotInfo: TimeSlot) => {
    setSelectedSlotId(slotInfo.slotId);
    setTimeSlotDetails(slotInfo);
    setIsSlotLocked(false);

    // Store in localStorage for persistence
    localStorage.setItem("selectedSlotId", slotInfo.slotId.toString());
    localStorage.setItem("timeSlotDetails", JSON.stringify(slotInfo));
    localStorage.setItem("isSlotLocked", "false");
  };

  // Handle item selection for checkout
  const selectItem = (invoiceId: number) => {
    if (selectedInvoiceId === invoiceId) {
      // Deselect if already selected
      resetSelection();
    } else {
      // Select new item
      setSelectedInvoiceId(invoiceId);
      // Reset other checkout-related states
      setSelectedSlotId(null);
      setTimeSlotDetails(null);
      setIsSlotLocked(false);
      setSelectedAddressId(null);
      setSelectedCarId(null);
      setSelectionConfirmed(false);
      setDiscountAmount(0);
      setDiscountType(null);
      setDiscountCode("");

      // Clear localStorage for time slot
      localStorage.removeItem("selectedSlotId");
      localStorage.removeItem("timeSlotDetails");
      localStorage.removeItem("isSlotLocked");
    }
  };

  // Clear time slot
  const clearTimeSlot = () => {
    setSelectedSlotId(null);
    setTimeSlotDetails(null);
    setIsSlotLocked(false);
    localStorage.removeItem("selectedSlotId");
    localStorage.removeItem("timeSlotDetails");
    localStorage.removeItem("isSlotLocked");
  };

  // Set time slot for the selected item and lock it
  const selectTimeSlot = async (slotId: number) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return false;
    }

    try {
      // Lock the new slot
      const locked = await lockTimeSlot(slotId);
      if (locked) {
        setSelectedSlotId(slotId);
        setIsSlotLocked(true);
        localStorage.setItem("selectedSlotId", slotId.toString());
        localStorage.setItem("isSlotLocked", "true");

        // Fetch the time slot details to update the UI
        setLoadingTimeSlot(true);
        try {
          if (selectedItem?.brandId) {
            const response = await axios.get(
              `${apiEndpoints.getSlots}?brandId=${selectedItem.brandId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (response.data.success) {
              const slots = response.data.content || [];
              const selectedSlot = slots.find(
                (slot: TimeSlot) => slot.slotId === slotId
              );
              if (selectedSlot) {
                setTimeSlotDetails(selectedSlot);
                localStorage.setItem(
                  "timeSlotDetails",
                  JSON.stringify(selectedSlot)
                );
              }
            }
          }
        } catch (error) {
          console.error("Error fetching time slot details:", error);
        } finally {
          setLoadingTimeSlot(false);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error selecting time slot:", error);
      return false;
    }
  };

  // Set address and car for delivery
  const selectAddressAndCar = (addressId: number, carId: number) => {
    setSelectedAddressId(addressId);
    setSelectedCarId(carId);
    setSelectionConfirmed(true);
  };

  // Apply discount code
  const applyDiscount = async () => {
    if (!discountCode) {
      toast.error(t("enterValidDiscount"));
      return;
    }

    if (!selectedItem) {
      toast.error(t("selectItemFirst"));
      return;
    }

    try {
      const response = await axios.get(
        `${apiEndpoints.validateDiscount}?discountCode=${discountCode}&brandId=${selectedItem.brandId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const discount = response.data.content;
        setDiscountAmount(discount.discountAmount);
        setDiscountType(discount.discountType);
        toast.success(t("discountApplied"));
      } else {
        toast.error(t("invalidDiscount"));
      }
    } catch (error) {
      toast.error(t("invalidDiscount"));
      console.error("Error validating discount:", error);
    }
  };

  // Confirm selection of address and car
  const confirmSelection = () => {
    setSelectionConfirmed(true);
  };

  // Reset all selection
  const resetSelection = () => {
    setSelectedInvoiceId(null);
    setSelectedSlotId(null);
    setTimeSlotDetails(null);
    setIsSlotLocked(false);
    setSelectedAddressId(null);
    setSelectedCarId(null);
    setSelectionConfirmed(false);
    setDiscountAmount(0);
    setDiscountType(null);
    setDiscountCode("");

    // Clear localStorage
    localStorage.removeItem("selectedInvoiceId");
    localStorage.removeItem("selectedSlotId");
    localStorage.removeItem("timeSlotDetails");
    localStorage.removeItem("isSlotLocked");
  };

  // Lock time slot
  const lockTimeSlot = async (slotId: number) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return false;
    }

    try {
      const response = await axios.put(
        `${apiEndpoints.lockSlot}?slotId=${slotId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        return true;
      } else {
        toast.error(t("errorLockingSlot"));
        return false;
      }
    } catch (error) {
      console.error("Error locking slot:", error);
      toast.error(t("errorLockingSlot"));
      return false;
    }
  };

  // Add to cart without time slot
  const addToCart = async (serviceId: number, extraServices: number[]) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return false;
    }

    try {
      // Add to cart
      const cartResponse = await axios.post(
        apiEndpoints.addToCart,
        {
          serviceId: Number(serviceId),
          extraServices:
            extraServices.length > 0
              ? extraServices.map((id) => Number(id))
              : [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (cartResponse.data.success) {
        // Refresh the cart
        await getCart();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  // Initialize selected invoice ID and slot ID from localStorage
  useEffect(() => {
    const storedInvoiceId = localStorage.getItem("selectedInvoiceId");
    const storedSlotId = localStorage.getItem("selectedSlotId");
    const storedTimeSlotDetails = localStorage.getItem("timeSlotDetails");
    const storedIsSlotLocked = localStorage.getItem("isSlotLocked");

    if (storedInvoiceId) {
      setSelectedInvoiceId(Number(storedInvoiceId));
    }

    if (storedSlotId) {
      setSelectedSlotId(Number(storedSlotId));
    }

    if (storedTimeSlotDetails) {
      try {
        setTimeSlotDetails(JSON.parse(storedTimeSlotDetails));
      } catch (e) {
        console.error("Error parsing stored time slot details:", e);
      }
    }

    if (storedIsSlotLocked) {
      setIsSlotLocked(storedIsSlotLocked === "true");
    }
  }, []);

  // Process payment
  const processPayment = async () => {
    if (!selectedInvoiceId) {
      toast.error(t("selectItemFirst"));
      return;
    }

    if (!selectedSlotId) {
      toast.error(t("pleaseSelectTimeSlot"));
      return;
    }

    if (!selectedAddressId || !selectedCarId) {
      toast.error(t("pleaseSelectAddressAndCar"));
      return;
    }

    // Lock the time slot before proceeding with payment if not already locked
    if (!isSlotLocked) {
      const slotLocked = await lockTimeSlot(selectedSlotId);
      if (!slotLocked) {
        toast.error(t("timeSlotNoLongerAvailable"));
        return;
      }
      setIsSlotLocked(true);
      localStorage.setItem("isSlotLocked", "true");
    }

    setIsProcessingPayment(true);

    try {
      // Proceed with payment
      const response = await axios.post(
        apiEndpoints.makePayment,
        {
          paymentMethodId: 2,
          invoiceId: selectedInvoiceId,
          slotId: selectedSlotId,
          discountCode: discountCode || null,
          userAddress: selectedAddressId,
          userCar: selectedCarId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSuccessDeletedCartItem(selectedInvoiceId);
        // Reset state
        resetSelection();

        if (response.data.content?.redirect_url) {
          window.location.href = response.data.content.redirect_url;
        } else {
          toast.success(t("paymentSuccessful"));
          // Remove the item from cart after successful payment
          await getCart();
          window.location.href = "/orders";
        }
      } else {
        toast.error(t("paymentFailed"));
      }
    } catch (error) {
      toast.error(t("paymentFailed"));
      console.error("Payment error:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        setSuccessDeletedCartItem,
        selectedInvoiceId,
        selectedSlotId,
        selectedAddressId,
        selectedCarId,
        timeSlotDetails,
        discountCode,
        discountAmount,
        discountType,
        loadingTimeSlot,
        isSlotLocked,
        selectionConfirmed,
        selectedItem,
        selectItem,
        selectTimeSlot,
        saveTimeSlotInfo,
        clearTimeSlot,
        selectAddressAndCar,
        setDiscountCode,
        applyDiscount,
        confirmSelection,
        resetSelection,
        lockTimeSlot,
        processPayment,
        isProcessingPayment,
        addToCart,
        successDeletedCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
